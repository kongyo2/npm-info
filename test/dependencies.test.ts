import { describe, it } from "node:test";
import type { TestContext } from "node:test";
import assert from "node:assert/strict";
import {
  resolveDependencySpec,
  formatDeps,
  formatTree,
  resolveProductionTree,
} from "../src/tools/dependencies.js";
import type { ResolveResult } from "../src/tools/dependencies.js";
import type { AbbreviatedPackument } from "../src/types.js";

describe("resolveDependencySpec", () => {
  it("passes through standard registry ranges", () => {
    assert.deepEqual(resolveDependencySpec("foo", "^1.0.0"), {
      name: "foo",
      hint: "^1.0.0",
    });
  });

  it("passes through dist-tag hints", () => {
    assert.deepEqual(resolveDependencySpec("foo", "latest"), {
      name: "foo",
      hint: "latest",
    });
  });

  it("resolves npm: aliases", () => {
    assert.deepEqual(resolveDependencySpec("foo", "npm:bar@^1.0.0"), {
      name: "bar",
      hint: "^1.0.0",
    });
  });

  it("resolves scoped npm: aliases", () => {
    assert.deepEqual(resolveDependencySpec("foo", "npm:@scope/bar@1.2.3"), {
      name: "@scope/bar",
      hint: "1.2.3",
    });
  });

  it("defaults alias hints to latest", () => {
    assert.deepEqual(resolveDependencySpec("foo", "npm:@scope/bar"), {
      name: "@scope/bar",
      hint: "latest",
    });
  });

  it("rejects git URLs", () => {
    assert.equal(resolveDependencySpec("foo", "git+ssh://git@github.com/x/y.git"), null);
    assert.equal(resolveDependencySpec("foo", "git://github.com/x/y.git"), null);
  });

  it("rejects http tarballs", () => {
    assert.equal(resolveDependencySpec("foo", "https://example.com/pkg.tgz"), null);
  });

  it("rejects file:, link:, and workspace: specs", () => {
    assert.equal(resolveDependencySpec("foo", "file:../local"), null);
    assert.equal(resolveDependencySpec("foo", "link:../local"), null);
    assert.equal(resolveDependencySpec("foo", "workspace:*"), null);
  });

  it("rejects GitHub shorthand", () => {
    assert.equal(resolveDependencySpec("foo", "github:user/repo"), null);
    assert.equal(resolveDependencySpec("foo", "user/repo#branch"), null);
    assert.equal(resolveDependencySpec("foo", "user/repo"), null);
  });

  it("rejects non-registry protocols (catalog/jsr/portal/patch)", () => {
    assert.equal(resolveDependencySpec("foo", "catalog:default"), null);
    assert.equal(resolveDependencySpec("foo", "jsr:@scope/pkg@^1"), null);
    assert.equal(resolveDependencySpec("foo", "portal:../local"), null);
    assert.equal(resolveDependencySpec("foo", "patch:foo@1.0.0#./fix.patch"), null);
  });

  it("rejects gitlab:, bitbucket: and gist: shorthand", () => {
    assert.equal(resolveDependencySpec("foo", "gitlab:user/repo"), null);
    assert.equal(resolveDependencySpec("foo", "gitlab:user/repo#dev"), null);
    assert.equal(resolveDependencySpec("foo", "bitbucket:user/repo"), null);
    assert.equal(resolveDependencySpec("foo", "gist:11081aaa2815d66ee"), null);
  });

  it("tolerates whitespace inside npm: aliases", () => {
    assert.deepEqual(resolveDependencySpec("foo", "npm: bar@^1"), {
      name: "bar",
      hint: "^1",
    });
  });

  it("rejects npm: aliases with an empty or malformed target", () => {
    assert.equal(resolveDependencySpec("foo", "npm:"), null);
    assert.equal(resolveDependencySpec("foo", "npm:@scope"), null);
    assert.equal(resolveDependencySpec("foo", "npm:@scope/"), null);
    assert.equal(resolveDependencySpec("foo", "npm:@@1.0.0"), null);
    assert.deepEqual(resolveDependencySpec("foo", "npm:bar@"), {
      name: "bar",
      hint: "latest",
    });
  });
});

describe("formatDeps", () => {
  it("sorts entries and marks optional peers", () => {
    const lines = formatDeps(
      { zebra: "^1.0.0", alpha: "^2.0.0" },
      "Peer Dependencies",
      new Set(["alpha"])
    );
    assert.equal(lines[0], "### Peer Dependencies (2)");
    assert.equal(lines[2], "- alpha: ^2.0.0 (optional)");
    assert.equal(lines[3], "- zebra: ^1.0.0");
  });

  it("returns no lines for empty or missing maps", () => {
    assert.deepEqual(formatDeps({}, "Dependencies"), []);
    assert.deepEqual(formatDeps(undefined, "Dependencies"), []);
  });
});

