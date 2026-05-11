import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Html, OrbitControls } from "@react-three/drei";
import {
  bridgeComponents,
  categoryColors,
  getComponentById,
  loadPathComponentIds,
  type BridgeCategory
} from "../lib/bridgeData";
import { twoDViewModes, type TwoDViewMode } from "../lib/viewConfig";
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
  const [activeView, setActiveView] = useState<TwoDViewMode>("top");
  const selectedId = useViewerStore((state) => state.selectedComponentId);
  const selectComponent = useViewerStore((state) => state.selectComponent);
  const selected = getComponentById(selectedId);

  return (
    <div className="diagram-2d">
      <div className="diagram-tabs" aria-label="2D视图切换">
        {twoDViewModes.map((mode) => (
          <button
            className={activeView === mode.id ? "active" : ""}
            key={mode.id}
            onClick={() => setActiveView(mode.id)}
            type="button"
          >
            {mode.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 900 520" role="img" aria-label={`${getTwoDModeLabel(activeView)}桥梁二维结构示意图`}>
        <defs>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="10" floodColor="#0d3768" floodOpacity="0.14" stdDeviation="10" />
          </filter>
          <pattern id="diagramGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#dfe8f2" strokeWidth="1" />
          </pattern>
        </defs>
        <rect className="diagram-bg" width="900" height="520" rx="24" />
        <rect className="diagram-grid" width="900" height="520" rx="24" />
        <text className="diagram-title" x="42" y="62">
          {getTwoDModeLabel(activeView)}
        </text>
        <text className="diagram-subtitle" x="42" y="92">
          当前选中: {selected?.nameZh ?? "主梁"}
        </text>
        {activeView === "top" ? (
          <TopViewDiagram selectedId={selectedId} selectComponent={selectComponent} />
        ) : null}
        {activeView === "side" ? (
          <SideViewDiagram selectedId={selectedId} selectComponent={selectComponent} />
        ) : null}
      </svg>
    </div>
  );
}

function getTwoDModeLabel(mode: TwoDViewMode) {
  return twoDViewModes.find((item) => item.id === mode)?.label ?? "顶视图";
}

function shapeClass(selectedId: string, id: string, category: BridgeCategory, fallback: string) {
  return selectedId === id ? `diagram-shape selected ${category}` : `diagram-shape ${fallback}`;
}

type DiagramViewProps = {
  selectedId: string;
  selectComponent: (id: string) => void;
};

function TopViewDiagram({ selectedId, selectComponent }: DiagramViewProps) {
  return (
    <g filter="url(#softShadow)">
      <rect className="diagram-panel-label" x="40" y="126" width="72" height="32" rx="6" />
      <text className="diagram-panel-label-text" x="76" y="148" textAnchor="middle">顶视图</text>
      <rect
        className={shapeClass(selectedId, "deck-slab", "superstructure", "deck")}
        height="104"
        onClick={() => selectComponent("deck-slab")}
        rx="8"
        width="560"
        x="170"
        y="210"
      />
      <rect
        className={shapeClass(selectedId, "guardrail", "superstructure", "rail")}
        height="10"
        onClick={() => selectComponent("guardrail")}
        rx="3"
        width="580"
        x="160"
        y="190"
      />
      <rect
        className={shapeClass(selectedId, "guardrail", "superstructure", "rail")}
        height="10"
        onClick={() => selectComponent("guardrail")}
        rx="3"
        width="580"
        x="160"
        y="324"
      />
      {[260, 450, 640].map((x) => (
        <rect
          className={shapeClass(selectedId, "cross-beam", "superstructure", "beam")}
          height="104"
          key={x}
          onClick={() => selectComponent("cross-beam")}
          rx="3"
          width="12"
          x={x}
          y="210"
        />
      ))}
      <path className="road-mark" d="M215 262h34M288 262h34M361 262h34M434 262h34M507 262h34M580 262h34M653 262h34" />
      <DiagramCallout x={285} y={185} number={1} label="护栏" onClick={() => selectComponent("guardrail")} />
      <DiagramCallout x={610} y={185} number={2} label="桥面板" onClick={() => selectComponent("deck-slab")} />
      <DiagramCallout x={450} y={336} number={4} label="横梁" onClick={() => selectComponent("cross-beam")} />
    </g>
  );
}

function SideViewDiagram({ selectedId, selectComponent }: DiagramViewProps) {
  return (
    <g filter="url(#softShadow)">
      <rect className="diagram-panel-label" x="40" y="126" width="72" height="32" rx="6" />
      <text className="diagram-panel-label-text" x="76" y="148" textAnchor="middle">侧视图</text>
      <path
        className={shapeClass(selectedId, "soil-layer", "foundation", "soil")}
        d="M90 350h720v82H90z"
        onClick={() => selectComponent("soil-layer")}
      />
      <rect
        className={shapeClass(selectedId, "deck-slab", "superstructure", "deck")}
        height="22"
        onClick={() => selectComponent("deck-slab")}
        rx="4"
        width="650"
        x="125"
        y="176"
      />
      <rect
        className={shapeClass(selectedId, "guardrail", "superstructure", "rail")}
        height="16"
        onClick={() => selectComponent("guardrail")}
        rx="3"
        width="620"
        x="140"
        y="150"
      />
      <rect
        className={shapeClass(selectedId, "main-girder", "superstructure", "girder")}
        height="36"
        onClick={() => selectComponent("main-girder")}
        rx="4"
        width="620"
        x="140"
        y="198"
      />
      {[218, 422, 626].map((x) => (
        <g key={x}>
          <rect
            className={shapeClass(selectedId, "bearing", "superstructure", "bearing")}
            height="12"
            onClick={() => selectComponent("bearing")}
            rx="3"
            width="40"
            x={x}
            y="236"
          />
          <rect
            className={shapeClass(selectedId, "pier", "substructure", "concrete")}
            height="92"
            onClick={() => selectComponent("pier")}
            rx="4"
            width="36"
            x={x + 2}
            y="248"
          />
          <rect
            className={shapeClass(selectedId, "pile-cap", "foundation", "cap")}
            height="24"
            onClick={() => selectComponent("pile-cap")}
            rx="4"
            width="80"
            x={x - 20}
            y="340"
          />
          {[x - 6, x + 18, x + 42].map((pileX) => (
            <rect
              className={shapeClass(selectedId, "pile-foundation", "foundation", "pile")}
              height="52"
              key={pileX}
              onClick={() => selectComponent("pile-foundation")}
              rx="5"
              width="14"
              x={pileX}
              y="364"
            />
          ))}
        </g>
      ))}
      <path
        className={shapeClass(selectedId, "abutment", "substructure", "concrete")}
        d="M90 234h48v116H90zM762 234h48v116h-48z"
        onClick={() => selectComponent("abutment")}
      />
      <rect
        className={shapeClass(selectedId, "cross-beam", "superstructure", "beam")}
        height="46"
        onClick={() => selectComponent("cross-beam")}
        rx="3"
        width="10"
        x="758"
        y="192"
      />
      <DiagramCallout x={310} y={138} number={1} label="护栏" onClick={() => selectComponent("guardrail")} />
      <DiagramCallout x={480} y={142} number={2} label="桥面板" onClick={() => selectComponent("deck-slab")} />
      <DiagramCallout x={460} y={256} number={3} label="主梁" onClick={() => selectComponent("main-girder")} />
      <DiagramCallout x={790} y={246} number={4} label="横梁" onClick={() => selectComponent("cross-beam")} />
      <DiagramCallout x={690} y={276} number={5} label="支座" onClick={() => selectComponent("bearing")} />
      <DiagramCallout x={650} y={324} number={6} label="桥墩" onClick={() => selectComponent("pier")} />
      <DiagramCallout x={160} y={336} number={7} label="桥台" onClick={() => selectComponent("abutment")} />
      <DiagramCallout x={520} y={424} number={8} label="基础" onClick={() => selectComponent("pile-cap")} />
    </g>
  );
}

function DiagramCallout({
  x,
  y,
  number,
  label,
  onClick
}: {
  x: number;
  y: number;
  number: number;
  label: string;
  onClick: () => void;
}) {
  return (
    <g className="diagram-callout" onClick={onClick} transform={`translate(${x}, ${y})`}>
      <line x1="0" x2="0" y1="0" y2="42" />
      <circle r="13" />
      <text className="diagram-label-number" dy="5" textAnchor="middle">
        {number}
      </text>
      <text className="diagram-label-text" x="20" y="5">
        {label}
      </text>
    </g>
  );
}
