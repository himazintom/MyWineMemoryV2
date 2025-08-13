# MyWineMemory コンポーネントライブラリ

## 概要

本書は MyWineMemory アプリケーションで使用される再利用可能なUIコンポーネントの仕様とスタイルガイドを定義します。

## デザインシステム

### カラーパレット

#### プライマリカラー
```css
:root {
  /* ブランドカラー（ワインレッド） */
  --primary-color: #722f37;
  --primary-light: #8b4a52;
  --primary-dark: #5a252a;
  
  /* セカンダリカラー（ゴールド） */
  --secondary-color: #d4a574;
  --secondary-light: #e0b885;
  --secondary-dark: #c8955d;
  
  /* アクセントカラー */
  --accent-red: #ff6b7a;
  --accent-green: #4caf50;
  --accent-blue: #2196f3;
  --accent-orange: #ff9800;
}
```

#### グレースケール
```css
:root {
  --gray-50: #fafafa;
  --gray-100: #f5f5f5;
  --gray-200: #eeeeee;
  --gray-300: #e0e0e0;
  --gray-400: #bdbdbd;
  --gray-500: #9e9e9e;
  --gray-600: #757575;
  --gray-700: #616161;
  --gray-800: #424242;
  --gray-900: #212121;
}
```

#### セマンティックカラー
```css
:root {
  /* 成功 */
  --success-color: #4caf50;
  --success-light: #81c784;
  --success-dark: #388e3c;
  
  /* 警告 */
  --warning-color: #ff9800;
  --warning-light: #ffb74d;
  --warning-dark: #f57c00;
  
  /* エラー */
  --error-color: #f44336;
  --error-light: #e57373;
  --error-dark: #d32f2f;
  
  /* 情報 */
  --info-color: #2196f3;
  --info-light: #64b5f6;
  --info-dark: #1976d2;
}
```

### タイポグラフィ

```css
:root {
  /* フォントファミリー */
  --font-family-primary: 'Noto Sans JP', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-secondary: 'Roboto', sans-serif;
  --font-family-monospace: 'Source Code Pro', monospace;
  
  /* フォントサイズ */
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;  /* 30px */
  --font-size-4xl: 2.25rem;   /* 36px */
  
  /* フォントウェイト */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* 行間 */
  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

### スペーシング

```css
:root {
  --spacing-0: 0;
  --spacing-1: 0.25rem;   /* 4px */
  --spacing-2: 0.5rem;    /* 8px */
  --spacing-3: 0.75rem;   /* 12px */
  --spacing-4: 1rem;      /* 16px */
  --spacing-5: 1.25rem;   /* 20px */
  --spacing-6: 1.5rem;    /* 24px */
  --spacing-8: 2rem;      /* 32px */
  --spacing-10: 2.5rem;   /* 40px */
  --spacing-12: 3rem;     /* 48px */
  --spacing-16: 4rem;     /* 64px */
}
```

### ボーダーラディウス

```css
:root {
  --border-radius-sm: 0.25rem;   /* 4px */
  --border-radius-md: 0.5rem;    /* 8px */
  --border-radius-lg: 0.75rem;   /* 12px */
  --border-radius-xl: 1rem;      /* 16px */
  --border-radius-full: 9999px;  /* 完全な円形 */
}
```

### シャドウ

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
```

## 基本コンポーネント

### Button

汎用的なボタンコンポーネント。

#### Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### 使用例
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  保存
</Button>

<Button variant="outline" icon={<SearchIcon />} iconPosition="left">
  検索
</Button>

<Button variant="danger" loading disabled>
  削除中...
</Button>
```

#### スタイル
```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  border: none;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  transition: all 0.2s ease;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Variants */
.button--primary {
  background: var(--primary-color);
  color: white;
}

.button--secondary {
  background: var(--secondary-color);
  color: var(--gray-900);
}

.button--outline {
  background: transparent;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

/* Sizes */
.button--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.button--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
}

.button--lg {
  padding: var(--spacing-4) var(--spacing-6);
  font-size: var(--font-size-lg);
}
```

### Input

テキスト入力フィールド。

#### Props
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}
```

#### 使用例
```tsx
<Input
  label="ワイン名"
  placeholder="ワイン名を入力"
  value={wineName}
  onChange={setWineName}
  required
  error={errors.wineName}
  helperText="正確なワイン名を入力してください"
/>

<Input
  type="number"
  label="価格"
  prefix="¥"
  suffix="円"
  value={price}
  onChange={setPrice}
/>
```

### Card

コンテンツをカードレイアウトで表示。

#### Props
```typescript
interface CardProps {
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}
```

