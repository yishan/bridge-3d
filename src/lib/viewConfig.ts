export const headerUtilityActions = ["fullscreen"] as const;

export const knowledgeCardButtonVisible = false;

export const defaultViewTitle = "整体视图";

export const displayModeOptions = [
  { id: "2d", label: "2D" },
  { id: "3d", label: "3D" },
  { id: "model", label: "模型" }
] as const;

export type DisplayMode = (typeof displayModeOptions)[number]["id"];

export const twoDViewModes = [
  { id: "top", label: "顶视图" },
  { id: "side", label: "侧视图" }
] as const;

export type TwoDViewMode = (typeof twoDViewModes)[number]["id"];
