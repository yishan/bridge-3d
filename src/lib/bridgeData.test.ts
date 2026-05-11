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

  it("provides matching navigation tones for each structure layer", () => {
    expect(categoryUiColors).toEqual({
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
    });
  });
});
