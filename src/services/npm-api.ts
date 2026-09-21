import { setTimeout as delay } from "node:timers/promises";
import {
  NPM_REGISTRY_URL,
  NPMS_API_URL,
  NPM_DOWNLOADS_API_URL,
  GITHUB_API_URL,
  USER_AGENT,
  DEFAULT_REQUEST_TIMEOUT,
  TYPES_CHECK_TIMEOUT,
  MAX_PACKAGE_NAME_LENGTH,
  PACKAGE_NAME_REGEX,
} from "../constants.js";
import { maxSatisfying } from "./semver.js";
import type {
  NpmRegistryResponse,
  NpmSearchResult,
  NpmPackageVersion,
  NpmDownloadsResponse,
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

export function typesPackageName(packageName: string): string {
  return packageName.startsWith("@")
    ? `@types/${packageName.slice(1).replace("/", "__")}`
    : `@types/${packageName}`;
}

export class HttpError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

const RETRYABLE_STATUSES = new Set([429, 503]);
const MAX_RETRY_WAIT_MS = 10_000;

async function fetchOnce(
  url: string,
  timeout: number,
  headers: Record<string, string>
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { signal: controller.signal, headers });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        `Request timed out after ${timeout}ms. The remote service may be slow or unreachable — try again later.`,
        { cause: error }
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithTimeout(
  url: string,
  timeout: number = DEFAULT_REQUEST_TIMEOUT,
  headers: Record<string, string> = { Accept: "application/json" }
): Promise<Response> {
  const merged = { Accept: "application/json", "User-Agent": USER_AGENT, ...headers };
  const first = await fetchOnce(url, timeout, merged);
  if (!RETRYABLE_STATUSES.has(first.status)) return first;

  const retryAfter = Number(first.headers.get("retry-after"));
  const waitMs =
    Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter * 1000, MAX_RETRY_WAIT_MS)
      : 1000;
  await delay(waitMs);
  return fetchOnce(url, timeout, merged);
}

async function fetchJson<T>(
  url: string,
  describeFailure: (status: number) => string,
  timeout?: number,
  headers?: Record<string, string>
): Promise<T> {
  const response = await fetchWithTimeout(url, timeout, headers);
  if (!response.ok) {
    throw new HttpError(describeFailure(response.status), response.status);
  }
  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new Error(`Invalid JSON in the response from ${new URL(url).hostname}.`, {
      cause: error,
    });
  }
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

export async function fetchResolvedVersion(
  packageName: string,
  version?: string
): Promise<NpmPackageVersion> {
  const requested = version?.trim() || "latest";
  try {
    return await fetchPackageVersion(packageName, requested);
  } catch (error) {
    if (!(error instanceof HttpError) || error.status !== 404) throw error;

    const packument = await fetchAbbreviatedPackument(packageName);
    const resolved = maxSatisfying(Object.keys(packument.versions ?? {}), requested);
    if (!resolved) {
      throw new Error(
        `No published version of "${packageName}" satisfies "${requested}". Use npm_package_versions to see available versions.`,
        { cause: error }
      );
    }
    return fetchPackageVersion(packageName, resolved);
  }
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

export interface DefinitelyTypedResult {
  exists: boolean;
  version?: string;
  deprecated?: string;
}

export async function checkDefinitelyTyped(
  packageName: string
): Promise<DefinitelyTypedResult> {
  const typesName = typesPackageName(packageName);
  const url = `${NPM_REGISTRY_URL}/${encodePackageName(typesName)}/latest`;
  const response = await fetchWithTimeout(url, TYPES_CHECK_TIMEOUT);
  if (response.ok) {
    const data = (await response.json()) as NpmPackageVersion;
    return {
      exists: true,
      version: data.version,
      deprecated: typeof data.deprecated === "string" ? data.deprecated : undefined,
    };
  }
  if (response.status === 404) {
    return { exists: false };
  }
  throw new Error(
    `Failed to check @types package "${typesName}": registry returned status ${response.status}. Try again later.`
  );
}

export async function fetchNpmDownloads(
  packageName: string
): Promise<{ lastWeek?: NpmDownloadsResponse; lastMonth?: NpmDownloadsResponse }> {
  const encoded = encodePackageName(packageName);
  const [lastWeek, lastMonth] = await Promise.all([
    fetchJson<NpmDownloadsResponse>(
      `${NPM_DOWNLOADS_API_URL}/point/last-week/${encoded}`,
      (status) => `npm downloads API returned status ${status} for "${packageName}".`
    ).catch(() => undefined),
    fetchJson<NpmDownloadsResponse>(
      `${NPM_DOWNLOADS_API_URL}/point/last-month/${encoded}`,
      (status) => `npm downloads API returned status ${status} for "${packageName}".`
    ).catch(() => undefined),
  ]);
  return { lastWeek, lastMonth };
}

export function extractGitHubRepo(
  repository: NpmRegistryResponse["repository"]
): { owner: string; repo: string; directory?: string } | null {
  if (!repository) return null;

  const repoObj = typeof repository === "string" ? null : repository;
  const url = typeof repository === "string" ? repository : repository.url;
  if (!url) return null;

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
