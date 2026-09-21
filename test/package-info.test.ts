import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  formatLicense,
  formatRepository,
  formatAuthor,
  formatEngines,
  formatKeywords,
  formatMaintainer,
  registerPackageInfoTool,
} from "../src/tools/package-info.js";

describe("formatLicense", () => {
  it("passes SPDX strings through", () => {
    assert.equal(formatLicense("MIT"), "MIT");
    assert.equal(formatLicense("(MIT OR Apache-2.0)"), "(MIT OR Apache-2.0)");
  });

  it("renders legacy { type, url } objects instead of [object Object]", () => {
    assert.equal(
      formatLicense({ type: "MIT", url: "https://spdx.org/licenses/MIT" }),
      "MIT (https://spdx.org/licenses/MIT)"
    );
  });

  it("renders license objects that only carry a name", () => {
    assert.equal(formatLicense({ name: "BSD-3-Clause" }), "BSD-3-Clause");
  });

  it("joins entries of a license array", () => {
    assert.equal(
      formatLicense([{ type: "MIT" }, { type: "Apache-2.0" }]),
      "MIT, Apache-2.0"
    );
  });

  it("keeps string entries inside license and licenses arrays", () => {
    assert.equal(formatLicense(["MIT", { type: "Apache-2.0" }]), "MIT, Apache-2.0");
    assert.equal(formatLicense(undefined, ["MIT", "Apache-2.0"]), "MIT, Apache-2.0");
  });

  it("falls back to the deprecated `licenses` array", () => {
    assert.equal(
      formatLicense(undefined, [
        { type: "MIT", url: "https://example.com/mit" },
        { type: "GPL-2.0" },
      ]),
      "MIT (https://example.com/mit), GPL-2.0"
    );
  });

  it("returns undefined when nothing usable is present", () => {
    assert.equal(formatLicense(undefined), undefined);
    assert.equal(formatLicense({}), undefined);
    assert.equal(formatLicense([]), undefined);
  });
});

describe("formatRepository", () => {
  it("normalizes git+ssh GitHub URLs to https", () => {
    assert.equal(
      formatRepository("git+ssh://git@github.com/isaacs/minimatch.git"),
      "https://github.com/isaacs/minimatch"
    );
  });

  it("links monorepo directories to tree/HEAD/<dir>", () => {
    assert.equal(
      formatRepository({
        type: "git",
        url: "https://github.com/angular/angular.git",
        directory: "packages/core",
      }),
      "https://github.com/angular/angular/tree/HEAD/packages/core"
    );
  });

  it("strips transport wrappers from non-GitHub hosts", () => {
    assert.equal(
      formatRepository("git@gitlab.com:group/proj.git"),
      "https://gitlab.com/group/proj"
    );
    assert.equal(
      formatRepository("git://git.example.com/proj.git#main"),
      "https://git.example.com/proj"
    );
  });

  it("upgrades plain http URLs", () => {
    assert.equal(formatRepository("http://example.com/repo"), "https://example.com/repo");
  });

  it("returns undefined for missing or malformed repository fields", () => {
    assert.equal(formatRepository(undefined), undefined);
    assert.equal(formatRepository({ type: "git" }), undefined);
  });
});

describe("formatAuthor", () => {
  it("passes string authors through", () => {
    assert.equal(formatAuthor("Jane Doe"), "Jane Doe");
  });

  it("joins name, email, and url", () => {
    assert.equal(
      formatAuthor({ name: "Jane", email: "j@x.dev", url: "https://j.dev" }),
      "Jane <j@x.dev> (https://j.dev)"
    );
  });

  it("returns undefined for empty objects", () => {
    assert.equal(formatAuthor({}), undefined);
    assert.equal(formatAuthor(undefined), undefined);
  });

  it("skips non-string author fields like formatMaintainer does", () => {
    assert.equal(
      formatAuthor({
        name: 42,
        email: "j@x.dev",
        url: { bad: true },
      } as unknown as Parameters<typeof formatAuthor>[0]),
      "<j@x.dev>"
    );
    assert.equal(
      formatAuthor(42 as unknown as Parameters<typeof formatAuthor>[0]),
      undefined
    );
  });
});

