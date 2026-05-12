import "@google/model-viewer";
import {
  createElement,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type RefObject
} from "react";
import { AlertCircle, Box, RotateCcw, Upload } from "lucide-react";
import type { Material, Mesh, Object3D, Group } from "three";

const DEFAULT_MODEL_PATH = "/models/bridge.glb";

type ActiveModel = {
  name: string;
  src: string;
  source: string;
};

export function ModelViewerPanel() {
  const uploadInputId = useId();
  const [activeModel, setActiveModel] = useState<ActiveModel>({
    name: "bridge.glb",
    src: DEFAULT_MODEL_PATH,
    source: "默认桥梁模型"
  });
  const [status, setStatus] = useState("正在载入默认模型...");
  const [isProcessing, setIsProcessing] = useState(false);
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  const trackAndReturn = (url: string) => {
    blobUrlsRef.current.push(url);
    return url;
  };

  // 清理所有 blob URL
  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  // model-viewer 事件监听
  useEffect(() => {
    const viewer = modelViewerRef.current;
    if (!viewer) return undefined;

    const handleLoad = () => {
      setStatus(`${activeModel.name} 已载入，可拖拽旋转或滚轮缩放。`);
      setIsProcessing(false);
    };
    const handleError = () => {
      setStatus("模型渲染失败，请确认文件格式有效。");
      setIsProcessing(false);
    };

    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);

    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, [activeModel]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension !== "glb" && extension !== "obj") {
      setStatus("请选择 .glb 或 .obj 模型文件。");
      event.target.value = "";
      return;
    }

    try {
      setIsProcessing(true);
      setStatus(`正在处理 ${file.name}...`);

      if (extension === "glb") {
        // GLB: 检测是否缺材质，缺则补，不缺则直接用
        const arrayBuffer = await file.arrayBuffer();
        const src = await prepareGlb(arrayBuffer, trackAndReturn);
        setActiveModel({ name: file.name, src, source: "用户上传 GLB" });
      } else {
        // OBJ: 必须转换为 GLB
        const src = await convertObjToGlbUrl(file, trackAndReturn);
        setActiveModel({ name: file.name, src, source: "用户上传 OBJ（已转换）" });
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "模型处理失败。");
      setIsProcessing(false);
    } finally {
      event.target.value = "";
    }
  };

  const loadDefault = () => {
    setActiveModel({ name: "bridge.glb", src: DEFAULT_MODEL_PATH, source: "默认桥梁模型" });
    setStatus("正在载入默认模型...");
  };

  return (
    <div className="model-viewer-panel">
      <div className="model-viewer-header">
        <div>
          <span className="model-viewer-kicker">外部模型预览</span>
          <h3>{activeModel.name}</h3>
          <p>{activeModel.source}</p>
        </div>
        <div className="model-actions">
          <label className="model-action" htmlFor={uploadInputId}>
            <Upload size={18} />
            上传模型
          </label>
          <button className="model-action secondary" onClick={loadDefault} type="button">
            <RotateCcw size={18} />
            重置
          </button>
        </div>
      </div>

      <input
        accept=".glb,.obj,model/gltf-binary,text/plain"
        className="model-upload-input"
        id={uploadInputId}
        onChange={handleUpload}
        type="file"
      />

      <div className="model-viewer-surface">
        {createElement("model-viewer", {
          alt: `${activeModel.name} 三维模型`,
          "auto-rotate": "",
          "camera-controls": "",
          className: "model-viewer-element",
          "environment-image": "neutral",
          exposure: "1.2",
          "interaction-prompt": "auto",
          key: activeModel.src,
          loading: "eager",
          ref: modelViewerRef,
          reveal: "auto",
          "rotation-per-second": "28deg",
          "shadow-intensity": "0.82",
          "shadow-softness": "0.72",
          src: activeModel.src,
          "touch-action": "pan-y"
        })}

        {isProcessing ? (
          <div className="model-loading">
            <Box size={26} />
            <span>正在处理模型</span>
          </div>
        ) : null}
      </div>

      <div className="model-viewer-footnote">
        <AlertCircle size={16} />
        <span>{status}</span>
      </div>
    </div>
  );
}

// ─── GLB 快速检测 + 按需补材质 ──────────────────────────────────

