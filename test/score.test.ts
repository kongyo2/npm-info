import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  daysSince,
  formatScoreReport,
  registerScoreTool,
  STALE_AFTER_DAYS,
} from "../src/tools/score.js";
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

  it("renders N/A rather than crashing on non-finite metrics", () => {
    const text = formatScoreReport({
      packageName: "pkg",
      npms: {
        analyzedAt: "2023-01-13T00:00:00.000Z",
        score: { final: Number.NaN },
        evaluation: {
          popularity: { downloadsAcceleration: null, downloadsCount: Number.NaN },
        },
      } as unknown as NpmsPackageResponse,
      downloads: {
        lastWeek: { downloads: Number.NaN, start: "s", end: "e", package: "pkg" },
      },
      now: NOW,
    }).join("\n");
    assert.match(text, /\*\*Overall Score:\*\* N\/A/);
    assert.doesNotMatch(text, /NaN/);
    assert.doesNotMatch(text, /Download Acceleration/);
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

describe("npm_package_score handler", () => {
  it("reports the npm 404 when the package exists nowhere", async (t) => {
    type Handler = (args: { package_name: string }) => Promise<{
      content: { text: string }[];
      isError?: boolean;
    }>;
    let handler: Handler | undefined;
    registerScoreTool({
      registerTool: (_name: string, _spec: unknown, h: Handler) => {
        handler = h;
      },
    } as unknown as McpServer);
    assert.ok(handler);
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("not found", { status: 404 })
    );
    const res = await handler({ package_name: "nope-not-real" });
    assert.equal(res.isError, true);
    assert.match(res.content[0].text, /not found on npm/);
  });

  it("surfaces the registry error when npms 404s and the registry fails", async (t) => {
    type Handler = (args: { package_name: string }) => Promise<{
      content: { text: string }[];
      isError?: boolean;
    }>;
    let handler: Handler | undefined;
    registerScoreTool({
      registerTool: (_name: string, _spec: unknown, h: Handler) => {
        handler = h;
      },
    } as unknown as McpServer);
    assert.ok(handler);
    t.mock.method(globalThis, "fetch", async (input) => {
      const url = String(input);
      if (url.includes("api.npms.io")) {
        return new Response("not found", { status: 404 });
      }
      return new Response("boom", { status: 500 });
    });
    const res = await handler({ package_name: "has-no-npms" });
    assert.equal(res.isError, true);
    assert.match(res.content[0].text, /npm registry returned status 500/);
    assert.doesNotMatch(res.content[0].text, /npms\.io/);
  });
});
