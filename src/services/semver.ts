export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: Array<string | number>;
}

const NUMERIC = /^(?:0|[1-9]\d*)$/;

export function parseSemver(v: string): SemVer | null {
  const m = v.match(
    /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/
  );
  if (!m || !NUMERIC.test(m[1]) || !NUMERIC.test(m[2]) || !NUMERIC.test(m[3])) {
    return null;
  }
  const prerelease = parsePrerelease(m[4]);
  if (!prerelease) return null;
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease,
  };
}

function parsePrerelease(raw: string | undefined): Array<string | number> | null {
  if (!raw) return [];
  const out: Array<string | number> = [];
  for (const p of raw.split(".")) {
    if (!/^[0-9A-Za-z-]+$/.test(p)) return null;
    if (/^\d+$/.test(p)) {
      if (p.length > 1 && p[0] === "0") return null;
      out.push(Number(p));
    } else {
      out.push(p);
    }
  }
  return out;
}

function makeSemver(major: number, minor: number, patch: number): SemVer {
  return { major, minor, patch, prerelease: [] };
}

interface PartialSemver {
  semver: SemVer;
  parts: 0 | 1 | 2 | 3;
}

const WILDCARD = /^[xX*]$/;

function isWildcard(segment: string | undefined): boolean {
  return segment !== undefined && WILDCARD.test(segment);
}

function parsePartial(v: string): PartialSemver | null {
  const stripped = v.replace(/^v(?=[0-9xX*])/, "");
  const plusAt = stripped.indexOf("+");
  const operand = plusAt === -1 ? stripped : stripped.slice(0, plusAt);
  if (
    plusAt !== -1 &&
    !/^[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*$/.test(stripped.slice(plusAt + 1))
  ) {
    return null;
  }
  const m = operand.match(
    /^(\d+|[xX*])(?:\.(\d+|[xX*])(?:\.(\d+|[xX*])(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?)?)?$/
  );
  if (!m) return null;
  let seenWildcard = false;
  for (const part of [m[1], m[2], m[3]]) {
    if (part === undefined || isWildcard(part)) {
      seenWildcard = true;
    } else if (seenWildcard || !NUMERIC.test(part)) {
      return null;
    }
  }
  const prerelease = parsePrerelease(m[4]);
  if (prerelease === null) return null;

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
      prerelease: parts === 3 ? prerelease : [],
    },
    parts,
  };
}

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
  minInclusive: boolean;
  max: SemVer | null;
  maxInclusive: boolean;
}

function rangeAll(): SemverRange {
  return { min: null, minInclusive: true, max: null, maxInclusive: false };
}

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

  if (parts === 0) {
    return op === ">" || op === "<" ? rangeNothing() : rangeAll();
  }

  switch (op) {
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

    case "~": {
      const max = partialUpperBound(base, parts === 1 ? 1 : 2);
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }

    case ">=":
      return { min: base, minInclusive: true, max: null, maxInclusive: false };

    case ">": {
      if (parts === 3) {
        return { min: base, minInclusive: false, max: null, maxInclusive: false };
      }
      const min = partialUpperBound(base, parts);
      return { min, minInclusive: true, max: null, maxInclusive: false };
    }

    case "<=": {
      if (parts === 3) {
        return { min: null, minInclusive: true, max: base, maxInclusive: true };
      }
      const max = partialUpperBound(base, parts);
      return { min: null, minInclusive: true, max, maxInclusive: false };
    }

    case "<":
      return { min: null, minInclusive: true, max: base, maxInclusive: false };

    default: {
      if (parts === 3) {
        return { min: base, minInclusive: true, max: base, maxInclusive: true };
      }
      const max = partialUpperBound(base, parts);
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }
  }
}

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
      const min = lo.parts === 0 ? "" : `>=${loRaw.replace(/^v(?=[0-9xX*])/, "")}`;
      let max = "";
      if (hi.parts === 3) {
        max = `<=${hiRaw.replace(/^v(?=[0-9xX*])/, "")}`;
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

  const normalized = hyphenExpanded.replace(/(>=|<=|>|<|=|\^|~>?)\s+/g, "$1").trim();
  if (normalized === "") return rangeAll();

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

export function maxSatisfying(versions: string[], range: string): string | null {
  const r = range.trim().replace(/^v(?=[0-9xX*])/, "");
  if (versions.includes(r) && parseSemver(r)) return r;

  let subRanges = r
    .split("||")
    .map((s) => ({ sub: s.trim(), parsed: parseRange(s.trim()) }));

  if (subRanges.some(({ parsed }) => parsed === null)) return null;

  if (subRanges.some(({ parsed }) => parsed !== null && isRangeAll(parsed))) {
    subRanges = [{ sub: "*", parsed: rangeAll() }];
  }

  let best: string | null = null;
  let bestParsed: SemVer | null = null;

  for (const { sub, parsed } of subRanges) {
    if (!parsed) continue;
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
