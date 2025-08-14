# Vercel移行ガイド

Google Cloud FunctionsからVercelへの移行手順

## 📋 移行概要

### 現在の状況
- **現在のエンドポイント**: `https://asia-northeast1-gen-lang-client-0344989001.cloudfunctions.net/geminiProxy`
- **移行先**: Vercel Functions
- **移行理由**: コスト削減、管理簡素化、高速デプロイ

### 移行メリット
- **無料枠**: 月100GB-Hours、1000回関数呼び出し
- **高速デプロイ**: Git連携で自動デプロイ
- **グローバルCDN**: 世界中で高速アクセス
- **シンプル管理**: 直感的なダッシュボード

## 🚀 移行手順

### Phase 1: Vercelプロジェクト準備

#### 1.1 Vercelアカウント作成
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントでサインアップ
3. 新しいプロジェクトを作成

#### 1.2 プロジェクトデプロイ
```bash
# プロジェクトディレクトリに移動
cd vercel-gemini-proxy

# 依存関係インストール
npm install

# Vercel CLIインストール（未インストールの場合）
npm install -g vercel

# プロジェクトをVercelにデプロイ
vercel --prod
```

#### 1.3 環境変数設定
Vercelダッシュボードで以下を設定：

**必須環境変数:**
- `GOOGLE_CLOUD_PROJECT`: `gen-lang-client-0344989001`
- `GEMINI_MODEL`: `gemini-2.0-flash-lite`
- `VERTEX_LOCATION`: `asia-northeast1`

**設定方法:**
1. Vercelダッシュボード → プロジェクト → Settings → Environment Variables
2. 各変数を追加

### Phase 2: 動作確認

#### 2.1 API テスト
デプロイ後、以下のURLでテスト：
```
https://your-project.vercel.app/api/gemini
```

**テスト用JSON:**
```json
{
  "userMessage": "こんにちは",
  "persona": {
    "name": "テスト",
    "personality": "親切",
    "speechStyle": "丁寧"
  },
  "conversationHistory": []
}
```

#### 2.2 レスポンス確認
正常なレスポンス例：
```json
{
  "response": "こんにちは！お元気ですか？",
  "model": "gemini-2.0-flash-lite",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Phase 3: アプリ更新

#### 3.1 アプリ側URL更新
`AIConfigManager.swift`のURLを更新：

```swift
// 変更前
cloudFunctionURL: "https://asia-northeast1-gen-lang-client-0344989001.cloudfunctions.net/geminiProxy"

// 変更後
cloudFunctionURL: "https://your-project.vercel.app/api/gemini"
```

#### 3.2 アプリビルド・テスト
```bash
# ビルドテスト
xcodebuild -project want.xcodeproj -scheme want -destination 'platform=iOS Simulator,name=iPhone 16' build

# 動作確認
# 1. アプリ起動
# 2. AI機能テスト
# 3. 会話機能確認
```

### Phase 4: 本番切り替え

#### 4.1 並行運用期間（推奨: 1週間）
- 両方のエンドポイントを動作確認
- エラー率、レスポンス時間を比較
- 問題がないことを確認

#### 4.2 アプリ更新リリース
1. App Store Connectで新しいバージョンをアップロード
2. 審査通過後、段階的ロールアウト
3. ユーザーフィードバック確認

#### 4.3 Google Cloud停止
1. 動作確認完了後
2. Google Cloud ConsoleでCloud Functions停止
3. 課金停止確認

## 🔧 トラブルシューティング

### よくある問題

#### 1. 環境変数エラー
```
Error: GOOGLE_CLOUD_PROJECT environment variable is required
```
**解決方法**: Vercelダッシュボードで環境変数を設定

#### 2. CORS エラー
```
Access to fetch at 'https://your-project.vercel.app/api/gemini' from origin '...' has been blocked by CORS policy
```
**解決方法**: コード内のCORS設定を確認

#### 3. タイムアウトエラー
```
Function execution time limit exceeded
```
**解決方法**: `vercel.json`で`maxDuration`を調整

### ロールバック手順
問題が発生した場合：

1. **アプリ側**: `AIConfigManager.swift`で元のURLに戻す
2. **サーバー側**: Google Cloud Functionsを再起動
3. **調査**: ログを確認して原因を特定

## 📊 パフォーマンス比較

### レスポンス時間
- **Google Cloud Functions**: ~500-800ms
- **Vercel Functions**: ~300-600ms（予想）

### 可用性
- **Google Cloud Functions**: 99.9%
- **Vercel Functions**: 99.9%

### コスト
- **Google Cloud Functions**: 使用量に応じて課金
- **Vercel Functions**: 無料枠内で十分

## 📞 サポート

移行中に問題が発生した場合：

1. **Vercelサポート**: [Vercel Support](https://vercel.com/support)
2. **Google Cloudサポート**: Google Cloud Console
3. **開発者**: プロジェクトのIssues

## ✅ チェックリスト

### 移行前
- [ ] Vercelアカウント作成
- [ ] プロジェクトデプロイ
- [ ] 環境変数設定
- [ ] API動作確認
- [ ] レスポンス時間測定

### 移行中
- [ ] アプリ側URL更新
- [ ] アプリビルド・テスト
- [ ] 並行運用開始
- [ ] パフォーマンス比較

### 移行後
- [ ] 本番切り替え
- [ ] 動作確認
- [ ] Google Cloud停止
- [ ] コスト削減確認

---

**移行完了後は、Google Cloud Functionsを停止してコストを削減できます。**
