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
  fetchGitHubReadme,
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

  it("tolerates non-string url and directory values", () => {
    assert.equal(
      extractGitHubRepo({
        url: 42,
      } as unknown as Parameters<typeof extractGitHubRepo>[0]),
      null
    );
    assert.deepEqual(
      extractGitHubRepo({
        url: "https://github.com/a/b.git",
        directory: { path: "x" },
      } as unknown as Parameters<typeof extractGitHubRepo>[0]),
      { owner: "a", repo: "b" }
    );
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

  it("honors an HTTP-date Retry-After header", async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return calls === 1
        ? jsonResponse(
            {},
            {
              status: 429,
              headers: {
                "retry-after": new Date(Date.now() + 2000).toUTCString(),
              },
            }
          )
        : jsonResponse({ name: "react" });
    });
    const pending = fetchPackageMetadata("react");
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(calls, 1);
    t.mock.timers.tick(2000);
    const meta = await pending;
    assert.equal(meta.name, "react");
    assert.equal(calls, 2);
  });

  it("treats a past HTTP-date Retry-After as no wait", async (t) => {
    let calls = 0;
    t.mock.method(globalThis, "fetch", async () => {
      calls++;
      return calls === 1
        ? jsonResponse(
            {},
            {
              status: 429,
              headers: { "retry-after": "Wed, 21 Oct 2015 07:28:00 GMT" },
            }
          )
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

  it("times out while the body is still streaming", async (t) => {
    t.mock.timers.enable({ apis: ["setTimeout"] });
    t.mock.method(globalThis, "fetch", async (_url: unknown, init?: RequestInit) => {
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new TextEncoder().encode("{"));
          init?.signal?.addEventListener("abort", () =>
            controller.error(new DOMException("aborted", "AbortError"))
          );
        },
      });
      return new Response(body, {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    const pending = fetchPackageMetadata("react");
    await new Promise((resolve) => setImmediate(resolve));
    t.mock.timers.tick(15_000);
    await assert.rejects(pending, /timed out after 15000ms/);
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

describe("fetchGitHubReadme", () => {
  it("falls back to raw.githubusercontent.com when the API is unavailable", async (t) => {
    const seen: string[] = [];
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const u = String(url);
      seen.push(u);
      if (u.startsWith("https://api.github.com/")) {
        return new Response("rate limited", { status: 403 });
      }
      if (u.endsWith("/HEAD/Readme.md"))
        return new Response("# Express", { status: 200 });
      return new Response("Not Found", { status: 404 });
    });
    assert.equal(await fetchGitHubReadme("expressjs", "express"), "# Express");
    assert.deepEqual(seen, [
      "https://api.github.com/repos/expressjs/express/readme",
      "https://raw.githubusercontent.com/expressjs/express/HEAD/README.md",
      "https://raw.githubusercontent.com/expressjs/express/HEAD/Readme.md",
    ]);
  });

  it("prefers the API response and keeps the monorepo directory", async (t) => {
    const seen: string[] = [];
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      seen.push(String(url));
      return new Response("# next", { status: 200 });
    });
    assert.equal(await fetchGitHubReadme("vercel", "next.js", "packages/next"), "# next");
    assert.deepEqual(seen, [
      "https://api.github.com/repos/vercel/next.js/readme/packages/next",
    ]);
  });

  it("returns null when every source fails", async (t) => {
    t.mock.method(globalThis, "fetch", async () => new Response("nope", { status: 404 }));
    assert.equal(await fetchGitHubReadme("o", "r"), null);
  });
});
