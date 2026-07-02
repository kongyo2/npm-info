import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maxSatisfying } from "../src/services/semver.js";

const VERSIONS = ["1.2.3", "1.2.4", "1.3.0", "2.0.0"];

describe("maxSatisfying: exact versions", () => {
  it("returns an exact match present in the list", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3"), "1.2.3");
  });

  it("strips a leading v from the range", () => {
    assert.equal(maxSatisfying(VERSIONS, "v1.2.3"), "1.2.3");
  });

  it("supports the = operator", () => {
    assert.equal(maxSatisfying(VERSIONS, "=1.2.4"), "1.2.4");
  });

  it("ignores build metadata in the range", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3+build.7"), "1.2.3");
  });

  it("ignores build metadata in candidate versions", () => {
    assert.equal(maxSatisfying(["1.2.3+build.5"], "^1.2.3"), "1.2.3+build.5");
  });

  it("returns null when nothing matches", () => {
    assert.equal(maxSatisfying(VERSIONS, "^3.0.0"), null);
  });

  it("returns null for garbage ranges", () => {
    assert.equal(maxSatisfying(VERSIONS, "not-a-range"), null);
  });
});

describe("maxSatisfying: caret ranges", () => {
  it("^1.2.3 allows minor and patch updates", () => {
    assert.equal(maxSatisfying(VERSIONS, "^1.2.3"), "1.3.0");
  });

  it("^0.2.3 stays within the 0.2 minor", () => {
    assert.equal(maxSatisfying(["0.2.3", "0.2.9", "0.3.0"], "^0.2.3"), "0.2.9");
  });

  it("^0.0.3 pins the exact patch window", () => {
    assert.equal(maxSatisfying(["0.0.3", "0.0.4"], "^0.0.3"), "0.0.3");
  });

  it("^1 expands to >=1.0.0 <2.0.0", () => {
    assert.equal(maxSatisfying(VERSIONS, "^1"), "1.3.0");
  });

  it("^0 expands to >=0.0.0 <1.0.0", () => {
    assert.equal(maxSatisfying(["0.9.9", "1.0.0"], "^0"), "0.9.9");
  });

  it("^0.0 expands to >=0.0.0 <0.1.0", () => {
    assert.equal(maxSatisfying(["0.0.5", "0.1.0"], "^0.0"), "0.0.5");
  });

  it("^1.x behaves like ^1", () => {
    assert.equal(maxSatisfying(VERSIONS, "^1.x"), "1.3.0");
  });
});

describe("maxSatisfying: tilde ranges", () => {
  it("~1.2.3 allows only patch updates", () => {
    assert.equal(maxSatisfying(VERSIONS, "~1.2.3"), "1.2.4");
  });

  it("~1 expands to >=1.0.0 <2.0.0", () => {
    assert.equal(maxSatisfying(VERSIONS, "~1"), "1.3.0");
  });

  it("~1.2 expands to >=1.2.0 <1.3.0", () => {
    assert.equal(maxSatisfying(VERSIONS, "~1.2"), "1.2.4");
  });

  it("~1.2.x behaves like ~1.2", () => {
    assert.equal(maxSatisfying(VERSIONS, "~1.2.x"), "1.2.4");
  });

  it("~> is accepted as a tilde alias", () => {
    assert.equal(maxSatisfying(VERSIONS, "~>1.2.3"), "1.2.4");
  });
});

describe("maxSatisfying: comparators", () => {
  it(">=1.3.0", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=1.3.0"), "2.0.0");
  });

  it(">1.2.4 excludes the boundary", () => {
    assert.equal(maxSatisfying(["1.2.4"], ">1.2.4"), null);
  });

  it(">1.2 expands to >=1.3.0", () => {
    assert.equal(maxSatisfying(["1.2.9", "1.3.0"], ">1.2"), "1.3.0");
  });

  it(">1 expands to >=2.0.0", () => {
    assert.equal(maxSatisfying(VERSIONS, ">1"), "2.0.0");
  });

  it("<=1.2 includes all of 1.2.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "<=1.2"), "1.2.4");
  });

  it("<1.3 excludes 1.3.0", () => {
    assert.equal(maxSatisfying(VERSIONS, "<1.3"), "1.2.4");
  });

  it("<1 means <1.0.0", () => {
    assert.equal(maxSatisfying(VERSIONS, "<1"), null);
  });

  it("=1.2 matches the highest 1.2.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "=1.2"), "1.2.4");
  });

  it("accepts whitespace between operator and operand", () => {
    assert.equal(maxSatisfying(VERSIONS, ">= 1.3.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "~> 1.2.3"), "1.2.4");
    assert.equal(maxSatisfying(VERSIONS, "^ 1.2.3"), "1.3.0");
  });

  it("accepts a v prefix on comparator operands", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=v1.3.0"), "2.0.0");
  });

  it("accepts x placeholders in comparator operands", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=1.x"), "2.0.0");
  });
});

