import type { QuizQuestion } from '../../types';

// レベル定義
export const QUIZ_LEVELS = [
  // 学習資料ベースのレベル（優先表示）
  { level: 1, name: 'ワイン入門講座', description: 'ワイン概論から各産地まで' },
  { level: 2, name: 'テイスティング入門基礎', description: '基礎的なテイスティング技法' },
  { level: 3, name: 'テイスティング入門発展', description: '上級テイスティング技法' },
  { level: 4, name: 'ワインペアリング入門', description: 'ペアリングの基本と応用' },
  { level: 5, name: 'スパークリングワイン入門', description: 'スパークリングの基本と楽しみ方' },
  { level: 6, name: 'TSGトレーニング', description: '品種解説と実践トレーニング' },
  // 既存のレベル
  { level: 7, name: 'ワインの基本', description: '赤・白・ロゼ・スパークリング' },
  { level: 8, name: '主要ブドウ品種', description: '国際品種中心' },
  { level: 9, name: '基本的なテイスティング技法', description: 'テイスティングの基礎' },
  { level: 10, name: 'ワインサービスとマナー', description: 'サービスの基本' },
  { level: 11, name: '基本的なフードペアリング', description: '料理との相性' },
  { level: 12, name: 'フランスワイン基礎', description: '主要産地' },
  { level: 13, name: 'イタリア・ドイツ・スペインワイン', description: '欧州三大産地' },
  { level: 14, name: '新世界ワイン', description: 'アメリカ・オーストラリア等' },
  { level: 15, name: 'ワイン製造技術詳細', description: '醸造プロセス' },
  { level: 16, name: 'ヴィンテージと熟成', description: '年代と熟成' },
  { level: 17, name: 'フランス各地方詳細', description: 'ボルドー・ブルゴーニュ' },
  { level: 18, name: '世界各国のワイン法規制', description: '法律と規制' },
  { level: 19, name: 'プロテイスティング・ブラインド技法', description: '上級テイスティング' },
  { level: 20, name: '稀少品種・マイナー産地', description: '珍しい品種と産地' },
  { level: 21, name: 'ワインビジネス・流通', description: 'ビジネス側面' },
  { level: 22, name: '歴史的ヴィンテージ・伝説的ワイン', description: '歴史と伝説' },
  { level: 23, name: '最新醸造技術・イノベーション', description: '技術革新' },
  { level: 24, name: 'ワイン投資・ビジネス理論', description: '投資と経営' },
  { level: 25, name: '総合酒類知識', description: '日本酒・ウイスキー等' },
  { level: 26, name: 'ワイン哲学・心理学・文化論', description: '文化と心理' },
] as const;

