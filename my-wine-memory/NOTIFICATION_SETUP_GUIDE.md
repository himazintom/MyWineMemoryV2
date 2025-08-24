# 通知機能を有効にするための設定ガイド

## 1. Firebase Console での設定（必須）

### VAPID Key の取得
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. プロジェクト「mywinememory-4bdf9」を選択
3. ⚙️ → プロジェクト設定 → Cloud Messaging タブ
4. 「ウェブプッシュ証明書」セクションで：
   - 既存のキーペアがある場合：キーをコピー
   - ない場合：「鍵ペアを生成」をクリック
5. 生成された VAPID key をコピー

### 環境変数の設定
プロジェクトルートに `.env.local` ファイルを作成：

```bash
# my-wine-memory/.env.local
VITE_FIREBASE_VAPID_KEY=あなたのVAPIDキーをここに貼り付け
```

## 2. ローカルでのテスト設定

### HTTPS での動作確認（通知には HTTPS が必須）
```bash
# Vite の HTTPS モードで起動
npm run dev -- --host --https
```

### ブラウザでの通知許可
1. アプリを開く
2. プロフィール画面へ移動
3. 「プッシュ通知」セクションを展開
4. 「通知を許可する」をクリック
5. ブラウザの許可ダイアログで「許可」を選択

## 3. PWA としてインストール

### Chrome/Edge でのインストール
1. `https://localhost:5173` でアプリを開く（HTTPS必須）
2. アドレスバーの右側にあるインストールアイコン（⊕）をクリック
3. または、メニュー → 「アプリをインストール」
4. インストールダイアログで「インストール」をクリック

### 確認方法
- デスクトップにアプリアイコンが作成される
- アプリが独立したウィンドウで開く
- chrome://apps/ でインストール済みアプリを確認できる

## 4. 本番環境へのデプロイ前の設定

### Firebase Hosting の設定確認
`firebase.json` に以下が含まれていることを確認：

```json
{
  "hosting": {
    "public": "dist",
    "headers": [
      {
        "source": "/sw.js",
        "headers": [
          {
            "key": "Service-Worker-Allowed",
            "value": "/"
          }
        ]
      },
      {
        "source": "/manifest.json",
        "headers": [
          {
            "key": "Content-Type",
            "value": "application/manifest+json"
          }
        ]
      }
    ]
  }
}
```

### ビルドとデプロイ
```bash
# ビルド
npm run build

# Firebase にデプロイ
firebase deploy --only hosting
```

## 5. 動作確認チェックリスト

### 基本機能
- [ ] Service Worker が登録されている（DevTools → Application → Service Workers）
- [ ] manifest.json が読み込まれている（DevTools → Application → Manifest）
- [ ] アプリがインストール可能（アドレスバーにインストールアイコンが表示）

### 通知機能
- [ ] 通知の許可ダイアログが表示される
- [ ] テスト通知が送信される（プロフィール → テスト通知を送信）
- [ ] PWAインストール後、アプリを閉じても通知が届く

### PWA機能
- [ ] オフラインでアプリが開く
- [ ] ホーム画面のアイコンからアプリが起動
- [ ] スタンドアロンモードで動作（ブラウザUIが非表示）

## 6. トラブルシューティング

### 通知が届かない場合
1. **ブラウザの通知設定を確認**
   - Chrome: chrome://settings/content/notifications
   - サイトが「許可」リストに含まれているか確認

2. **Service Worker の状態を確認**
   - DevTools → Application → Service Workers
   - Status が "Activated and is running" になっているか

3. **VAPID Key の確認**
   - .env.local ファイルが正しく設定されているか
   - ビルド後も環境変数が反映されているか

### PWA がインストールできない場合
1. **HTTPS で動作しているか確認**
   - localhost または HTTPS 証明書のあるドメインが必要

2. **manifest.json が正しく配信されているか**
   - DevTools → Network で manifest.json の読み込みを確認
   - Content-Type が application/manifest+json になっているか

3. **Service Worker が正しく登録されているか**
   - Console にエラーが出ていないか確認

## 7. iOS での設定（追加）

### Safari での PWA インストール
1. Safari でサイトを開く（Chrome では不可）
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択
4. 名前を確認して「追加」

### iOS の制限事項
- Push通知は iOS 16.4+ の Safari でのみ部分対応
- Background Sync は未対応
- 定期的な通知は、アプリを開いた時のみ動作

## 8. 必要なファイルの確認

以下のファイルが正しく配置されているか確認：

```
my-wine-memory/
├── public/
│   ├── manifest.json ✓
│   ├── sw.js ✓
│   ├── firebase-messaging-sw.js ✓
│   └── android/
│       └── [アイコンファイル] ✓
├── src/
│   └── services/
│       ├── notificationService.ts ✓
│       ├── notificationScheduler.ts ✓
│       └── pwaService.ts ✓
└── .env.local （要作成）
```

## サポート

問題が解決しない場合は、以下の情報と共に報告してください：
- ブラウザとバージョン
- デバイス（PC/Android/iOS）
- Console のエラーメッセージ
- Network タブのスクリーンショット