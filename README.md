# @kongyo2/npm-info-mcp-server

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kongyo2/npm-info)

MCP server that provides npm package information for AI agents during TypeScript development.

npm パッケージ情報を提供する MCP サーバー。AI エージェントが TypeScript 開発中に npm レジストリを参照できます。

## Tools

| Tool                       | Description                                  |
| -------------------------- | -------------------------------------------- |
| `npm_search`               | Search packages                              |
| `npm_package_info`         | Get package details                          |
| `npm_package_versions`     | List versions                                |
| `npm_package_dependencies` | Get dependencies                             |
| `npm_package_readme`       | Fetch README                                 |
| `npm_package_types`        | Check TypeScript type definitions            |
| `npm_package_score`        | Get quality / popularity / maintenance score |

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
claude mcp add npm-info --scope user npx @kongyo2/npm-info-mcp-server
```

### Codex

```bash
codex mcp add npm-info -- npx @kongyo2/npm-info-mcp-server
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run check    # Type check, lint & format
npm run build    # Build
```

## License

MIT
