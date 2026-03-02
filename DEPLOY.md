# Railway へのデプロイ手順

## 1. 変更を GitHub にプッシュ

```bash
git add package.json package-lock.json DEPLOY.md
git commit -m "Add Railway deploy config (serve + start script)"
git push origin main
```

## 2. Railway でデプロイ

1. [Railway](https://railway.app/) にログイン（GitHub アカウントで可）
2. **New Project** → **Deploy from GitHub repo**
3. リポジトリ **liberaspace3035/blog-coconala** を選択
4. ブランチは **main** のまま
5. Railway が自動で以下を実行します：
   - `npm install`
   - `npm start`（内部で `build:css` → `serve` で静的ファイルを配信）
6. デプロイ完了後、**Settings** → **Networking** → **Generate Domain** で公開URLを発行

## 補足

- **PORT**: Railway が自動で設定します（`serve` が使用）
- **ビルド**: 起動時に `sass style.scss style.css` が実行され、その後 `index.html` 等が配信されます