// 動的インポート用のマップ
const levelImportMap: Record<number, () => Promise<{ default: QuizQuestion[] }>> = {
  // 学習資料ベースのレベル (1-6)
  1: async () => {
    // ワイン入門講座シリーズを統合
    const [
      m01, m02, m03, m04, m05, m06, m07, m08,
      m09, m10, m11, m12, m13, m14, m15
    ] = await Promise.all([
      import('./study/data/study-wine-intro-01'),
      import('./study/data/study-wine-intro-02'),
      import('./study/data/study-wine-intro-03'),
      import('./study/data/study-wine-intro-04'),
      import('./study/data/study-wine-intro-05'),
      import('./study/data/study-wine-intro-06'),
      import('./study/data/study-wine-intro-07'),
      import('./study/data/study-wine-intro-08'),
      import('./study/data/study-wine-intro-09'),
      import('./study/data/study-wine-intro-10'),
      import('./study/data/study-wine-intro-11'),
      import('./study/data/study-wine-intro-12'),
      import('./study/data/study-wine-intro-13'),
      import('./study/data/study-wine-intro-14'),
      import('./study/data/study-wine-intro-15'),
    ]);
    const questions = [
      ...m01.studyWineIntro01Questions,
      ...m02.studyWineIntro02Questions,
      ...m03.studyWineIntro03Questions,
      ...m04.studyWineIntro04Questions,
      ...m05.studyWineIntro05Questions,
      ...m06.studyWineIntro06Questions,
      ...m07.studyWineIntro07Questions,
      ...m08.studyWineIntro08Questions,
      ...m09.studyWineIntro09Questions,
      ...m10.studyWineIntro10Questions,
      ...m11.studyWineIntro11Questions,
      ...m12.studyWineIntro12Questions,
      ...m13.studyWineIntro13Questions,
      ...m14.studyWineIntro14Questions,
      ...m15.studyWineIntro15Questions,
    ];
    return { default: questions };
  },
  2: async () => {
    // テイスティング入門基礎シリーズ
    const [m01, m02, m03, m04, m05] = await Promise.all([
      import('./study/data/study-tasting-basic-01'),
      import('./study/data/study-tasting-basic-02'),
      import('./study/data/study-tasting-basic-03'),
      import('./study/data/study-tasting-basic-04'),
      import('./study/data/study-tasting-basic-05'),
    ]);
    const questions = [
      ...m01.studyTastingBasic01Questions,
      ...m02.studyTastingBasic02Questions,
      ...m03.studyTastingBasic03Questions,
      ...m04.studyTastingBasic04Questions,
      ...m05.studyTastingBasic05Questions,
    ];
    return { default: questions };
  },
  3: async () => {
    // テイスティング入門発展シリーズ
    const [m01, m02, m03, m04, m05, m06] = await Promise.all([
      import('./study/data/study-tasting-advanced-01'),
      import('./study/data/study-tasting-advanced-02'),
      import('./study/data/study-tasting-advanced-03'),
      import('./study/data/study-tasting-advanced-04'),
      import('./study/data/study-tasting-advanced-05'),
      import('./study/data/study-tasting-advanced-06'),
    ]);
    const questions = [
      ...m01.studyTastingAdvanced01Questions,
      ...m02.studyTastingAdvanced02Questions,
      ...m03.studyTastingAdvanced03Questions,
      ...m04.studyTastingAdvanced04Questions,
      ...m05.studyTastingAdvanced05Questions,
      ...m06.studyTastingAdvanced06Questions,
    ];
    return { default: questions };
  },
  4: async () => {
    // ペアリング入門シリーズ
    const [m01, m02, m03] = await Promise.all([
      import('./study/data/study-pairing-01'),
      import('./study/data/study-pairing-02'),
      import('./study/data/study-pairing-03'),
    ]);
    const questions = [
      ...m01.studyPairing01Questions,
      ...m02.studyPairing02Questions,
      ...m03.studyPairing03Questions,
    ];
    return { default: questions };
  },
  5: async () => {
    // スパークリングワイン入門シリーズ
    const [m01, m02, m03] = await Promise.all([
      import('./study/data/study-sparkling-01'),
      import('./study/data/study-sparkling-02'),
      import('./study/data/study-sparkling-03'),
    ]);
    const questions = [
      ...m01.studySparkling01Questions,
      ...m02.studySparkling02Questions,
      ...m03.studySparkling03Questions,
    ];
    return { default: questions };
  },
  6: async () => {
    // TSGトレーニングシリーズ
    const [m01, m02, m03, m04, m05, m06, m07] = await Promise.all([
      import('./study/data/study-tsg-01'),
      import('./study/data/study-tsg-02'),
      import('./study/data/study-tsg-03'),
      import('./study/data/study-tsg-04'),
      import('./study/data/study-tsg-05'),
      import('./study/data/study-tsg-06'),
      import('./study/data/study-tsg-07'),
    ]);
    const questions = [
      ...m01.studyTsg01Questions,
      ...m02.studyTsg02Questions,
      ...m03.studyTsg03Questions,
      ...m04.studyTsg04Questions,
      ...m05.studyTsg05Questions,
      ...m06.studyTsg06Questions,
      ...m07.studyTsg07Questions,
    ];
    return { default: questions };
  },
  // 既存のレベル (7-26)
  7: async () => {
    const { level01Questions } = await import('./levels/level01-basic');
    return { default: level01Questions };
  },
  8: async () => {
    const { level02Questions } = await import('./levels/level02-grapes');
    return { default: level02Questions };
  },
  9: async () => {
    const { level03Questions } = await import('./levels/level03-tasting');
    return { default: level03Questions };
  },
  10: async () => {
    const { level04Questions } = await import('./levels/level04-service');
    return { default: level04Questions };
  },
  11: async () => {
    const { level05Questions } = await import('./levels/level05-pairing');
    return { default: level05Questions };
  },
  12: async () => {
    const { level06Questions } = await import('./levels/level06-france');
    return { default: level06Questions };
  },
  13: async () => {
    const { level07Questions } = await import('./levels/level07-europe');
    return { default: level07Questions };
  },
  14: async () => {
    const { level08Questions } = await import('./levels/level08-newworld');
    return { default: level08Questions };
  },
  15: async () => {
    const { level09Questions } = await import('./levels/level09-production');
    return { default: level09Questions };
  },
  16: async () => {
    const { level10Questions } = await import('./levels/level10-vintage');
    return { default: level10Questions };
  },
  17: async () => {
    const { level11Questions } = await import('./levels/level11-france-detail');
    return { default: level11Questions };
  },
  18: async () => {
    const { level12Questions } = await import('./levels/level12-regulations');
    return { default: level12Questions };
  },
  19: async () => {
    const { level13Questions } = await import('./levels/level13-pro-tasting');
    return { default: level13Questions };
  },
  20: async () => {
    const { level14Questions } = await import('./levels/level14-rare');
    return { default: level14Questions };
  },
  21: async () => {
    const { level15Questions } = await import('./levels/level15-business');
    return { default: level15Questions };
  },
  22: async () => {
    const { level16Questions } = await import('./levels/level16-history');
    return { default: level16Questions };
  },
  23: async () => {
    const { level17Questions } = await import('./levels/level17-innovation');
    return { default: level17Questions };
  },
  24: async () => {
    const { level18Questions } = await import('./levels/level18-investment');
    return { default: level18Questions };
  },
  25: async () => {
    const { level19Questions } = await import('./levels/level19-spirits');
    return { default: level19Questions };
  },
  26: async () => {
    const { level20Questions } = await import('./levels/level20-philosophy');
    return { default: level20Questions };
  },
};

