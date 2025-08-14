# Gemini API Proxy for Vercel

Google Cloud FunctionsからVercelへの移行用Gemini APIプロキシ

## 🚀 デプロイ手順

### 1. Vercel CLIインストール
```bash
npm install -g vercel
```

### 2. プロジェクトセットアップ
```bash
cd vercel-gemini-proxy
npm install
```

### 3. 環境変数設定
VercelダッシュボードまたはCLIで以下を設定：

```bash
vercel env add GOOGLE_CLOUD_PROJECT
vercel env add GEMINI_MODEL
vercel env add VERTEX_LOCATION
```

**必須環境変数:**
- `GOOGLE_CLOUD_PROJECT`: Google Cloud プロジェクトID
- `GEMINI_MODEL`: 使用するGeminiモデル（デフォルト: gemini-2.0-flash-lite）
- `VERTEX_LOCATION`: Vertex AIのリージョン（デフォルト: asia-northeast1）

### 4. デプロイ
```bash
vercel --prod
```

## 🔧 設定

### 環境変数
- `GOOGLE_CLOUD_PROJECT`: Google Cloud プロジェクトID
- `GEMINI_MODEL`: gemini-2.0-flash-lite または gemini-2.0-pro
- `VERTEX_LOCATION`: asia-northeast1（推奨）

### API エンドポイント
デプロイ後、以下のURLが生成されます：
```
https://your-project.vercel.app/api/gemini
```

## 📱 iOSアプリでの設定変更

デプロイ後、`AIConfigManager.swift`のURLを更新：

```swift
cloudFunctionURL: "https://your-project.vercel.app/api/gemini"
```

## 🔄 移行タイムライン

1. **準備期間**: Vercelプロジェクト作成・テスト
2. **並行運用**: 両方のエンドポイントを動作確認
3. **切り替え**: アプリ更新でVercel URLに変更
4. **Google Cloud停止**: 動作確認後にCloud Functions停止

## 💰 コスト比較

### Vercel（推奨）
- **無料枠**: 月100GB-Hours、1000回関数呼び出し
- **有料**: $20/月から（Hobbyプラン）

### Google Cloud Functions
- **無料枠**: 月200万回呼び出し、400,000GB-seconds
- **有料**: 使用量に応じて課金

## 🛡️ セキュリティ

- CORS設定済み
- 環境変数による設定管理
- エラーハンドリング実装
- システムプロンプトによる自然な会話制御
