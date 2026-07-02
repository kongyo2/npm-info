/**
 * Lightweight semver range resolution used to walk dependency trees without
 * pulling in the full `semver` package. Supports the range syntax that
 * actually appears in published package.json files: `^`, `~` (and the `~>`
 * alias), comparators (`>=`, `>`, `<=`, `<`, `=`) with optional whitespace
 * and `v` prefixes, x-ranges (`1`, `1.x`, `1.2.*`, `x`), hyphen ranges with
 * abbreviated endpoints, space-separated intersections, and `||` unions.
 */

export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  /** Empty when the version is not a prerelease. */
  prerelease: Array<string | number>;
}

export function parseSemver(v: string): SemVer | null {
  // Strip build metadata (anything after `+`).
  const stripped = v.split("+")[0];
  const m = stripped.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease: parsePrerelease(m[4]),
  };
}

function parsePrerelease(raw: string | undefined): Array<string | number> {
  if (!raw) return [];
  return raw.split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : p));
}

function makeSemver(major: number, minor: number, patch: number): SemVer {
  return { major, minor, patch, prerelease: [] };
}

interface PartialSemver {
  semver: SemVer;
  /**
   * Number of explicit numeric parts: 1 = "1", 2 = "1.2", 3 = "1.2.3".
   * 0 means the whole operand is a wildcard ("x", "X", "*").
   */
  parts: 0 | 1 | 2 | 3;
}

const WILDCARD = /^[xX*]$/;

function isWildcard(segment: string | undefined): boolean {
  return segment !== undefined && WILDCARD.test(segment);
}

/**
 * Parse a possibly-abbreviated version operand (e.g. `1`, `1.2`, `1.2.3`,
 * `1.2.3-pre`, `v1.2`, `1.x`). Missing or wildcard parts default to zero.
 * Returns the parsed semver along with the explicit-part count so callers
 * can apply node-semver's partial-version expansion rules per operator.
 */
function parsePartial(v: string): PartialSemver | null {
  // Strip an optional leading `v` and build metadata (anything after `+`).
  const stripped = v.replace(/^v/, "").split("+")[0];
  const m = stripped.match(
    /^(\d+|[xX*])(?:\.(\d+|[xX*])(?:\.(\d+|[xX*])(?:-([0-9A-Za-z.-]+))?)?)?$/
  );
  if (!m) return null;

  let parts: 0 | 1 | 2 | 3;
  if (isWildcard(m[1])) parts = 0;
  else if (m[2] === undefined || isWildcard(m[2])) parts = 1;
  else if (m[3] === undefined || isWildcard(m[3])) parts = 2;
  else parts = 3;

  return {
    semver: {
      major: parts >= 1 ? Number(m[1]) : 0,
      minor: parts >= 2 ? Number(m[2]) : 0,
      patch: parts >= 3 ? Number(m[3]) : 0,
      // A prerelease is only meaningful on a fully-specified version.
      prerelease: parts === 3 ? parsePrerelease(m[4]) : [],
    },
    parts,
  };
}

/**
 * Compare two semver values. Implements the prerelease-precedence rules from
 * semver.org §11: numeric identifiers compare numerically; alphanumeric ones
 * compare lexically; numeric < alphanumeric; a shorter prefix-equal prerelease
 * is lower; and a non-prerelease version is greater than a prerelease at the
 * same major.minor.patch.
 */
export function cmpSemver(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;

  const ap = a.prerelease;
  const bp = b.prerelease;
  if (ap.length === 0 && bp.length === 0) return 0;
  if (ap.length === 0) return 1;
  if (bp.length === 0) return -1;

  const len = Math.min(ap.length, bp.length);
  for (let i = 0; i < len; i++) {
    const x = ap[i];
    const y = bp[i];
    if (typeof x === "number" && typeof y === "number") {
      if (x !== y) return x < y ? -1 : 1;
    } else if (typeof x === "number") {
      return -1;
    } else if (typeof y === "number") {
      return 1;
    } else if (x !== y) {
      return x < y ? -1 : 1;
    }
  }
  if (ap.length !== bp.length) return ap.length < bp.length ? -1 : 1;
  return 0;
}

interface SemverRange {
  min: SemVer | null;
  /** True when min is `>=`, false when `>`. Ignored if min is null. */
  minInclusive: boolean;
  max: SemVer | null;
  /** True when max is `<=`, false when `<`. Ignored if max is null. */
  maxInclusive: boolean;
}

function rangeAll(): SemverRange {
  return { min: null, minInclusive: true, max: null, maxInclusive: false };
}

/** `<0.0.0-0` — the node-semver encoding of "matches nothing". */
function rangeNothing(): SemverRange {
  return {
    min: null,
    minInclusive: true,
    max: { major: 0, minor: 0, patch: 0, prerelease: [0] },
    maxInclusive: false,
  };
}

function isRangeAll(range: SemverRange): boolean {
  return range.min === null && range.max === null;
}