// キャッシュ用
const questionCache: Map<number, QuizQuestion[]> = new Map();

/**
 * 指定レベルの問題を動的に読み込む
 * @param level レベル番号 (1-26)
 * @returns 問題配列
 */
export async function loadQuestionsByLevel(level: number): Promise<QuizQuestion[]> {
  console.log(`[loadQuestionsByLevel] Attempting to load level ${level}`);

  // キャッシュチェック
  if (questionCache.has(level)) {
    console.log(`[loadQuestionsByLevel] Returning cached questions for level ${level}`);
    return questionCache.get(level)!;
  }

  // 動的インポート
  const importer = levelImportMap[level];
  if (!importer) {
    console.warn(`[loadQuestionsByLevel] Level ${level} not found in levelImportMap, returning empty array`);
    console.log(`[loadQuestionsByLevel] Available levels:`, Object.keys(levelImportMap));
    return [];
  }

  try {
    console.log(`[loadQuestionsByLevel] Importing questions for level ${level}`);
    const module = await importer();
    const questions = module.default;

    console.log(`[loadQuestionsByLevel] Successfully loaded ${questions?.length || 0} questions for level ${level}`);

    // キャッシュに保存
    questionCache.set(level, questions);

    return questions;
  } catch (error) {
    console.error(`[loadQuestionsByLevel] Failed to load level ${level}:`, error);
    return [];
  }
}

/**
 * 複数レベルの問題を読み込む
 * @param levels レベル番号の配列
 * @returns 統合された問題配列
 */
export async function loadQuestionsByLevels(levels: number[]): Promise<QuizQuestion[]> {
  const allQuestions = await Promise.all(
    levels.map(level => loadQuestionsByLevel(level))
  );
  
  return allQuestions.flat();
}

/**
 * 指定難易度範囲の問題を読み込む
 * @param minLevel 最小レベル
 * @param maxLevel 最大レベル
 * @returns 統合された問題配列
 */
export async function loadQuestionsByRange(
  minLevel: number,
  maxLevel: number
): Promise<QuizQuestion[]> {
  const levels = Array.from(
    { length: maxLevel - minLevel + 1 },
    (_, i) => minLevel + i
  );
  
  return loadQuestionsByLevels(levels);
}

/**
 * キャッシュをクリア
 */
export function clearQuestionCache(): void {
  questionCache.clear();
}

// 後方互換性のため、既存コンポーネント用のエクスポート
// 初期は空配列、必要に応じて動的に読み込む
export let SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [];

// 初期化関数（アプリ起動時に呼ぶ）
export async function initializeQuizQuestions(): Promise<void> {
  // 最初はレベル1のみ読み込む（初心者向け）
  SAMPLE_QUIZ_QUESTIONS = await loadQuestionsByLevel(1);
}