export type BridgeCategory = "superstructure" | "substructure" | "foundation";
export type DetailDiagramVariant =
  | "edge-safety"
  | "top-slab"
  | "longitudinal-girder"
  | "transverse-beam"
  | "support-node"
  | "vertical-pier"
  | "end-abutment"
  | "cap-block"
  | "deep-piles"
  | "ground-layer";

export type BridgeComponent = {
  id: string;
  number: number;
  nameZh: string;
  nameEn: string;
  category: BridgeCategory;
  shortDescription: string;
  functions: string[];
  location: string;
  materials: string[];
  relatedComponentIds: string[];
  labelPosition: [number, number, number];
  diagramVariant: DetailDiagramVariant;
};

export const categoryLabels: Record<BridgeCategory, string> = {
  superstructure: "上部结构",
  substructure: "下部结构",
  foundation: "基础结构"
};

export const categoryColors: Record<BridgeCategory, string> = {
  superstructure: "#1f76d2",
  substructure: "#2f8f72",
  foundation: "#e69a32"
};

export const categoryUiColors: Record<
  BridgeCategory,
  {
    accent: string;
    accentStrong: string;
    hover: string;
    selected: string;
  }
> = {
  superstructure: {
    accent: "#1f76d2",
    accentStrong: "#0f4f9a",
    hover: "rgba(31, 118, 210, 0.1)",
    selected: "rgba(31, 118, 210, 0.18)"
  },
  substructure: {
    accent: "#2f8f72",
    accentStrong: "#1f6c56",
    hover: "rgba(47, 143, 114, 0.1)",
    selected: "rgba(47, 143, 114, 0.18)"
  },
  foundation: {
    accent: "#e69a32",
    accentStrong: "#a76513",
    hover: "rgba(230, 154, 50, 0.12)",
    selected: "rgba(230, 154, 50, 0.2)"
  }
};

