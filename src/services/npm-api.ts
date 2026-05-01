import {
  NPM_REGISTRY_URL,
  NPMS_API_URL,
  GITHUB_API_URL,
  DEFAULT_REQUEST_TIMEOUT,
  PACKAGE_NAME_REGEX,
} from "../constants.js";
import type {
  NpmRegistryResponse,
  NpmSearchResult,
  NpmPackageVersion,
  NpmsPackageResponse,
  AbbreviatedPackument,
} from "../types.js";

export function validatePackageName(name: string): void {
  if (!PACKAGE_NAME_REGEX.test(name)) {
    throw new Error(
      `Invalid package name: "${name}". Package names may contain letters, digits, hyphens, dots, underscores, tildes, and scoped names (@scope/name).`
    );
  }
}

function encodePackageName(name: string): string {
  return name.startsWith("@")
    ? `@${encodeURIComponent(name.slice(1))}`
    : encodeURIComponent(name);
}

async function fetchWithTimeout(
  url: string,
  timeout: number = DEFAULT_REQUEST_TIMEOUT,
  headers: Record<string, string> = { Accept: "application/json" }
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchPackageMetadata(
  packageName: string
): Promise<NpmRegistryResponse> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Package "${packageName}" not found on npm. Check the package name is correct.`
      );
    }
    throw new Error(
      `npm registry returned status ${response.status} for "${packageName}".`
    );
  }
  return (await response.json()) as NpmRegistryResponse;
}

export async function fetchAbbreviatedPackument(
  packageName: string
): Promise<AbbreviatedPackument> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}`;
  const response = await fetchWithTimeout(url, DEFAULT_REQUEST_TIMEOUT, {
    Accept: "application/vnd.npm.install-v1+json",
  });
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Package "${packageName}" not found on npm. Check the package name is correct.`
      );
    }
    throw new Error(
      `npm registry returned status ${response.status} for "${packageName}".`
    );
  }
  return (await response.json()) as AbbreviatedPackument;
}

export async function fetchPackageVersion(
  packageName: string,
  version: string
): Promise<NpmPackageVersion> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}/${encodeURIComponent(version)}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Version "${version}" of package "${packageName}" not found. Use npm_package_versions to see available versions.`
      );
    }
    throw new Error(
      `npm registry returned status ${response.status} for "${packageName}@${version}".`
    );
  }
  return (await response.json()) as NpmPackageVersion;
}

export async function searchPackages(
  query: string,
  limit: number
): Promise<NpmSearchResult> {
  const url = `${NPM_REGISTRY_URL}/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error(
        `Invalid search query. The query must be between 2 and 64 characters.`
      );
    }
    throw new Error(
      `npm search API returned status ${response.status}. Try again later.`
    );
  }
  return (await response.json()) as NpmSearchResult;
}

export async function fetchNpmsScore(packageName: string): Promise<NpmsPackageResponse> {
  validatePackageName(packageName);
  const url = `${NPMS_API_URL}/package/${encodePackageName(packageName)}`;
  const response = await fetchWithTimeout(url);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Package "${packageName}" not found on npms.io. The package may be too new or unlisted.`
      );
    }
    throw new Error(
      `npms.io API returned status ${response.status} for "${packageName}".`
    );
  }
  return (await response.json()) as NpmsPackageResponse;
}

