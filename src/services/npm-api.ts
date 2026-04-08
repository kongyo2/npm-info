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
  timeout: number = DEFAULT_REQUEST_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
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

export function extractGitHubRepo(
  repository: NpmRegistryResponse["repository"]
): { owner: string; repo: string } | null {
  if (!repository) return null;

  const url = typeof repository === "string" ? repository : repository.url;
  if (!url) return null;

  const match = url.match(/github\.com[/:]([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:#.*)?$/);
  if (!match) return null;

  return { owner: match[1], repo: match[2] };
}

export async function fetchGitHubReadme(
  owner: string,
  repo: string
): Promise<string | null> {
  const url = `${GITHUB_API_URL}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/vnd.github.raw+json",
      },
    });
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
