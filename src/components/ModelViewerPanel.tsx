import { Suspense, useEffect, useId, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";
import * as THREE from "three";
import { AlertCircle, Box, ChevronDown, Palette, Upload } from "lucide-react";

const DEFAULT_MODEL = { id: "bridge", name: "bridge.glb", src: "/models/bridge.glb" };

const EXTRA_MODELS = [
  { id: "model-1", name: "Model 1", src: "/models/Model 1.glb" },
  { id: "model-2", name: "Model 2", src: "/models/Model 2.glb" },
  { id: "model-3", name: "Model 3", src: "/models/Model 3.glb" },
] as const;

const ALL_MODELS = [DEFAULT_MODEL, ...EXTRA_MODELS];

type ActiveModel = {
  name: string;
  src: string;
  source: string;
};

// ─── 结构分色：按 Y 坐标将顶点映射到不同构件颜色 ───────────────
// bridge.glb 原始 Y 范围约 -0.204 ~ 0.208（总高 0.412）
// 从下到上依次：地基/土层 → 桩基 → 承台 → 桥墩 → 支座 → 主梁/横梁 → 桥面板 → 护栏

const STRUCTURE_BANDS: { maxY: number; color: [number, number, number]; label: string }[] = [
  { maxY: -0.16, color: [0.68, 0.46, 0.20], label: "地基/土层" },     // 棕色
  { maxY: -0.10, color: [0.55, 0.70, 0.55], label: "桩基" },          // 绿色
  { maxY: -0.04, color: [0.40, 0.60, 0.75], label: "承台" },          // 蓝色
  { maxY:  0.06, color: [0.75, 0.55, 0.35], label: "桥墩" },          // 橙色
  { maxY:  0.08, color: [0.25, 0.25, 0.30], label: "支座" },          // 深灰
  { maxY:  0.12, color: [0.85, 0.45, 0.40], label: "主梁/横梁" },     // 红色
  { maxY:  0.17, color: [0.55, 0.65, 0.80], label: "桥面板" },        // 淡蓝
  { maxY:  Infinity, color: [0.90, 0.85, 0.60], label: "护栏" },      // 黄色
];

function getStructureColor(y: number): [number, number, number] {
  for (const band of STRUCTURE_BANDS) {
    if (y <= band.maxY) return band.color;
  }
  return STRUCTURE_BANDS[STRUCTURE_BANDS.length - 1].color;
}

// ─── 主面板 ──────────────────────────────────────────────────────

export function ModelViewerPanel() {
  const uploadInputId = useId();
  const [activeModel, setActiveModel] = useState<ActiveModel>({
    name: DEFAULT_MODEL.name,
    src: DEFAULT_MODEL.src,
    source: "默认桥梁模型"
  });
  const [status, setStatus] = useState("正在载入模型...");
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuralColor, setStructuralColor] = useState(false);
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

  const selectPreset = (id: string) => {
    const preset = ALL_MODELS.find((m) => m.id === id);
    if (!preset) return;
    const source = preset.id === DEFAULT_MODEL.id ? "默认桥梁模型" : "预设模型";
    setActiveModel({ name: preset.name, src: preset.src, source });
    setStatus("正在载入模型...");
    setIsProcessing(true);
  };

  return (
    <div className="model-viewer-panel">
      <div className="model-viewer-header">
        <div>
          <span className="model-viewer-kicker">模型预览</span>
          <h3>{activeModel.name}</h3>
          <p>{activeModel.source}</p>
        </div>
        <div className="model-actions">
          <div className="model-select-wrapper">
            <select
              className="model-select"
              onChange={(e) => selectPreset(e.target.value)}
              value={ALL_MODELS.find((m) => m.src === activeModel.src)?.id ?? ""}
            >
              {ALL_MODELS.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="model-select-icon" size={16} />
          </div>
          <button
            className={structuralColor ? "model-action" : "model-action secondary"}
            onClick={() => setStructuralColor((v) => !v)}
            type="button"
            title="按结构分色"
          >
            <Palette size={18} />
            分色
          </button>
          <label className="model-action secondary" htmlFor={uploadInputId}>
            <Upload size={18} />
            上传
          </label>
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
              structuralColor={structuralColor}
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

        {structuralColor ? (
          <div className="structure-legend">
            {STRUCTURE_BANDS.map((band) => (
              <div className="legend-item" key={band.label}>
                <span
                  className="legend-swatch"
                  style={{
                    background: `rgb(${Math.round(band.color[0] * 255)},${Math.round(band.color[1] * 255)},${Math.round(band.color[2] * 255)})`
                  }}
                />
                <span>{band.label}</span>
              </div>
            ))}
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
  structuralColor,
  onLoad,
  onError
}: {
  src: string;
  structuralColor: boolean;
  onLoad: () => void;
  onError: () => void;
}) {
  let gltf: { scene: THREE.Group };

  try {
    gltf = useLoader(GLTFLoader, src);
  } catch (error) {
    if (error instanceof Promise) throw error;
    onError();
    return null;
  }

  const processedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);

    const defaultMaterial = new THREE.MeshStandardMaterial({
      color: 0xb0a898,
      roughness: 0.55,
      metalness: 0.08,
      side: THREE.DoubleSide,
      envMapIntensity: 1.15
    });

    if (structuralColor) {
      // ── 分色模式：收集所有 mesh，按面片中心 Y 拆分 ──
      const meshes: THREE.Mesh[] = [];
      scene.traverse((node) => {
        if (node instanceof THREE.Mesh) meshes.push(node);
      });

      for (const mesh of meshes) {
        const srcGeom = mesh.geometry;
        const index = srcGeom.index;
        const positions = srcGeom.getAttribute("position");
        if (!positions || !index) continue;

        const bandFaces: number[][] = STRUCTURE_BANDS.map(() => []);
        for (let f = 0; f < index.count; f += 3) {
          const ia = index.getX(f);
          const ib = index.getX(f + 1);
          const ic = index.getX(f + 2);
          const cy = (positions.getY(ia) + positions.getY(ib) + positions.getY(ic)) / 3;
          for (let bi = 0; bi < STRUCTURE_BANDS.length; bi++) {
            if (cy <= STRUCTURE_BANDS[bi].maxY) {
              bandFaces[bi].push(ia, ib, ic);
              break;
            }
          }
        }

        const parent = mesh.parent ?? scene;
        for (let bi = 0; bi < STRUCTURE_BANDS.length; bi++) {
          if (bandFaces[bi].length === 0) continue;
          const subGeom = srcGeom.clone();
          subGeom.setIndex(bandFaces[bi]);
          const [r, g, b] = STRUCTURE_BANDS[bi].color;
          const subMesh = new THREE.Mesh(
            subGeom,
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(r, g, b),
              roughness: 0.45,
              metalness: 0.02,
              side: THREE.DoubleSide,
            })
          );
          subMesh.castShadow = true;
          subMesh.receiveShadow = true;
          parent.add(subMesh);
        }
        parent.remove(mesh);
      }
    } else {
      // ── 原始模式：修复/增强材质 ──
      scene.traverse((node) => {
        if (!(node instanceof THREE.Mesh)) return;
        node.castShadow = true;
        node.receiveShadow = true;
        if (!node.material) {
          node.material = defaultMaterial;
        } else if (Array.isArray(node.material)) {
          if (node.material.length === 0) {
            node.material = defaultMaterial;
          }
        } else {
          const mat = node.material as THREE.MeshStandardMaterial;
          if (mat.isMeshStandardMaterial) {
            mat.side = THREE.DoubleSide;
            mat.envMapIntensity = Math.max(mat.envMapIntensity ?? 0, 1.15);
          }
        }
      });
    }

    // ── 自动居中 + 缩放适配视口 ──
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetSize = 2.5;
    const scale = maxDim > 0 ? targetSize / maxDim : 1;
    scene.scale.setScalar(scale);

    const scaledBox = new THREE.Box3().setFromObject(scene);
    const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
    const scaledMin = scaledBox.min;
    scene.position.sub(scaledCenter);
    scene.position.y -= scaledMin.y - scaledCenter.y;

    return scene;
  }, [gltf, structuralColor]);

  useEffect(() => {
    onLoad();
  }, [processedScene]);

  const sceneKey = `${src}-${structuralColor}`;
  return <primitive key={sceneKey} object={processedScene} />;
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
