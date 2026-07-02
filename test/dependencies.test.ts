import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveDependencySpec } from "../src/tools/dependencies.js";

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
});
