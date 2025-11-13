# Design Tokens & Styling System

このディレクトリには、MyWineMemoryアプリの統一されたデザインシステムが含まれています。

## 📁 構成

```
styles/
├── tokens/                  # デザイントークン（値の定義）
│   ├── colors.ts           # カラーパレット
│   ├── spacing.ts          # スペーシング（8pxベースライングリッド）
│   ├── shadows.ts          # シャドウ（エレベーションシステム）
│   ├── typography.ts       # タイポグラフィ
│   ├── transitions.ts      # トランジション・アニメーション
│   ├── borderRadius.ts     # ボーダー半径
│   └── index.ts            # 統合エクスポート
└── variables.css           # CSS変数（トークンのCSS版）
```

## 🎨 使用方法

### TypeScript/Reactでの使用

```typescript
import { colors, spacing, shadows } from '@/styles/tokens';

// 例: インラインスタイル
<div style={{
  color: colors.primary.main,
  padding: spacing.md,
  boxShadow: shadows.light.md
}}>
```

### CSS/SCSSでの使用

```css
/* variables.cssが自動的にインポートされます（App.css経由） */

.my-component {
  /* 新しいトークンを使用（推奨） */
  color: var(--color-primary-main);
  padding: var(--space-md);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-card);
  transition: var(--transition-base);
}

/* レガシー変数（非推奨、移行中） */
.legacy-component {
  color: var(--primary-color);  /* ⚠️ 将来削除予定 */
  background: var(--card-bg);   /* ⚠️ 代わりに --bg-card を使用 */
}
```

## 📐 デザイントークンの原則

### 1. **カラーシステム**
- **WCAG AA準拠**: すべての色の組み合わせでコントラスト比4.5:1以上を保証
- **セマンティック命名**: `primary`, `success`, `error`, `warning`, `info`
- **ライト/ダークテーマ対応**: 自動的にテーマ切り替えに対応

### 2. **スペーシング**
- **8pxベースライングリッド**: すべての間隔は8pxの倍数
- **一貫性**: `xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `xxxl`

### 3. **シャドウ（エレベーション）**
- **マテリアルデザイン準拠**: 6段階のエレベーション
- **ホバー状態**: 専用のホバーシャドウ

### 4. **タイポグラフィ**
- **システムフォント**: パフォーマンス最適化
- **スケーリング**: 12px〜48pxの9段階

## 🔄 移行ガイド

既存のCSSから新しいトークンへの移行：

| 古い変数 | 新しい変数 | 説明 |
|---------|----------|------|
| `--primary-color` | `--color-primary-main` | プライマリカラー |
| `--card-bg` | `--bg-card` | カード背景 |
| `--text-primary` | `--text-primary` | 変更なし |
| `12px` | `var(--space-sm)` | スペーシング |
| `0.2s ease` | `var(--transition-base)` | トランジション |

## 🎯 ベストプラクティス

### ✅ 良い例

```css
.wine-card {
  background: var(--bg-card);
  padding: var(--padding-md);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.wine-card:hover {
  box-shadow: var(--shadow-hover-md);
  transform: translateY(-2px);
}
```

### ❌ 悪い例

```css
.wine-card {
  background: #ffffff;           /* ハードコード */
  padding: 16px;                /* マジックナンバー */
  border-radius: 12px;          /* マジックナンバー */
  box-shadow: 0 4px 8px rgba(0,0,0,0.1); /* ハードコード */
  transition: all 0.2s ease;    /* ハードコード */
}
```

## 🌗 テーマ対応

すべてのトークンは自動的にライト/ダークテーマに対応します：

```css
/* 自動的にテーマに応じて値が変わります */
.component {
  background: var(--bg-primary);    /* ライト: #FFF8E1, ダーク: #1a1a1a */
  color: var(--text-primary);       /* ライト: #1a1a1a, ダーク: #ffffff */
}
```

## ♿ アクセシビリティ

- **色コントラスト**: すべてWCAG AA準拠
- **ハイコントラストモード**: `@media (prefers-contrast: high)` 対応
- **モーション低減**: `@media (prefers-reduced-motion)` 対応

## 📝 今後の予定

- [ ] CSS Modulesへの完全移行
- [ ] Styled Componentsサポート
- [ ] Figmaデザイントークンとの同期
- [ ] レガシー変数の完全削除

## 🤝 貢献

新しいトークンを追加する際は：
1. `tokens/` ディレクトリに適切なファイルを編集
2. `variables.css` に対応するCSS変数を追加
3. このREADMEを更新
4. レビューをリクエスト
