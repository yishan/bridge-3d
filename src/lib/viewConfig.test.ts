import { describe, expect, it } from "vitest";
import {
  defaultViewTitle,
  headerUtilityActions,
  knowledgeCardButtonVisible,
  twoDViewModes
} from "./viewConfig";

describe("viewer UI configuration", () => {
  it("opens directly in the overall view without top-level content navigation", () => {
    expect(defaultViewTitle).toBe("整体视图");
  });

  it("keeps only the fullscreen utility in the header", () => {
    expect(headerUtilityActions).toEqual(["fullscreen"]);
  });

  it("does not expose the standalone knowledge card action", () => {
    expect(knowledgeCardButtonVisible).toBe(false);
  });

  it("offers the retained planar 2D view modes", () => {
    expect(twoDViewModes).toEqual([
      { id: "top", label: "顶视图" },
      { id: "side", label: "侧视图" }
    ]);
  });
});
