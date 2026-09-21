import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { maxSatisfying, satisfiableAtOrAbove } from "../src/services/semver.js";

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

  it("strips a generated >=0.0.0 lower bound (node-semver GTE0)", () => {
    const preVersions = ["0.0.0-alpha.1.2", "0.0.0-rc.2", "0.0.0", "0.0.1"];
    assert.equal(maxSatisfying(preVersions, ">=0 <=0.0.0-rc.2 x"), "0.0.0-rc.2");
    assert.equal(maxSatisfying(preVersions, "=0 <=0.0.0-rc.2"), "0.0.0-rc.2");
    assert.equal(maxSatisfying(["0.0.0-alpha"], ">=0.0.0-0"), "0.0.0-alpha");
  });
});

describe("maxSatisfying: malformed operands (node-semver parity)", () => {
  it("truncates a numeric segment after a wildcard like npm's bundled semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "=x.5"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "<1.x.2"), null);
    assert.equal(maxSatisfying(VERSIONS, ">=1.*.9"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.x.2"), "1.3.0");
    assert.equal(maxSatisfying(VERSIONS, "x.2.3"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.x.2-beta"), "1.3.0");
    assert.equal(maxSatisfying(VERSIONS, ">1.x.5"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "<=1.x.9"), "1.3.0");
    assert.equal(maxSatisfying(VERSIONS, "1.x.2 - 2"), "2.0.0");
  });

  it("truncates out-of-order wildcards under ~ and ^", () => {
    assert.equal(maxSatisfying(VERSIONS, "~x.5"), "2.0.0");
    assert.equal(maxSatisfying(["0.9.9", "1.3.0"], "^0.x.5"), "0.9.9");
  });

  it("truncates out-of-order wildcard hyphen endpoints", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.3.1 - x.18"), "2.0.0");
  });

  it("rejects an invalid branch anywhere in a union", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 || garbage"), null);
  });

  it("rejects leading zeros, empty ids and oversized numbers", () => {
    assert.equal(maxSatisfying(VERSIONS, "01.2.3"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.02.3"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-01"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-a..b"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-.a"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3+"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3+a..b"), null);
    assert.equal(maxSatisfying(VERSIONS, "9007199254740992.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "0.0.9007199254740993"), null);
  });

  it("tolerates redundant + and numeric build ids", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3+meta+extra"), "1.2.3");
    assert.equal(maxSatisfying(VERSIONS, "1.2.3+build.01"), "1.2.3");
  });

  it("skips candidates whose build metadata is itself invalid", () => {
    assert.equal(maxSatisfying(["1.2.3+a..b", "1.2.4"], "*"), "1.2.4");
    assert.equal(maxSatisfying(["1.2.3+a+b"], "*"), null);
  });

  it("does not treat prerelease-looking text inside build metadata as an anchor", () => {
    assert.equal(maxSatisfying(["9.9.9-rc"], "<=9.9.9+zzz-9.9.9-rc"), null);
    assert.equal(maxSatisfying(["9.9.9-rc"], "<=9.9.9-rc+zzz"), "9.9.9-rc");
  });

  it("ignores unparseable version strings in the candidates list", () => {
    assert.equal(maxSatisfying(["1.1.1-.a", "1.2.3"], "1.1.1-.a"), null);
    assert.equal(maxSatisfying(["1.1.1-_a", "1.2.3"], "*"), "1.2.3");
  });
});

describe("maxSatisfying: stray hyphens and operand prefixes", () => {
  it("rejects a hyphen expression embedded in a compound range", () => {
    assert.equal(maxSatisfying(VERSIONS, ">=1.0.0 1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - 2.0.0 <9.0.0"), null);
    assert.equal(maxSatisfying(["1.5.0", "2.0.0"], "x - 2.0.0 1.5.0"), null);
  });

  it("accepts v/whitespace-prefixed partial endpoints like node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - v 2.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "v 1.2 - 2.0.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - v=2.0"), "2.0.0");
  });

  it("accepts full endpoints only with an attached v, like node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "v1.2.3 - 2.0.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - v2.0.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "v 1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - v 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "=1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "= 1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - =2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "vv1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "v=1.2.3 - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "v=1.2.3-alpha - 2.0.0"), null);
  });

  it("rebuilds prefixed upper endpoints with prereleases like node-semver", () => {
    const preVersions = ["1.2.3", "2.0.0-beta", "2.0.0"];
    assert.equal(maxSatisfying(preVersions, "1.2.3 - v=2.0.0-beta"), "2.0.0-beta");
    assert.equal(maxSatisfying(preVersions, "1.2.3 - v 2.0.0-beta"), "2.0.0-beta");
    assert.equal(maxSatisfying(preVersions, "1.2.3 - =2.0.0-beta"), "2.0.0-beta");
  });

  it("mirrors node-semver's trimming of build-stripped operator gaps", () => {
    assert.equal(maxSatisfying(VERSIONS, "^ +meta 1"), "1.3.0");
    assert.equal(maxSatisfying(VERSIONS, "~ +meta 1.2"), "1.2.4");
    assert.equal(maxSatisfying(VERSIONS, "< +meta 2"), null);
    assert.equal(maxSatisfying(VERSIONS, "< +meta +more 2"), null);
    assert.equal(maxSatisfying(VERSIONS, ">= +meta 1.2.3"), null);
    assert.equal(maxSatisfying(VERSIONS, "= +meta 1.2.3"), null);
    assert.equal(maxSatisfying(VERSIONS, "^ +a +b 1"), null);
    assert.equal(maxSatisfying(VERSIONS, "> =X.x +meta = X"), null);
    assert.equal(maxSatisfying(VERSIONS, "~ +meta >X"), null);
    assert.equal(maxSatisfying(VERSIONS, "~ >X"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "~> +meta 1.2"), "1.2.4");
    assert.equal(maxSatisfying(VERSIONS, ">=1.2.3 +meta <2.0.0"), "1.3.0");
    assert.equal(maxSatisfying(VERSIONS, ">=1.2.3 = 1.2.4"), "1.2.4");
  });

  it("treats a build-stripped hyphen separator as invalid like node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 +meta - 2.0.0"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3  -  2.0.0"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.2.3 - 2.0.0 +meta"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "1.2 - 2+build"), "2.0.0");
  });
});

