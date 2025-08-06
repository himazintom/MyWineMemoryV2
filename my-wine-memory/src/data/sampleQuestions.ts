import type { QuizQuestion } from '../types';

// サンプルクイズ問題（実際は1000問必要）
export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 難易度1: 入門編
  {
    id: 'basic_001',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'シャンパーニュはどこの国の地域名ですか？',
    options: ['フランス', 'イタリア', 'スペイン', 'ドイツ'],
    correctAnswer: 0,
    explanation: 'シャンパーニュはフランス北東部の地域で、この地域で作られたスパークリングワインのみがシャンパーニュと名乗ることができます。'
  },
  {
    id: 'basic_002',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの主な原料は何ですか？',
    options: ['米', 'ブドウ', '麦', 'イモ'],
    correctAnswer: 1,
    explanation: 'ワインはブドウを発酵させて作られるアルコール飲料です。'
  },
  {
    id: 'basic_003',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '赤ワインと白ワインの主な違いは何ですか？',
    options: ['ブドウの品種', 'ブドウの皮を取り除くタイミング', '発酵温度', 'アルコール度数'],
    correctAnswer: 1,
    explanation: '赤ワインは皮と一緒に発酵させることで色と渋みを抽出し、白ワインは皮を早めに取り除いて発酵させます。'
  },

  // 難易度2: 初級編
  {
    id: 'basic_101',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'カベルネ・ソーヴィニヨンはどんなタイプのワインに使われる品種ですか？',
    options: ['赤ワイン', '白ワイン', 'ロゼワイン', 'スパークリングワイン'],
    correctAnswer: 0,
    explanation: 'カベルネ・ソーヴィニヨンは世界で最も栽培されている黒ブドウ品種の一つで、主に赤ワインに使用されます。'
  },
  {
    id: 'basic_102',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ボルドーワインで有名な「五大シャトー」に含まれないのはどれですか？',
    options: ['シャトー・ラフィット', 'シャトー・マルゴー', 'シャトー・ペトリュス', 'シャトー・ムートン'],
    correctAnswer: 2,
    explanation: 'シャトー・ペトリュスは右岸のポムロールにある名醸造所ですが、五大シャトーには含まれません。五大シャトーは左岸のメドック地区にあります。'
  },

  // 難易度3: 中級編
  {
    id: 'inter_001',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ボディ」とは主に何を表現する言葉ですか？',
    options: ['色の濃さ', '香りの強さ', '口当たりの重厚感', 'アルコール度数'],
    correctAnswer: 2,
    explanation: 'ボディはワインの口当たりの重厚感や濃厚さを表現する言葉で、ライトボディからフルボディまで段階があります。'
  },
  {
    id: 'inter_002',
    difficulty: 3,
    category: '醸造',
    question: 'マロラクティック発酵の効果として正しいのはどれですか？',
    options: ['アルコール度数が上がる', '酸味がまろやかになる', '色が濃くなる', '泡が生まれる'],
    correctAnswer: 1,
    explanation: 'マロラクティック発酵は尖ったリンゴ酸をまろやかな乳酸に変換する発酵で、ワインの酸味を和らげます。'
  },

  // 難易度4: 上級編
  {
    id: 'adv_001',
    difficulty: 4,
    category: '土壌・テロワール',
    question: 'シャブリの特徴的な土壌は何ですか？',
    options: ['花崗岩', 'キンメリジャン', 'シスト', '火山岩'],
    correctAnswer: 1,
    explanation: 'シャブリの特徴的なミネラル感は、古代の海底に堆積したキンメリジャン土壌によるものとされています。'
  },
  {
    id: 'adv_002',
    difficulty: 4,
    category: '法規・格付け',
    question: 'フランスワインのAOCで最も上位の格付けは何ですか？',
    options: ['AOC', 'AOP', 'Grand Cru', 'Premier Cru'],
    correctAnswer: 1,
    explanation: '2009年からAOCはAOP（Appellation d\'Origine Protégée）に名称変更され、EU統一規格となりました。'
  },

  // 難易度5: 仙人編
  {
    id: 'master_001',
    difficulty: 5,
    category: 'ヴィンテージ',
    question: '1947年のシャトー・ディケムが伝説的とされる理由は何ですか？',
    options: ['戦後初のヴィンテージ', '収穫量が極めて少なかった', '貴腐菌が完璧に付いた', '創始者が亡くなった年'],
    correctAnswer: 2,
    explanation: '1947年は貴腐菌の付着が完璧で、極上の甘口ワインが生まれた伝説的なヴィンテージです。'
  }
];

export const getQuestionsByDifficulty = (difficulty: number): QuizQuestion[] => {
  return SAMPLE_QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty);
};

export const getRandomQuestions = (difficulty: number, count: number): QuizQuestion[] => {
  const questions = getQuestionsByDifficulty(difficulty);
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};