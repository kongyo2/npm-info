import {
  NPM_REGISTRY_URL,
  NPMS_API_URL,
  GITHUB_API_URL,
  USER_AGENT,
  DEFAULT_REQUEST_TIMEOUT,
  TYPES_CHECK_TIMEOUT,
  MAX_PACKAGE_NAME_LENGTH,
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
  if (name.length > MAX_PACKAGE_NAME_LENGTH) {
    throw new Error(
      `Invalid package name: names must not exceed ${MAX_PACKAGE_NAME_LENGTH} characters.`
    );
  }
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

/**
 * Map a package name to its DefinitelyTyped companion package name:
 * `react` → `@types/react`, `@babel/core` → `@types/babel__core`.
 */
export function typesPackageName(packageName: string): string {
  return packageName.startsWith("@")
    ? `@types/${packageName.slice(1).replace("/", "__")}`
    : `@types/${packageName}`;
}

async function fetchWithTimeout(
  url: string,
  timeout: number = DEFAULT_REQUEST_TIMEOUT,
  headers: Record<string, string> = { Accept: "application/json" }
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal, headers });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timed out after ${timeout}ms. The registry may be slow or unreachable — try again later.`,
        { cause: error }
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a JSON endpoint, translating non-2xx responses into descriptive
 * errors via `describeFailure`.
 */
async function fetchJson<T>(
  url: string,
  describeFailure: (status: number) => string,
  timeout?: number,
  headers?: Record<string, string>
): Promise<T> {
  const response = await fetchWithTimeout(url, timeout, headers);
  if (!response.ok) {
    throw new Error(describeFailure(response.status));
  }
  return (await response.json()) as T;
}

export async function fetchPackageMetadata(
  packageName: string
): Promise<NpmRegistryResponse> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}`;
  return fetchJson(url, (status) =>
    status === 404
      ? `Package "${packageName}" not found on npm. Check the package name is correct.`
      : `npm registry returned status ${status} for "${packageName}".`
  );
}

export async function fetchAbbreviatedPackument(
  packageName: string
): Promise<AbbreviatedPackument> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}`;
  return fetchJson(
    url,
    (status) =>
      status === 404
        ? `Package "${packageName}" not found on npm. Check the package name is correct.`
        : `npm registry returned status ${status} for "${packageName}".`,
    DEFAULT_REQUEST_TIMEOUT,
    { Accept: "application/vnd.npm.install-v1+json" }
  );
}

export async function fetchPackageVersion(
  packageName: string,
  version: string
): Promise<NpmPackageVersion> {
  validatePackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(packageName)}/${encodeURIComponent(version)}`;
  return fetchJson(url, (status) =>
    status === 404
      ? `Version "${version}" of package "${packageName}" not found. Use npm_package_versions to see available versions.`
      : `npm registry returned status ${status} for "${packageName}@${version}".`
  );
}

export async function searchPackages(
  query: string,
  limit: number
): Promise<NpmSearchResult> {
  const url = `${NPM_REGISTRY_URL}/-/v1/search?text=${encodeURIComponent(query)}&size=${limit}`;
  return fetchJson(url, (status) =>
    status === 400
      ? `Invalid search query. The query must be between 2 and 64 characters.`
      : `npm search API returned status ${status}. Try again later.`
  );
}

export async function fetchNpmsScore(packageName: string): Promise<NpmsPackageResponse> {
  validatePackageName(packageName);
  const url = `${NPMS_API_URL}/package/${encodePackageName(packageName)}`;
  return fetchJson(url, (status) =>
    status === 404
      ? `Package "${packageName}" not found on npms.io. The package may be too new or unlisted.`
      : `npms.io API returned status ${status} for "${packageName}".`
  );
}

export async function checkDefinitelyTyped(
  packageName: string
): Promise<{ exists: boolean; version?: string }> {
  const typesName = typesPackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(typesName)}/latest`;
  const response = await fetchWithTimeout(url, TYPES_CHECK_TIMEOUT);
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

export function extractGitHubRepo(
  repository: NpmRegistryResponse["repository"]
): { owner: string; repo: string; directory?: string } | null {
  if (!repository) return null;

  const repoObj = typeof repository === "string" ? null : repository;
  const url = typeof repository === "string" ? repository : repository.url;
  if (!url) return null;

  // Handle github:owner/repo shorthand notation
  const shorthandMatch = url.match(/^github:([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:#.*)?$/);
  const match =
    shorthandMatch ??
    url.match(
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
      "User-Agent": USER_AGENT,
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}