#### 使用例
```tsx
<Card variant="elevated" padding="md">
  <h3>ワインカード</h3>
  <p>ワインの詳細情報...</p>
</Card>
```

### Modal

モーダルダイアログ。

#### Props
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}
```

#### 使用例
```tsx
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="ワインの詳細"
  size="lg"
>
  <WineDetailContent />
</Modal>
```

## 複合コンポーネント

### WineCard

ワイン情報を表示するカード。

#### Props
```typescript
interface WineCardProps {
  wine: WineMaster;
  showRating?: boolean;
  showActions?: boolean;
  compact?: boolean;
  onClick?: (wineId: string) => void;
  onEdit?: (wineId: string) => void;
  onDelete?: (wineId: string) => void;
}
```

#### 使用例
```tsx
<WineCard
  wine={wine}
  showRating
  showActions
  onClick={handleWineClick}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### TastingRecordCard

テイスティング記録を表示するカード。

#### Props
```typescript
interface TastingRecordCardProps {
  record: TastingRecord;
  wine?: WineMaster;
  showWineInfo?: boolean;
  showActions?: boolean;
  onEdit?: (recordId: string) => void;
  onDelete?: (recordId: string) => void;
  onViewWine?: (wineId: string) => void;
}
```

### RatingDisplay

評価を視覚的に表示。

#### Props
```typescript
interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  showValue?: boolean;
  precision?: number;
}
```

#### 使用例
```tsx
<RatingDisplay
  rating={8.5}
  maxRating={10}
  size="md"
  showValue
  precision={1}
/>
```

### ImageGallery

画像ギャラリー表示。

#### Props
```typescript
interface ImageGalleryProps {
  images: string[];
  maxImages?: number;
  aspectRatio?: 'square' | '4:3' | '16:9';
  showThumbnails?: boolean;
  onImageClick?: (imageUrl: string, index: number) => void;
}
```

### SearchFilter

検索フィルターUI。

#### Props
```typescript
interface SearchFilterProps {
  filters: WineFilterOptions;
  onFiltersChange: (filters: WineFilterOptions) => void;
  suggestions?: FilterSuggestions;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}
```

## レイアウトコンポーネント

### Container

コンテンツコンテナ。

#### Props
```typescript
interface ContainerProps {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: boolean;
  centerContent?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

### Grid

グリッドレイアウト。

#### Props
```typescript
interface GridProps {
  columns?: number | 'auto' | 'auto-fit' | 'auto-fill';
  gap?: keyof typeof spacing;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
  children: React.ReactNode;
}
```

### Stack

スタックレイアウト（縦並び）。

#### Props
```typescript
interface StackProps {
  direction?: 'vertical' | 'horizontal';
  spacing?: keyof typeof spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

## フォームコンポーネント

### FormField

フォームフィールドのラッパー。

#### Props
```typescript
interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}
```

### Select

セレクトボックス。

#### Props
```typescript
interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  placeholder?: string;
  multiple?: boolean;
  searchable?: boolean;
  disabled?: boolean;
  error?: string;
  onChange?: (value: string | string[]) => void;
}

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}
```

### TagInput

タグ入力コンポーネント。

#### Props
```typescript
interface TagInputProps {
  tags: string[];
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
  allowCustomTags?: boolean;
  error?: string;
  onChange?: (tags: string[]) => void;
}
```

### DatePicker

日付選択コンポーネント。

#### Props
```typescript
interface DatePickerProps {
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
  format?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (date: Date | null) => void;
}
```

## フィードバックコンポーネント

### Toast

トースト通知。

#### Props
```typescript
interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose?: () => void;
}
```

### LoadingSpinner

ローディングスピナー。

#### Props
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  message?: string;
  overlay?: boolean;
}
```

### ErrorMessage

エラーメッセージ表示。

#### Props
```typescript
interface ErrorMessageProps {
  error: Error | string;
  retryButton?: boolean;
  onRetry?: () => void;
  className?: string;
}
```

### EmptyState

空の状態表示。

#### Props
```typescript
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## ナビゲーションコンポーネント

### BottomNavigation

下部ナビゲーション。

#### Props
```typescript
interface BottomNavigationProps {
  items: NavigationItem[];
  activeIndex: number;
  onChange: (index: number) => void;
}

interface NavigationItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  badge?: number;
}
```

### Breadcrumb

パンくずナビゲーション。

#### Props
```typescript
interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  path?: string;
  current?: boolean;
}
```

### Tabs

タブナビゲーション。

#### Props
```typescript
interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}
```

## データ表示コンポーネント

### Table

データテーブル。

#### Props
```typescript
interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  sortable?: boolean;
  selectable?: boolean;
  pagination?: PaginationConfig;
  loading?: boolean;
  emptyMessage?: string;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  onSelect?: (selectedRows: T[]) => void;
}

interface TableColumn<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}
```

