import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validatePackageName,
  typesPackageName,
  extractGitHubRepo,
  fetchPackageMetadata,
  fetchResolvedVersion,
  checkDefinitelyTyped,
  fetchNpmDownloads,
} from "../src/services/npm-api.js";

describe("validatePackageName", () => {
  it("accepts plain names", () => {
    assert.doesNotThrow(() => validatePackageName("react"));
    assert.doesNotThrow(() => validatePackageName("lodash.merge"));
    assert.doesNotThrow(() => validatePackageName("my-pkg_2"));
  });

  it("accepts scoped names", () => {
    assert.doesNotThrow(() => validatePackageName("@types/node"));
    assert.doesNotThrow(() => validatePackageName("@babel/core"));
  });

  it("accepts legacy uppercase names", () => {
    assert.doesNotThrow(() => validatePackageName("JSONStream"));
  });

  it("rejects names starting with a dot or underscore", () => {
    assert.throws(() => validatePackageName(".hidden"));
    assert.throws(() => validatePackageName("_private"));
  });

  it("rejects names with spaces or slashes outside a scope", () => {
    assert.throws(() => validatePackageName("a b"));
    assert.throws(() => validatePackageName("a/b/c"));
  });

  it("rejects names longer than 214 characters", () => {
    assert.throws(() => validatePackageName("a".repeat(215)));
    assert.doesNotThrow(() => validatePackageName("a".repeat(214)));
  });
});

describe("typesPackageName", () => {
  it("maps plain names", () => {
    assert.equal(typesPackageName("react"), "@types/react");
  });

  it("maps scoped names with the double-underscore convention", () => {
    assert.equal(typesPackageName("@babel/core"), "@types/babel__core");
  });
});

describe("extractGitHubRepo", () => {
  it("parses git+https URLs", () => {
    assert.deepEqual(
      extractGitHubRepo({
        type: "git",
        url: "git+https://github.com/facebook/react.git",
      }),
      { owner: "facebook", repo: "react" }
    );
  });

  it("parses plain https URLs with trailing slash", () => {
    assert.deepEqual(extractGitHubRepo("https://github.com/lodash/lodash/"), {
      owner: "lodash",
      repo: "lodash",
    });
  });

  it("parses ssh URLs", () => {
    assert.deepEqual(extractGitHubRepo("git@github.com:expressjs/express.git"), {
      owner: "expressjs",
      repo: "express",
    });
  });

  it("parses github: shorthand", () => {
    assert.deepEqual(extractGitHubRepo("github:user/repo"), {
      owner: "user",
      repo: "repo",
    });
  });

  it("strips a #fragment", () => {
    assert.deepEqual(extractGitHubRepo("https://github.com/o/r#main"), {
      owner: "o",
      repo: "r",
    });
  });

  it("carries the monorepo directory through", () => {
    assert.deepEqual(
      extractGitHubRepo({
        type: "git",
        url: "https://github.com/vercel/next.js.git",
        directory: "packages/next",
      }),
      { owner: "vercel", repo: "next.js", directory: "packages/next" }
    );
  });

  it("returns null for non-GitHub hosts", () => {
    assert.equal(extractGitHubRepo("https://gitlab.com/x/y"), null);
  });

  it("returns null when repository is missing or has no url", () => {
    assert.equal(extractGitHubRepo(undefined), null);
    assert.equal(extractGitHubRepo({ type: "git" }), null);
  });
});

function jsonResponse(
  body: unknown,
  init: { status?: number; headers?: Record<string, string> } = {}
): Response {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: { "content-type": "application/json", ...init.headers },
  });
}

describe("fetchPackageMetadata", () => {
  it("sends a User-Agent header", async (t) => {
    let seenUA: string | null = null;
    t.mock.method(globalThis, "fetch", async (_url: unknown, init?: RequestInit) => {
      seenUA = new Headers(init?.headers).get("user-agent");
      return jsonResponse({ name: "react" });
    });
    await fetchPackageMetadata("react");
    assert.equal(seenUA, "npm-info-mcp-server");
  });

  it("retries once on 429 honoring Retry-After", async (t) => {
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return calls === 1
        ? jsonResponse({}, { status: 429, headers: { "retry-after": "0.01" } })
        : jsonResponse({ name: "react" });
    });
    const meta = await fetchPackageMetadata("react");
    assert.equal(meta.name, "react");
    assert.equal(calls, 2);
  });

  it("does not retry non-retryable statuses", async (t) => {
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return jsonResponse({}, { status: 404 });
    });
    await assert.rejects(fetchPackageMetadata("react"), /not found on npm/);
    assert.equal(calls, 1);
  });

  it("wraps invalid JSON with a descriptive error", async (t) => {
    t.mock.method(
      globalThis,
      "fetch",
      async () => new Response("this is not json", { status: 200 })
    );
    await assert.rejects(
      fetchPackageMetadata("react"),
      /Invalid JSON in the response from registry\.npmjs\.org/
    );
  });
});

