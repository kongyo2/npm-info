import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  inspectExportsForTypes,
  detectTypesEntry,
  isDefinitelyTypedStub,
} from "../src/tools/types-check.js";
import type { NpmPackageVersion } from "../src/types.js";
import { typesVersionsCoverCurrentTypeScript } from "../src/tools/types-check.js";

describe("inspectExportsForTypes", () => {
  it("finds nothing in string exports that are not declarations", () => {
    assert.deepEqual(inspectExportsForTypes("./index.js"), {
      found: false,
      subpathCount: 0,
      misorderedSubpaths: [],
    });
  });

  it("detects a string exports field pointing at a declaration file", () => {
    assert.deepEqual(inspectExportsForTypes("./index.d.ts"), {
      found: true,
      rootEntry: "./index.d.ts",
      subpathCount: 1,
      misorderedSubpaths: [],
    });
    assert.equal(inspectExportsForTypes("./index.d.mts").found, true);
    assert.equal(inspectExportsForTypes("./index.d.cts").found, true);
  });

  it("detects a subpath whose target is a declaration file", () => {
    const result = inspectExportsForTypes({ ".": "./index.d.ts" });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.ts");
    assert.equal(result.subpathCount, 1);
  });

  it("finds nothing when exports is missing", () => {
    assert.deepEqual(inspectExportsForTypes(undefined), {
      found: false,
      subpathCount: 0,
      misorderedSubpaths: [],
    });
    assert.deepEqual(inspectExportsForTypes(null), {
      found: false,
      subpathCount: 0,
      misorderedSubpaths: [],
    });
  });

  it("detects the sugar form without subpaths", () => {
    const result = inspectExportsForTypes({
      types: "./index.d.ts",
      default: "./index.js",
    });
    assert.deepEqual(result, {
      found: true,
      rootEntry: "./index.d.ts",
      rootCondition: "types",
      subpathCount: 1,
      misorderedSubpaths: [],
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
      rootCondition: "types",
      subpathCount: 2,
      misorderedSubpaths: [],
    });
  });

  it("detects nested conditions (types under import/require)", () => {
    const result = inspectExportsForTypes({
      ".": { import: { types: "./index.d.mts", default: "./index.mjs" } },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.mts");
  });

  it("detects TS-version-gated types@ conditions and reports the gate", () => {
    const result = inspectExportsForTypes({
      ".": { "types@>=5.5": "./ts5.5/index.d.ts", default: "./index.js" },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./ts5.5/index.d.ts");
    assert.equal(result.rootCondition, "types@>=5.5");
  });

  it("reports the plain types condition for ungated entries", () => {
    const result = inspectExportsForTypes({
      ".": { types: "./index.d.ts", default: "./index.js" },
    });
    assert.equal(result.rootCondition, "types");
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

  it("resolves a types condition that nests import/require targets", () => {
    const result = inspectExportsForTypes({
      ".": {
        types: { import: "./index.d.mts", require: "./index.d.cts" },
        import: "./index.mjs",
        require: "./index.cjs",
      },
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./index.d.mts");
    assert.equal(result.rootCondition, "types");
    assert.deepEqual(result.misorderedSubpaths, []);
  });

  it("finds nothing when no types condition exists", () => {
    const result = inspectExportsForTypes({
      ".": { import: "./index.mjs", require: "./index.cjs" },
    });
    assert.deepEqual(result, {
      found: false,
      subpathCount: 0,
      misorderedSubpaths: [],
    });
  });

  it("flags a types condition placed after default (TS ignores it)", () => {
    const result = inspectExportsForTypes({
      ".": { import: "./index.mjs", default: "./index.js", types: "./index.d.ts" },
    });
    assert.equal(result.found, true);
    assert.deepEqual(result.misorderedSubpaths, ["."]);
  });

  it("flags misordered types@<version> conditions in the sugar form", () => {
    const result = inspectExportsForTypes({
      default: "./index.js",
      "types@<5.4": "./ts53/index.d.ts",
    });
    assert.equal(result.found, true);
    assert.equal(result.rootEntry, "./ts53/index.d.ts");
    assert.deepEqual(result.misorderedSubpaths, ["."]);
  });

  it("does not flag correctly ordered types conditions", () => {
    const result = inspectExportsForTypes({
      ".": { types: "./index.d.ts", import: "./index.mjs", default: "./index.js" },
    });
    assert.deepEqual(result.misorderedSubpaths, []);
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
    assert.equal(result.entryCondition, "types");
  });

  it("carries the gate of a types@<spec>-only entry", () => {
    const result = detectTypesEntry({
      ...base,
      exports: { ".": { "types@<5.4": "./old.d.ts", default: "./index.js" } },
    });
    assert.equal(result.source, "exports");
    assert.equal(result.entryCondition, "types@<5.4");
  });

  it("detects typesVersions-only packages as bundled", () => {
    const result = detectTypesEntry({
      ...base,
      typesVersions: { ">=4.0": { "*": ["ts4.0/*"] } },
    });
    assert.equal(result.source, "typesVersions");
  });

  it("ignores typesVersions selectors that only cover old TypeScript releases", () => {
    const result = detectTypesEntry({
      ...base,
      main: "./index.js",
      typesVersions: { "<2.0": { "*": ["ts/*"] } },
    });
    assert.equal(result.source, "none");
    assert.equal(typesVersionsCoverCurrentTypeScript({ "*": { "*": ["ts/*"] } }), true);
    assert.equal(
      typesVersionsCoverCurrentTypeScript({ ">=3.1 <5": { "*": ["a/*"] } }),
      true
    );
    assert.equal(typesVersionsCoverCurrentTypeScript({ "<2.0": {}, ">=4.1": {} }), true);
    assert.equal(typesVersionsCoverCurrentTypeScript("nope"), false);
  });

  it("ignores an empty typesVersions map", () => {
    const result = detectTypesEntry({ ...base, typesVersions: {} });
    assert.equal(result.source, "none");
  });

  it("ignores non-string types and typings values", () => {
    assert.equal(
      detectTypesEntry({
        ...base,
        types: { "*": "./t.d.ts" } as unknown as string,
      }).source,
      "none"
    );
    assert.equal(
      detectTypesEntry({
        ...base,
        typings: ["./t.d.ts"] as unknown as string,
      }).source,
      "none"
    );
  });

  it("ignores a non-object typesVersions value", () => {
    const result = detectTypesEntry({
      ...base,
      typesVersions: ">=4.0" as unknown as NpmPackageVersion["typesVersions"],
    });
    assert.equal(result.source, "none");
  });

  it("reports none when nothing declares types", () => {
    const result = detectTypesEntry({ ...base, main: "./index.js" });
    assert.equal(result.source, "none");
  });
});

describe("isDefinitelyTypedStub", () => {
  it("matches the standard stub wording", () => {
    assert.equal(
      isDefinitelyTypedStub(
        "This is a stub types definition. uuid provides its own type definitions, so you do not need this installed."
      ),
      true
    );
    assert.equal(
      isDefinitelyTypedStub(
        "This is a stub types definition for vuejs (https://github.com/vuejs/vue). vuejs provides its own type definitions, so you don't need @types/vue installed!"
      ),
      true
    );
  });

  it("does not match other deprecations", () => {
    assert.equal(
      isDefinitelyTypedStub("This package is deprecated, use @types/other instead"),
      false
    );
    assert.equal(isDefinitelyTypedStub("renamed to @scope/pkg"), false);
    assert.equal(isDefinitelyTypedStub(undefined), false);
  });
});