describe("maxSatisfying: operator spacing", () => {
  it("does not merge an operator with a spaced-out '='", () => {
    assert.equal(maxSatisfying(VERSIONS, "> = 1.2.3"), null);
    assert.equal(maxSatisfying(VERSIONS, "> = 1.2"), null);
    assert.equal(maxSatisfying(VERSIONS, "> =1.2.3"), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, "> =1.2"), "2.0.0");
  });
});

describe("maxSatisfying: exact 0.0.0 equality bound", () => {
  it("does not strip the lower bound of an exact 0.0.0 constraint", () => {
    const preVersions = ["0.0.0-alpha.1.2", "0.0.0-rc.2", "0.0.0", "0.0.1"];
    assert.equal(maxSatisfying(preVersions, "=0.0.0 <=0.0.0-rc.2"), null);
    assert.equal(maxSatisfying(preVersions, "0.0.0 <=0.0.0-rc.2"), null);
    assert.equal(maxSatisfying(preVersions, ">=0 <=0.0.0-rc.2"), "0.0.0-rc.2");
  });
});

describe("maxSatisfying: oversized identifiers", () => {
  it("rejects full operands over 256 chars like node-semver", () => {
    const big = "b".repeat(251);
    assert.equal(maxSatisfying(VERSIONS, `>=1.0.0-${big}`), null);
    assert.equal(maxSatisfying(VERSIONS, `1.2.3 - 2.0.0-${big}`), null);
    assert.equal(maxSatisfying(VERSIONS, `~1.0.0-${big}`), null);
    assert.equal(maxSatisfying(VERSIONS, `>=1.0.0-${"b".repeat(250)}`), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, `1.2.3 - 2.0.0-${"b".repeat(250)}`), "1.3.0");
  });

  it("drops oversized prerelease ids on wildcard operands like node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, `x.x.x-${"c".repeat(251)}`), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, `x.x.x-${"c".repeat(252)}`), null);
    assert.equal(maxSatisfying(VERSIONS, `x.x.x-${"9".repeat(257)}`), "2.0.0");
    assert.equal(maxSatisfying(VERSIONS, `x.x.x-${"9".repeat(258)}`), null);
  });

  it("rejects leading-zero numeric prerelease ids like node-semver", () => {
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-007"), null);
    assert.equal(maxSatisfying(VERSIONS, "1.2.3-0.07"), null);
    assert.equal(maxSatisfying(VERSIONS, "x.x.x-007"), null);
    assert.equal(maxSatisfying(["1.2.3-01a", "1.2.4"], ">=1.2.0"), "1.2.4");
    assert.equal(maxSatisfying(["1.2.3-01a"], "1.2.3-01a"), "1.2.3-01a");
    assert.equal(maxSatisfying(["1.2.3-007"], "*"), null);
  });

  it("rejects ranges whose computed bounds overflow MAX_SAFE_INTEGER", () => {
    const max = String(Number.MAX_SAFE_INTEGER);
    const pool = ["1.0.0", `${max}.0.0`];
    assert.equal(maxSatisfying(pool, `${max}.x`), null);
    assert.equal(maxSatisfying(pool, max), null);
    assert.equal(maxSatisfying(pool, `~${max}`), null);
    assert.equal(maxSatisfying(pool, `^0.0.${max}`), null);
    assert.equal(maxSatisfying(pool, `>${max}`), null);
    assert.equal(maxSatisfying(pool, `<=${max}.x`), null);
    assert.equal(maxSatisfying(pool, `x - ${max}`), null);
    assert.equal(maxSatisfying(pool, `${max}.0.0`), `${max}.0.0`);
    assert.equal(maxSatisfying(pool, `>=${max}.0.0`), `${max}.0.0`);
  });
});

