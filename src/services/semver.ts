export interface SemVer {
  major: number;
  minor: number;
  patch: number;
  prerelease: Array<string | number>;
}

const CORE_SEGMENT = "(?:0|[1-9]\\d*)";

const PRERELEASE_ID = "(?:0|[1-9][0-9]{0,256}|[0-9]{0,256}[A-Za-z-][0-9A-Za-z-]{0,250})";
const PRERELEASE = `(${PRERELEASE_ID}(?:\\.${PRERELEASE_ID})*)`;

const BUILD_GROUP = /^[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*$/;
const BUILD_METADATA = /\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*/g;

const MAX_VERSION_LENGTH = 256;

function stripBuild(v: string): string | null {
  const plusIdx = v.indexOf("+");
  if (plusIdx === -1) return v;
  return BUILD_GROUP.test(v.slice(plusIdx + 1)) ? v.slice(0, plusIdx) : null;
}

export function parseSemver(v: string): SemVer | null {
  if (v.length > MAX_VERSION_LENGTH) return null;
  const trimmed = v.trim();
  const stripped = stripBuild(trimmed.replace(/^v/, ""));
  if (stripped === null) return null;
  const m = stripped.match(
    new RegExp(
      `^(${CORE_SEGMENT})\\.(${CORE_SEGMENT})\\.(${CORE_SEGMENT})(?:-${PRERELEASE})?$`
    )
  );
  if (!m) return null;
  const major = Number(m[1]);
  const minor = Number(m[2]);
  const patch = Number(m[3]);
  if (
    major > Number.MAX_SAFE_INTEGER ||
    minor > Number.MAX_SAFE_INTEGER ||
    patch > Number.MAX_SAFE_INTEGER
  ) {
    return null;
  }
  return { major, minor, patch, prerelease: parsePrerelease(m[4]) };
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
  parts: 0 | 1 | 2 | 3;
}

const WILDCARD = /^[xX*]$/;

function isWildcard(segment: string | undefined): boolean {
  return segment !== undefined && WILDCARD.test(segment);
}

function parsePartial(v: string): PartialSemver | null {
  const noBuild = v.replace(BUILD_METADATA, "");
  const stripped = noBuild.replace(/^v/, "");
  const m = stripped.match(
    new RegExp(
      `^((?:${CORE_SEGMENT}|[xX*]))(?:\\.((?:${CORE_SEGMENT}|[xX*]))(?:\\.((?:${CORE_SEGMENT}|[xX*]))(?:-${PRERELEASE})?)?)?$`
    )
  );
  if (!m) return null;

  let parts = 0;
  for (const seg of [m[1], m[2], m[3]]) {
    if (seg === undefined || isWildcard(seg)) break;
    parts++;
  }
  const partCount = parts as 0 | 1 | 2 | 3;
  const major = partCount >= 1 ? Number(m[1]) : 0;
  const minor = partCount >= 2 ? Number(m[2]) : 0;
  const patch = partCount >= 3 ? Number(m[3]) : 0;
  if (
    major > Number.MAX_SAFE_INTEGER ||
    minor > Number.MAX_SAFE_INTEGER ||
    patch > Number.MAX_SAFE_INTEGER
  ) {
    return null;
  }
  if (partCount === 3 && noBuild.length > MAX_VERSION_LENGTH) return null;

  return {
    semver: {
      major,
      minor,
      patch,
      prerelease: partCount === 3 ? parsePrerelease(m[4]) : [],
    },
    parts: partCount,
  };
}

function isSafe(v: SemVer | null): boolean {
  return (
    v === null ||
    (v.major <= Number.MAX_SAFE_INTEGER &&
      v.minor <= Number.MAX_SAFE_INTEGER &&
      v.patch <= Number.MAX_SAFE_INTEGER)
  );
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

function exclusiveFloor(v: SemVer): SemVer {
  return { ...v, prerelease: [0] };
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
  const constraint = parseConstraintBounds(r);
  if (!constraint || !isSafe(constraint.min) || !isSafe(constraint.max)) return null;
  return constraint;
}

function parseConstraintBounds(r: string): SemverRange | null {
  if (r === "") return rangeAll();

  const opMatch = r.match(/^(>=|<=|>|<|=|\^|~>?)/);
  const op = opMatch ? (opMatch[1] === "~>" ? "~" : opMatch[1]) : "";
  const rest = opMatch ? r.slice(opMatch[1].length) : r;
  const prefix = rest.match(/^[v=]*/)?.[0] ?? "";
  const p = parsePartial(rest.slice(prefix.length));
  if (!p) return null;
  const { semver: base, parts } = p;
  const soup = prefix.includes("=") || prefix.length > 1;
  if (soup && parts === 3 && op !== "~" && op !== "^") return null;

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
      return {
        min: base,
        minInclusive: true,
        max: exclusiveFloor(max),
        maxInclusive: false,
      };
    }

    case "~": {
      const max = partialUpperBound(base, parts === 1 ? 1 : 2);
      return {
        min: base,
        minInclusive: true,
        max: exclusiveFloor(max),
        maxInclusive: false,
      };
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
      const max = exclusiveFloor(partialUpperBound(base, parts));
      return { min: null, minInclusive: true, max, maxInclusive: false };
    }

    case "<":
      return {
        min: null,
        minInclusive: true,
        max: parts === 3 ? base : exclusiveFloor(base),
        maxInclusive: false,
      };

    default: {
      if (parts === 3) {
        return { min: base, minInclusive: true, max: base, maxInclusive: true };
      }
      const max = exclusiveFloor(partialUpperBound(base, parts));
      return { min: base, minInclusive: true, max, maxInclusive: false };
    }
  }
}

