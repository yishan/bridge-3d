import { Suspense, useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as THREE from "three";
import { AlertCircle, Box, RotateCcw, Upload } from "lucide-react";

const DEFAULT_MODEL_PATH = "/models/bridge.glb";

type ActiveModel = {
  name: string;
  src: string;
  source: string;
};

// ─── 主面板 ──────────────────────────────────────────────────────

export function ModelViewerPanel() {
  const uploadInputId = useId();
  const [activeModel, setActiveModel] = useState<ActiveModel>({
    name: "bridge.glb",
    src: DEFAULT_MODEL_PATH,
    source: "默认桥梁模型"
  });
  const [status, setStatus] = useState("正在载入模型...");
  const [isProcessing, setIsProcessing] = useState(false);
  const blobUrlsRef = useRef<string[]>([]);

  const track = (url: string) => {
    blobUrlsRef.current.push(url);
    return url;
  };

  useEffect(() => {
    return () => {
      for (const url of blobUrlsRef.current) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();

    if (ext !== "glb" && ext !== "obj") {
      setStatus("请选择 .glb 或 .obj 模型文件。");
      event.target.value = "";
      return;
    }

    try {
      setIsProcessing(true);
      setStatus(`正在处理 ${file.name}...`);

      let src: string;

      if (ext === "obj") {
        src = await convertObjToGlbUrl(file, track);
      } else {
        const blob = new Blob([await file.arrayBuffer()], { type: "model/gltf-binary" });
        src = track(URL.createObjectURL(blob));
      }

      setActiveModel({
        name: file.name,
        src,
        source: ext === "obj" ? "用户上传 OBJ（已转换）" : "用户上传 GLB"
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "模型处理失败。");
    } finally {
      setIsProcessing(false);
      event.target.value = "";
    }
  };

  const resetModel = () => {
    setActiveModel({ name: "bridge.glb", src: DEFAULT_MODEL_PATH, source: "默认桥梁模型" });
    setStatus("正在载入模型...");
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
          <button className="model-action secondary" onClick={resetModel} type="button">
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
        <Canvas
          camera={{ position: [0, 0.6, 4.5], fov: 35 }}
          className="model-viewer-canvas"
          dpr={[1, 1.8]}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
          shadows="basic"
        >
          <color attach="background" args={["#f0ece2"]} />
          <SceneLighting />
          <Suspense fallback={null}>
            <LoadedModel
              key={activeModel.src}
              src={activeModel.src}
              onLoad={() => {
                setStatus(`${activeModel.name} 已载入，可拖拽旋转或滚轮缩放。`);
                setIsProcessing(false);
              }}
              onError={() => {
                setStatus("模型加载失败，请确认文件格式有效。");
                setIsProcessing(false);
              }}
            />
          </Suspense>
          <ContactShadows
            blur={2.5}
            far={8}
            opacity={0.25}
            position={[0, -0.01, 0]}
            scale={12}
          />
          <OrbitControls
            dampingFactor={0.08}
            enableDamping
            autoRotate
            autoRotateSpeed={0.45}
            maxDistance={12}
            maxPolarAngle={Math.PI / 2.05}
            minDistance={1.5}
          />
        </Canvas>

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

// ─── 灯光组（参考 3DCellForge 5 灯组合）─────────────────────────

function SceneLighting() {
  return (
    <>
      {/* 暖色主光 */}
      <directionalLight
        castShadow
        color="#fff5e6"
        intensity={3.2}
        position={[5, 8, 4]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      {/* 冷色补光 */}
      <directionalLight
        color="#e0ecff"
        intensity={1.2}
        position={[-4, 4, -3]}
      />
      {/* 环境光 */}
      <ambientLight intensity={0.55} />
      {/* 底部反射光 */}
      <pointLight
        color="#ffeedd"
        intensity={0.6}
        position={[0, -3, 2]}
      />
      {/* 侧面点缀光 */}
      <pointLight
        color="#d0e8ff"
        intensity={0.45}
        position={[-6, 2, -5]}
      />
    </>
  );
}

// ─── 模型加载 + 自动居中缩放 + 材质修复 ─────────────────────────

function LoadedModel({
  src,
  onLoad,
  onError
}: {
  src: string;
  onLoad: () => void;
  onError: () => void;
}) {
  const { camera } = useThree();
  let gltf: { scene: THREE.Group };

  try {
    gltf = useLoader(GLTFLoader, src);
  } catch (error) {
    // useLoader throws a promise for suspense; rethrow that.
    // Only catch real errors.
    if (error instanceof Promise) throw error;
    onError();
    return null;
  }

  const processedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);

    // ── 材质修复：为缺失材质的 mesh 补上默认材质 ──
    const defaultMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0a898,
      roughness: 0.55,
      metalness: 0.08,
      side: THREE.DoubleSide,
      envMapIntensity: 1.15
    });

    scene.traverse((node) => {
      if (!(node instanceof THREE.Mesh)) return;

      // 启用阴影
      node.castShadow = true;
      node.receiveShadow = true;

      if (!node.material) {
        node.material = defaultMaterial;
      } else if (Array.isArray(node.material)) {
        if (node.material.length === 0) {
          node.material = defaultMaterial;
        }
      } else {
        // 已有材质：增强渲染
        const mat = node.material as THREE.MeshStandardMaterial;
        if (mat.isMeshStandardMaterial) {
          mat.side = THREE.DoubleSide;
          mat.envMapIntensity = Math.max(mat.envMapIntensity ?? 0, 1.15);
        }
      }
    });

    // ── 自动居中 + 缩放适配视口 ──
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // 目标尺寸：让最大维度约为 2.5 单位
    const targetSize = 2.5;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;
    scene.scale.setScalar(scale);

    // 居中：平移使中心在原点，底部在 y=0
    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    const scaledMin = scaledBox.min;
    scene.position.sub(scaledCenter);
    scene.position.y -= scaledMin.y - scaledCenter.y; // 底部对齐 y=0

    return scene;
  }, [gltf]);

  // 加载完成回调
  useEffect(() => {
    onLoad();
  }, [processedScene]);

  return <primitive object={processedScene} />;
}

// ─── OBJ → GLB 转换（在 Canvas 外部执行）────────────────────────

async function convertObjToGlbUrl(
  file: File,
  track: (url: string) => string
): Promise<string> {
  const source = await file.text();
  const object = new OBJLoader().parse(source);
  object.name = file.name.replace(/\.obj$/i, "");

  const defaultMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0a898,
    roughness: 0.55,
    metalness: 0.08
  });

  object.traverse((node) => {
    if (node instanceof THREE.Mesh) {
      if (!node.material || (Array.isArray(node.material) && node.material.length === 0)) {
        node.material = defaultMaterial;
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
