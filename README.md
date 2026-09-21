# @kongyo2/npm-info-mcp-server

[![npm version](https://img.shields.io/npm/v/@kongyo2/npm-info-mcp-server.svg)](https://www.npmjs.com/package/@kongyo2/npm-info-mcp-server)
[![CI](https://github.com/kongyo2/npm-info/actions/workflows/ci.yml/badge.svg)](https://github.com/kongyo2/npm-info/actions/workflows/ci.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kongyo2/npm-info)

MCP server that provides npm package information for AI agents during TypeScript development.

npm パッケージ情報を提供する MCP サーバー。AI エージェントが TypeScript 開発中に npm レジストリを参照できます。

## Tools

| Tool                       | Description                                  | Parameters                                                                                                                                              |
| -------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm_search`               | Search packages                              | `query`, `limit` (1-30, default 10)                                                                                                                     |
| `npm_package_info`         | Get package details                          | `package_name`                                                                                                                                          |
| `npm_package_versions`     | List versions                                | `package_name`, `limit` (1-100, default 20)                                                                                                             |
| `npm_package_dependencies` | Get dependencies                             | `package_name`, `version` (version, dist-tag, or range), `depth` (1-5, default 1), `include_dev`, `include_peer`, `include_optional` (all default true) |
| `npm_package_readme`       | Fetch README                                 | `package_name`                                                                                                                                          |
| `npm_package_types`        | Check TypeScript type definitions            | `package_name`, `version` (version, dist-tag, or range)                                                                                                 |
| `npm_package_score`        | Get quality / popularity / maintenance score | `package_name`                                                                                                                                          |

## Setup

```json
{
  "mcpServers": {
    "npm-info": {
      "command": "npx",
      "args": ["-y", "@kongyo2/npm-info-mcp-server"]
    }
  }
}
```

## MCP Client Configuration

### Claude Code

Install via CLI (MCP only):

```bash
claude mcp add --scope user npm-info -- npx -y @kongyo2/npm-info-mcp-server
```

### Codex

```bash
codex mcp add npm-info -- npx -y @kongyo2/npm-info-mcp-server
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm test         # Run unit tests
npm run check    # Type check, lint & format
npm run build    # Build
```

## License

MIT
