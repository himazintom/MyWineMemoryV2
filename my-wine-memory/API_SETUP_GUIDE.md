# API Setup Guide for Learning Insights

学習インサイト機能を有効にするために、以下のいずれかのAPIを設定できます。APIを設定しない場合でも、事前定義されたメッセージが表示されます。

## Option 1: OpenRouter (推奨 - 無料枠あり)

### 1. アカウント作成
1. https://openrouter.ai/ にアクセス
2. 「Sign Up」をクリックしてアカウント作成
3. メールアドレスを確認

### 2. APIキーの取得
1. ダッシュボードにログイン
2. 「API Keys」セクションに移動
3. 「Create New Key」をクリック
4. キーをコピー（一度しか表示されません）

### 3. 環境変数の設定
`.env.local`ファイルをmy-wine-memoryフォルダに作成し、以下を追加：

```
VITE_OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
VITE_LLM_MODEL=meta-llama/llama-3.2-3b-instruct:free
```

### 無料モデル一覧
- `meta-llama/llama-3.2-3b-instruct:free` - 高速、日本語対応良好
- `google/gemini-2.0-flash-thinking-exp-1219:free` - 高品質
- `microsoft/phi-3.5-mini-128k-instruct:free` - 軽量

## Option 2: Groq (高速処理)

### 1. アカウント作成
1. https://console.groq.com/ にアクセス
2. 「Sign Up」でアカウント作成
3. メール確認

### 2. APIキーの取得
1. Console にログイン
2. 「API Keys」に移動
3. 「Create API Key」をクリック
4. キーをコピー

### 3. 環境変数の設定
`.env.local`ファイルに以下を追加：

```
VITE_OPENROUTER_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENROUTER_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_LLM_MODEL=llama-3.2-3b-preview
```

### 利用可能モデル
- `llama-3.2-3b-preview` - 高速、バランス良好
- `mixtral-8x7b-32768` - 高品質、多言語対応

## Option 3: OpenAI (有料)

### 1. アカウント作成
1. https://platform.openai.com/ にアクセス
2. アカウント作成
3. クレジットカード登録

### 2. APIキーの取得
1. https://platform.openai.com/api-keys にアクセス
2. 「Create new secret key」をクリック
3. キーをコピー

### 3. 環境変数の設定
`.env.local`ファイルに以下を追加：

```
VITE_OPENROUTER_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
VITE_OPENROUTER_API_URL=https://api.openai.com/v1/chat/completions
VITE_LLM_MODEL=gpt-3.5-turbo
```

## 設定の確認

1. アプリケーションを再起動
```bash
npm run dev
```

2. クイズを完了するか、ワインを記録
3. 学習インサイトが表示されることを確認

## トラブルシューティング

### インサイトが表示されない
- `.env.local`ファイルが正しい場所にあるか確認
- APIキーが正しくコピーされているか確認
- ブラウザのコンソールでエラーを確認

### APIエラー
- APIキーの有効性を確認
- 利用制限に達していないか確認
- ネットワーク接続を確認

## 料金について

### 無料オプション
- **OpenRouter**: 無料モデルは完全無料
- **Groq**: 月間制限あり（十分な無料枠）

### 有料オプション
- **OpenAI**: 使用量に応じた従量課金
  - GPT-3.5-turbo: $0.0015/1K tokens (約0.2円/リクエスト)

## セキュリティ注意事項

⚠️ **重要**: 
- APIキーを絶対にGitHubにコミットしないでください
- `.env.local`は`.gitignore`に含まれています
- 本番環境では環境変数を適切に設定してください

## サポート

問題が発生した場合は、以下を確認してください：
1. ブラウザのコンソールログ
2. ネットワークタブでAPIリクエストの状態
3. 各APIプロバイダーのステータスページ