const packumentFor = (versions: string[]) => ({
  name: "pkg",
  "dist-tags": { latest: versions[versions.length - 1] },
  versions: Object.fromEntries(versions.map((v) => [v, { name: "pkg", version: v }])),
});

describe("fetchResolvedVersion", () => {
  it("fetches an exact version directly", async (t) => {
    const urls: string[] = [];
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      urls.push(String(url));
      return jsonResponse({ name: "pkg", version: "1.2.3" });
    });
    const v = await fetchResolvedVersion("pkg", "1.2.3");
    assert.equal(v.version, "1.2.3");
    assert.equal(urls.length, 1);
    assert.match(urls[0], /\/pkg\/1\.2\.3$/);
  });

  it("resolves a semver range via the abbreviated packument", async (t) => {
    const packument = packumentFor(["1.0.0", "1.5.0", "2.0.0"]);
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const u = String(url);
      if (u.endsWith("/pkg/%5E1")) {
        return jsonResponse("version not found: pkg@^1", { status: 404 });
      }
      if (u.endsWith("/pkg/1.5.0")) {
        return jsonResponse({ name: "pkg", version: "1.5.0" });
      }
      if (u.endsWith("/pkg")) return jsonResponse(packument);
      return jsonResponse({}, { status: 500 });
    });
    const v = await fetchResolvedVersion("pkg", "^1");
    assert.equal(v.version, "1.5.0");
  });

  it("errors when no published version satisfies the range", async (t) => {
    const packument = packumentFor(["1.0.0", "1.5.0"]);
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const u = String(url);
      if (u.endsWith("/pkg")) return jsonResponse(packument);
      return jsonResponse("version not found: pkg@^9", { status: 404 });
    });
    await assert.rejects(
      fetchResolvedVersion("pkg", "^9"),
      /No published version of "pkg" satisfies "\^9"/
    );
  });

  it("propagates non-404 failures without falling back", async (t) => {
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return jsonResponse({}, { status: 500 });
    });
    await assert.rejects(fetchResolvedVersion("pkg", "1.0.0"), /status 500/);
    assert.equal(calls, 1);
  });
});

describe("checkDefinitelyTyped", () => {
  it("reports a deprecated stub", async (t) => {
    t.mock.method(globalThis, "fetch", async () =>
      jsonResponse({
        name: "@types/foo",
        version: "1.0.0",
        deprecated:
          "This is a stub types definition. foo provides its own type definitions.",
      })
    );
    const result = await checkDefinitelyTyped("foo");
    assert.equal(result.exists, true);
    assert.equal(result.version, "1.0.0");
    assert.match(result.deprecated ?? "", /stub types definition/);
  });

  it("returns exists:false on 404", async (t) => {
    t.mock.method(globalThis, "fetch", async () => jsonResponse({}, { status: 404 }));
    assert.deepEqual(await checkDefinitelyTyped("foo"), { exists: false });
  });
});

describe("fetchNpmDownloads", () => {
  it("returns both windows", async (t) => {
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const u = String(url);
      if (u.includes("last-week")) {
        return jsonResponse({ downloads: 10, start: "a", end: "b", package: "x" });
      }
      return jsonResponse({ downloads: 40, start: "a", end: "b", package: "x" });
    });
    const d = await fetchNpmDownloads("x");
    assert.equal(d.lastWeek?.downloads, 10);
    assert.equal(d.lastMonth?.downloads, 40);
  });

  it("tolerates a single failed window", async (t) => {
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const u = String(url);
      if (u.includes("last-week")) return jsonResponse({}, { status: 500 });
      return jsonResponse({ downloads: 40, start: "a", end: "b", package: "x" });
    });
    const d = await fetchNpmDownloads("x");
    assert.equal(d.lastWeek, undefined);
    assert.equal(d.lastMonth?.downloads, 40);
  });
});