describe("maxSatisfying: x-ranges and wildcards", () => {
  it("* matches everything stable", () => {
    assert.equal(maxSatisfying(VERSIONS, "*"), "2.0.0");
  });

  it("empty range matches everything stable", () => {
    assert.equal(maxSatisfying(VERSIONS, ""), "2.0.0");
  });

  it("bare x matches everything stable", () => {
    assert.equal(maxSatisfying(VERSIONS, "x"), "2.0.0");
  });

  it("bare X matches everything stable", () => {
    assert.equal(maxSatisfying(VERSIONS, "X"), "2.0.0");
  });

  it("1 matches the highest 1.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "1"), "1.3.0");
  });

  it("1.x matches the highest 1.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.x"), "1.3.0");
  });

  it("1.X (uppercase) matches the highest 1.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.X"), "1.3.0");
  });

  it("1.2.x matches the highest 1.2.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.x"), "1.2.4");
  });

  it("1.2.* matches the highest 1.2.x", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.*"), "1.2.4");
  });

  it(">* and <x match nothing (node-semver: <0.0.0-0)", () => {
    assert.equal(maxSatisfying(VERSIONS, ">*"), null);
    assert.equal(maxSatisfying(VERSIONS, "<x"), null);
    assert.equal(maxSatisfying(VERSIONS, ">=1.0.0 <x"), null);
  });

  it(">=* and <=* match everything stable", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=*"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "<=x"), "2.0.0");
  });
});

describe("maxSatisfying: hyphen ranges", () => {
  it("full endpoints are inclusive", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - 1.3.0"), "1.3.0");
  });

  it("abbreviated upper endpoint covers the whole window", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2 - 1.2"), "1.2.4");
  });

  it("single-part endpoints expand per node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "1 - 2"), "2.0.0");
  });

  it("mixed endpoints (full lower, abbreviated upper)", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.4 - 1"), "1.3.0");
  });

  it("wildcard upper endpoint is unbounded", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.4 - x"), "2.0.0");
  });
});

describe("maxSatisfying: compound ranges and unions", () => {
  it("intersects space-separated constraints", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=1.2.3 <1.3.0"), "1.2.4");
  });

  it("resolves || unions to the overall best", () => {
    assert.equal(maxSatisfying(["1.5.0", "2.3.0", "3.0.0"], "^1 || ^2"), "2.3.0");
  });

  it("supports hyphen ranges inside unions", () => {
    assert.equal(
      maxSatisfying(["1.2.7", "1.2.9", "1.9.0", "2.1.0"], "1.2.7 || 1.2.9 - 2.0.0"),
      "1.9.0"
    );
  });

  it("supports exact comparators inside unions", () => {
    assert.equal(maxSatisfying(["1.5.0", "2.0.0"], "^1 || 2.0.0"), "2.0.0");
  });

  it("collapses unions containing * to * (drops prerelease anchors)", () => {
    // node-semver: any ANY set collapses the whole union to `*`, so the
    // prerelease anchor from the other branch no longer applies.
    assert.equal(
      maxSatisfying(["2.0.0", "2.4.3-beta.2"], "^x || ^2.4.3-alpha.0"),
      "2.0.0"
    );
  });
});

describe("maxSatisfying: prerelease handling", () => {
  it("does not match prereleases for plain ranges", () => {
    assert.equal(maxSatisfying(["1.1.0-beta.1"], "^1.0.0"), null);
  });

  it("prefers the stable release over anchored prereleases", () => {
    assert.equal(maxSatisfying(["1.0.0-alpha.1", "1.0.0"], "^1.0.0-alpha"), "1.0.0");
  });

  it("matches prereleases anchored at the same tuple", () => {
    assert.equal(
      maxSatisfying(["1.0.0-alpha.1", "1.0.0-alpha.2"], "^1.0.0-alpha.1"),
      "1.0.0-alpha.2"
    );
  });

  it("rejects prereleases at a different tuple", () => {
    assert.equal(maxSatisfying(["3.4.5-alpha.9"], ">1.2.3-alpha.3"), null);
  });

  it("accepts prereleases at the anchored tuple with >", () => {
    assert.equal(maxSatisfying(["1.2.3-alpha.9"], ">1.2.3-alpha.3"), "1.2.3-alpha.9");
  });

  it("orders prerelease identifiers per semver.org", () => {
    const versions = [
      "1.0.0-alpha",
      "1.0.0-alpha.1",
      "1.0.0-alpha.beta",
      "1.0.0-beta",
      "1.0.0-beta.2",
      "1.0.0-beta.11",
      "1.0.0-rc.1",
    ];
    assert.equal(maxSatisfying(versions, ">=1.0.0-alpha <=1.0.0-rc.1"), "1.0.0-rc.1");
    assert.equal(
      maxSatisfying(versions, ">=1.0.0-alpha <1.0.0-beta"),
      "1.0.0-alpha.beta"
    );
    assert.equal(maxSatisfying(versions, ">=1.0.0-beta.2 <1.0.0-rc.1"), "1.0.0-beta.11");
  });

  it("hyphen ranges anchor prereleases on their endpoints", () => {
    assert.equal(
      maxSatisfying(["1.2.3-alpha.5", "1.2.3"], "1.2.3-alpha.1 - 2.0.0"),
      "1.2.3"
    );
    assert.equal(
      maxSatisfying(["1.2.3-alpha.5"], "1.2.3-alpha.1 - 2.0.0"),
      "1.2.3-alpha.5"
    );
  });
});
