import type { QuizQuestion } from '../types';

// ワインクイズ問題データベース（150問以上）
export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // 難易度1: 入門編 (30問)
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
  {
    id: 'basic_004',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのアルコール度数は一般的に何パーセント程度ですか？',
    options: ['5-8%', '12-15%', '20-25%', '30-35%'],
    correctAnswer: 1,
    explanation: 'ワインのアルコール度数は一般的に12-15%程度です。ビールより高く、ウイスキーより低い度数です。'
  },
  {
    id: 'basic_005',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ロゼワインはどのように作られますか？',
    options: ['赤ワインと白ワインを混ぜる', '黒ブドウを短時間だけ皮と接触させる', 'ピンクのブドウを使う', '特殊な酵母を使う'],
    correctAnswer: 1,
    explanation: 'ロゼワインは主に黒ブドウを使い、短時間だけ皮と接触させて薄い色を抽出して作ります。'
  },
  {
    id: 'basic_006',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'スパークリングワインの泡はどのように作られますか？',
    options: ['炭酸ガスを注入する', '二次発酵で自然に発生する', '泡立て器で混ぜる', '特殊な添加物を加える'],
    correctAnswer: 1,
    explanation: 'スパークリングワインの泡は二次発酵によって自然に発生する炭酸ガスです。'
  },
  {
    id: 'basic_007',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのヴィンテージとは何を表しますか？',
    options: ['ワイナリーの名前', 'ブドウを収穫した年', 'ワインを瓶詰めした年', 'ワインの品質等級'],
    correctAnswer: 1,
    explanation: 'ヴィンテージはブドウを収穫した年を表します。その年の気候がワインの味に大きく影響します。'
  },
  {
    id: 'basic_008',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの一般的な容量は？',
    options: ['500ml', '750ml', '1000ml', '1500ml'],
    correctAnswer: 1,
    explanation: 'ワインボトルの標準的な容量は750mlです。これは約5杯分のワインに相当します。'
  },
  {
    id: 'basic_009',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの適切な保存温度は？',
    options: ['5-8℃', '10-15℃', '20-25℃', '30-35℃'],
    correctAnswer: 1,
    explanation: 'ワインの理想的な保存温度は10-15℃です。温度が高すぎると劣化が早まります。'
  },
  {
    id: 'basic_010',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'デキャンタージュの主な目的は？',
    options: ['見た目を良くする', '酸素と接触させる', 'アルコール度数を下げる', '温度を調整する'],
    correctAnswer: 1,
    explanation: 'デキャンタージュは酸素と接触させてワインを開かせ、香りや味わいを向上させる目的で行います。'
  },
  {
    id: 'basic_011',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインコルクの主な材料は？',
    options: ['プラスチック', 'コルク樫の皮', 'ゴム', '合成樹脂'],
    correctAnswer: 1,
    explanation: '伝統的なワインコルクはコルク樫の皮から作られます。通気性があり、ワインの熟成に適しています。'
  },
  {
    id: 'basic_012',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ドライワインとは何ですか？',
    options: ['乾燥地帯で作られたワイン', '甘味の少ないワイン', '熟成期間の長いワイン', 'アルコール度数の高いワイン'],
    correctAnswer: 1,
    explanation: 'ドライワインは残糖分が少ない、甘味の少ないワインを指します。'
  },
  {
    id: 'basic_013',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「酸化」とは何ですか？',
    options: ['良い熟成過程', '酸素による劣化', '発酵の停止', '色の変化'],
    correctAnswer: 1,
    explanation: 'ワインの酸化は空気中の酸素による劣化で、味わいや香りが損なわれます。'
  },
  {
    id: 'basic_014',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'テーブルワインとは何ですか？',
    options: ['食事と一緒に楽しむワイン', 'テーブルの上で熟成させたワイン', '安価なワイン', '低アルコールのワイン'],
    correctAnswer: 0,
    explanation: 'テーブルワインは食事と一緒に楽しむ日常的なワインを指します。'
  },
  {
    id: 'basic_015',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「タンニン」とは何ですか？',
    options: ['甘味成分', '酸味成分', '渋味成分', '苦味成分'],
    correctAnswer: 2,
    explanation: 'タンニンはワインの渋味成分で、主に赤ワインに含まれ、ブドウの皮や種から抽出されます。'
  },

  // 難易度2: 初級編 (40問)
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
  {
    id: 'basic_103',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'シャルドネはどんなタイプのワインに使われる品種ですか？',
    options: ['赤ワイン', '白ワイン', 'ロゼワイン', 'デザートワインのみ'],
    correctAnswer: 1,
    explanation: 'シャルドネは世界で最も人気のある白ワイン用ブドウ品種です。'
  },
  {
    id: 'basic_104',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ピノ・ノワールの特徴として正しいのは？',
    options: ['非常に濃い色', '高いタンニン', '繊細で上品', '長期熟成には向かない'],
    correctAnswer: 2,
    explanation: 'ピノ・ノワールは繊細で上品な味わいが特徴の赤ワイン用品種です。'
  },
  {
    id: 'basic_105',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'キャンティはどこの国のワイン産地ですか？',
    options: ['フランス', 'イタリア', 'スペイン', 'ドイツ'],
    correctAnswer: 1,
    explanation: 'キャンティはイタリア・トスカーナ州の有名なワイン産地です。'
  },
  {
    id: 'basic_106',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'リースリングで有名なドイツワイン産地は？',
    options: ['ボルドー', 'ブルゴーニュ', 'モーゼル', 'リオハ'],
    correctAnswer: 2,
    explanation: 'モーゼルはドイツの代表的なワイン産地で、リースリングの名産地です。'
  },
  {
    id: 'basic_107',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ナパバレーはどこの国にありますか？',
    options: ['フランス', 'イタリア', 'アメリカ', 'オーストラリア'],
    correctAnswer: 2,
    explanation: 'ナパバレーはアメリカ・カリフォルニア州の世界的に有名なワイン産地です。'
  },
  {
    id: 'basic_108',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'プロヴァンスで有名なワインの種類は？',
    options: ['赤ワイン', 'ロゼワイン', '白ワイン', 'スパークリングワイン'],
    correctAnswer: 1,
    explanation: 'プロヴァンスはフランス南部の産地で、特にロゼワインで有名です。'
  },
  {
    id: 'basic_109',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'メルローの特徴は？',
    options: ['高い酸味', 'まろやかで果実味豊か', '強いタンニン', '草っぽい香り'],
    correctAnswer: 1,
    explanation: 'メルローはまろやかで果実味豊かな赤ワインを生み出すブドウ品種です。'
  },
  {
    id: 'basic_110',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ソーヴィニヨン・ブランの特徴的な香りは？',
    options: ['バラの香り', 'バニラの香り', '草やハーブの香り', 'チョコレートの香り'],
    correctAnswer: 2,
    explanation: 'ソーヴィニヨン・ブランは草やハーブのような爽やかな香りが特徴の白ワイン用品種です。'
  },
  {
    id: 'basic_111',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'リオハはどこの国のワイン産地ですか？',
    options: ['ポルトガル', 'スペイン', 'イタリア', 'フランス'],
    correctAnswer: 1,
    explanation: 'リオハはスペイン北部の代表的なワイン産地で、テンプラニーリョ主体の赤ワインが有名です。'
  },
  {
    id: 'basic_112',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'バローロはどこの国のワイン？',
    options: ['フランス', 'イタリア', 'スペイン', 'ドイツ'],
    correctAnswer: 1,
    explanation: 'バローロはイタリア・ピエモンテ州の高級赤ワインで、ネッビオーロ品種から造られます。'
  },

  // 難易度3: 中級編 (40問)
  {
    id: 'inter_201',
    difficulty: 3,
    category: 'ワイン法',
    question: 'フランスワインのAOC制度で、最高ランクは？',
    options: ['VdP', 'AOC', 'VDQS', 'AOP'],
    correctAnswer: 3,
    explanation: '2012年からAOCはAOP（Appellation d\'Origine Protégée）に名称変更されました。'
  },
  {
    id: 'inter_202',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインテイスティングで「タンニン」を最も感じる部分はどこですか？',
    options: ['舌先', '舌の両脇', '舌の奥', '歯茎'],
    correctAnswer: 3,
    explanation: 'タンニンは主に歯茎や口の中全体に渋みとして感じられます。'
  },
  {
    id: 'inter_203',
    difficulty: 3,
    category: 'ワイン法',
    question: 'イタリアワインの最高品質分類は？',
    options: ['DOC', 'DOCG', 'IGT', 'VdT'],
    correctAnswer: 1,
    explanation: 'DOCGはイタリアワインの最高品質分類で、厳しい規制を受けます。'
  },
  {
    id: 'inter_204',
    difficulty: 3,
    category: 'ワイン法',
    question: 'シャンパーニュ地方で認められているブドウ品種でないのは？',
    options: ['シャルドネ', 'ピノ・ノワール', 'ピノ・ムニエ', 'カベルネ・ソーヴィニヨン'],
    correctAnswer: 3,
    explanation: 'シャンパーニュではシャルドネ、ピノ・ノワール、ピノ・ムニエの3品種のみが認められています。'
  },
  {
    id: 'inter_205',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの酸味を最も感じる舌の部分は？',
    options: ['舌先', '舌の両脇', '舌の奥', '舌全体'],
    correctAnswer: 1,
    explanation: '酸味は舌の両脇で最も敏感に感じられます。'
  },
  {
    id: 'inter_206',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'マロラクティック発酵の効果として正しいのは？',
    options: ['アルコール度数が上がる', '酸味が柔らかくなる', '色が濃くなる', '甘味が増す'],
    correctAnswer: 1,
    explanation: 'マロラクティック発酵により、刺激的なリンゴ酸が柔らかい乳酸に変換されます。'
  },
  {
    id: 'inter_207',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'バトナージュとは何ですか？',
    options: ['ブドウの収穫作業', '澱を撹拌する作業', 'ブレンド作業', '瓶詰め作業'],
    correctAnswer: 1,
    explanation: 'バトナージュは澱を撹拌してワインに旨みとコクを与える技法です。'
  },
  {
    id: 'inter_208',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ブルゴーニュのグラン・クリュの畑の数は？',
    options: ['33', '44', '55', '66'],
    correctAnswer: 0,
    explanation: 'ブルゴーニュには33のグラン・クリュ畑があります。'
  },
  {
    id: 'inter_209',
    difficulty: 3,
    category: 'ワイン製造',
    question: '炭酸浸漬法（カーボニック・マセレーション）の特徴は？',
    options: ['タンニンが強くなる', '色が薄くなる', 'フルーティーになる', '酸味が強くなる'],
    correctAnswer: 2,
    explanation: '炭酸浸漬法はフルーティーで軽やかなワインを造る製法です。'
  },
  {
    id: 'inter_210',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'コート・デュ・ローヌ地方の代表品種は？',
    options: ['ピノ・ノワール', 'シラー', 'カベルネ・ソーヴィニヨン', 'ガメイ'],
    correctAnswer: 1,
    explanation: 'コート・デュ・ローヌ地方ではシラーが代表的な赤ワイン品種です。'
  },

  // 難易度4: 上級編 (25問)
  {
    id: 'adv_301',
    difficulty: 4,
    category: 'ワイン歴史',
    question: 'フィロキセラ禍はいつ頃ヨーロッパのブドウ畑を襲いましたか？',
    options: ['1800年代前半', '1800年代後半', '1900年代前半', '1900年代後半'],
    correctAnswer: 1,
    explanation: 'フィロキセラ禍は1800年代後半にヨーロッパのブドウ畑を壊滅的に襲いました。'
  },
  {
    id: 'adv_302',
    difficulty: 4,
    category: 'ワイン製造',
    question: 'シュール・リー製法の特徴は？',
    options: ['高温発酵', '澱と長期接触', '早期瓶詰め', '炭酸浸漬'],
    correctAnswer: 1,
    explanation: 'シュール・リー製法は澱と長期間接触させることでワインに複雑さを与えます。'
  },
  {
    id: 'adv_303',
    difficulty: 4,
    category: 'ワイン産地',
    question: 'シャブリのキンメリジャン土壌の特徴は？',
    options: ['火山灰質', '石灰質で牡蠣の化石を含む', '花崗岩質', '砂質'],
    correctAnswer: 1,
    explanation: 'キンメリジャン土壌は石灰質で牡蠣の化石を含み、シャブリの特徴的なミネラル感をもたらします。'
  },
  {
    id: 'adv_304',
    difficulty: 4,
    category: 'ワイン法',
    question: 'ドイツワインのVDPとは何ですか？',
    options: ['国の品質分類', '醸造所連盟の品質分類', '輸出用ワイン', '甘口ワイン'],
    correctAnswer: 1,
    explanation: 'VDPは優良醸造所連盟による独自の品質分類システムです。'
  },
  {
    id: 'adv_305',
    difficulty: 4,
    category: 'ワイン製造',
    question: 'リムーザージュとは何ですか？',
    options: ['澱を取り除く作業', '瓶を回転させる作業', 'コルクを抜く作業', 'ラベルを貼る作業'],
    correctAnswer: 1,
    explanation: 'リムーザージュはシャンパーニュ製造で瓶を回転させて澱を瓶口に集める作業です。'
  },

  // 難易度5: 専門級 (15問)
  {
    id: 'exp_401',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの渋味成分タンニンの化学的分類は？',
    options: ['アルカロイド', 'フェノール化合物', 'アミノ酸', '有機酸'],
    correctAnswer: 1,
    explanation: 'タンニンはフェノール化合物の一種で、植物の二次代謝産物です。'
  },
  {
    id: 'exp_402',
    difficulty: 5,
    category: 'ワイン法',
    question: 'シャンパーニュのリディアージュとは何ですか？',
    options: ['収穫作業', '動瓶作業', 'デゴルジュマン', 'ドザージュ'],
    correctAnswer: 1,
    explanation: 'リディアージュは瓶を回転させながら角度を変え、澱を瓶口に集める動瓶作業です。'
  },
  {
    id: 'exp_403',
    difficulty: 5,
    category: 'ワイン歴史',
    question: '1855年のボルドー格付けが行われた理由は？',
    options: ['戦争の復興', 'パリ万国博覧会', '皇帝の命令', '商工会議所の要請'],
    correctAnswer: 1,
    explanation: '1855年格付けはパリ万国博覧会に出品するワインを選定するために行われました。'
  },
  {
    id: 'exp_404',
    difficulty: 5,
    category: 'テイスティング',
    question: 'ワインの「ミネラル感」を科学的に説明すると？',
    options: ['実際のミネラル成分', '酸味と塩味の組み合わせ', '心理的な表現', '土壌由来の味'],
    correctAnswer: 1,
    explanation: 'ミネラル感は主に酸味と微量の塩味の組み合わせによる味覚表現とされています。'
  },
  {
    id: 'exp_405',
    difficulty: 5,
    category: 'ワイン製造',
    question: 'オークの熟成による「バニリン」生成のメカニズムは？',
    options: ['樽材の分解', 'リグニンの分解', 'セルロースの分解', 'タンニンの変化'],
    correctAnswer: 1,
    explanation: 'バニリンは樽材のリグニンが熱や時間により分解されて生成されます。'
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

export const getTotalQuestionsByDifficulty = () => {
  const stats = [1, 2, 3, 4, 5].map(difficulty => ({
    difficulty,
    count: getQuestionsByDifficulty(difficulty).length
  }));
  return stats;
};