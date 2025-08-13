# MyWineMemory 開発者ガイド

## 概要

MyWineMemoryは、ワイン愛好家向けのPWA（Progressive Web App）です。ワインのテイスティング記録、クイズによる学習、ゲーミフィケーション要素を組み合わせた総合的なワイン体験アプリケーションです。

## 技術スタック

### フロントエンド
- **React 19.1.1** - UIライブラリ
- **TypeScript** - 型安全性とコード品質
- **Vite** - 高速な開発とビルド
- **React Router v7** - SPA ルーティング

### バックエンド・インフラ
- **Firebase** - BaaS プラットフォーム
  - Authentication (Google OAuth)
  - Firestore (NoSQL データベース)
  - Storage (画像ストレージ)
  - Hosting (静的サイトホスティング)
  - Analytics (使用状況分析)
  - Performance Monitoring

### 開発ツール
- **ESLint** - コード品質チェック
- **Jest + React Testing Library** - テスト
- **Vite PWA Plugin** - PWA 機能
- **Sentry** - エラートラッキング

## プロジェクト構成

```
my-wine-memory/
├── src/
│   ├── components/          # 再利用可能なUIコンポーネント
│   ├── pages/              # ページコンポーネント
│   ├── hooks/              # カスタムReactフック
│   ├── services/           # ビジネスロジックとAPI
│   ├── contexts/           # Reactコンテキスト
│   ├── types/              # TypeScript型定義
│   └── App.tsx             # メインアプリケーション
├── docs/                   # ドキュメント
├── public/                 # 静的アセット
├── scripts/                # ビルド・開発スクリプト
└── tests/                  # テストファイル
```

## アーキテクチャ

### データフロー

```
User Interaction
       ↓
React Components
       ↓
Custom Hooks (useWine, useQuiz, etc.)
       ↓
Service Layer (analyticsService, errorTrackingService)
       ↓
Firebase SDK
       ↓
Firebase Services (Firestore, Auth, Storage)
```

### 主要な設計パターン

1. **Container/Presentational Pattern**
   - ページコンポーネント（Container）
   - UIコンポーネント（Presentational）

2. **Custom Hooks Pattern**
   - ビジネスロジックの分離
   - 状態管理の再利用

3. **Service Layer Pattern**
   - Firebase操作の抽象化
   - エラーハンドリングの統一

4. **Context Pattern**
   - グローバル状態管理（Auth, Theme, Error）

## 開発セットアップ

### 必要な環境
- Node.js 18+
- npm または yarn
- Firebase プロジェクト

### セットアップ手順

1. **リポジトリクローン**
```bash
git clone [repository-url]
cd my-wine-memory
```

2. **依存関係インストール**
```bash
npm install
```

3. **環境変数設定**
```bash
cp .env.example .env
# .env ファイルを編集してFirebase設定を追加
```

4. **Firebaseプロジェクト設定**
```bash
npm install -g firebase-tools
firebase login
firebase init
```

5. **開発サーバー起動**
```bash
npm run dev
```

## コーディング規約

### TypeScript

- 厳密な型指定を使用
- `any` 型は避ける
- インターフェースを明確に定義

```typescript
// 良い例
interface WineMaster {
  id: string;
  wineName: string;
  producer: string;
  country: string;
}

// 悪い例
const wine: any = { /* ... */ };
```

### React コンポーネント

- 関数コンポーネントを使用
- TypeScript with React.FC は避ける
- Props の型を明確に定義

```typescript
// 良い例
interface WineCardProps {
  wine: WineMaster;
  onSelect: (wineId: string) => void;
}

const WineCard = ({ wine, onSelect }: WineCardProps) => {
  // ...
};

// 悪い例
const WineCard: React.FC<any> = (props) => {
  // ...
};
```

### カスタムフック

- `use` プレフィックスを使用
- 副作用は適切にクリーンアップ
- 戻り値の型を明確に定義

```typescript
interface UseWineReturn {
  wines: WineMaster[];
  loading: boolean;
  error: Error | null;
  addWine: (wine: Partial<WineMaster>) => Promise<string>;
}

export function useWine(): UseWineReturn {
  // implementation
}
```

### CSS

- CSS Modules または styled-components
- レスポンシブデザインファースト
- アクセシビリティを考慮

```css
/* モバイルファースト */
.wine-card {
  padding: 12px;
}

/* タブレット以上 */
@media (min-width: 768px) {
  .wine-card {
    padding: 16px;
  }
}
```