describe("maxSatisfying: candidate version normalization", () => {
  it("parses v-prefixed and whitespace-padded candidates", () => {
    assert.equal(maxSatisfying(["v9.9.9", "1.2.3"], ">1.0.0"), "v9.9.9");
    assert.equal(maxSatisfying(["1.2.3 ", "1.0.0"], "1.2.3"), "1.2.3 ");
    assert.equal(maxSatisfying(["\t2.0.0"], "*"), "\t2.0.0");
  });

  it("rejects candidate strings over 256 characters", () => {
    const huge = `1.2.3-${"a".repeat(300)}`;
    assert.equal(maxSatisfying([huge, "1.2.3"], "*"), "1.2.3");
  });

  it("measures the 256-char limit before trimming like node-semver", () => {
    const padded = `1.2.3 ${" ".repeat(260)}`;
    assert.equal(maxSatisfying([padded, "1.2.4"], "*"), "1.2.4");
    const prefixed = `v1.2.3${" ".repeat(251)}`;
    assert.equal(maxSatisfying([prefixed, "1.2.4"], "*"), "1.2.4");
  });

  it("picks the first equal candidate when the range carries build metadata", () => {
    assert.equal(maxSatisfying(["1.2.3 ", "1.2.3+ok"], "1.2.3+ok"), "1.2.3 ");
  });
});

