# MyWineMemory API 仕様書

## 概要

本書は MyWineMemory アプリケーションで使用される内部API（サービス層）の仕様を定義します。Firebase SDK を使用したデータ操作と、アプリケーション固有のビジネスロジックを含みます。

## アーキテクチャ

```
Frontend Components
       ↓
Custom Hooks
       ↓
Service Layer (API)
       ↓
Firebase SDK
       ↓
Firebase Services
```

## 認証

すべてのデータ操作には Firebase Authentication が必要です。

### 認証状態の管理

```typescript
interface AuthState {
  currentUser: User | null;
  loading: boolean;
  error: Error | null;
}
```

## データモデル

### WineMaster (ワインマスターデータ)

```typescript
interface WineMaster {
  id: string;                    // 一意識別子
  wineName: string;              // ワイン名（必須）
  producer: string;              // 生産者（必須）
  country: string;               // 生産国（必須）
  region: string;                // 地域（必須）
  vintage?: number;              // ヴィンテージ年
  grapeVarieties?: string[];     // ブドウ品種
  wineType?: WineType;           // ワインタイプ
  alcoholContent?: number;       // アルコール度数
  winemaker?: string;            // ワインメーカー
  referenceCount: number;        // 参照カウント
  createdAt: Date;               // 作成日時
  updatedAt: Date;               // 更新日時
  createdBy: string;             // 作成者UID
}

type WineType = 'red' | 'white' | 'rose' | 'sparkling' | 'dessert' | 'fortified';
```

### TastingRecord (テイスティング記録)

```typescript
interface TastingRecord {
  id: string;                    // 一意識別子
  userId: string;                // ユーザーUID（必須）
  wineId: string;                // ワインID（必須）
  overallRating: number;         // 総合評価 (0.0-10.0)
  tastingDate: Date;             // テイスティング日
  recordMode: 'quick' | 'detailed'; // 記録モード
  notes?: string;                // メモ
  price?: number;                // 価格
  purchaseLocation?: string;     // 購入場所
  images?: string[];             // 画像URL配列
  
  // 詳細分析（detailed モード時）
  visualAnalysis?: VisualAnalysis;
  aromaAnalysis?: AromaAnalysis;
  tasteAnalysis?: TasteAnalysis;
  componentAnalysis?: ComponentAnalysis;
  
  createdAt: Date;               // 作成日時
  updatedAt: Date;               // 更新日時
}

interface VisualAnalysis {
  color: string;                 // 色調
  clarity: string;               // 透明度
  viscosity: string;             // 粘性
}

interface AromaAnalysis {
  firstImpression: string;       // 第一印象
  afterSwirling: string;         // スワリング後
  aromaIntensity: number;        // 香りの強度 (1-10)
  aromaCategories: string[];     // 香りのカテゴリ
}

interface TasteAnalysis {
  attack: string;                // アタック
  development: string;           // 展開
  finish: string;                // フィニッシュ
}

interface ComponentAnalysis {
  acidity: number;               // 酸味 (1-10)
  tannins: number;               // タンニン (1-10)
  sweetness: number;             // 甘味 (1-10)
  body: number;                  // ボディ (1-10)
}
```

### User (ユーザー)

```typescript
interface User {
  uid: string;                   // Firebase UID
  email?: string;                // メールアドレス
  displayName?: string;          // 表示名
  photoURL?: string;             // プロフィール画像URL
  createdAt: Date;               // 作成日時
  lastLoginAt: Date;             // 最終ログイン日時
  
  // ユーザー統計
  stats: UserStats;
  
  // 設定
  preferences: UserPreferences;
}

interface UserStats {
  totalWines: number;            // 総ワイン数
  totalRecords: number;          // 総記録数
  averageRating: number;         // 平均評価
  streak: number;                // 連続記録日数
  xp: number;                    // 経験値
  level: number;                 // レベル
  badges: string[];              // 獲得バッジ
}

interface UserPreferences {
  theme: 'light' | 'dark';       // テーマ
  language: 'ja' | 'en';         // 言語
  notifications: boolean;        // 通知設定
  publicProfile: boolean;        // 公開プロフィール
  analyticsEnabled: boolean;     // 分析許可
}
```

## サービス API

### WineMasterService

#### `wineMasterService.searchWineMasters(query: string, limit?: number): Promise<WineMaster[]>`

ワインマスターデータを検索します。

**パラメータ:**
- `query` (string): 検索クエリ
- `limit` (number, optional): 結果の上限数（デフォルト: 20）

**戻り値:**
- `Promise<WineMaster[]>`: 検索結果のワイン配列

**例:**
```typescript
const wines = await wineMasterService.searchWineMasters('シャルドネ', 10);
```

#### `wineMasterService.getPopularWines(limit?: number): Promise<WineMaster[]>`

人気のワインを取得します。

**パラメータ:**
- `limit` (number, optional): 結果の上限数（デフォルト: 10）

**戻り値:**
- `Promise<WineMaster[]>`: 人気ワインの配列

