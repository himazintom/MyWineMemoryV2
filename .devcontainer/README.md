# GitHub Codespaces Setup for MyWineMemory

このプロジェクトはGitHub Codespacesに対応しています。スマホやタブレットからでもブラウザ経由で開発環境にアクセスできます。

## 使用方法

### 1. Codespacesを開く
1. GitHubでこのリポジトリを開く
2. 「Code」ボタンをクリック
3. 「Codespaces」タブを選択
4. 「Create codespace on main」をクリック

### 2. 開発サーバーの起動
```bash
cd my-wine-memory
npm run dev
```

### 3. Claude Code CLIの使用
Codespacesには自動的にClaude Code CLIがインストールされます：

```bash
# Claude Codeセッションを開始
claude-code

# 特定のファイルを編集
claude-code edit src/components/MyComponent.tsx

# プロジェクト全体を分析
claude-code analyze
```

## 設定内容

- **Node.js 20**: 最新のLTS版
- **VS Code拡張**: TypeScript、ESLint、Prettier、Tailwind CSS等
- **ポートフォワーディング**: 3000, 5173, 8080（開発サーバー用）
- **自動セットアップ**: npm install + Claude Code CLI

## スマホでの使用Tips

1. **横画面推奨**: より快適な編集体験
2. **外付けキーボード**: 可能であれば接続推奨
3. **ターミナル**: 下部パネルで操作可能
4. **ファイル検索**: Ctrl+P (Cmd+P on iOS) で素早いファイル検索

## 注意事項

- Codespacesは使用時間に制限があります（無料プランの場合）
- 環境変数（Firebase設定等）は手動で設定する必要があります
- 長時間使用しない場合は自動的に停止します