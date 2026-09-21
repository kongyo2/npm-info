import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { collectVersionRows } from "../src/tools/versions.js";
import type { NpmRegistryResponse } from "../src/types.js";

function metadata(
  versions: string[],
  time: Record<string, string>,
  distTags: Record<string, string> = {}
): NpmRegistryResponse {
  return {
    name: "pkg",
    "dist-tags": distTags,
    time,
    versions: Object.fromEntries(versions.map((v) => [v, { name: "pkg", version: v }])),
  };
}

describe("collectVersionRows", () => {
  it("sorts by publish date, newest first", () => {
    const meta = metadata(
      ["1.0.0", "2.0.0", "1.5.0"],
      { "1.0.0": "2020-01-01", "2.0.0": "2022-01-01", "1.5.0": "2021-01-01" },
      { latest: "2.0.0" }
    );
    const { rows, total } = collectVersionRows(meta, 20);
    assert.equal(total, 3);
    assert.deepEqual(
      rows.map((r) => r.version),
      ["2.0.0", "1.5.0", "1.0.0"]
    );
    assert.deepEqual(rows[0].tags, ["latest"]);
  });

  it("keeps versions that have no `time` entry (they sort last)", () => {
    const meta = metadata(["1.0.0", "9.9.9-snapshot"], {
      "1.0.0": "2020-01-01",
    });
    const { rows, total } = collectVersionRows(meta, 20);
    assert.equal(total, 2);
    assert.deepEqual(
      rows.map((r) => r.version),
      ["1.0.0", "9.9.9-snapshot"]
    );
    assert.equal(rows[1].date, undefined);
  });

  it("honors the limit", () => {
    const meta = metadata(["1.0.0", "2.0.0"], {
      "1.0.0": "2020-01-01",
      "2.0.0": "2022-01-01",
    });
    const { rows, total } = collectVersionRows(meta, 1);
    assert.equal(total, 2);
    assert.equal(rows.length, 1);
    assert.equal(rows[0].version, "2.0.0");
  });

  it("surfaces deprecation notices", () => {
    const meta = metadata(["1.0.0"], { "1.0.0": "2020-01-01" });
    meta.versions = {
      "1.0.0": { name: "pkg", version: "1.0.0", deprecated: "do not use" },
    };
    const { rows } = collectVersionRows(meta, 20);
    assert.equal(rows[0].deprecated, "do not use");
  });
});
