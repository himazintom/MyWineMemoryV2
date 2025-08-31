const fs = require('fs');
const path = require('path');

// 主要ファイルのリスト（重要度順）
const coreFiles = [
  // アーキテクチャの中核
  'my-wine-memory/src/App.tsx',
  'my-wine-memory/src/main.tsx',
  'my-wine-memory/src/types/index.ts',
  
  // Firebase設定
  'my-wine-memory/src/services/firebase.ts',
  
  // データサービス層
  'my-wine-memory/src/services/wineMasterService.ts',
  'my-wine-memory/src/services/tastingRecordService.ts',
  'my-wine-memory/src/services/userService.ts',
  'my-wine-memory/src/services/gamificationService.ts',
  'my-wine-memory/src/services/badgeService.ts',
  'my-wine-memory/src/services/advancedQuizService.ts',
  'my-wine-memory/src/services/notificationService.ts',
  
  // Context/状態管理
  'my-wine-memory/src/contexts/AuthContext.tsx',
  'my-wine-memory/src/contexts/ThemeContext.tsx',
  
  // 主要ページコンポーネント
  'my-wine-memory/src/pages/Home.tsx',
  'my-wine-memory/src/pages/SelectWine.tsx',
  'my-wine-memory/src/pages/AddTastingRecord.tsx',
  'my-wine-memory/src/pages/Records.tsx',
  'my-wine-memory/src/pages/WineDetail.tsx',
  'my-wine-memory/src/pages/Quiz.tsx',
  'my-wine-memory/src/pages/QuizGame.tsx',
  'my-wine-memory/src/pages/Profile.tsx',
  
  // カスタムフック
  'my-wine-memory/src/hooks/useAsyncOperation.ts',
  'my-wine-memory/src/hooks/useAutoSave.ts',
  'my-wine-memory/src/hooks/useOfflineSync.ts',
  
  // 主要コンポーネント
  'my-wine-memory/src/components/WineCard.tsx',
  'my-wine-memory/src/components/BottomNavigation.tsx',
  'my-wine-memory/src/components/BadgeDisplay.tsx',
];

let markdown = `# MyWineMemory コードレビュー用ドキュメント

生成日時: ${new Date().toLocaleString('ja-JP')}

## 目次

`;

// 目次を生成
coreFiles.forEach((file, index) => {
  const fileName = path.basename(file);
  markdown += `${index + 1}. [${fileName}](#${fileName.toLowerCase().replace(/\./g, '')})\n`;
});

markdown += '\n---\n\n';

// 各ファイルの内容を追加
coreFiles.forEach((filePath) => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    const fileName = path.basename(filePath);
    const language = path.extname(filePath).slice(1);
    
    markdown += `## ${fileName}\n\n`;
    markdown += `**パス**: \`${filePath}\`\n\n`;
    markdown += `\`\`\`${language}\n`;
    markdown += content;
    markdown += `\n\`\`\`\n\n`;
    markdown += '---\n\n';
    
    console.log(`✓ ${fileName} を追加しました`);
  } else {
    console.log(`✗ ${filePath} が見つかりません`);
  }
});

// Markdownファイルを保存
const outputPath = path.join(__dirname, 'code-review.md');
fs.writeFileSync(outputPath, markdown);

console.log(`\n✅ code-review.md を生成しました (${coreFiles.length} ファイル)`);
console.log(`\nMarkdownをPDFに変換するには以下のコマンドを実行してください:`);
console.log(`\n1. Pandocを使用:`);
console.log(`   pandoc code-review.md -o code-review.pdf --pdf-engine=xelatex -V documentclass=ltjarticle -V geometry:margin=1in`);
console.log(`\n2. VSCode拡張機能 "Markdown PDF" を使用:`);
console.log(`   VSCodeでcode-review.mdを開き、Ctrl+Shift+P → "Markdown PDF: Export (pdf)"`);
console.log(`\n3. オンラインツールを使用:`);
console.log(`   https://www.markdowntopdf.com/`);