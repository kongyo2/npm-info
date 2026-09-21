import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { daysSince, formatScoreReport, STALE_AFTER_DAYS } from "../src/tools/score.js";
import type { NpmsPackageResponse } from "../src/types.js";

const NOW = Date.parse("2026-01-01T00:00:00Z");

const fullNpms: NpmsPackageResponse = {
  analyzedAt: "2023-01-13T00:00:00.000Z",
  collected: {
    metadata: { name: "pkg", version: "1.0.0" },
    npm: {
      downloads: [{ from: "2022-12-13", to: "2023-01-12", count: 1_000_000 }],
    },
    github: { starsCount: 5, forksCount: 1, issues: { openCount: 2 } },
  },
  score: {
    final: 0.91,
    detail: { quality: 0.9, popularity: 0.8, maintenance: 0.95 },
  },
  evaluation: {
    quality: { tests: 0.7 },
    popularity: { downloadsCount: 1_000_000, dependentsCount: 42 },
    maintenance: { releasesFrequency: 0.5 },
  },
};

describe("daysSince", () => {
  it("returns whole days and rejects garbage", () => {
    assert.equal(daysSince("2025-12-31T00:00:00Z", NOW), 1);
    assert.equal(daysSince("not a date", NOW), null);
  });
});

describe("formatScoreReport", () => {
  it("renders the full npms report with live downloads", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: fullNpms,
      downloads: {
        lastWeek: { downloads: 1234, start: "s", end: "e", package: "pkg" },
        lastMonth: { downloads: 5000, start: "s", end: "e", package: "pkg" },
      },
      now: NOW,
    }).join("\n");
    assert.match(text, /\*\*Overall Score:\*\* 91%/);
    assert.match(text, /\| Quality \| 90% \|/);
    assert.match(text, /## npm Downloads \(live\)/);
    assert.match(text, /\*\*Last 7 days:\*\* 1,234/);
    assert.match(text, /\*\*Analyzed:\*\* 2023-01-13/);
  });

  it("warns when the npms analysis is stale", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: fullNpms,
      downloads: {},
      now: NOW,
    }).join("\n");
    assert.match(text, /index is frozen/);
  });

  it("omits the stale warning for fresh analyses", () => {
    const fresh = { ...fullNpms, analyzedAt: "2025-12-31T00:00:00Z" };
    const text = formatScoreReport({
      packageName: "pkg",
      npms: fresh,
      downloads: {},
      now: NOW,
    }).join("\n");
    assert.doesNotMatch(text, /index is frozen/);
  });

  it("renders the no-analysis fallback with registry context", () => {
    const text = formatScoreReport({
      packageName: "newpkg",
      npms: null,
      registryMeta: { latest: "1.2.3", modified: "2025-06-01" },
      downloads: {
        lastMonth: { downloads: 99, start: "s", end: "e", package: "newpkg" },
      },
    }).join("\n");
    assert.match(text, /no analysis available/);
    assert.match(text, /\*\*Registry:\*\* latest 1\.2\.3, updated 2025-06-01/);
    assert.match(text, /\*\*Last 30 days:\*\* 99/);
  });

  it("notes a transient npms failure", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: null,
      npmsError: 'npms.io API returned status 502 for "pkg".',
      downloads: {},
    }).join("\n");
    assert.match(text, /npms\.io scoring is unavailable right now/);
  });

  it("tolerates a minimal npms payload", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: { analyzedAt: "2023-01-13T00:00:00.000Z" },
      downloads: {},
      now: NOW,
    }).join("\n");
    assert.match(text, /\*\*Overall Score:\*\* N\/A/);
    assert.ok(STALE_AFTER_DAYS > 0);
  });

  it("omits the analyzed line when npms omits analyzedAt", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: { ...fullNpms, analyzedAt: undefined as unknown as string },
      downloads: {},
      now: NOW,
    }).join("\n");
    assert.doesNotMatch(text, /undefined/);
    assert.doesNotMatch(text, /\*\*Analyzed:\*\*/);
  });
});
