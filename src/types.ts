export interface NpmPackageVersion {
  name: string;
  version: string;
  description?: string;
  license?: string;
  homepage?: string;
  repository?: { type?: string; url?: string } | string;
  keywords?: string[];
  author?: { name?: string; email?: string; url?: string } | string;
  maintainers?: Array<{ name: string; email?: string }>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
  types?: string;
  typings?: string;
  engines?: Record<string, string>;
  deprecated?: string;
  dist?: {
    tarball?: string;
    shasum?: string;
    integrity?: string;
    unpackedSize?: number;
  };
}

export interface NpmRegistryResponse {
  name: string;
  description?: string;
  "dist-tags"?: Record<string, string>;
  versions?: Record<string, NpmPackageVersion>;
  time?: Record<string, string>;
  maintainers?: Array<{ name: string; email?: string }>;
  homepage?: string;
  keywords?: string[];
  repository?: { type?: string; url?: string; directory?: string } | string;
  license?: string;
  readme?: string;
  readmeFilename?: string;
}

export interface NpmSearchResult {
  objects: Array<{
    package: {
      name: string;
      version: string;
      description?: string;
      keywords?: string[];
      date: string;
      links?: {
        npm?: string;
        homepage?: string;
        repository?: string;
      };
      author?: { name?: string; email?: string };
      publisher?: { username?: string; email?: string };
      maintainers?: Array<{ username?: string; email?: string }>;
    };
    score: {
      final: number;
      detail: {
        quality: number;
        popularity: number;
        maintenance: number;
      };
    };
    searchScore: number;
  }>;
  total: number;
}

export interface NpmsPackageResponse {
  analyzedAt: string;
  collected: {
    metadata: {
      name: string;
      version: string;
      description?: string;
      date?: string;
      links?: {
        npm?: string;
        homepage?: string;
        repository?: string;
        bugs?: string;
      };
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
      hasTestScript?: boolean;
      hasSelectiveFiles?: boolean;
    };
    npm: {
      downloads: Array<{ from: string; to: string; count: number }>;
      starsCount?: number;
    };
    github?: {
      starsCount?: number;
      forksCount?: number;
      subscribersCount?: number;
      issues?: {
        count?: number;
        openCount?: number;
        isDisabled?: boolean;
      };
      homepage?: string;
    };
    source?: {
      files?: {
        readmeSize?: number;
        testsSize?: number;
        hasChangelog?: boolean;
      };
      linters?: string[];
    };
  };
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  evaluation: {
    quality: {
      carefulness?: number;
      tests?: number;
      health?: number;
      branding?: number;
    };
    popularity: {
      communityInterest?: number;
      downloadsCount?: number;
      downloadsAcceleration?: number;
      dependentsCount?: number;
    };
    maintenance: {
      releasesFrequency?: number;
      commitsFrequency?: number;
      openIssues?: number;
      issuesDistribution?: number;
    };
  };
}
