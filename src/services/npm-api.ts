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

type SemVer = [number, number, number];

function parseSemver(v: string): SemVer | null {
  const m = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function cmpSemver(a: SemVer, b: SemVer): number {
  for (let i = 0; i < 3; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
}

interface SemverRange {
  min: SemVer | null;
  max: SemVer | null;
}

function parseSingleConstraint(r: string): SemverRange | null {
  if (r === "*" || r === "") return { min: null, max: null };

  if (r.startsWith("^")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    let max: SemVer;
    if (base[0] > 0) max = [base[0] + 1, 0, 0];
    else if (base[1] > 0) max = [0, base[1] + 1, 0];
    else max = [0, 0, base[2] + 1];
    return { min: base, max };
  }
  if (r.startsWith("~")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: base, max: [base[0], base[1] + 1, 0] };
  }
  if (r.startsWith(">=")) {
    const base = parseSemver(r.slice(2));
    if (!base) return null;
    return { min: base, max: null };
  }
  if (r.startsWith(">")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: [base[0], base[1], base[2] + 1], max: null };
  }
  if (r.startsWith("<=")) {
    const base = parseSemver(r.slice(2));
    if (!base) return null;
    return { min: null, max: [base[0], base[1], base[2] + 1] };
  }
  if (r.startsWith("<")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: null, max: base };
  }
  if (r.startsWith("=")) {
    const base = parseSemver(r.slice(1));
    if (!base) return null;
    return { min: base, max: [base[0], base[1], base[2] + 1] };
  }

  const xm = r.match(/^(\d+)(?:\.(\d+|x|\*)(?:\.(\d+|x|\*))?)?$/);
  if (xm) {
    const major = Number(xm[1]);
    const minor =
      xm[2] !== undefined && xm[2] !== "x" && xm[2] !== "*" ? Number(xm[2]) : null;
    if (minor === null) return { min: [major, 0, 0], max: [major + 1, 0, 0] };
    const patch =
      xm[3] !== undefined && xm[3] !== "x" && xm[3] !== "*" ? Number(xm[3]) : null;
    if (patch === null) {
      return { min: [major, minor, 0], max: [major, minor + 1, 0] };
    }
    return null;
  }
  return null;
}

function parseRange(r: string): SemverRange | null {
  const hyphenMatch = r.match(/^(\d+\.\d+\.\d+)\s+-\s+(\d+\.\d+\.\d+)$/);
  if (hyphenMatch) {
    const low = parseSemver(hyphenMatch[1]);
    const high = parseSemver(hyphenMatch[2]);
    if (low && high) return { min: low, max: [high[0], high[1], high[2] + 1] };
    return null;
  }

  const parts = r.trim().split(/\s+/);
  if (parts.length > 1) {
    let min: SemVer | null = null;
    let max: SemVer | null = null;
    for (const part of parts) {
      const constraint = parseSingleConstraint(part);
      if (!constraint) return null;
      if (constraint.min) {
        if (!min || cmpSemver(constraint.min, min) > 0) min = constraint.min;
      }
      if (constraint.max) {
        if (!max || cmpSemver(constraint.max, max) < 0) max = constraint.max;
      }
    }
    return { min, max };
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
    const subTargetsPrerelease = /\d+\.\d+\.\d+-/.test(sub);

    for (const v of versions) {
      if (v.includes("-") && !subTargetsPrerelease) continue;
      const vp = parseSemver(v);
      if (!vp) continue;
      if (parsed.min && cmpSemver(vp, parsed.min) < 0) continue;
      if (parsed.max && cmpSemver(vp, parsed.max) >= 0) continue;
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