describe("maxSatisfying: operator prefixes accepted by node-semver", () => {
  it("accepts = and v after ^ and ~ on any operand", () => {
    const pool = ["1.2.3", "1.5.0", "2.0.0", "2.0.5", "2.1.0"];
    assert.equal(maxSatisfying(pool, "~=2.0.0"), "2.0.5");
    assert.equal(maxSatisfying(pool, "^=1.2.3"), "1.5.0");
    assert.equal(maxSatisfying(pool, "^1 || ~=2.0.0"), "2.0.5");
    assert.equal(maxSatisfying(pool, "~v2.0.0"), "2.0.5");
    assert.equal(maxSatisfying(pool, "^v1"), "1.5.0");
    assert.equal(maxSatisfying(pool, "~>=2.0"), "2.0.5");
    assert.equal(maxSatisfying(pool, "^=1.x"), "1.5.0");
  });

  it("accepts prefix soup on partial comparator operands only", () => {
    const pool = ["1.2.3", "1.5.0", "2.0.0", "2.0.5", "2.1.0"];
    assert.equal(maxSatisfying(pool, ">==1.2"), "2.1.0");
    assert.equal(maxSatisfying(pool, "v=1"), "1.5.0");
    assert.equal(maxSatisfying(pool, "=v1.2.3"), "1.2.3");
    assert.equal(maxSatisfying(pool, "==1.2.3"), null);
    assert.equal(maxSatisfying(pool, "v=1.2.3"), null);
    assert.equal(maxSatisfying(pool, ">==1.2.3"), null);
  });

  it("mirrors node-semver's space handling around prefix soup", () => {
    const pool = ["1.2.3", "1.5.0", "2.0.0", "2.0.5", "2.1.0"];
    assert.equal(maxSatisfying(pool, "~= 2.0.0"), "2.0.5");
    assert.equal(maxSatisfying(pool, "^= 1.2"), "1.5.0");
    assert.equal(maxSatisfying(pool, "~ = 1.2"), "1.2.3");
    assert.equal(maxSatisfying(pool, "= v1.2.3"), "1.2.3");
    assert.equal(maxSatisfying(pool, "> =1.2.3"), "2.1.0");
    assert.equal(maxSatisfying(pool, "^ =1.2"), "1.5.0");
    assert.equal(maxSatisfying(pool, ">=1.2.3 +meta <= 2"), "2.1.0");
    assert.equal(maxSatisfying(pool, ">=1.2.3 +meta = 2.0.5"), null);
    assert.equal(maxSatisfying(pool, "== x"), null);
    assert.equal(maxSatisfying(pool, "=== x"), null);
    assert.equal(maxSatisfying(pool, ">== 1.2"), null);
    assert.equal(maxSatisfying(pool, "<= = 2"), null);
    assert.equal(maxSatisfying(pool, "v= 1"), null);
    assert.equal(maxSatisfying(pool, "~v= 1"), null);
    assert.equal(maxSatisfying(pool, "=v 1.2.3"), null);
    assert.equal(maxSatisfying(pool, "~=v 2.0.0"), null);
    assert.equal(maxSatisfying(pool, "> = 1.2.3"), null);
  });

  it("re-forms a tilde arrow after a spaced comparator like node-semver", () => {
    const pool = ["0.5.3", "0.10.2", "0.11.0", "1.0.0", "10.5.3"];
    assert.equal(maxSatisfying(pool, "~> >=0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "~> >= 0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "~ >=0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "~ > 0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "~> =0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "~> x"), "10.5.3");
    assert.equal(maxSatisfying(pool, "~> <0.10"), null);
    assert.equal(maxSatisfying(pool, "~>>=0.10"), null);
    assert.equal(maxSatisfying(pool, "^ >=0.10"), null);
    assert.equal(maxSatisfying(pool, "~>= 0.10"), "0.10.2");
    assert.equal(maxSatisfying(pool, "= >0.10"), null);
  });
});

describe("satisfiableAtOrAbove", () => {
  it("reports whether a range admits some version at or above the floor", () => {
    assert.equal(satisfiableAtOrAbove("*", "4.0.0"), true);
    assert.equal(satisfiableAtOrAbove(">=5.1 <6", "4.0.0"), true);
    assert.equal(satisfiableAtOrAbove(">=3.1 <5", "4.0.0"), true);
    assert.equal(satisfiableAtOrAbove("<2.0", "4.0.0"), false);
    assert.equal(satisfiableAtOrAbove("<=4.0.0", "4.0.0"), true);
    assert.equal(satisfiableAtOrAbove("<4.0.0", "4.0.0"), false);
    assert.equal(satisfiableAtOrAbove("<2.0 || >=4.1", "4.0.0"), true);
    assert.equal(satisfiableAtOrAbove(">=9 <5", "4.0.0"), false);
    assert.equal(satisfiableAtOrAbove("garbage", "4.0.0"), false);
  });
});