#### `wineMasterService.createWineMaster(wineData: Partial<WineMaster>): Promise<string>`

新しいワインマスターデータを作成します。

**パラメータ:**
- `wineData` (Partial<WineMaster>): ワインデータ

**戻り値:**
- `Promise<string>`: 作成されたワインのID

**例:**
```typescript
const wineId = await wineMasterService.createWineMaster({
  wineName: 'ドンペリニヨン',
  producer: 'モエ・エ・シャンドン',
  country: 'フランス',
  region: 'シャンパーニュ',
  wineType: 'sparkling'
});
```

#### `wineMasterService.getWineMasterById(wineId: string): Promise<WineMaster | null>`

IDでワインマスターデータを取得します。

**パラメータ:**
- `wineId` (string): ワインID

**戻り値:**
- `Promise<WineMaster | null>`: ワインデータまたはnull

### TastingRecordService

#### `tastingRecordService.createTastingRecord(recordData: Partial<TastingRecord>): Promise<string>`

新しいテイスティング記録を作成します。

**パラメータ:**
- `recordData` (Partial<TastingRecord>): 記録データ

**戻り値:**
- `Promise<string>`: 作成された記録のID

**例:**
```typescript
const recordId = await tastingRecordService.createTastingRecord({
  wineId: 'wine_123',
  overallRating: 8.5,
  tastingDate: new Date(),
  recordMode: 'detailed',
  notes: '素晴らしいワインでした。'
});
```

#### `tastingRecordService.getUserTastingRecords(userId: string, options?: QueryOptions): Promise<TastingRecord[]>`

ユーザーのテイスティング記録を取得します。

**パラメータ:**
- `userId` (string): ユーザーID
- `options` (QueryOptions, optional): クエリオプション

**戻り値:**
- `Promise<TastingRecord[]>`: テイスティング記録の配列

```typescript
interface QueryOptions {
  limit?: number;                // 結果の上限数
  orderBy?: string;              // ソート項目
  orderDirection?: 'asc' | 'desc'; // ソート方向
  startAfter?: any;              // ページネーション開始点
  filters?: FilterCondition[];   // フィルター条件
}

interface FilterCondition {
  field: string;                 // フィルター対象フィールド
  operator: FilterOperator;      // フィルター演算子
  value: any;                    // フィルター値
}

type FilterOperator = '==' | '!=' | '<' | '<=' | '>' | '>=' | 'in' | 'not-in' | 'array-contains';
```

#### `tastingRecordService.updateTastingRecord(recordId: string, updates: Partial<TastingRecord>): Promise<void>`

テイスティング記録を更新します。

**パラメータ:**
- `recordId` (string): 記録ID
- `updates` (Partial<TastingRecord>): 更新データ

#### `tastingRecordService.deleteTastingRecord(recordId: string): Promise<void>`

テイスティング記録を削除します。

**パラメータ:**
- `recordId` (string): 記録ID

### UserService

#### `userService.createUserProfile(user: User): Promise<void>`

ユーザープロフィールを作成します。

#### `userService.getUserProfile(userId: string): Promise<User | null>`

ユーザープロフィールを取得します。

#### `userService.updateUserStats(userId: string, updates: Partial<UserStats>): Promise<void>`

ユーザー統計を更新します。

#### `userService.updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<void>`

ユーザー設定を更新します。

### AnalyticsService

#### `analyticsService.trackWineRecorded(wineData: WineAnalyticsData): void`

ワイン記録イベントを追跡します。

```typescript
interface WineAnalyticsData {
  wine_type: string;
  recording_mode: 'quick' | 'detailed';
  rating: number;
  has_images: boolean;
}
```

#### `analyticsService.trackQuizCompleted(quizData: QuizAnalyticsData): void`

クイズ完了イベントを追跡します。

```typescript
interface QuizAnalyticsData {
  difficulty: number;
  score: number;
  total_questions: number;
  time_spent: number;
}
```

#### `analyticsService.trackPageView(pageName: string, additionalData?: Record<string, any>): void`

ページビューを追跡します。

### ErrorTrackingService

#### `errorTrackingService.captureError(error: Error, context?: ErrorContext): void`

エラーをキャプチャします。

```typescript
interface ErrorContext {
  component?: string;
  action?: string;
  wineId?: string;
  userId?: string;
  route?: string;
}
```

#### `errorTrackingService.captureWineError(error: Error, wineContext: WineErrorContext): void`

ワイン関連エラーをキャプチャします。

```typescript
interface WineErrorContext {
  wineId?: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'search';
  component: string;
  additionalData?: Record<string, any>;
}
```

### IndexedDBService (オフライン対応)

#### `indexedDBService.saveDraft(draft: DraftRecord): Promise<void>`

ドラフトを保存します。

```typescript
interface DraftRecord {
  id: string;
  data: Partial<TastingRecord>;
  lastModified: number;
  wineId?: string;
  wineName?: string;
}
```

