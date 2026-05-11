import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import {
  bridgeComponents,
  categoryColors,
  getComponentById,
  loadPathComponentIds,
  type BridgeCategory
} from "../lib/bridgeData";
import { useViewerStore } from "../store/viewerStore";

type Vec3 = [number, number, number];

const categoryOffsets: Record<BridgeCategory, Vec3> = {
  superstructure: [0, 0.72, 0],
  substructure: [0, -0.18, 0],
  foundation: [0, -0.62, 0]
};

export function BridgeViewer() {
  const displayMode = useViewerStore((state) => state.displayMode);

  if (displayMode === "2d") {
    return <BridgeDiagram2D />;
  }

  return (
    <Canvas
      camera={{ position: [7.4, 4.6, 6.8], fov: 44 }}
      className="bridge-canvas"
      dpr={[1, 1.8]}
      shadows="basic"
    >
      <color attach="background" args={["#f8fbff"]} />
      <ambientLight intensity={0.62} />
      <directionalLight
        castShadow
        intensity={1.55}
        position={[4.8, 8.5, 5.5]}
        shadow-mapSize-height={1024}
        shadow-mapSize-width={1024}
      />
      <pointLight intensity={0.85} position={[-5, 3, -4]} />
      <BridgeModel />
      <GridFloor />
      <ContactShadows blur={2.4} far={7} opacity={0.2} position={[0, -1.66, 0]} scale={13} />
      <OrbitControls
        enableDamping
        maxDistance={13}
        maxPolarAngle={Math.PI / 2.08}
        minDistance={4.2}
        target={[0, 0.58, 0]}
      />
    </Canvas>
  );
}