export const bridgeComponents: BridgeComponent[] = [
  {
    id: "guardrail",
    number: 1,
    nameZh: "护栏",
    nameEn: "Guardrail",
    category: "superstructure",
    shortDescription: "护栏位于桥面两侧，用于保护车辆和行人，降低越界坠落风险。",
    functions: ["提供安全防护", "引导交通边界", "辅助划分桥面空间"],
    location: "桥面板两侧，沿桥梁纵向连续布置。",
    materials: ["钢材", "混凝土", "金属栏杆组合件"],
    relatedComponentIds: ["deck-slab", "main-girder"],
    labelPosition: [-4.55, 2.75, -1.45],
    diagramVariant: "edge-safety"
  },
  {
    id: "deck-slab",
    number: 2,
    nameZh: "桥面板",
    nameEn: "Deck Slab",
    category: "superstructure",
    shortDescription: "桥面板是车辆和行人直接通过的承载面。",
    functions: ["承受桥面荷载", "将荷载传递给主梁和横梁", "提供平整通行表面"],
    location: "桥梁最上部，铺装层和栏杆下方。",
    materials: ["钢筋混凝土", "预应力混凝土", "钢桥面板"],
    relatedComponentIds: ["guardrail", "main-girder", "cross-beam"],
    labelPosition: [-0.35, 2.8, 0.1],
    diagramVariant: "top-slab"
  },
  {
    id: "main-girder",
    number: 3,
    nameZh: "主梁",
    nameEn: "Main Girder",
    category: "superstructure",
    shortDescription: "主梁是梁桥中承担主要荷载的核心受力构件。",
    functions: ["承受来自桥面板的荷载", "沿桥跨方向传力", "将荷载传递至支座和下部结构"],
    location: "桥面板下方，沿桥梁纵向布置。",
    materials: ["钢材", "预应力混凝土", "钢筋混凝土"],
    relatedComponentIds: ["deck-slab", "cross-beam", "bearing", "pier", "abutment"],
    labelPosition: [-0.9, 1.25, -1.3],
    diagramVariant: "longitudinal-girder"
  },
  {
    id: "cross-beam",
    number: 4,
    nameZh: "横梁",
    nameEn: "Cross Beam",
    category: "superstructure",
    shortDescription: "横梁连接多片主梁，帮助桥梁横向整体受力。",
    functions: ["分配横向荷载", "增强整体稳定性", "协调主梁共同工作"],
    location: "主梁之间，通常沿桥梁横向布置。",
    materials: ["钢材", "钢筋混凝土"],
    relatedComponentIds: ["main-girder", "deck-slab", "bearing"],
    labelPosition: [2.65, 1.6, 1.18],
    diagramVariant: "transverse-beam"
  },
  {
    id: "bearing",
    number: 5,
    nameZh: "支座",
    nameEn: "Bearing",
    category: "superstructure",
    shortDescription: "支座位于上部结构和下部结构之间，是荷载传递的关键节点。",
    functions: ["将主梁荷载传给桥墩或桥台", "允许结构产生必要位移或转动", "减少局部应力集中"],
    location: "主梁端部下方，桥墩或桥台顶部。",
    materials: ["橡胶支座", "钢支座", "盆式支座"],
    relatedComponentIds: ["main-girder", "pier", "abutment"],
    labelPosition: [3.55, 1.08, 1.2],
    diagramVariant: "support-node"
  },
  {
    id: "pier",
    number: 6,
    nameZh: "桥墩",
    nameEn: "Pier",
    category: "substructure",
    shortDescription: "桥墩支撑桥跨中间部分，是桥梁竖向承重的重要构件。",
    functions: ["承受来自支座的荷载", "将荷载传递至承台和基础", "保持桥跨稳定"],
    location: "桥跨之间，位于地面或水面以上。",
    materials: ["钢筋混凝土", "预应力混凝土"],
    relatedComponentIds: ["bearing", "pile-cap", "pile-foundation"],
    labelPosition: [1.95, 0.48, 1.35],
    diagramVariant: "vertical-pier"
  },
  {
    id: "abutment",
    number: 7,
    nameZh: "桥台",
    nameEn: "Abutment",
    category: "substructure",
    shortDescription: "桥台位于桥梁两端，连接桥梁与路基。",
    functions: ["支撑桥跨端部", "承受桥头土压力", "连接道路与桥梁结构"],
    location: "桥梁起点和终点处。",
    materials: ["钢筋混凝土", "片石混凝土"],
    relatedComponentIds: ["main-girder", "bearing", "pile-cap"],
    labelPosition: [-5.15, 0.55, 1.28],
    diagramVariant: "end-abutment"
  },
  {
    id: "pile-cap",
    number: 8,
    nameZh: "承台",
    nameEn: "Pile Cap",
    category: "foundation",
    shortDescription: "承台位于桥墩或桥台下方，用于汇集并分配上部荷载。",
    functions: ["将桥墩荷载分配给多根桩基", "增强基础整体性"],
    location: "桥墩底部与桩基顶部之间。",
    materials: ["钢筋混凝土"],
    relatedComponentIds: ["pier", "abutment", "pile-foundation"],
    labelPosition: [2.35, -0.38, 1.45],
    diagramVariant: "cap-block"
  },
  {
    id: "pile-foundation",
    number: 9,
    nameZh: "桩基",
    nameEn: "Pile Foundation",
    category: "foundation",
    shortDescription: "桩基深入地下，将桥梁荷载传递到更稳定的土层或岩层。",
    functions: ["提高承载能力", "控制沉降", "保证桥梁基础稳定"],
    location: "承台下方，埋入地下。",
    materials: ["钢筋混凝土灌注桩", "预制混凝土桩", "钢管桩"],
    relatedComponentIds: ["pile-cap", "soil-layer"],
    labelPosition: [3.05, -1.2, 1.35],
    diagramVariant: "deep-piles"
  },
  {
    id: "soil-layer",
    number: 10,
    nameZh: "地基/土层",
    nameEn: "Soil Layer",
    category: "foundation",
    shortDescription: "地基是承受桥梁最终荷载的自然或处理后土体。",
    functions: ["承接基础传来的荷载", "为桥梁提供整体支承条件"],
    location: "桩基或浅基础周围及下方。",
    materials: ["天然土层", "加固土层", "岩层"],
    relatedComponentIds: ["pile-foundation", "pile-cap"],
    labelPosition: [-4.35, -1.18, 1.38],
    diagramVariant: "ground-layer"
  }
];

export const loadPathComponentIds = [
  "deck-slab",
  "main-girder",
  "cross-beam",
  "bearing",
  "pier",
  "pile-cap",
  "pile-foundation",
  "soil-layer"
];

export function getDefaultComponent() {
  return getComponentById("main-girder") ?? bridgeComponents[0];
}

export function getComponentById(id: string | null | undefined) {
  return bridgeComponents.find((component) => component.id === id);
}

export function getGroupedComponents() {
  return bridgeComponents.reduce<Record<BridgeCategory, BridgeComponent[]>>(
    (groups, component) => {
      groups[component.category].push(component);
      return groups;
    },
    {
      superstructure: [],
      substructure: [],
      foundation: []
    }
  );
}

export function getRelatedComponents(componentId: string) {
  const component = getComponentById(componentId);

  if (!component) {
    return [];
  }

  return component.relatedComponentIds
    .map((relatedId) => getComponentById(relatedId))
    .filter((item): item is BridgeComponent => Boolean(item));
}