#### `indexedDBService.getDrafts(): Promise<DraftRecord[]>`

ドラフト一覧を取得します。

#### `indexedDBService.cacheWines(wines: WineMaster[]): Promise<void>`

ワインデータをキャッシュします。

#### `indexedDBService.searchCachedWines(query: string): Promise<WineMaster[]>`

キャッシュされたワインを検索します。

## エラーハンドリング

### エラータイプ

```typescript
interface AppError {
  id: string;
  type: 'network' | 'auth' | 'validation' | 'server' | 'unknown';
  message: string;
  userMessage: string;
  timestamp: number;
  retry?: () => Promise<void>;
  details?: any;
}
```

### Firebase エラーコード

| エラーコード | 説明 | ユーザーメッセージ |
|-------------|------|-------------------|
| `auth/user-not-found` | ユーザーが見つからない | ログイン情報が正しくありません |
| `auth/wrong-password` | パスワードが間違っている | ログイン情報が正しくありません |
| `auth/network-request-failed` | ネットワークエラー | ネットワーク接続を確認してください |
| `permission-denied` | アクセス権限なし | この操作を実行する権限がありません |
| `not-found` | データが見つからない | 指定されたデータが見つかりません |
| `unavailable` | サービス利用不可 | サービスが一時的に利用できません |

## パフォーマンス監視

### 監視対象メトリクス

1. **ページロード時間**
   - First Contentful Paint (FCP)
   - Largest Contentful Paint (LCP)
   - Cumulative Layout Shift (CLS)

2. **API レスポンス時間**
   - Firestore クエリ時間
   - 画像アップロード時間
   - 検索レスポンス時間

3. **ユーザーエンゲージメント**
   - セッション時間
   - ページビュー数
   - 機能利用率

### パフォーマンス測定

```typescript
// 手動測定
const trace = PerformanceMonitor.startMeasure('wine_search');
try {
  const results = await wineMasterService.searchWineMasters(query);
  PerformanceMonitor.stopMeasure('wine_search', {
    query_length: query.length.toString(),
    results_count: results.length.toString()
  });
} catch (error) {
  PerformanceMonitor.stopMeasure('wine_search', { error: 'true' });
}

// 非同期操作の自動測定
const results = await PerformanceMonitor.measureAsync(
  'wine_search',
  () => wineMasterService.searchWineMasters(query),
  { query_length: query.length.toString() }
);
```

## セキュリティ

### データアクセス制御

- ユーザーは自分のデータのみアクセス可能
- ワインマスターデータは読み取り専用
- 管理者のみシステムデータを編集可能

### 入力検証

```typescript
// ワインデータの検証
const validateWineData = (data: Partial<WineMaster>): ValidationResult => {
  const errors: string[] = [];
  
  if (!data.wineName || data.wineName.trim().length < 2) {
    errors.push('ワイン名は2文字以上で入力してください');
  }
  
  if (!data.producer || data.producer.trim().length < 2) {
    errors.push('生産者名は2文字以上で入力してください');
  }
  
  if (data.vintage && (data.vintage < 1800 || data.vintage > new Date().getFullYear())) {
    errors.push('ヴィンテージが正しくありません');
  }
  
  return { isValid: errors.length === 0, errors };
};
```

### レート制限

- API呼び出し: 100回/分/ユーザー
- 画像アップロード: 10MB/ファイル、20ファイル/分
- 検索: 60回/分/ユーザー

## テスト

### サービス層のテスト

```typescript
// wineMasterService.test.ts
describe('WineMasterService', () => {
  beforeEach(() => {
    // Firebase モックセットアップ
  });

  it('should search wines by name', async () => {
    const mockWines = [{ id: '1', wineName: 'Test Wine' }];
    mockFirestore.collection.mockReturnValue({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn().mockResolvedValue({ docs: mockWines })
    });

    const results = await wineMasterService.searchWineMasters('Test');
    expect(results).toHaveLength(1);
    expect(results[0].wineName).toBe('Test Wine');
  });
});
```

## バージョニング

### API バージョン管理

- メジャーバージョン: 破壊的変更
- マイナーバージョン: 機能追加
- パッチバージョン: バグ修正

### 後方互換性

- データ構造の変更は段階的移行
- 古いAPIは少なくとも2バージョン維持
- 廃止予定機能は事前に警告

## 制限事項

### Firebase 制限

- Firestore: 1MB/ドキュメント
- Storage: 5GB/プロジェクト（無料枠）
- Authentication: 匿名認証は120日で期限切れ

### アプリケーション制限

- 画像: 10MB/ファイル、WebP推奨
- テキスト: 10,000文字/フィールド
- 検索結果: 100件/クエリ

## 変更ログ

### v1.0.0 (2024-01-15)
- 初期リリース
- ワイン記録機能
- クイズ機能
- ユーザー認証

### v1.1.0 (2024-02-01)
- オフライン対応
- エラーハンドリング改善
- パフォーマンス監視追加