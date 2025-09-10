import type { QuizQuestion } from '../../../../types';

// ワイン入門 #10 フランス各論 シャンパーニュ - クイズ問題
export const studyWineIntro10Questions: QuizQuestion[] = [
  {
    id: 'STUDY_WINE_INTRO_10_001',
    difficulty: 1,
    category: 'シャンパーニュ',
    question: 'シャンパーニュの位置として正しいものは？',
    options: ['フランス最南のAOC産地', 'フランス最北のAOC産地', 'フランス中央部', 'フランス東部'],
    correctAnswer: 1,
    explanation: 'シャンパーニュはフランス最北のAOC産地で、北緯48～49度に位置します。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_002',
    difficulty: 2,
    category: 'シャンパーニュ',
    question: 'シャンパーニュの特徴的な土壌は？',
    options: ['花崗岩', '白亜質（チョーク土壌）', '砂岩', '粘土'],
    correctAnswer: 1,
    explanation: '白亜質（チョーク土壌）が水はけを良くし、繊細で複雑なワインを生みます。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_003',
    difficulty: 2,
    category: 'シャンパーニュ',
    question: 'シャンパーニュの主要3品種として正しい組み合わせは？',
    options: ['シャルドネ、ピノ・ノワール、メルロー', 'シャルドネ、ピノ・ノワール、ムニエ', 'シャルドネ、カベルネ・ソーヴィニヨン、ピノ・ノワール', 'リースリング、ピノ・ノワール、シャルドネ'],
    correctAnswer: 1,
    explanation: 'シャンパーニュの主要3品種はシャルドネ、ピノ・ノワール、ムニエ（旧ピノ・ムニエ）です。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_004',
    difficulty: 3,
    category: 'シャンパーニュ',
    question: 'シャンパーニュ製法で瓶内二次発酵後の熟成期間は？',
    options: ['ノンヴィンテージ12ヶ月、ヴィンテージ24ヶ月', 'ノンヴィンテージ15ヶ月、ヴィンテージ36ヶ月', 'ノンヴィンテージ18ヶ月、ヴィンテージ48ヶ月', 'ノンヴィンテージ24ヶ月、ヴィンテージ60ヶ月'],
    correctAnswer: 1,
    explanation: 'ノンヴィンテージは最低15ヶ月、ヴィンテージは最低36ヶ月の熟成が義務付けられています。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_005',
    difficulty: 2,
    category: 'シャンパーニュ',
    question: 'シャンパーニュ製法「メトード・シャンプノワーズ」で泡が生まれる仕組みは？',
    options: ['炭酸ガスを注入', '瓶内二次発酵でCO2が発生', '圧力をかける', '冷却して泡を作る'],
    correctAnswer: 1,
    explanation: '瓶内二次発酵で酵母が糖を分解し、アルコールと二酸化炭素が生成されます。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_006',
    difficulty: 3,
    category: 'シャンパーニュ',
    question: '動瓶（Remuage）の目的は？',
    options: ['泡を増やす', '温度を調整する', '酵母の澱を瓶口に集める', 'アルコール度を上げる'],
    correctAnswer: 2,
    explanation: '動瓶は瓶を回転させて酵母の澱を瓶口に集め、後の澱除去を容易にします。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_007',
    difficulty: 2,
    category: 'シャンパーニュ',
    question: '最も辛口のシャンパーニュの甘辛度表記は？',
    options: ['ブリュット', 'エクストラ・ブリュット', 'ブリュット・ナチュール', 'エクストラ・ドライ'],
    correctAnswer: 2,
    explanation: 'ブリュット・ナチュール（ゼロ・ドサージュ）は門出のリキュールなしで最も辛口です。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_008',
    difficulty: 3,
    category: 'シャンパーニュ',
    question: 'レコルタン・マニピュラン（RM）とネゴシアン・マニピュラン（NM）の違いは？',
    options: ['規模の違い', '自社畑か買付けか', '熟成期間の違い', '品種の違い'],
    correctAnswer: 1,
    explanation: 'RMは自社畑で一貫生産、NMはブドウやワインを買い付けて醸造・瓶詰めします。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_009',
    difficulty: 1,
    category: 'シャンパーニュ',
    question: 'ドン・ペリニヨンが貢献したのは？',
    options: ['白ワインの発明', '樽熟成技術', '瓶内二次発酵によるシャンパーニュ誕生', 'ブレンド技術'],
    correctAnswer: 2,
    explanation: 'ドン・ペリニヨンは瓶内二次発酵によるシャンパーニュの製法確立に貢献した伝説的人物です。'
  },
  {
    id: 'STUDY_WINE_INTRO_10_010',
    difficulty: 2,
    category: 'シャンパーニュ',
    question: 'アッサンブラージュ（ブレンド）の目的は？',
    options: ['アルコール度を調整', 'メゾンのハウススタイル確立', '色を調整', '泡を増やす'],
    correctAnswer: 1,
    explanation: 'アッサンブラージュにより複数の区画・品種・年をブレンドし、メゾンのハウススタイルを確立します。'
  }
];