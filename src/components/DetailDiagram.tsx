import type { BridgeComponent } from "../lib/bridgeData";

type DiagramProps = {
  component: BridgeComponent;
};

export function DetailDiagram({ component }: DiagramProps) {
  return (
    <div className="mini-diagram" aria-label={`${component.nameZh}结构示意图`}>
      <svg viewBox="0 0 280 150" role="img">
        <BaseGuide />
        {renderVariant(component)}
      </svg>
    </div>
  );
}

function BaseGuide() {
  return (
    <>
      <line className="diagram-axis" x1="140" y1="18" x2="140" y2="136" />
      <line className="diagram-axis" x1="24" y1="106" x2="256" y2="106" />
    </>
  );
}

function BridgeDeck({ muted = false }: { muted?: boolean }) {
  return (
    <>
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="40" y="46" width="200" height="10" rx="2" />
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="52" y="58" width="176" height="12" rx="2" />
    </>
  );
}

function Supports({ muted = false }: { muted?: boolean }) {
  return (
    <>
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="78" y="80" width="18" height="46" rx="2" />
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="184" y="80" width="18" height="46" rx="2" />
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="58" y="126" width="58" height="10" rx="2" />
      <rect className={muted ? "diagram-muted" : "diagram-shape"} x="164" y="126" width="58" height="10" rx="2" />
    </>
  );
}

function renderVariant(component: BridgeComponent) {
  switch (component.diagramVariant) {
    case "edge-safety":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-highlight" x="42" y="24" width="196" height="8" rx="2" />
          {[52, 78, 104, 130, 156, 182, 208, 234].map((x) => (
            <rect className="diagram-highlight thin" height="26" key={x} rx="1.5" width="4" x={x} y="28" />
          ))}
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">桥面两侧连续防护</text>
        </>
      );
    case "top-slab":
      return (
        <>
          <rect className="diagram-highlight" x="34" y="44" width="212" height="18" rx="3" />
          <rect className="diagram-muted" x="58" y="68" width="166" height="14" rx="2" />
          <Supports muted />
          <path className="diagram-arrow" d="M92 28v13M140 28v13M188 28v13" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">直接承受桥面荷载</text>
        </>
      );
    case "longitudinal-girder":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-highlight" x="52" y="66" width="176" height="18" rx="3" />
          <rect className="diagram-highlight secondary" x="52" y="88" width="176" height="6" rx="2" />
          <Supports muted />
          <path className="diagram-arrow" d="M62 76h154" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">沿桥跨方向承担主要荷载</text>
        </>
      );
    case "transverse-beam":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-muted" x="60" y="67" width="160" height="10" rx="2" />
          {[86, 140, 194].map((x) => (
            <rect className="diagram-highlight" height="38" key={x} rx="3" width="10" x={x} y="58" />
          ))}
          <path className="diagram-arrow" d="M70 92h140" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">横向连接主梁并分配荷载</text>
        </>
      );
    case "support-node":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-muted" x="58" y="66" width="166" height="14" rx="2" />
          <rect className="diagram-highlight" x="72" y="82" width="30" height="12" rx="3" />
          <rect className="diagram-highlight" x="178" y="82" width="30" height="12" rx="3" />
          <Supports muted />
          <path className="diagram-arrow" d="M87 64v14M193 64v14" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">上部与下部结构的传力节点</text>
        </>
      );
    case "vertical-pier":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-muted" x="58" y="66" width="166" height="12" rx="2" />
          <rect className="diagram-highlight" x="119" y="82" width="42" height="45" rx="3" />
          <rect className="diagram-highlight secondary" x="104" y="126" width="72" height="10" rx="2" />
          <path className="diagram-arrow" d="M140 58v20M140 130v10" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">竖向支撑桥跨中部</text>
        </>
      );
    case "end-abutment":
      return (
        <>
          <BridgeDeck muted />
          <rect className="diagram-muted" x="72" y="66" width="136" height="12" rx="2" />
          <rect className="diagram-highlight" x="42" y="76" width="34" height="52" rx="3" />
          <path className="diagram-fill-soil" d="M24 128h58V82L24 104z" />
          <path className="diagram-arrow" d="M62 64v10M36 100h24" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">桥梁端部与路基连接</text>
        </>
      );
    case "cap-block":
      return (
        <>
          <rect className="diagram-muted" x="120" y="44" width="40" height="48" rx="3" />
          <rect className="diagram-highlight" x="84" y="94" width="112" height="18" rx="3" />
          {[101, 125, 149, 173].map((x) => (
            <rect className="diagram-muted" height="28" key={x} rx="3" width="12" x={x} y="112" />
          ))}
          <path className="diagram-arrow" d="M140 74v16M102 104h76" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">汇集并分配桥墩荷载</text>
        </>
      );
    case "deep-piles":
      return (
        <>
          <rect className="diagram-muted" x="84" y="42" width="112" height="18" rx="3" />
          <path className="diagram-fill-soil" d="M40 62h200v78H40z" />
          {[96, 124, 152, 180].map((x) => (
            <rect className="diagram-highlight" height="78" key={x} rx="6" width="14" x={x} y="60" />
          ))}
          <path className="diagram-arrow" d="M140 58v72" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">深入地下传递荷载</text>
        </>
      );
    case "ground-layer":
      return (
        <>
          <rect className="diagram-muted" x="88" y="30" width="104" height="16" rx="3" />
          {[104, 132, 160].map((x) => (
            <rect className="diagram-muted" height="44" key={x} rx="5" width="12" x={x} y="46" />
          ))}
          <path className="diagram-highlight ground" d="M26 92c30-16 58 10 91-2s61-15 96 0c15 7 28 8 41 1v45H26z" />
          <path className="diagram-arrow" d="M140 52v34" />
          <text className="diagram-caption" x="140" y="142" textAnchor="middle">最终承接基础传来的荷载</text>
        </>
      );
    default:
      return null;
  }
}
