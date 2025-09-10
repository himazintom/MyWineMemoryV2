import type { QuizQuestion } from '../../../../types';

// TSGトレーニング シャルドネ 続き - クイズ問題
export const studyTsg06Questions: QuizQuestion[] = [
  {
    id: 'STUDY_TSG_06_001',
    difficulty: 2,
    category: 'TSGシャルドネ地域差',
    question: '温暖な地域で栽培されたシャルドネの特徴として正しいものはどれか？',
    options: ['淡いレモン色、高い酸', '黄金色、パイナップル、バター、バニラの風味', '緑がかった色調', 'ミネラル感が強い'],
    correctAnswer: 1,
    explanation: '温暖な地域のシャルドネは黄金色で、パイナップル、バター、バニラの風味とクリーミーな質感が特徴です。'
  },
  {
    id: 'STUDY_TSG_06_002',
    difficulty: 2,
    category: 'TSGシャルドネペアリング',
    question: '温暖系シャルドネ（凝縮した紹興酒のような香り）と相性が良い料理はどれか？',
    options: ['白身魚のレモンハーブ焼き', 'ロブスターテルミドール', '寿司', 'サラダ'],
    correctAnswer: 1,
    explanation: '温暖系シャルドネはクリーミーなソース、ナッティなニュアンスの料理、ロブスターテルミドールとの相性が良いです。'
  },
  {
    id: 'STUDY_TSG_06_003',
    difficulty: 3,
    category: 'TSGシャルドネ評価',
    question: 'ソムリエコメントで使用されるCMSとは何の略か？',
    options: ['Central Management System', 'Court of Master Sommeliers', 'California Master Sommelier', 'Certified Master Series'],
    correctAnswer: 1,
    explanation: 'CMSはCourt of Master Sommeliersの略で、WSETが機械的なのに対し、より実践的なコメント手法として採用されています。'
  },
  {
    id: 'STUDY_TSG_06_004',
    difficulty: 2,
    category: 'TSGシャルドネ焼き鳥',
    question: '冷涼系シャルドネと相性が良い焼き鳥の特徴はどれか？',
    options: ['クリーミーなコクのある皮やボンジリ', '梅と合わせたもの、昆布の旨味', '甘辛いタレ', '香ばしい炭火焼き'],
    correctAnswer: 1,
    explanation: '冷涼系シャルドネは梅と合わせたものや昆布の旨味がある料理、キレのある引き締まった酸味に合います。'
  },
  {
    id: 'STUDY_TSG_06_005',
    difficulty: 3,
    category: 'TSGシャルドネ高級生産者',
    question: 'ムルソーの有名な生産者として正しいものはどれか？',
    options: ['ドメーヌ・ルフレーヴ', 'コシュ・デュリ', 'ウィリアム・フェーブル', 'ドメーヌ・ルーロ'],
    correctAnswer: 1,
    explanation: 'コシュ・デュリはムルソーで有名な生産者です。ドメーヌ・ルーロも入手困難な高級生産者として知られています。'
  },
  {
    id: 'STUDY_TSG_06_006',
    difficulty: 2,
    category: 'TSGシャルドネテイスティング',
    question: 'シャルドネの製法違いを理解する目的として最も適切なものはどれか？',
    options: ['価格を判定する', '品種の深掘りと作り手の個性理解', '産地を特定する', 'ヴィンテージを推定する'],
    correctAnswer: 1,
    explanation: '製法が異なる2種類のシャルドネを比較することで、品種の深掘りと作り手の個性を理解することが目的です。'
  },
  {
    id: 'STUDY_TSG_06_007',
    difficulty: 3,
    category: 'TSGロゼワイン',
    question: 'ロゼワインサブスクのヴィンテージ飲み比べの組み合わせはどれか？',
    options: ['2021年と2023年', '2022年と2024年', '2020年と2022年', '2023年と2025年'],
    correctAnswer: 1,
    explanation: 'ロゼワインサブスクでは2022年と2024年のヴィンテージ飲み比べが提供され、夏から秋にかけて楽しめます。'
  },
  {
    id: 'STUDY_TSG_06_008',
    difficulty: 2,
    category: 'TSGシャルドネ品種比較',
    question: 'シャルドネとソーヴィニヨン・ブランの香りの違いとして正しいものはどれか？',
    options: ['シャルドネの方がレモンっぽい', 'ソーヴィニヨン・ブランの方がレモンっぽい', '香りに違いはない', 'どちらもバターの香り'],
    correctAnswer: 1,
    explanation: 'ソーヴィニヨン・ブランの方がレモンっぽい香りが強く、シャルドネはより中性的な特徴を持ちます。'
  },
  {
    id: 'STUDY_TSG_06_009',
    difficulty: 3,
    category: 'TSGワイン知識',
    question: 'プリミティーボのシノニム（同一品種の別名）として正しいものはどれか？',
    options: ['テンプラニーロ', 'ジンファンデル', 'サンジョヴェーゼ', 'バルベーラ'],
    correctAnswer: 1,
    explanation: 'イタリアのプリミティーボとカリフォルニアのジンファンデルは同じ品種で、場所により名前が変わるシノニムの例です。'
  },
  {
    id: 'STUDY_TSG_06_010',
    difficulty: 2,
    category: 'TSGワイン学習',
    question: 'シャルドネの深掘り学習で重要な要素として適切でないものはどれか？',
    options: ['土壌・環境による違い', '作り手の個性', 'ブランド価値', '醸造方法の影響'],
    correctAnswer: 2,
    explanation: 'シャルドネはニュートラル品種なので、土壌・環境・作り手・醸造方法が重要で、ブランド価値よりも実質的な要素が大切です。'
  }
];