const XRANGE_PART = `(?:${CORE_SEGMENT}|[xX*])`;
const HYPHEN_OPERAND =
  `[v=\\s]*${XRANGE_PART}` +
  `(?:\\.${XRANGE_PART}(?:\\.${XRANGE_PART}` +
  `(?:-${PRERELEASE_ID}(?:\\.${PRERELEASE_ID})*)?` +
  `(?:\\+[0-9A-Za-z-]+(?:\\.[0-9A-Za-z-]+)*)?` +
  `)?)?`;
const HYPHEN_RANGE = new RegExp(`^\\s?(${HYPHEN_OPERAND}) - (${HYPHEN_OPERAND})\\s?$`);

function expandHyphenRanges(range: string): string | null {
  const m = range.match(HYPHEN_RANGE);
  if (!m) return range;
  const loRaw = m[1].replace(/^[v=\s]+/, "");
  const hiRaw = m[2].replace(/^[v=\s]+/, "");
  const lo = parsePartial(loRaw);
  const hi = parsePartial(hiRaw);
  if (!lo || !hi) return null;
  let min = "";
  if (lo.parts === 3) {
    min = `>=${m[1]}`;
  } else if (lo.parts !== 0) {
    min = `>=${lo.semver.major}.${lo.semver.minor}.${lo.semver.patch}`;
  }
  let max = "";
  if (hi.parts === 3) {
    max = hi.semver.prerelease.length > 0 ? `<=${hiRaw}` : `<=${m[2]}`;
  } else if (hi.parts !== 0) {
    const bound = exclusiveFloor(partialUpperBound(hi.semver, hi.parts));
    max = `<${bound.major}.${bound.minor}.${bound.patch}-0`;
  }
  return `${min} ${max}`.trim();
}

function parseRange(r: string): SemverRange | null {
  const trimmed = r.trim();
  if (trimmed === "") return rangeAll();

  const hyphenExpanded = expandHyphenRanges(trimmed.replace(BUILD_METADATA, ""));
  if (hyphenExpanded === null) return null;

  const normalized = hyphenExpanded
    .replace(/(?<![<>=v])(>=|<=|>|<) (?=[0-9xX*v]|=(?!\s))/g, "$1")
    .replace(/(?<![<>=v\s])( ?)= (?=[0-9xX*v]|=(?!\s))/g, "$1=")
    .replace(/~>?  (?=[0-9xX*v])/g, "~")
    .replace(/~>? (?!=\s)/g, "~")
    .replace(/\^  (?=[0-9xX*v])/g, "^")
    .replace(/\^ (?!=\s)/g, "^")
    .trim();
  if (normalized === "") return rangeAll();

  let min: SemVer | null = null;
  let minInclusive = true;
  let max: SemVer | null = null;
  let maxInclusive = false;
  for (const part of normalized.split(/\s+/)) {
    const constraint = parseSingleConstraint(part);
    if (!constraint) return null;
    if (
      constraint.min &&
      constraint.min !== constraint.max &&
      constraint.minInclusive &&
      constraint.min.major === 0 &&
      constraint.min.minor === 0 &&
      constraint.min.patch === 0 &&
      constraint.min.prerelease.length === 0
    ) {
      constraint.min = null;
    }
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

export function satisfiableAtOrAbove(range: string, floor: string): boolean {
  const floorVersion = parseSemver(floor);
  if (!floorVersion) return false;
  const r = range
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^v(?=\d)/, "");
  return r.split("||").some((rawSub) => {
    const parsed = parseRange(rawSub.trim());
    if (!parsed) return false;
    if (parsed.min && parsed.max) {
      const span = cmpSemver(parsed.min, parsed.max);
      if (span > 0 || (span === 0 && !(parsed.minInclusive && parsed.maxInclusive))) {
        return false;
      }
    }
    if (!parsed.max) return true;
    const cmp = cmpSemver(parsed.max, floorVersion);
    return cmp > 0 || (cmp === 0 && parsed.maxInclusive);
  });
}

export function maxSatisfying(versions: string[], range: string): string | null {
  const r = range
    .trim()
    .replace(/\s+/g, " ")
    .replace(/^v(?=\d)/, "");

  const subRanges: Array<{ sub: string; parsed: SemverRange }> = [];
  for (const rawSub of r.split("||")) {
    const sub = rawSub.trim();
    const parsed = parseRange(sub);
    if (!parsed) return null;
    subRanges.push({ sub, parsed });
  }

  if (subRanges.some(({ parsed }) => isRangeAll(parsed))) {
    subRanges.length = 0;
    subRanges.push({ sub: "*", parsed: rangeAll() });
  }

  let best: string | null = null;
  let bestParsed: SemVer | null = null;

  for (const { sub, parsed } of subRanges) {
    const prereleaseAnchors: Array<[number, number, number]> = [];
    const anchorText = sub.replace(/\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*/g, "");
    for (const m of anchorText.matchAll(/(\d+)\.(\d+)\.(\d+)-[\w.+-]+/g)) {
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