function packument(
  name: string,
  versions: Record<string, Record<string, string>>
): AbbreviatedPackument {
  const names = Object.keys(versions);
  return {
    name,
    "dist-tags": { latest: names[names.length - 1] },
    versions: Object.fromEntries(
      Object.entries(versions).map(([v, dependencies]) => [
        v,
        { name, version: v, dependencies },
      ])
    ),
  };
}

function stubRegistry(
  t: TestContext,
  fixtures: Record<string, AbbreviatedPackument>,
  calls: string[] = []
): string[] {
  t.mock.method(globalThis, "fetch", async (url: unknown) => {
    const name = decodeURIComponent(String(url).split("/").pop() ?? "");
    calls.push(name);
    const found = fixtures[name];
    if (!found) {
      return new Response(JSON.stringify("not found"), { status: 404 });
    }
    return new Response(JSON.stringify(found), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  });
  return calls;
}

describe("resolveProductionTree", () => {
  it("treats non-object dist-tags and versions maps as empty", async (t) => {
    stubRegistry(t, {
      root: { name: "root", "dist-tags": "latest", versions: "1.0.0" } as never,
    });
    const result = await resolveProductionTree("root", "latest", 2);
    assert.equal(result.tree["root@latest"], undefined);
    assert.match(
      result.warnings.join("\n"),
      /No published version of root satisfies 'latest'/
    );
  });

  it("resolves a transitive tree and dedups in-flight packument fetches", async (t) => {
    const fixtures = {
      root: packument("root", { "1.0.0": { a: "^1.0.0", b: "^1.0.0" } }),
      a: packument("a", { "1.0.0": { shared: "^1.0.0" } }),
      b: packument("b", { "1.0.0": { shared: "*" } }),
      shared: packument("shared", { "1.0.0": {} }),
    };
    const calls = stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 3);
    assert.equal(result.truncated, false);
    assert.deepEqual(result.warnings, []);
    assert.deepEqual(Object.keys(result.tree).sort(), [
      "a@1.0.0",
      "b@1.0.0",
      "root@1.0.0",
      "shared@1.0.0",
    ]);
    assert.equal(calls.filter((n) => n === "shared").length, 1);
  });

  it("keeps siblings when one fetch fails", async (t) => {
    const fixtures = {
      root: packument("root", { "1.0.0": { good: "^1.0.0", bad: "^1.0.0" } }),
      good: packument("good", { "1.0.0": {} }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    assert.ok(result.tree["good@1.0.0"]);
    assert.equal(result.warnings.length, 1);
    assert.match(result.warnings[0], /Failed to fetch bad/);
  });

  it("ignores non-string dependency spec values", async (t) => {
    const fixtures: Record<string, AbbreviatedPackument> = {
      root: {
        name: "root",
        "dist-tags": { latest: "1.0.0" },
        versions: {
          "1.0.0": {
            name: "root",
            version: "1.0.0",
            dependencies: {
              a: "^1.0.0",
              weird: { url: "https://x" },
              nil: null,
            } as unknown as Record<string, string>,
          },
        },
      },
      a: packument("a", { "1.0.0": {} }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    assert.ok(result.tree["a@1.0.0"]);
    const text = formatTree(result, 2).join("\n");
    assert.doesNotMatch(text, /weird|nil/);
  });

  it("marks deps whose packument fetch failed as not resolved", async (t) => {
    const fixtures = {
      root: packument("root", { "1.0.0": { bad: "^1.0.0" } }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    assert.equal(result.tree["bad@^1.0.0"], undefined);
    const text = formatTree(result, 2).join("\n");
    assert.match(text, /bad@\^1\.0\.0 \(not resolved\)/);
  });

  it("includes optionalDependencies in the tree, marked optional", async (t) => {
    const a: AbbreviatedPackument = {
      name: "a",
      "dist-tags": { latest: "1.0.0" },
      versions: {
        "1.0.0": {
          name: "a",
          version: "1.0.0",
          dependencies: { req: "^1.0.0" },
          optionalDependencies: { opt: "^2.0.0", req: "^9.9.9" },
        },
      },
    };
    const fixtures = {
      root: packument("root", { "1.0.0": { a: "^1.0.0" } }),
      a,
      opt: packument("opt", { "2.5.0": {} }),
      req: packument("req", { "9.9.9": {} }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    const text = formatTree(result, 2).join("\n");
    assert.match(text, /opt@2\.5\.0 \(optional\)/);
    assert.match(text, /req@9\.9\.9 \(optional\)/);
  });

  it("dedups identical warnings", async (t) => {
    const fixtures = {
      root: packument("root", {
        "1.0.0": { m1: "npm:missing@^1.0.0", m2: "npm:missing@^2.0.0" },
      }),
    };
    const calls = stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    assert.equal(result.warnings.length, 1);
    assert.equal(calls.filter((n) => n === "missing").length, 1);
  });

  it("warns when no published version satisfies a range", async (t) => {
    const fixtures = {
      root: packument("root", { "1.0.0": { gone: "^9.0.0" } }),
      gone: packument("gone", { "1.0.0": {} }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 2);
    assert.match(result.warnings.join("\n"), /gone satisfies '\^9\.0\.0'/);
    assert.equal(result.tree["gone@9.0.0"], undefined);
  });

  it("truncates when the package budget is exhausted", async (t) => {
    const fixtures = {
      root: packument("root", { "1.0.0": { a: "^1.0.0", b: "^1.0.0" } }),
      a: packument("a", { "1.0.0": {} }),
      b: packument("b", { "1.0.0": {} }),
    };
    stubRegistry(t, fixtures);
    const result = await resolveProductionTree("root", "1.0.0", 3, {
      maxPackages: 2,
      timeLimitMs: 60_000,
    });
    assert.equal(result.truncated, true);
    assert.equal(result.truncatedBy, "packages");
    assert.ok(Object.keys(result.tree).length <= 2);
  });

  it("stops queued fetches once the deadline passes", async (t) => {
    const deps: Record<string, string> = {};
    for (let i = 0; i < 20; i++) deps[`dep${i}`] = "^1.0.0";
    const fixtures: Record<string, AbbreviatedPackument> = {
      root: packument("root", { "1.0.0": deps }),
    };
    for (let i = 0; i < 20; i++)
      fixtures[`dep${i}`] = packument(`dep${i}`, { "1.0.0": {} });
    const calls: string[] = [];
    let clock = 0;
    t.mock.method(Date, "now", () => clock);
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const name = decodeURIComponent(String(url).split("/").pop() ?? "");
      calls.push(name);
      clock += 30;
      return new Response(JSON.stringify(fixtures[name]), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });
    const result = await resolveProductionTree("root", "1.0.0", 2, {
      maxPackages: 100,
      timeLimitMs: 100,
    });
    assert.equal(result.truncated, true);
    assert.equal(result.truncatedBy, "time");
    assert.ok(calls.length < 21, `expected fewer than 21 fetches, saw ${calls.length}`);
    assert.equal(result.warnings.length, 0);
  });

  it("marks a fetch that outlives the deadline as truncation, not failure", async (t) => {
    let clock = 0;
    t.mock.method(Date, "now", () => clock);
    t.mock.method(globalThis, "fetch", async (url: unknown) => {
      const name = decodeURIComponent(String(url).split("/").pop() ?? "");
      clock += 500;
      if (name === "root") {
        return new Response(
          JSON.stringify(packument("root", { "1.0.0": { slow: "^1.0.0" } })),
          { status: 200, headers: { "content-type": "application/json" } }
        );
      }
      throw new Error("socket hang up");
    });
    const result = await resolveProductionTree("root", "1.0.0", 2, {
      maxPackages: 100,
      timeLimitMs: 600,
    });
    assert.equal(result.truncated, true);
    assert.equal(result.truncatedBy, "time");
    assert.deepEqual(result.warnings, []);
  });

  it("truncates when the time budget is already spent", async (t) => {
    stubRegistry(t, {});
    const result = await resolveProductionTree("root", "1.0.0", 3, {
      maxPackages: 100,
      timeLimitMs: -1,
    });
    assert.equal(result.truncated, true);
    assert.equal(result.truncatedBy, "time");
  });
});

describe("formatTree", () => {
  it("keeps the warnings when the root itself could not be resolved", () => {
    const result: ResolveResult = {
      rootKey: "root@1.0.0",
      tree: {},
      hintToKey: new Map(),
      warnings: ['Failed to fetch root: npm registry returned status 503 for "root".'],
      truncated: false,
    };
    const text = formatTree(result, 2).join("\n");
    assert.match(text, /Root: root@1\.0\.0 \(not resolved\)/);
    assert.match(text, /### Warnings \(1\)/);
    assert.match(text, /status 503/);
  });

  it("renders the resolved tree, truncation note, and warnings", () => {
    const result: ResolveResult = {
      rootKey: "root@1.0.0",
      tree: {
        "root@1.0.0": {
          version: "1.0.0",
          dependencies: { a: "^1.0.0", gone: "^9.0.0" },
        },
        "a@1.0.0": { version: "1.0.0", dependencies: { a: "*" } },
      },
      hintToKey: new Map([
        ["a@^1.0.0", "a@1.0.0"],
        ["a@*", "a@1.0.0"],
      ]),
      warnings: ["No published version of gone satisfies '^9.0.0'."],
      truncated: true,
      truncatedBy: "packages",
    };
    const text = formatTree(result, 2).join("\n");
    assert.match(text, /\*\*Resolved tree:\*\* 2 unique packages/);
    assert.match(text, /tree is partial — package fetch limit reached/);
    assert.match(text, /├── a@1\.0\.0/);
    assert.match(text, /└── gone@\^9\.0\.0 \(truncated\)/);
    assert.match(text, /\(already shown\)/);
    assert.match(text, /### Warnings \(1\)/);
  });
});
