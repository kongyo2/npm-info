import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatSearchResults } from "../src/tools/search.js";
import type { NpmSearchResult } from "../src/types.js";

const empty: NpmSearchResult = { objects: [], total: 0 };

function hit(
  overrides: Partial<NpmSearchResult["objects"][number]["package"]> = {},
  score?: number
): NpmSearchResult["objects"][number] {
  return {
    package: {
      name: "pkg",
      version: "1.0.0",
      date: "2024-01-01",
      ...overrides,
    },
    ...(score === undefined ? {} : { score: { final: score } }),
  };
}

describe("formatSearchResults", () => {
  it("renders a friendly message for empty results", () => {
    assert.deepEqual(formatSearchResults("zzz", empty), [
      'No packages found matching "zzz". Try broader search terms.',
    ]);
  });

  it("renders hits with metadata", () => {
    const result: NpmSearchResult = {
      total: 2,
      objects: [
        hit({ name: "a", keywords: ["x"], links: { homepage: "https://a.dev" } }, 12.34),
        hit({ name: "b", description: "b desc" }),
      ],
    };
    const text = formatSearchResults("q", result).join("\n");
    assert.match(text, /# npm Search Results: "q"/);
    assert.match(text, /Found 2 packages \(showing 2\)/);
    assert.match(text, /## a \(v1\.0\.0\)/);
    assert.match(text, /\*\*Keywords:\*\* x/);
    assert.match(text, /\*\*Homepage:\*\* https:\/\/a\.dev/);
    assert.match(text, /\*\*Score:\*\* overall=12\.3/);
    assert.match(text, /## b \(v1\.0\.0\)/);
    assert.match(text, /b desc/);
    assert.match(text, /\*\*Published:\*\* 2024-01-01/);
  });

  it("renders score detail percentages when present", () => {
    const result: NpmSearchResult = {
      total: 1,
      objects: [
        {
          package: { name: "a", version: "1.0.0", date: "2024-01-01" },
          score: {
            final: 9.9,
            detail: { quality: 0.9, popularity: 0.8, maintenance: 0.5 },
          },
        },
      ],
    };
    const text = formatSearchResults("q", result).join("\n");
    assert.match(text, /quality=90% popularity=80% maintenance=50%/);
  });
  it("tolerates sparse hits without crashing or printing NaN", () => {
    const text = formatSearchResults("q", {
      total: 3,
      objects: [
        { package: undefined },
        { package: { name: "bare" }, score: { detail: { quality: 0.5 } } },
        { package: { name: "nan", version: "2.0.0" }, score: { final: Number.NaN } },
      ],
    }).join("\n");
    assert.match(text, /## bare\n/);
    assert.match(text, /\*\*Score:\*\* quality=50%/);
    assert.doesNotMatch(text, /NaN|undefined/);
    assert.doesNotMatch(text, /\*\*Score:\*\*\s*$/m);
  });

  it("tolerates a missing objects array", () => {
    const lines = formatSearchResults("q", {
      total: 3,
    } as unknown as NpmSearchResult);
    assert.match(lines[0], /No packages found matching "q"/);
  });
});
