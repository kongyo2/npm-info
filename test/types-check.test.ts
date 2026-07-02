import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { inspectExportsForTypes, detectTypesEntry } from "../src/tools/types-check.js";
import type { NpmPackageVersion } from "../src/types.js";

describe("inspectExportsForTypes", () => {
  it("finds nothing in string exports", () => {
    assert.deepEqual(inspectExportsForTypes("./index.js"), {
      found: false,
      subpathCount: 0,
    });
  });

  it("finds nothing when exports is missing", () => {
    assert.deepEqual(inspectExportsForTypes(undefined), {
      found: false,
      subpathCount: 0,
    });
    assert.deepEqual(inspectExportsForTypes(null), { found: false, subpathCount: 0 });
  });

  it("detects the sugar form without subpaths", () => {
    const result = inspectExportsForTypes({
      types: "./index.d.ts",
      default: "./index.js",
    });
    assert.deepEqual(result, {
      found: true,
      rootEntry: "./index.d.ts",
      subpathCount: 1,
    });
  });

  it("detects types on the root subpath", () => {
    const result = inspectExportsForTypes({
      ".": { types: "./index.d.ts", import: "./index.mjs" },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.ts");
  });

  it("prefers the root subpath entry and counts all typed subpaths", () => {
    const result = inspectExportsForTypes({
      "./util": { types: "./util.d.ts" },
      ".": { types: "./index.d.ts" },
    });
    assert.deepEqual(result, {
      found: true,
      rootEntry: "./index.d.ts",
      subpathCount: 2,
    });
  });

  it("detects nested conditions (types under import/require)", () => {
    const result = inspectExportsForTypes({
      ".": { import: { types: "./index.d.mts", default: "./index.mjs" } },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.mts");
  });

  it("detects TS-version-gated types@ conditions", () => {
    const result = inspectExportsForTypes({
      ".": { "types@>=5.5": "./ts5.5/index.d.ts", default: "./index.js" },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./ts5.5/index.d.ts");
  });

  it("resolves fallback arrays on the types condition", () => {
    const result = inspectExportsForTypes({
      ".": { types: ["./index.d.ts", "./legacy.d.ts"] },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.ts");
  });

  it("recurses into fallback arrays of condition objects", () => {
    const result = inspectExportsForTypes({
      ".": ["./plain.js", { types: "./index.d.ts" }],
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.ts");
  });

  it("finds nothing when no types condition exists", () => {
    const result = inspectExportsForTypes({
      ".": { import: "./index.mjs", require: "./index.cjs" },
    });
    assert.deepEqual(result, { found: false, subpathCount: 0 });
  });
});

describe("detectTypesEntry", () => {
  const base: NpmPackageVersion = { name: "pkg", version: "1.0.0" };

  it("prefers the types field", () => {
    const result = detectTypesEntry({ ...base, types: "./t.d.ts" });
    assert.equal(result.source, "types");
    assert.equal(result.entry, "./t.d.ts");
  });

  it("falls back to typings", () => {
    const result = detectTypesEntry({ ...base, typings: "./t.d.ts" });
    assert.equal(result.source, "typings");
  });

  it("falls back to exports conditions", () => {
    const result = detectTypesEntry({
      ...base,
      exports: { ".": { types: "./t.d.ts" } },
    });
    assert.equal(result.source, "exports");
    assert.equal(result.entry, "./t.d.ts");
  });

  it("reports none when nothing declares types", () => {
    const result = detectTypesEntry({ ...base, main: "./index.js" });
    assert.equal(result.source, "none");
  });
});