export async function checkDefinitelyTyped(
  packageName: string
): Promise<{ exists: boolean; version?: string }> {
  const typesName = packageName.startsWith("@")
    ? `@types/${packageName.slice(1).replace("/", "__")}`
    : `@types/${packageName}`;
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(typesName)}/latest`;
  const response = await fetchWithTimeout(url, 5000);
  if (response.ok) {
    const data = (await response.json()) as NpmPackageVersion;
    return { exists: true, version: data.version };
  }
  if (response.status === 404) {
    return { exists: false };
  }
  throw new Error(
    `Failed to check @types package "${typesName}": registry returned status ${response.status}. Try again later.`
  );
}

export function createLimiter(max: number) {
  let active = 0;
  const queue: Array<() => void> = [];
  return function runLimited<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const run = (): void => {
        active++;
        fn()
          .then(resolve, reject)
          .finally(() => {
            active--;
            const next = queue.shift();
            if (next) next();
          });
      };
      if (active < max) run();
      else queue.push(run);
    });
  };
}

interface SemVer {
  major: number;
  minor: number;
  patch: number;
  /** Empty when the version is not a prerelease. */
  prerelease: Array<string | number>;
}

function parseSemver(v: string): SemVer | null {
  // Strip build metadata (anything after `+`).
  const stripped = v.split("+")[0];
  const m = stripped.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/);
  if (!m) return null;
  const prerelease: Array<string | number> = m[4]
    ? m[4].split(".").map((p) => (/^\d+$/.test(p) ? Number(p) : p))
    : [];
  return {
    major: Number(m[1]),
    minor: Number(m[2]),
    patch: Number(m[3]),
    prerelease,
  };
}

function makeSemver(major: number, minor: number, patch: number): SemVer {
  return { major, minor, patch, prerelease: [] };
}

/**
 * Compare two semver values. Implements the prerelease-precedence rules from
 * semver.org §11: numeric identifiers compare numerically; alphanumeric ones
 * compare lexically; numeric < alphanumeric; a shorter prefix-equal prerelease
 * is lower; and a non-prerelease version is greater than a prerelease at the
 * same major.minor.patch.
 */
function cmpSemver(a: SemVer, b: SemVer): number {
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

function parseSingleConstraint(r: string): SemverRange | null {
  if (r === "*" || r === "") return rangeAll();

  if (r.startsWith("^")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    let max: SemVer;
    if (base.major > 0) max = makeSemver(base.major + 1, 0, 0);
    else if (base.minor > 0) max = makeSemver(0, base.minor + 1, 0);
    else max = makeSemver(0, 0, base.patch + 1);
    return { min: base, minInclusive: true, max, maxInclusive: false };
  }
  if (r.startsWith("~")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return {
      min: base,
      minInclusive: true,
      max: makeSemver(base.major, base.minor + 1, 0),
      maxInclusive: false,
    };
  }
  if (r.startsWith(">=")) {
    const base = parseSemver(r.slice(2));
    if (!base) return null;
    return { min: base, minInclusive: true, max: null, maxInclusive: false };
  }
  if (r.startsWith(">")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    // Exclusive lower bound: don't bump patch (which would drop prerelease
    // ordering and exclude valid same-tuple prereleases like
    // `>1.2.3-alpha.3` matching `1.2.3-alpha.7`).
    return { min: base, minInclusive: false, max: null, maxInclusive: false };
  }
  if (r.startsWith("<=")) {
    const base = parseSemver(r.slice(2));
    if (!base) return null;
    return { min: null, minInclusive: true, max: base, maxInclusive: true };
  }
  if (r.startsWith("<")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: null, minInclusive: true, max: base, maxInclusive: false };
  }
  if (r.startsWith("=")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: base, minInclusive: true, max: base, maxInclusive: true };
  }

  // x-ranges: 1, 1.x, 1.2, 1.2.x
  const xm = r.match(/^(\d+)(?:\.(\d+|x|\*)(?:\.(\d+|x|\*))?)?$/);
  if (xm) {
    const major = Number(xm[1]);
    const minor =
      xm[2] !== undefined && xm[2] !== "x" && xm[2] !== "*" ? Number(xm[2]) : null;
    if (minor === null) {
      return {
        min: makeSemver(major, 0, 0),
        minInclusive: true,
        max: makeSemver(major + 1, 0, 0),
        maxInclusive: false,
      };
    }
    const patch =
      xm[3] !== undefined && xm[3] !== "x" && xm[3] !== "*" ? Number(xm[3]) : null;
    if (patch === null) {
      return {
        min: makeSemver(major, minor, 0),
        minInclusive: true,
        max: makeSemver(major, minor + 1, 0),
        maxInclusive: false,
      };
    }
    return null;
  }
  return null;
}

function parseRange(r: string): SemverRange | null {
  const hyphenMatch = r.match(
    /^(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)\s+-\s+(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/
  );
  if (hyphenMatch) {
    const low = parseSemver(hyphenMatch[1]);
    const high = parseSemver(hyphenMatch[2]);
    if (low && high) {
      return { min: low, minInclusive: true, max: high, maxInclusive: true };
    }
    return null;
  }

  const parts = r.trim().split(/\s+/);
  if (parts.length > 1) {
    let min: SemVer | null = null;
    let minInclusive = true;
    let max: SemVer | null = null;
    let maxInclusive = false;
    for (const part of parts) {
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
  return parseSingleConstraint(r.trim());
}

/**
 * Lightweight semver maxSatisfying — returns the highest version from `versions`
 * that satisfies `range`. Supports ^, ~, >=, >, <=, <, =, x-ranges, hyphen
 * ranges, compound ranges, and || unions. Falls back to null if no match.
 */
export function maxSatisfying(versions: string[], range: string): string | null {
  const r = range.trim().replace(/^v/, "");
  if (versions.includes(r)) return r;

  const subRanges = r.split("||").map((s) => s.trim());

  let best: string | null = null;
  let bestParsed: SemVer | null = null;

  for (const sub of subRanges) {
    const parsed = parseRange(sub);
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

export function extractGitHubRepo(
  repository: NpmRegistryResponse["repository"]
): { owner: string; repo: string; directory?: string } | null {
  if (!repository) return null;

  const repoObj = typeof repository === "string" ? null : repository;
  const url = typeof repository === "string" ? repository : repository.url;
  if (!url) return null;

  // Handle github:owner/repo shorthand notation
  const shorthandMatch = url.match(/^github:([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:#.*)?$/);
  if (shorthandMatch) {
    const result: { owner: string; repo: string; directory?: string } = {
      owner: shorthandMatch[1],
      repo: shorthandMatch[2],
    };
    if (repoObj?.directory) {
      result.directory = repoObj.directory;
    }
    return result;
  }

  const match = url.match(
    /(?:^|\/\/|git@)github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?\/?(?:#.*)?$/
  );
  if (!match) return null;

  const result: { owner: string; repo: string; directory?: string } = {
    owner: match[1],
    repo: match[2],
  };

  if (repoObj?.directory) {
    result.directory = repoObj.directory;
  }

  return result;
}

export async function fetchGitHubReadme(
  owner: string,
  repo: string,
  directory?: string
): Promise<string | null> {
  let url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  if (directory) {
    url += `/${directory.split("/").map(encodeURIComponent).join("/")}`;
  }
  try {
    const response = await fetchWithTimeout(url, DEFAULT_REQUEST_TIMEOUT, {
      Accept: "application/vnd.github.raw",
      "User-Agent": "npm-info-mcp-server",
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}