### Chart

チャート表示（Chart.js ラッパー）。

#### Props
```typescript
interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar';
  data: ChartData;
  options?: ChartOptions;
  height?: number;
  responsive?: boolean;
}
```

### StatCard

統計カード。

#### Props
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period?: string;
  };
  icon?: React.ReactNode;
  color?: string;
  onClick?: () => void;
}
```

## ユーティリティコンポーネント

### Portal

ポータル（DOM外レンダリング）。

#### Props
```typescript
interface PortalProps {
  children: React.ReactNode;
  container?: Element;
}
```

### Transition

トランジション効果。

#### Props
```typescript
interface TransitionProps {
  show: boolean;
  appear?: boolean;
  enter?: string;
  enterFrom?: string;
  enterTo?: string;
  leave?: string;
  leaveFrom?: string;
  leaveTo?: string;
  children: React.ReactNode;
}
```

### MediaQuery

レスポンシブ表示制御。

#### Props
```typescript
interface MediaQueryProps {
  query: string;
  children: React.ReactNode;
}
```

#### 使用例
```tsx
<MediaQuery query="(min-width: 768px)">
  <DesktopComponent />
</MediaQuery>

<MediaQuery query="(max-width: 767px)">
  <MobileComponent />
</MediaQuery>
```

## アクセシビリティ

### 基本原則

1. **キーボードナビゲーション**
   - すべてのインタラクティブ要素がキーボードでアクセス可能
   - 適切なタブオーダー
   - フォーカス表示

2. **スクリーンリーダー対応**
   - 適切なARIAラベル
   - セマンティックHTML
   - 代替テキスト

3. **色とコントラスト**
   - WCAG AA準拠のコントラスト比
   - 色のみに依存しない情報表示

4. **レスポンシブデザイン**
   - モバイル優先設計
   - タッチフレンドリーなサイズ

### 実装例

```tsx
// ボタンのアクセシビリティ
<button
  aria-label="ワインを削除"
  aria-describedby="delete-help"
  disabled={loading}
  onClick={handleDelete}
>
  <DeleteIcon aria-hidden="true" />
  削除
</button>
<div id="delete-help" className="sr-only">
  この操作は取り消せません
</div>

// フォームのアクセシビリティ
<label htmlFor="wine-name">
  ワイン名 <span aria-label="必須">*</span>
</label>
<input
  id="wine-name"
  type="text"
  required
  aria-describedby="wine-name-error"
  aria-invalid={!!errors.wineName}
/>
{errors.wineName && (
  <div id="wine-name-error" role="alert">
    {errors.wineName}
  </div>
)}
```

## テストガイドライン

### コンポーネントテスト

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should be disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### ビジュアルテスト

```typescript
// Button.stories.tsx (Storybook)
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading...',
  },
};
```

## パフォーマンス最適化

### React.memo の使用

```tsx
import React, { memo } from 'react';

interface WineCardProps {
  wine: WineMaster;
  onClick: (wineId: string) => void;
}

export const WineCard = memo(({ wine, onClick }: WineCardProps) => {
  return (
    <div onClick={() => onClick(wine.id)}>
      {wine.wineName}
    </div>
  );
});
```

### 遅延読み込み

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 画像最適化

```tsx
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const OptimizedImage = ({ src, alt, ...props }: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};
```

## スタイリング規約

### CSS クラス命名規則

BEM（Block Element Modifier）を採用：

```css
/* Block */
.wine-card { }

/* Element */
.wine-card__title { }
.wine-card__rating { }
.wine-card__actions { }

/* Modifier */
.wine-card--featured { }
.wine-card--compact { }
.wine-card__title--large { }
```

### CSS カスタムプロパティの使用

```css
.wine-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);
}
```

### レスポンシブデザイン

```css
/* モバイルファースト */
.wine-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-4);
}

/* タブレット */
@media (min-width: 768px) {
  .wine-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .wine-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

## 今後の拡張予定

### 追加予定コンポーネント

1. **DataVisualization**
   - 高度なチャートコンポーネント
   - ワイン評価の視覚化

2. **VirtualizedList**
   - 大量データの効率的表示
   - 無限スクロール対応

3. **DragAndDrop**
   - ファイルアップロード
   - リスト並び替え

4. **RichTextEditor**
   - ワインノート用エディタ
   - マークダウン対応

### テーマシステム拡張

```typescript
interface ThemeConfig {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  breakpoints: BreakpointScale;
  components: ComponentThemes;
}
```

この仕様書により、一貫性のあるUIコンポーネントの開発と保守が可能になります。