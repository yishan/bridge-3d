import { useEffect, useState, type CSSProperties } from "react";
import {
  BookOpen,
  ChevronDown,
  Eye,
  EyeOff,
  Maximize,
  Minimize2,
  Move3d,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { BridgeViewer } from "./components/BridgeViewer";
import { ComponentNavIcon } from "./components/ComponentNavIcon";
import { DetailDiagram } from "./components/DetailDiagram";
import {
  categoryLabels,
  categoryUiColors,
  getComponentById,
  getDefaultComponent,
  getGroupedComponents,
  getRelatedComponents,
  loadPathComponentIds,
  type BridgeCategory
} from "./lib/bridgeData";
import {
  defaultViewTitle,
  headerUtilityActions,
  knowledgeCardButtonVisible
} from "./lib/viewConfig";
import { useViewerStore } from "./store/viewerStore";

const groupOrder: BridgeCategory[] = ["superstructure", "substructure", "foundation"];

function App() {
  const [isImmersive, setIsImmersive] = useState(false);
  const selectedComponentId = useViewerStore((state) => state.selectedComponentId);
  const displayMode = useViewerStore((state) => state.displayMode);
  const labelsVisible = useViewerStore((state) => state.labelsVisible);
  const decompositionEnabled = useViewerStore((state) => state.decompositionEnabled);
  const loadPathActive = useViewerStore((state) => state.loadPathActive);
  const loadPathStep = useViewerStore((state) => state.loadPathStep);
  const setDisplayMode = useViewerStore((state) => state.setDisplayMode);
  const selectComponent = useViewerStore((state) => state.selectComponent);
  const toggleLabels = useViewerStore((state) => state.toggleLabels);
  const toggleDecomposition = useViewerStore((state) => state.toggleDecomposition);
  const toggleLoadPath = useViewerStore((state) => state.toggleLoadPath);

  const selectedComponent = getComponentById(selectedComponentId) ?? getDefaultComponent();
  const currentLoadComponent = getComponentById(loadPathComponentIds[loadPathStep]);

  const enterImmersive = () => {
    setDisplayMode("3d");
    setIsImmersive(true);
  };

  useEffect(() => {
    if (!loadPathActive) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      useViewerStore.getState().advanceLoadPathStep();
    }, 1400);

    return () => window.clearInterval(timer);
  }, [loadPathActive]);

  return (
    <div className={isImmersive ? "app-shell immersive" : "app-shell"}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <div>
            <h1>桥梁结构交互式导览</h1>
            <p>梁桥构件认知与受力路径教学</p>
          </div>
        </div>

        <div className="top-actions" aria-label="辅助操作">
          {headerUtilityActions.includes("fullscreen") ? (
            <button className="icon-action" onClick={enterImmersive} type="button" title="全屏">
              <Maximize size={20} />
            </button>
          ) : null}
        </div>
      </header>

      <main className="workspace">
        <aside className="left-panel panel">
          <div className="panel-heading">
            <div>
              <h2>构件导航</h2>
              <p>按结构层级选择构件</p>
            </div>
            <button className="small-icon-button" type="button" title="筛选">
              <Sparkles size={18} />
            </button>
          </div>
          <ComponentNavigation selectedId={selectedComponent.id} onSelect={selectComponent} />
          <TeachingTip />
        </aside>

        <section className="viewer-stage" aria-label="桥梁结构视图">
          <div className="viewer-title">
            <div>
              <h2>{defaultViewTitle}</h2>
              <p>
                点击构件编号、左侧列表或 3D 模型，查看构件作用与关联关系。
              </p>
            </div>
            <div className="mode-switch" aria-label="视图模式">
              <button
                className={displayMode === "2d" ? "active" : ""}
                onClick={() => setDisplayMode("2d")}
                type="button"
              >
                2D
              </button>
              <button
                className={displayMode === "3d" ? "active" : ""}
                onClick={() => setDisplayMode("3d")}
                type="button"
              >
                3D
              </button>
            </div>
          </div>

          <BridgeViewer />

          {loadPathActive ? (
            <div className="load-path-callout">
              <span>受力路径</span>
              <strong>{currentLoadComponent?.nameZh}</strong>
              <p>{loadPathExplanation(currentLoadComponent?.id)}</p>
            </div>
          ) : null}

          <Toolbar
            decompositionEnabled={decompositionEnabled}
            labelsVisible={labelsVisible}
            loadPathActive={loadPathActive}
            onToggleDecomposition={toggleDecomposition}
            onToggleLabels={toggleLabels}
            onToggleLoadPath={toggleLoadPath}
          />

          {isImmersive ? (
            <button
              className="close-immersive-button"
              onClick={() => setIsImmersive(false)}
              type="button"
            >
              <Minimize2 size={18} />
              关闭全屏视图
            </button>
          ) : null}
        </section>

        <aside className="right-panel panel">
          <DetailPanel componentId={selectedComponent.id} />
        </aside>
      </main>

      <footer className="statusbar">
        <span>当前视图: {defaultViewTitle}</span>
        <span>已选择构件: <strong>{selectedComponent.nameZh}</strong></span>
        <span>版本: v1.0.0</span>
      </footer>
    </div>
  );
}