function BridgeModel() {
  const selectedId = useViewerStore((state) => state.selectedComponentId);
  const hoveredId = useViewerStore((state) => state.hoveredComponentId);
  const labelsVisible = useViewerStore((state) => state.labelsVisible);
  const decompositionEnabled = useViewerStore((state) => state.decompositionEnabled);
  const loadPathActive = useViewerStore((state) => state.loadPathActive);
  const loadPathStep = useViewerStore((state) => state.loadPathStep);
  const selectComponent = useViewerStore((state) => state.selectComponent);
  const layerMode = useViewerStore((state) => state.layerMode);
  const setHovered = useViewerStore((state) => state.setHoveredComponent);
  const activeLoadId = loadPathActive ? loadPathComponentIds[loadPathStep] : null;

  const materialFor = (id: string, category: BridgeCategory, baseColor: string) => {
    const inactive = layerMode !== "all" && layerMode !== category;
    const selected = selectedId === id;
    const hovered = hoveredId === id;
    const inLoadPath = activeLoadId === id;

    return {
      color: inLoadPath ? "#f2b33d" : selected ? "#2877d4" : hovered ? "#69aef6" : baseColor,
      opacity: inactive ? 0.18 : selected ? 0.82 : 1,
      transparent: inactive || selected,
      roughness: 0.62,
      metalness: category === "superstructure" ? 0.08 : 0.02
    };
  };

  const groupOffset = (category: BridgeCategory): Vec3 =>
    decompositionEnabled ? categoryOffsets[category] : [0, 0, 0];

  return (
    <group>
      <InteractiveGroup
        id="soil-layer"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("foundation")}
      >
        <mesh receiveShadow position={[0, -1.42, 0]}>
          <boxGeometry args={[12.8, 0.42, 4.25]} />
          <meshStandardMaterial {...materialFor("soil-layer", "foundation", "#b98555")} />
        </mesh>
        <mesh receiveShadow position={[0, -1.16, 0]}>
          <boxGeometry args={[12.85, 0.1, 4.28]} />
          <meshStandardMaterial {...materialFor("soil-layer", "foundation", "#8fb36a")} />
        </mesh>
      </InteractiveGroup>

      <InteractiveGroup
        id="pile-foundation"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("foundation")}
      >
        {[-4.8, -2.25, 2.25, 4.8].map((x) =>
          [-0.55, 0.55].map((z) => (
            <mesh castShadow key={`${x}-${z}`} position={[x, -1.06, z]}>
              <cylinderGeometry args={[0.13, 0.13, 1.05, 24]} />
              <meshStandardMaterial
                {...materialFor("pile-foundation", "foundation", "#cbd3dc")}
              />
            </mesh>
          ))
        )}
      </InteractiveGroup>

      <InteractiveGroup
        id="pile-cap"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("foundation")}
      >
        {[-4.8, -2.25, 2.25, 4.8].map((x) => (
          <mesh castShadow key={x} position={[x, -0.58, 0]}>
            <boxGeometry args={[1.25, 0.28, 1.5]} />
            <meshStandardMaterial {...materialFor("pile-cap", "foundation", "#c5cbd2")} />
          </mesh>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="abutment"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("substructure")}
      >
        {[-5.18, 5.18].map((x) => (
          <mesh castShadow key={x} position={[x, 0.25, 0]}>
            <boxGeometry args={[0.55, 1.45, 2.18]} />
            <meshStandardMaterial {...materialFor("abutment", "substructure", "#d9dde2")} />
          </mesh>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="pier"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("substructure")}
      >
        {[-2.25, 2.25].map((x) => (
          <group key={x}>
            <mesh castShadow position={[x, 0.14, 0]}>
              <boxGeometry args={[0.55, 1.38, 0.78]} />
              <meshStandardMaterial {...materialFor("pier", "substructure", "#d5dae0")} />
            </mesh>
            <mesh castShadow position={[x, 0.9, 0]}>
              <boxGeometry args={[1.05, 0.22, 1.25]} />
              <meshStandardMaterial {...materialFor("pier", "substructure", "#c8ced6")} />
            </mesh>
          </group>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="bearing"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("superstructure")}
      >
        {[-4.8, -2.25, 2.25, 4.8].map((x) =>
          [-0.72, 0.72].map((z) => (
            <mesh castShadow key={`${x}-${z}`} position={[x, 0.98, z]}>
              <boxGeometry args={[0.36, 0.14, 0.38]} />
              <meshStandardMaterial {...materialFor("bearing", "superstructure", "#2f3640")} />
            </mesh>
          ))
        )}
      </InteractiveGroup>

      <InteractiveGroup
        id="main-girder"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("superstructure")}
      >
        {[-0.72, 0.72].map((z) => (
          <mesh castShadow key={z} position={[0, 1.28, z]}>
            <boxGeometry args={[10.7, 0.42, 0.28]} />
            <meshStandardMaterial
              {...materialFor("main-girder", "superstructure", "#9aa8b4")}
            />
          </mesh>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="cross-beam"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("superstructure")}
      >
        {[-3.35, 0, 3.35].map((x) => (
          <mesh castShadow key={x} position={[x, 1.24, 0]}>
            <boxGeometry args={[0.18, 0.28, 1.75]} />
            <meshStandardMaterial
              {...materialFor("cross-beam", "superstructure", "#8797a4")}
            />
          </mesh>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="deck-slab"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("superstructure")}
      >
        <mesh castShadow receiveShadow position={[0, 1.72, 0]}>
          <boxGeometry args={[10.95, 0.22, 2.32]} />
          <meshStandardMaterial {...materialFor("deck-slab", "superstructure", "#d4d9df")} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 1.86, 0]}>
          <boxGeometry args={[10.78, 0.04, 2.12]} />
          <meshStandardMaterial {...materialFor("deck-slab", "superstructure", "#727a82")} />
        </mesh>
        {[-0.34, 0.34].map((z) => (
          <mesh key={z} position={[0, 1.89, z]}>
            <boxGeometry args={[9.4, 0.012, 0.035]} />
            <meshStandardMaterial color="#dfe5eb" roughness={0.5} />
          </mesh>
        ))}
      </InteractiveGroup>

      <InteractiveGroup
        id="guardrail"
        onHover={setHovered}
        onSelect={selectComponent}
        position={groupOffset("superstructure")}
      >
        {[-1.24, 1.24].map((z) => (
          <group key={z}>
            <mesh castShadow position={[0, 2.22, z]}>
              <boxGeometry args={[10.85, 0.06, 0.055]} />
              <meshStandardMaterial {...materialFor("guardrail", "superstructure", "#f2f5f8")} />
            </mesh>
            <mesh castShadow position={[0, 2.02, z]}>
              <boxGeometry args={[10.85, 0.045, 0.05]} />
              <meshStandardMaterial {...materialFor("guardrail", "superstructure", "#e7ecf1")} />
            </mesh>
            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((x) => (
              <mesh castShadow key={x} position={[x, 2.08, z]}>
                <boxGeometry args={[0.055, 0.42, 0.055]} />
                <meshStandardMaterial {...materialFor("guardrail", "superstructure", "#e0e6ec")} />
              </mesh>
            ))}
          </group>
        ))}
      </InteractiveGroup>

      {labelsVisible
        ? bridgeComponents.map((component) => {
            const offset = decompositionEnabled ? categoryOffsets[component.category] : [0, 0, 0];
            return (
              <Html
                center
                distanceFactor={8.5}
                key={component.id}
                position={[
                  component.labelPosition[0] + offset[0],
                  component.labelPosition[1] + offset[1],
                  component.labelPosition[2] + offset[2]
                ]}
                zIndexRange={[4, 0]}
              >
                <button
                  className={selectedId === component.id ? "scene-label active" : "scene-label"}
                  onClick={() => selectComponent(component.id)}
                  type="button"
                >
                  <span>{component.number}</span>
                  {component.nameZh}
                </button>
              </Html>
            );
          })
        : null}
    </group>
  );
}

function InteractiveGroup({
  id,
  children,
  position,
  onHover,
  onSelect
}: {
  id: string;
  children: React.ReactNode;
  position?: Vec3;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <group
      onClick={(event) => {
        event.stopPropagation();
        onSelect(id);
      }}
      onPointerOut={() => onHover(null)}
      onPointerOver={(event) => {
        event.stopPropagation();
        onHover(id);
      }}
      position={position}
    >
      {children}
    </group>
  );
}

function GridFloor() {
  return (
    <gridHelper
      args={[14, 28, "#d8e3ef", "#eef3f8"]}
      position={[0, -1.14, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function BridgeDiagram2D() {
  const selectedId = useViewerStore((state) => state.selectedComponentId);
  const selectComponent = useViewerStore((state) => state.selectComponent);
  const selected = getComponentById(selectedId);

  return (
    <div className="diagram-2d">
      <svg viewBox="0 0 900 520" role="img" aria-label="桥梁二维结构示意图">
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" floodColor="#0d3768" floodOpacity="0.14" stdDeviation="10" />
          </filter>
        </defs>
        <rect className="diagram-bg" width="900" height="520" rx="24" />
        <g filter="url(#softShadow)">
          <rect
            className={selectedId === "soil-layer" ? "diagram-shape selected foundation" : "diagram-shape soil"}
            x="86"
            y="384"
            width="728"
            height="58"
            rx="8"
            onClick={() => selectComponent("soil-layer")}
          />
          <rect
            className={selectedId === "deck-slab" ? "diagram-shape selected superstructure" : "diagram-shape deck"}
            x="158"
            y="134"
            width="584"
            height="30"
            rx="5"
            onClick={() => selectComponent("deck-slab")}
          />
          <rect
            className={selectedId === "main-girder" ? "diagram-shape selected superstructure" : "diagram-shape girder"}
            x="188"
            y="172"
            width="524"
            height="42"
            rx="5"
            onClick={() => selectComponent("main-girder")}
          />
          <rect
            className={selectedId === "pier" ? "diagram-shape selected substructure" : "diagram-shape concrete"}
            x="398"
            y="228"
            width="52"
            height="118"
            rx="6"
            onClick={() => selectComponent("pier")}
          />
          <rect
            className={selectedId === "pier" ? "diagram-shape selected substructure" : "diagram-shape concrete"}
            x="502"
            y="228"
            width="52"
            height="118"
            rx="6"
            onClick={() => selectComponent("pier")}
          />
          <rect
            className={selectedId === "abutment" ? "diagram-shape selected substructure" : "diagram-shape concrete"}
            x="118"
            y="214"
            width="54"
            height="136"
            rx="5"
            onClick={() => selectComponent("abutment")}
          />
          <rect
            className={selectedId === "abutment" ? "diagram-shape selected substructure" : "diagram-shape concrete"}
            x="728"
            y="214"
            width="54"
            height="136"
            rx="5"
            onClick={() => selectComponent("abutment")}
          />
          <rect
            className={selectedId === "pile-cap" ? "diagram-shape selected foundation" : "diagram-shape cap"}
            x="368"
            y="346"
            width="218"
            height="34"
            rx="6"
            onClick={() => selectComponent("pile-cap")}
          />
          {[395, 435, 515, 555].map((x) => (
            <rect
              className={
                selectedId === "pile-foundation"
                  ? "diagram-shape selected foundation"
                  : "diagram-shape pile"
              }
              height="78"
              key={x}
              onClick={() => selectComponent("pile-foundation")}
              rx="8"
              width="20"
              x={x}
              y="380"
            />
          ))}
          <rect
            className={selectedId === "guardrail" ? "diagram-shape selected superstructure" : "diagram-shape rail"}
            x="162"
            y="99"
            width="576"
            height="14"
            rx="4"
            onClick={() => selectComponent("guardrail")}
          />
          <rect
            className={selectedId === "bearing" ? "diagram-shape selected superstructure" : "diagram-shape bearing"}
            x="396"
            y="214"
            width="62"
            height="14"
            rx="4"
            onClick={() => selectComponent("bearing")}
          />
          <rect
            className={selectedId === "cross-beam" ? "diagram-shape selected superstructure" : "diagram-shape beam"}
            x="444"
            y="168"
            width="20"
            height="54"
            rx="4"
            onClick={() => selectComponent("cross-beam")}
          />
        </g>
        <text className="diagram-title" x="42" y="62">
          2D 构件关系示意
        </text>
        <text className="diagram-subtitle" x="42" y="92">
          当前选中: {selected?.nameZh ?? "主梁"}
        </text>
        {bridgeComponents.slice(0, 9).map((component, index) => (
          <g key={component.id} transform={`translate(${640}, ${52 + index * 34})`}>
            <circle
              className={`diagram-label-dot ${component.category}`}
              r="12"
              onClick={() => selectComponent(component.id)}
            />
            <text className="diagram-label-number" dy="5" textAnchor="middle">
              {component.number}
            </text>
            <text className="diagram-label-text" x="24" y="5">
              {component.nameZh}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