describe("formatEngines", () => {
  it("renders the usual map form", () => {
    assert.equal(formatEngines({ node: ">=18", npm: ">=9" }), "node: >=18, npm: >=9");
  });

  it("handles legacy string and array forms", () => {
    assert.equal(formatEngines("node >= 0.4"), "node >= 0.4");
    assert.equal(formatEngines(["node >= 0.4", "npm"]), "node >= 0.4, npm");
  });

  it("returns undefined when empty", () => {
    assert.equal(formatEngines(undefined), undefined);
    assert.equal(formatEngines({}), undefined);
    assert.equal(formatEngines([]), undefined);
  });

  it("skips non-string engine values and array items", () => {
    assert.equal(formatEngines({ node: ">=18", npm: 8 } as never), "node: >=18");
    assert.equal(formatEngines(["node >= 0.4", 42] as never), "node >= 0.4");
  });
});

describe("formatKeywords", () => {
  it("joins keyword arrays", () => {
    assert.equal(formatKeywords(["a", "b"]), "a, b");
  });

  it("keeps legacy comma strings as-is", () => {
    assert.equal(formatKeywords("a, b"), "a, b");
  });

  it("returns undefined when empty", () => {
    assert.equal(formatKeywords([]), undefined);
    assert.equal(formatKeywords(""), undefined);
    assert.equal(formatKeywords(undefined), undefined);
  });

  it("skips non-string keyword items", () => {
    assert.equal(formatKeywords(["a", 7, { k: 1 }] as never), "a");
    assert.equal(formatKeywords([7, null] as never), undefined);
  });
});

describe("formatMaintainer", () => {
  it("handles string and object maintainers", () => {
    assert.equal(formatMaintainer("octocat"), "octocat");
    assert.equal(formatMaintainer(null), "unknown");
    assert.equal(formatMaintainer({ name: "oc", email: "oc@x.dev" }), "oc <oc@x.dev>");
    assert.equal(formatMaintainer({}), "unknown");
    assert.equal(
      formatMaintainer({ name: 42, email: { bad: true } } as unknown as { name: string }),
      "unknown"
    );
  });
});

describe("npm_package_info handler", () => {
  it("does not print a non-string deprecated marker", async (t) => {
    type Handler = (args: {
      package_name: string;
    }) => Promise<{ content: { text: string }[] }>;
    let handler: Handler | undefined;
    registerPackageInfoTool({
      registerTool: (_name: string, _spec: unknown, h: Handler) => {
        handler = h;
      },
    } as unknown as McpServer);
    assert.ok(handler);
    t.mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response(
          JSON.stringify({
            name: "pkg",
            "dist-tags": { latest: "1.0.0" },
            versions: {
              "1.0.0": {
                name: "pkg",
                version: "1.0.0",
                deprecated: { reason: "x" },
              },
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
    );
    const res = await handler({ package_name: "pkg" });
    assert.doesNotMatch(res.content[0].text, /DEPRECATED|object Object/);
  });

  it("never renders non-string packument fields", async (t) => {
    type Handler = (args: {
      package_name: string;
    }) => Promise<{ content: { text: string }[] }>;
    let handler: Handler | undefined;
    registerPackageInfoTool({
      registerTool: (_name: string, _spec: unknown, h: Handler) => {
        handler = h;
      },
    } as unknown as McpServer);
    assert.ok(handler);
    t.mock.method(
      globalThis,
      "fetch",
      async () =>
        new Response(
          JSON.stringify({
            name: 7,
            description: { text: "hi" },
            homepage: ["https://x.dev"],
            "dist-tags": { latest: "1.0.0", next: 5 },
            time: { "1.0.0": { $date: "x" }, created: "2020-01-01" },
            keywords: ["ok", 4, { bad: true }],
            maintainers: "bob",
            versions: {
              "1.0.0": {
                name: "pkg",
                version: "1.0.0",
                author: { name: ["a"], email: "a@x.dev" },
                engines: { node: ">=18", npm: 9 },
              },
            },
          }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
    );
    const res = await handler({ package_name: "pkg" });
    const text = res.content[0].text;
    assert.match(text, /# pkg/);
    assert.match(text, /\*\*Latest Version:\*\* 1\.0\.0/);
    assert.match(text, /\*\*Author:\*\* <a@x\.dev>/);
    assert.match(text, /\*\*Engines:\*\* node: >=18/);
    assert.match(text, /\*\*Keywords:\*\* ok/);
    assert.match(text, /\*\*Dist-tags:\*\* latest: 1\.0\.0/);
    assert.match(text, /\*\*Created:\*\* 2020-01-01/);
    assert.doesNotMatch(text, /object Object|undefined|Homepage|Published|Maintainers/);
    assert.doesNotMatch(text, /hi/);
  });
});
