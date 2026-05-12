import { create } from "zustand";
import { loadPathComponentIds, type BridgeCategory } from "../lib/bridgeData";
import type { DisplayMode } from "../lib/viewConfig";

export type ActiveView = "overall" | BridgeCategory | "knowledge" | "quiz";
export type LayerMode = "all" | BridgeCategory;

type ViewerState = {
  activeView: ActiveView;
  layerMode: LayerMode;
  displayMode: DisplayMode;
  selectedComponentId: string;
  hoveredComponentId: string | null;
  labelsVisible: boolean;
  decompositionEnabled: boolean;
  loadPathActive: boolean;
  loadPathStep: number;
  selectComponent: (componentId: string) => void;
  setHoveredComponent: (componentId: string | null) => void;
  setActiveView: (view: ActiveView) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setLayerMode: (mode: LayerMode) => void;
  toggleLabels: () => void;
  toggleDecomposition: () => void;
  toggleLoadPath: () => void;
  setLoadPathStep: (step: number) => void;
  advanceLoadPathStep: () => void;
};

const viewToLayer = (view: ActiveView): LayerMode => {
  if (view === "superstructure" || view === "substructure" || view === "foundation") {
    return view;
  }

  return "all";
};

export const useViewerStore = create<ViewerState>((set) => ({
  activeView: "overall",
  layerMode: "all",
  displayMode: "3d",
  selectedComponentId: "main-girder",
  hoveredComponentId: null,
  labelsVisible: true,
  decompositionEnabled: false,
  loadPathActive: false,
  loadPathStep: 1,
  selectComponent: (componentId) => set({ selectedComponentId: componentId }),
  setHoveredComponent: (componentId) => set({ hoveredComponentId: componentId }),
  setActiveView: (view) =>
    set({
      activeView: view,
      layerMode: viewToLayer(view)
    }),
  setDisplayMode: (mode) => set({ displayMode: mode }),
  setLayerMode: (mode) => set({ layerMode: mode }),
  toggleLabels: () => set((state) => ({ labelsVisible: !state.labelsVisible })),
  toggleDecomposition: () =>
    set((state) => ({ decompositionEnabled: !state.decompositionEnabled })),
  toggleLoadPath: () =>
    set((state) => ({
      loadPathActive: !state.loadPathActive,
      loadPathStep: state.loadPathActive ? state.loadPathStep : 0
    })),
  setLoadPathStep: (step) => set({ loadPathStep: step }),
  advanceLoadPathStep: () =>
    set((state) => ({
      loadPathStep: (state.loadPathStep + 1) % loadPathComponentIds.length
    }))
}));
