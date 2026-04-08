# @kongyo2/npm-info-mcp-server

npm パッケージ情報を提供する MCP サーバー。AI エージェントが TypeScript 開発中に npm レジストリを参照できます。

## ツール

| ツール                     | 説明                      |
| -------------------------- | ------------------------- |
| `npm_search`               | パッケージ検索            |
| `npm_package_info`         | パッケージ詳細情報        |
| `npm_package_versions`     | バージョン一覧            |
| `npm_package_dependencies` | 依存関係                  |
| `npm_package_readme`       | README 取得               |
| `npm_package_types`        | TypeScript 型定義チェック |
| `npm_package_score`        | 品質スコア                |

## セットアップ

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

## 開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run check    # 型チェック・リント・フォーマット確認
npm run build    # ビルド
```

## ライセンス

MIT
