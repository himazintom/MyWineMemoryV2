import type { QuizQuestion } from '../../../../types';

// TSGトレーニング 酸化防止剤とは - クイズ問題
export const studyTsg03Questions: QuizQuestion[] = [
  {
    id: 'STUDY_TSG_03_001',
    difficulty: 1,
    category: 'TSG酸化防止剤',
    question: 'ワインの酸化防止剤として使用される主要な成分は何か？',
    options: ['アルコール', '亜硫酸塩（SO2）', 'クエン酸', 'タンニン'],
    correctAnswer: 1,
    explanation: 'ワインの酸化防止剤として亜硫酸塩（SO2）が使用されており、これは硫黄化合物です。'
  },
  {
    id: 'STUDY_TSG_03_002',
    difficulty: 2,
    category: 'TSG酸化防止剤',
    question: '酸化防止剤の使用歴史として正しいものはどれか？',
    options: ['20世紀から使用開始', '古代ローマ時代から2000年以上使用', '19世紀から使用開始', '現代になって使用開始'],
    correctAnswer: 1,
    explanation: '酸化防止剤は古代ローマ時代から2000年以上使用されており、現代では厳格な摂取基準により健康被害はほとんどありません。'
  },
  {
    id: 'STUDY_TSG_03_003',
    difficulty: 2,
    category: 'TSGナチュラルワイン',
    question: 'ナチュラルワイン（ヴァン・ナチュール）の定義として正しくないものはどれか？',
    options: ['極力/全く農薬不使用栽培', '酸化防止剤を極力/全く使用しない', '必ず高価である', '有機栽培・ビオディナミ農法含む'],
    correctAnswer: 2,
    explanation: 'ナチュラルワインは農薬不使用栽培と酸化防止剤の不使用/極力使用しないことが特徴ですが、必ずしも高価とは限りません。'
  },
  {
    id: 'STUDY_TSG_03_004',
    difficulty: 3,
    category: 'TSGナチュラルワイン',
    question: 'ナチュラルワインの外観で特徴的なものはどれか？',
    options: ['透明で輝きがある', '濁りあり（無ろ過・無清澄）', '濃い色調', '泡がある'],
    correctAnswer: 1,
    explanation: 'ナチュラルワインは無ろ過・無清澄で造られるため、濁りがあることが特徴的です。'
  },
  {
    id: 'STUDY_TSG_03_005',
    difficulty: 3,
    category: 'TSGナチュラルワイン',
    question: 'ナチュラルワインで酸化防止剤の代わりに使われる天然の酸化防止方法はどれか？',
    options: ['高温殺菌', '澱（オリ）の活用', '長期熟成', '高アルコール度数'],
    correctAnswer: 1,
    explanation: 'ナチュラルワインでは澱（オリ）を天然の酸化防止剤として活用し、低pH維持や嫌気的醸造により酸化を防ぎます。'
  },
  {
    id: 'STUDY_TSG_03_006',
    difficulty: 2,
    category: 'TSG酸化防止剤',
    question: '酸化防止剤を使用しないワインで起こりうる問題として正しいものはどれか？',
    options: ['アルコール度数が下がる', '不快な香り（酢、ぬか漬け様）の発生', '色が薄くなる', '甘味が増す'],
    correctAnswer: 1,
    explanation: '酸化防止剤を使用しないと、酢酸菌やアセトアルデヒドにより酢やぬか漬け、動物の糞のような不快な香りが発生する可能性があります。'
  },
  {
    id: 'STUDY_TSG_03_007',
    difficulty: 2,
    category: 'TSG酸化防止剤',
    question: 'ワインを飲んだ後の頭痛の主な原因として正しいものはどれか？',
    options: ['酸化防止剤', '飲みすぎ・高アルコール度数', 'タンニン', '酸味'],
    correctAnswer: 1,
    explanation: 'ワインによる頭痛の主な原因は飲みすぎや高アルコール度数であり、酸化防止剤が原因ではありません。'
  },
  {
    id: 'STUDY_TSG_03_008',
    difficulty: 3,
    category: 'TSGペアリング応用',
    question: 'ナパワインと相性が良い肉料理の味付けはどれか？',
    options: ['複雑なソース', '塩胡椒でシンプルに', '醤油ベース', 'スパイシーな味付け'],
    correctAnswer: 1,
    explanation: 'ナパワインは塩胡椒でシンプルに味付けした肉料理との相性が良く、ワインの果実味を引き立てます。'
  },
  {
    id: 'STUDY_TSG_03_009',
    difficulty: 2,
    category: 'TSGペアリング応用',
    question: '低pHワインと相性が良い料理の特徴はどれか？',
    options: ['甘い料理', 'レモンをかける料理', 'クリーミーな料理', 'スパイシーな料理'],
    correctAnswer: 1,
    explanation: '低pHワインは酸味が強いため、唐揚げやムニエルなどレモンをかける料理との相性が良いです。'
  },
  {
    id: 'STUDY_TSG_03_010',
    difficulty: 2,
    category: 'TSGワイン保存',
    question: '高価/古いワインの最適な保存場所はどこか？',
    options: ['常温の暗い場所', '冷蔵庫の野菜室', '冷凍庫', '直射日光の当たる場所'],
    correctAnswer: 1,
    explanation: '高価/古いワインは冷蔵庫の野菜室が最適で、その他のワインは飲む3時間前に冷やし、飲む前に常温に戻すのが良いです。'
  }
];