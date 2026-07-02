import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  validatePackageName,
  typesPackageName,
  extractGitHubRepo,
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