/** Upper bound of the abbreviated window `base` covers (exclusive). */
function partialUpperBound(base: SemVer, parts: 1 | 2): SemVer {
  return parts === 1
    ? makeSemver(base.major + 1, 0, 0)
    : makeSemver(base.major, base.minor + 1, 0);
}

function parseSingleConstraint(r: string): SemverRange | null {
  if (r === "") return rangeAll();

  const opMatch = r.match(/^(>=|<=|>|<|=|\^|~>?)/);
  const op = opMatch ? (opMatch[1] === "~>" ? "~" : opMatch[1]) : "";
  const p = parsePartial(opMatch ? r.slice(opMatch[1].length) : r);
  if (!p) return null;
  const { semver: base, parts } = p;

  // A wildcard operand ("x", "*") matches everything for `>=`, `<=`, `^`,
  // `~`, `=`, and bare form — but `>x` / `<x` match nothing (node-semver
  // normalizes them to `<0.0.0-0`).
  if (parts === 0) {
    return op === ">" || op === "<" ? rangeNothing() : rangeAll();
  }

  switch (op) {
    // Caret: `^X.Y.Z` keeps left-most non-zero stable. Abbreviated forms
    // expand per node-semver: `^1` ≡ `>=1.0.0 <2.0.0`, `^1.2` ≡ `>=1.2.0
    // <2.0.0`, `^0.1` ≡ `>=0.1.0 <0.2.0`, `^0` ≡ `>=0.0.0 <1.0.0`.
    case "^": {
      let max: SemVer;
      if (base.major > 0 || parts === 1) {
        max = makeSemver(base.major + 1, 0, 0);
      } else if (base.minor > 0 || parts === 2) {
        max = makeSemver(0, base.minor + 1, 0);
      } else {
        max = makeSemver(0, 0, base.patch + 1);
      }
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }

    // Tilde: `~X.Y.Z` allows patch updates within X.Y. Abbreviated:
    // `~1` ≡ `>=1.0.0 <2.0.0`, `~1.2` ≡ `>=1.2.0 <1.3.0`.
    case "~": {
      const max = partialUpperBound(base, parts === 1 ? 1 : 2);
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }

    // `>=X` keeps the partial as the lower bound (missing parts default to
    // 0, which is the lowest in the range — the desired behavior here).
    case ">=":
      return { min: base, minInclusive: true, max: null, maxInclusive: false };

    // `>X.Y.Z` is exclusive on the original tuple (preserves prerelease
    // ordering). Abbreviated: `>1` expands to "above all 1.x.x" ≡ `>=2.0.0`,
    // `>1.2` expands to `>=1.3.0` (top of the abbreviated range, exclusive).
    case ">": {
      if (parts === 3) {
        return { min: base, minInclusive: false, max: null, maxInclusive: false };
      }
      const min = partialUpperBound(base, parts);
      return { min, minInclusive: true, max: null, maxInclusive: false };
    }

    // `<=X.Y.Z` is inclusive on the original tuple. Abbreviated `<=X` means
    // "everything up to and including X.x.x" ≡ `<X+1.0.0`; `<=X.Y` ≡
    // `<X.Y+1.0`.
    case "<=": {
      if (parts === 3) {
        return { min: null, minInclusive: true, max: base, maxInclusive: true };
      }
      const max = partialUpperBound(base, parts);
      return { min: null, minInclusive: true, max, maxInclusive: false };
    }

    // `<X` keeps the partial as the (exclusive) upper bound — missing parts
    // default to 0, which gives `<1` ≡ `<1.0.0`, `<1.2` ≡ `<1.2.0`. Per
    // node-semver this matches the lowest version in that abbreviated range.
    case "<":
      return { min: null, minInclusive: true, max: base, maxInclusive: false };

    // `=X.Y.Z` (or a bare version / x-range) pins exactly that version or
    // window: `1.2.3` matches only itself; `1.2` ≡ `>=1.2.0 <1.3.0`; `1` ≡
    // `>=1.0.0 <2.0.0`.
    default: {
      if (parts === 3) {
        return { min: base, minInclusive: true, max: base, maxInclusive: true };
      }
      const max = partialUpperBound(base, parts);
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }
  }
}

/**
 * Rewrite hyphen ranges (`1.2.3 - 2.3.4`) into comparator pairs so the rest
 * of the parser only deals with space-separated constraints. Per node-semver:
 * `1.2.3 - 2.3.4` ≡ `>=1.2.3 <=2.3.4`, `1.2 - 2.3` ≡ `>=1.2.0 <2.4.0`,
 * `1 - 2` ≡ `>=1.0.0 <3.0.0`, `1.2.3 - 2` ≡ `>=1.2.3 <3.0.0`.
 * Returns null when a hyphen endpoint is not a valid version operand.
 */