/**
 * 只解析 GLB 的 JSON 头部，判断是否有 materials。
 * 有材质 → 直接作为 blob URL 使用
 * 无材质 → 走 Three.js 补材质再导出
 */
async function prepareGlb(
  buffer: ArrayBuffer,
  track: (url: string) => string
): Promise<string> {
  const hasMaterials = glbHasMaterials(buffer);

  if (hasMaterials) {
    // 直接用原始数据，不做额外处理
    const blob = new Blob([buffer], { type: "model/gltf-binary" });
    return track(URL.createObjectURL(blob));
  }

  // 缺材质，走 Three.js 管线补上
  return patchMaterialsAndExport(buffer, track);
}

/** 解析 GLB 的 JSON chunk，检查 materials 数组是否存在且非空 */
function glbHasMaterials(buffer: ArrayBuffer): boolean {
  try {
    const view = new DataView(buffer);
    // GLB header: magic(4) + version(4) + length(4) = 12 bytes
    // Chunk 0 header: chunkLength(4) + chunkType(4) = 8 bytes
    const jsonLength = view.getUint32(12, true);
    const decoder = new TextDecoder();
    const jsonStr = decoder.decode(new Uint8Array(buffer, 20, jsonLength));
    const json = JSON.parse(jsonStr);
    return Array.isArray(json.materials) && json.materials.length > 0;
  } catch {
    return false;
  }
}

/** 用 Three.js 加载 GLB，为无材质 mesh 补默认材质，导出为新 GLB blob URL */
async function patchMaterialsAndExport(
  buffer: ArrayBuffer,
  track: (url: string) => string
): Promise<string> {
  const [three, { GLTFLoader }, { GLTFExporter }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/exporters/GLTFExporter.js")
  ]);

  // 用 blob URL 供 GLTFLoader 加载
  const tempUrl = track(
    URL.createObjectURL(new Blob([buffer], { type: "model/gltf-binary" }))
  );

  const gltf = await new Promise<{ scene: Group }>((resolve, reject) => {
    new GLTFLoader().load(tempUrl, resolve, undefined, reject);
  });

  const defaultMaterial = new three.MeshStandardMaterial({
    color: 0xb0a898,
    roughness: 0.65,
    metalness: 0.05
  });

  gltf.scene.traverse((node: Object3D) => {
    if (node instanceof three.Mesh) {
      const mesh = node as Mesh;
      if (!mesh.material) {
        mesh.material = defaultMaterial;
      } else if (Array.isArray(mesh.material) && mesh.material.length === 0) {
        mesh.material = defaultMaterial;
      }
    }
  });

  const result = await new GLTFExporter().parseAsync(gltf.scene, { binary: true });

  if (!(result instanceof ArrayBuffer)) {
    throw new Error("模型导出失败。");
  }

  return track(
    URL.createObjectURL(new Blob([result], { type: "model/gltf-binary" }))
  );
}

// ─── OBJ → GLB 转换 ─────────────────────────────────────────────

async function convertObjToGlbUrl(
  file: File,
  track: (url: string) => string
): Promise<string> {
  const [three, { OBJLoader }, { GLTFExporter }] = await Promise.all([
    import("three"),
    import("three/examples/jsm/loaders/OBJLoader.js"),
    import("three/examples/jsm/exporters/GLTFExporter.js")
  ]);

  const source = await file.text();
  const object = new OBJLoader().parse(source);
  object.name = file.name.replace(/\.obj$/i, "");

  // OBJ 导入的 mesh 默认没有标准材质，统一补上
  const defaultMaterial = new three.MeshStandardMaterial({
    color: 0xb0a898,
    roughness: 0.65,
    metalness: 0.05
  });

  object.traverse((node: Object3D) => {
    if (node instanceof three.Mesh) {
      const mesh = node as Mesh;
      if (
        !mesh.material ||
        (Array.isArray(mesh.material) && mesh.material.length === 0)
      ) {
        mesh.material = defaultMaterial;
      }
    }
  });

  const result = await new GLTFExporter().parseAsync(object, { binary: true });

  if (!(result instanceof ArrayBuffer)) {
    throw new Error("OBJ 转换失败，请换用 GLB 文件或检查 OBJ 内容。");
  }

  return track(
    URL.createObjectURL(new Blob([result], { type: "model/gltf-binary" }))
  );
}