## テスト戦略

### テストピラミッド

1. **単体テスト (Unit Tests)**
   - Hooks、Utilities、Services
   - Jest + React Testing Library

2. **統合テスト (Integration Tests)**
   - コンポーネント間の連携
   - API呼び出しとデータフロー

3. **E2Eテスト (End-to-End Tests)**
   - ユーザーフロー全体
   - Cypress または Playwright

### テスト例

```typescript
// hooks/useWine.test.ts
import { renderHook, act } from '@testing-library/react';
import { useWine } from './useWine';

describe('useWine', () => {
  it('should fetch wines on mount', async () => {
    const { result } = renderHook(() => useWine());
    
    expect(result.current.loading).toBe(true);
    
    await act(async () => {
      // wait for data loading
    });
    
    expect(result.current.wines).toHaveLength(0);
    expect(result.current.loading).toBe(false);
  });
});
```

## Firebase セットアップ

### Firestore 構造

```
firestore/
├── wines_master/           # ワインマスターデータ
│   └── {wineId}
├── tasting_records/        # ユーザーのテイスティング記録
│   └── {recordId}
├── users/                  # ユーザープロフィール
│   └── {userId}
└── quiz_questions/         # クイズ問題
    └── {questionId}
```

### セキュリティルール

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のデータのみアクセス可能
    match /tasting_records/{recordId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
    
    // ワインマスターは読み取り専用、認証ユーザーのみ作成可能
    match /wines_master/{wineId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 監視とエラートラッキング

### Analytics イベント

主要なユーザーアクションを追跡：

```typescript
// ワイン記録時
analyticsService.trackWineRecorded({
  wine_type: 'red',
  recording_mode: 'detailed',
  rating: 8.5,
  has_images: true
});

// クイズ完了時
analyticsService.trackQuizCompleted({
  difficulty: 3,
  score: 8,
  total_questions: 10,
  time_spent: 120
});
```

### エラートラッキング

```typescript
// エラーキャプチャ
errorTrackingService.captureWineError(error, {
  wineId: 'wine_123',
  action: 'create',
  component: 'AddTastingRecord'
});
```

## パフォーマンス最適化

### Code Splitting

```typescript
// ページレベルでの遅延読み込み
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Stats = React.lazy(() => import('./pages/Stats'));
```

### バンドル最適化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth'],
          'vendor-charts': ['chart.js', 'react-chartjs-2']
        }
      }
    }
  }
});
```

## デプロイメント

### 開発環境

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run preview      # ビルド結果をプレビュー
```

### テスト実行

```bash
npm test             # テスト実行
npm run test:watch   # ウォッチモード
npm run test:coverage # カバレッジ付き
```

### プロダクションデプロイ

```bash
npm run build        # ビルド
firebase deploy      # Firebase Hosting へデプロイ
```

### CI/CD パイプライン

GitHub Actions を使用した自動デプロイ：

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm test
      - uses: FirebaseExtended/action-hosting-deploy@v0
```

## トラブルシューティング

### よくある問題

1. **Firebase接続エラー**
   - 環境変数の確認
   - Firebase設定の再確認

2. **ビルドエラー**
   - TypeScript型エラーの解決
   - 依存関係の更新

3. **テスト失敗**
   - モックの確認
   - 非同期処理の待機

### デバッグ方法

1. **ブラウザ開発者ツール**
   - Console ログ
   - Network タブ
   - Application タブ（PWA）

2. **Firebase Debug**
   - Firebase Emulator
   - Firestore デバッグ

3. **React Developer Tools**
   - コンポーネント状態
   - Props の確認

## 貢献ガイドライン

### Pull Request プロセス

1. Feature ブランチ作成
2. 変更実装
3. テスト追加/更新
4. Pull Request 作成
5. コードレビュー
6. main ブランチにマージ

### コミットメッセージ

```
feat: 新機能を追加
fix: バグ修正
docs: ドキュメント更新
style: コードスタイル修正
refactor: リファクタリング
test: テスト追加/修正
chore: その他の変更
```

## 参考資料

- [React 公式ドキュメント](https://react.dev/)
- [TypeScript ハンドブック](https://www.typescriptlang.org/docs/)
- [Firebase ドキュメント](https://firebase.google.com/docs)
- [Vite ガイド](https://vitejs.dev/guide/)
- [Jest ドキュメント](https://jestjs.io/docs/getting-started)