function expandHyphenRanges(range: string): string | null {
  let invalid = false;
  const expanded = range.replace(
    /(\S+)\s+-\s+(\S+)/g,
    (_, loRaw: string, hiRaw: string) => {
      const lo = parsePartial(loRaw);
      const hi = parsePartial(hiRaw);
      if (!lo || !hi) {
        invalid = true;
        return "";
      }
      const min = lo.parts === 0 ? "" : `>=${loRaw.replace(/^v/, "")}`;
      let max = "";
      if (hi.parts === 3) {
        max = `<=${hiRaw.replace(/^v/, "")}`;
      } else if (hi.parts !== 0) {
        const bound = partialUpperBound(hi.semver, hi.parts);
        max = `<${bound.major}.${bound.minor}.${bound.patch}`;
      }
      return `${min} ${max}`.trim();
    }
  );
  return invalid ? null : expanded;
}

function parseRange(r: string): SemverRange | null {
  const trimmed = r.trim();
  if (trimmed === "") return rangeAll();

  const hyphenExpanded = expandHyphenRanges(trimmed);
  if (hyphenExpanded === null) return null;

  // Collapse whitespace between an operator and its operand (`>= 1.2.3`,
  // `~> 1.2` — both valid in node-semver) so tokens split cleanly.
  const normalized = hyphenExpanded.replace(/(>=|<=|>|<|=|\^|~>?)\s+/g, "$1").trim();
  if (normalized === "") return rangeAll();

  // Intersect all space-separated constraints: highest min and lowest max
  // win; on ties an exclusive bound beats an inclusive one.
  let min: SemVer | null = null;
  let minInclusive = true;
  let max: SemVer | null = null;
  let maxInclusive = false;
  for (const part of normalized.split(/\s+/)) {
    const constraint = parseSingleConstraint(part);
    if (!constraint) return null;
    if (constraint.min) {
      const cmp = min ? cmpSemver(constraint.min, min) : 1;
      if (!min || cmp > 0) {
        min = constraint.min;
        minInclusive = constraint.minInclusive;
      } else if (cmp === 0) {
        minInclusive = minInclusive && constraint.minInclusive;
      }
    }
    if (constraint.max) {
      const cmp = max ? cmpSemver(constraint.max, max) : -1;
      if (!max || cmp < 0) {
        max = constraint.max;
        maxInclusive = constraint.maxInclusive;
      } else if (cmp === 0) {
        maxInclusive = maxInclusive && constraint.maxInclusive;
      }
    }
  }
  return { min, minInclusive, max, maxInclusive };
}

/**
 * Lightweight semver maxSatisfying — returns the highest version from
 * `versions` that satisfies `range`. Falls back to null if no match.
 */
export function maxSatisfying(versions: string[], range: string): string | null {
  const r = range.trim().replace(/^v/, "");
  if (versions.includes(r)) return r;

  let subRanges = r
    .split("||")
    .map((s) => ({ sub: s.trim(), parsed: parseRange(s.trim()) }));

  // node-semver collapses a union to `*` when any of its comparator sets is
  // the ANY set — which also discards the other sets' prerelease anchors.
  if (subRanges.some(({ parsed }) => parsed !== null && isRangeAll(parsed))) {
    subRanges = [{ sub: "*", parsed: rangeAll() }];
  }

  let best: string | null = null;
  let bestParsed: SemVer | null = null;

  for (const { sub, parsed } of subRanges) {
    if (!parsed) continue;
    // npm/node-semver only allows a prerelease version to satisfy a range
    // when the range explicitly references a prerelease at the same
    // major.minor.patch tuple. Capture every such tuple appearing in this
    // sub-range; a prerelease version is eligible only if its tuple is in
    // this set. Without this, e.g. `>1.2.3-alpha.3` would erroneously
    // match `3.4.5-alpha.9`.
    const prereleaseAnchors: Array<[number, number, number]> = [];
    for (const m of sub.matchAll(/(\d+)\.(\d+)\.(\d+)-[\w.+-]+/g)) {
      prereleaseAnchors.push([Number(m[1]), Number(m[2]), Number(m[3])]);
    }
    const allowsPrerelease = prereleaseAnchors.length > 0;

    for (const v of versions) {
      const vp = parseSemver(v);
      if (!vp) continue;
      const isPrereleaseV = vp.prerelease.length > 0;
      if (isPrereleaseV && !allowsPrerelease) continue;
      if (
        isPrereleaseV &&
        !prereleaseAnchors.some(
          (a) => a[0] === vp.major && a[1] === vp.minor && a[2] === vp.patch
        )
      ) {
        continue;
      }
      if (parsed.min) {
        const c = cmpSemver(vp, parsed.min);
        if (c < 0 || (c === 0 && !parsed.minInclusive)) continue;
      }
      if (parsed.max) {
        const c = cmpSemver(vp, parsed.max);
        if (c > 0 || (c === 0 && !parsed.maxInclusive)) continue;
      }
      if (!bestParsed || cmpSemver(vp, bestParsed) > 0) {
        best = v;
        bestParsed = vp;
      }
    }
  }
  return best;
}