function ComponentNavigation({
  selectedId,
  onSelect
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const groups = getGroupedComponents();

  return (
    <div className="component-nav">
      {groupOrder.map((category) => (
        <section className="component-group" key={category}>
          <h3>
            <span className={`group-caret ${category}`} />
            {categoryLabels[category]}
          </h3>
          {groups[category].map((component) => (
            <button
              className={
                component.id === selectedId
                  ? `component-row ${component.category} active`
                  : `component-row ${component.category}`
              }
              key={component.id}
              onClick={() => onSelect(component.id)}
              style={getComponentRowStyle(component.category)}
              type="button"
            >
              <ComponentNavIcon component={component} />
              <span className={`component-number ${component.category}`}>
                {component.number}
              </span>
              <span>{component.nameZh}</span>
            </button>
          ))}
        </section>
      ))}
    </div>
  );
}

function TeachingTip() {
  const [tipState, setTipState] = useState<"open" | "collapsed">("open");

  if (tipState === "collapsed") {
    return (
      <button className="tip-reopen" onClick={() => setTipState("open")} type="button">
        <BookOpen size={18} />
        <span>使用提示</span>
      </button>
    );
  }

  return (
    <div className="teaching-tip">
      <div className="tip-topline">
        <div className="tip-icon">
          <BookOpen size={20} />
        </div>
        <div className="tip-actions">
          <button onClick={() => setTipState("collapsed")} title="收拢" type="button">
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <h3>使用提示</h3>
      <p>先从整体视图认识构件名称，再播放受力路径理解荷载如何逐级传递。</p>
    </div>
  );
}

function getComponentRowStyle(category: BridgeCategory): CSSProperties {
  const colors = categoryUiColors[category];

  return {
    "--component-accent": colors.accent,
    "--component-accent-strong": colors.accentStrong,
    "--component-hover": colors.hover,
    "--component-selected": colors.selected
  } as CSSProperties;
}

function DetailPanel({ componentId }: { componentId: string }) {
  const component = getComponentById(componentId) ?? getDefaultComponent();
  const related = getRelatedComponents(component.id);

  return (
    <>
      <div className="panel-heading">
        <div>
          <h2>构件详情</h2>
          <p>当前选中构件的教学说明</p>
        </div>
      </div>

      <div className="component-detail-title">
        <span className={`detail-number ${component.category}`}>{component.number}</span>
        <div>
          <h2>{component.nameZh}</h2>
          <p>{categoryLabels[component.category]}</p>
        </div>
      </div>

      <p className="detail-summary">{component.shortDescription}</p>

      <DetailDiagram component={component} />

      <div className="detail-table">
        <DetailRow label="作用" value={component.functions.join("；")} />
        <DetailRow label="位置" value={component.location} />
        <DetailRow label="常见材料" value={component.materials.join("、")} />
        <DetailRow label="关联构件" value={related.map((item) => item.nameZh).join("、")} />
      </div>

      {knowledgeCardButtonVisible ? (
        <button className="primary-button" type="button">
          <BookOpen size={18} />
          查看知识卡片
        </button>
      ) : null}
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-row">
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

function Toolbar({
  labelsVisible,
  decompositionEnabled,
  loadPathActive,
  onToggleLabels,
  onToggleDecomposition,
  onToggleLoadPath
}: {
  labelsVisible: boolean;
  decompositionEnabled: boolean;
  loadPathActive: boolean;
  onToggleLabels: () => void;
  onToggleDecomposition: () => void;
  onToggleLoadPath: () => void;
}) {
  return (
    <div className="toolbar" aria-label="教学工具栏">
      <button className={labelsVisible ? "tool active" : "tool"} onClick={onToggleLabels} type="button">
        {labelsVisible ? <Eye size={21} /> : <EyeOff size={21} />}
        <span>显示标签</span>
      </button>
      <button
        className={decompositionEnabled ? "tool active" : "tool"}
        onClick={onToggleDecomposition}
        type="button"
      >
        <Move3d size={21} />
        <span>结构拆解</span>
      </button>
      <button
        className={loadPathActive ? "tool active" : "tool"}
        onClick={onToggleLoadPath}
        type="button"
      >
        <RotateCcw size={21} />
        <span>受力路径</span>
      </button>
    </div>
  );
}

function loadPathExplanation(componentId?: string) {
  const explanations: Record<string, string> = {
    "deck-slab": "车辆与人群荷载首先作用在桥面板上。",
    "main-girder": "桥面荷载继续传递到主梁，由主梁沿桥跨方向承担。",
    "cross-beam": "横梁帮助多片主梁协同受力，分配横向荷载。",
    bearing: "支座把上部结构的荷载传给桥墩或桥台。",
    pier: "桥墩承受竖向荷载，并将其继续传向基础。",
    "pile-cap": "承台把桥墩荷载汇集后分配给多根桩基。",
    "pile-foundation": "桩基把荷载传递到更稳定的深层土体或岩层。",
    "soil-layer": "地基最终承接桥梁结构传来的荷载。"
  };

  return componentId ? explanations[componentId] : "";
}

export default App;
