# Quiz Mode Migration Guide

このガイドでは、既存ユーザーを無限モードに移行する方法を説明します。

## 方法1: Firebase Admin SDK を使用（推奨・一括処理）

### 前提条件

1. **Firebase Admin SDK のインストール**
   ```bash
   cd my-wine-memory
   npm install --save-dev firebase-admin
   ```

2. **サービスアカウントキーの取得**

   a. [Firebase Console](https://console.firebase.google.com/) を開く

   b. プロジェクトを選択

   c. 「プロジェクトの設定」（歯車アイコン）→「サービスアカウント」

   d. 「新しい秘密鍵の生成」をクリック

   e. ダウンロードしたJSONファイルを `service-account-key.json` として `my-wine-memory/` ディレクトリに保存

   ⚠️ **重要**: このファイルは機密情報です。絶対にGitにコミットしないでください（.gitignoreに含まれています）

### マイグレーション実行

```bash
cd my-wine-memory
node scripts/migrate-quiz-mode.js
```

このスクリプトは：
- ✅ `quizMode` が未設定の全ユーザーを検出
- ✅ 更新対象のユーザーリストを表示
- ✅ 5秒間の確認時間（Ctrl+C でキャンセル可能）
- ✅ バッチ処理で効率的に更新
- ✅ 進捗状況を表示

### 実行例

```
=== Quiz Mode Migration ===
This script will update all users without quizMode to "infinite" mode

📥 Fetching all users...
Found 15 total users

Found 12 users without quizMode

Users to be updated:
  1. John Doe (john@example.com)
  2. Jane Smith (jane@example.com)
  ...

⚠️  This will set quizMode="infinite" for all these users
Starting in 5 seconds... Press Ctrl+C to cancel

🔄 Starting migration...

✅ Updated 12/12 users

=================================
✨ Migration complete!
   Updated 12 users to infinite mode
=================================
```

---

## 方法2: 自動マイグレーション（ログイン時）

マイグレーションスクリプトを実行できない場合、ユーザーがログインした時に自動的に設定する方法もあります。

この方法では `AuthContext.tsx` を修正して、ログイン時に `quizMode` が未設定の場合に自動的に `'infinite'` を設定します。

詳細が必要な場合はお知らせください。

---

## 方法3: Firestore Console から手動更新

少数のユーザーの場合、Firebase Consoleから手動で更新できます：

1. [Firebase Console](https://console.firebase.google.com/) を開く
2. 「Firestore Database」を選択
3. `users` コレクションを開く
4. 各ユーザードキュメントを編集
5. フィールドを追加: `quizMode` = `"infinite"` (文字列型)

---

## トラブルシューティング

### エラー: Cannot find module 'firebase-admin'
```bash
npm install --save-dev firebase-admin
```

### エラー: Cannot find module '../service-account-key.json'
サービスアカウントキーをダウンロードして、正しい場所に配置してください。

### エラー: Permission denied
サービスアカウントに十分な権限があることを確認してください。

---

## 確認方法

マイグレーション後、以下を確認してください：

1. ユーザーがクイズページにアクセス
2. 「♾️ 無限モード」が表示される
3. 間違えても体力が減らない
4. 体力0でもクイズを続けられる

## package.json への追加（オプション）

スクリプトを npm コマンドとして実行できるようにする場合：

```json
{
  "scripts": {
    "migrate:quiz-mode": "node scripts/migrate-quiz-mode.js"
  }
}
```

実行：
```bash
npm run migrate:quiz-mode
```
