import { describe, expect, it } from "vitest";
import { defaultViewTitle, headerUtilityActions, knowledgeCardButtonVisible } from "./viewConfig";

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
});
