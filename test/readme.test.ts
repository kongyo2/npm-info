import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isMissingReadme } from "../src/tools/readme.js";

describe("isMissingReadme", () => {
  it("treats the npm sentinel as missing", () => {
    assert.equal(isMissingReadme("ERROR: No README data found!"), true);
  });

  it("treats absent and empty content as missing", () => {
    assert.equal(isMissingReadme(undefined), true);
    assert.equal(isMissingReadme(""), true);
    assert.equal(isMissingReadme(null), true);
  });

  it("accepts real content", () => {
    assert.equal(isMissingReadme("# hello"), false);
  });
});
