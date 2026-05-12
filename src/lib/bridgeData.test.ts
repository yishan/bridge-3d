import { describe, expect, it } from "vitest";
import {
  bridgeComponents,
  categoryUiColors,
  getComponentById,
  getDefaultComponent,
  getGroupedComponents,
  getRelatedComponents
} from "./bridgeData";

describe("bridge component teaching data", () => {
  it("contains a complete beginner-friendly component set", () => {
    expect(bridgeComponents).toHaveLength(10);
    expect(getDefaultComponent().id).toBe("main-girder");
    expect(getComponentById("main-girder")?.nameZh).toBe("主梁");
  });

  it("groups components into the three bridge structure layers", () => {
    const groups = getGroupedComponents();

    expect(groups.superstructure.map((item) => item.nameZh)).toEqual([
      "护栏",
      "桥面板",
      "主梁",
      "横梁",
      "支座"
    ]);
    expect(groups.substructure.map((item) => item.nameZh)).toEqual(["桥墩", "桥台"]);
    expect(groups.foundation.map((item) => item.nameZh)).toEqual([
      "承台",
      "桩基",
      "地基/土层"
    ]);
  });

  it("resolves related components for the selected teaching panel", () => {
    expect(getRelatedComponents("main-girder").map((item) => item.nameZh)).toEqual([
      "桥面板",
      "横梁",
      "支座",
      "桥墩",
      "桥台"
    ]);
  });

  it("assigns one detail diagram variant to every component", () => {
    expect(bridgeComponents.map((item) => [item.id, item.diagramVariant])).toEqual([
      ["guardrail", "edge-safety"],
      ["deck-slab", "top-slab"],
      ["main-girder", "longitudinal-girder"],
      ["cross-beam", "transverse-beam"],
      ["bearing", "support-node"],
      ["pier", "vertical-pier"],
      ["abutment", "end-abutment"],
      ["pile-cap", "cap-block"],
      ["pile-foundation", "deep-piles"],
      ["soil-layer", "ground-layer"]
    ]);
  });

  it("assigns one navigation icon variant to every component", () => {
    expect(bridgeComponents.map((item) => [item.id, item.navIcon])).toEqual([
      ["guardrail", "shield-rail"],
      ["deck-slab", "deck-road"],
      ["main-girder", "girder"],
      ["cross-beam", "cross-girder"],
      ["bearing", "bearing-pad"],
      ["pier", "pier-column"],
      ["abutment", "abutment-wall"],
      ["pile-cap", "pile-cap"],
      ["pile-foundation", "pile-group"],
      ["soil-layer", "soil-strata"]
    ]);
  });

  it("provides matching navigation tones for each structure layer", () => {
    expect(categoryUiColors).toEqual({
      superstructure: {
        accent: "#8d9b6e",
        accentStrong: "#4a5228",
        hover: "rgba(141, 155, 110, 0.1)",
        selected: "rgba(141, 155, 110, 0.16)"
      },
      substructure: {
        accent: "#7a9080",
        accentStrong: "#4a6458",
        hover: "rgba(122, 144, 128, 0.1)",
        selected: "rgba(122, 144, 128, 0.16)"
      },
      foundation: {
        accent: "#b8894a",
        accentStrong: "#7a5420",
        hover: "rgba(184, 137, 74, 0.1)",
        selected: "rgba(184, 137, 74, 0.18)"
      }
    });
  });
});
