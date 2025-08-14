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
  {
    id: 'basic_016',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'フォーティファイドワインとは何ですか？',
    options: ['度数の低いワイン', 'アルコールを添加したワイン', '炭酸を加えたワイン', '甘味料を加えたワイン'],
    correctAnswer: 1,
    explanation: 'フォーティファイドワインは発酵中または発酵後にアルコールを添加して作られるワインです。'
  },
  {
    id: 'basic_017',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのアペラシオンとは何ですか？',
    options: ['ワインの色', '産地呼称', 'アルコール度数', '製造年'],
    correctAnswer: 1,
    explanation: 'アペラシオンは原産地統制呼称のことで、特定の地域で決められた規則に従って作られたワインに与えられます。'
  },
  {
    id: 'basic_018',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「酸化防止剤」として使われるのは？',
    options: ['塩', '砂糖', '亜硫酸塩', 'クエン酸'],
    correctAnswer: 2,
    explanation: '亜硫酸塩（SO2）は酸化を防ぎ、ワインの品質を保つために使用される添加物です。'
  },
  {
    id: 'basic_019',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「ボディ」とは何を表しますか？',
    options: ['色の濃さ', '味わいの厚み', '香りの強さ', 'アルコール度数'],
    correctAnswer: 1,
    explanation: 'ボディはワインの味わいの厚みや重厚さを表現する用語です。'
  },
  {
    id: 'basic_020',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '白ワインの適切な飲用温度は？',
    options: ['5-10℃', '10-14℃', '16-18℃', '20-22℃'],
    correctAnswer: 1,
    explanation: '白ワインは一般的に10-14℃で飲むのが適切です。冷やしすぎると香りが立ちません。'
  },
  {
    id: 'basic_021',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '赤ワインの適切な飲用温度は？',
    options: ['5-10℃', '10-14℃', '16-18℃', '20-25℃'],
    correctAnswer: 2,
    explanation: '赤ワインは16-18℃で飲むのが適切です。室温より少し涼しいくらいが理想的です。'
  },
  {
    id: 'basic_022',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのセパージュとは何ですか？',
    options: ['生産地', 'ブドウ品種', '製造法', '収穫年'],
    correctAnswer: 1,
    explanation: 'セパージュはブドウ品種のことを指すフランス語です。'
  },
  {
    id: 'basic_023',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「レッグス」または「ティアーズ」とは何ですか？',
    options: ['沈殿物', 'グラスを回した時の液体の滴り', 'ワインの泡', 'コルクの破片'],
    correctAnswer: 1,
    explanation: 'レッグスやティアーズは、ワインをグラスで回した後にグラス壁に垂れる滴のことです。'
  },
  {
    id: 'basic_024',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '一般的なワイングラスの持ち方は？',
    options: ['ボウル部分を持つ', 'ステム（脚）を持つ', 'ベース部分を持つ', 'どこでも良い'],
    correctAnswer: 1,
    explanation: 'ワイングラスはステム（脚）を持つのが基本です。体温でワインが温まるのを防げます。'
  },
  {
    id: 'basic_025',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「フィニッシュ」とは何ですか？',
    options: ['最初の印象', '色合い', '飲み込んだ後の余韻', 'アルコール感'],
    correctAnswer: 2,
    explanation: 'フィニッシュは飲み込んだ後に残る味わいや香りの余韻のことです。'
  },
  {
    id: 'basic_026',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインを長期保存する際の理想的な湿度は？',
    options: ['30-40%', '50-60%', '70-80%', '90-100%'],
    correctAnswer: 2,
    explanation: '70-80%の湿度がワイン保存に理想的です。コルクの乾燥を防ぎます。'
  },
  {
    id: 'basic_027',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの底にある凹みを何と呼びますか？',
    options: ['プント', 'ヘッド', 'ネック', 'ショルダー'],
    correctAnswer: 0,
    explanation: 'ボトル底の凹みはプントと呼ばれ、ボトルの強度を高める役割があります。'
  },
  {
    id: 'basic_028',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「ブーケ」とは何ですか？',
    options: ['花の香り', '熟成による複雑な香り', '果実の香り', 'スパイスの香り'],
    correctAnswer: 1,
    explanation: 'ブーケは熟成により発達する複雑で上品な香りのことです。'
  },
  {
    id: 'basic_029',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '開栓後のワインはどのくらいで飲み切るべきですか？',
    options: ['当日中', '2-3日以内', '1週間以内', '1ヶ月以内'],
    correctAnswer: 1,
    explanation: '開栓後は酸化が進むため、2-3日以内に飲み切るのが理想的です。'
  },
  {
    id: 'basic_030',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「エチケット」とは何ですか？',
    options: ['マナー', 'ラベル', 'コルク', 'グラス'],
    correctAnswer: 1,
    explanation: 'エチケットはワインボトルに貼られたラベルのことです。'
  },
  {
    id: 'basic_031',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインに含まれる「亜硫酸塩」の役割は？',
    options: ['甘味を加える', '酸化防止', '色を濃くする', '泡を作る'],
    correctAnswer: 1,
    explanation: '亜硫酸塩は酸化を防ぎ、ワインの品質を保持する重要な役割を果たします。'
  },
  {
    id: 'basic_032',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「アルコール発酵」で糖分が変化するものは？',
    options: ['アルコールと二酸化炭素', '酸とタンニン', '色素とアロマ', '水と塩'],
    correctAnswer: 0,
    explanation: 'アルコール発酵では、酵母が糖分をアルコールと二酸化炭素に変換します。'
  },
  {
    id: 'basic_033',
    difficulty: 1,
    category: 'ワインの基礎',
    question: '「ワインの脚（レッグス）」が長いワインの特徴は？',
    options: ['アルコール度数が高い', '酸味が強い', '甘味が強い', '渋味が強い'],
    correctAnswer: 0,
    explanation: 'レッグスが長いワインは一般的にアルコール度数が高く、グリセロール含有量も多いことを示します。'
  },
  {
    id: 'basic_034',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの「パント（凹み）」の主な目的は？',
    options: ['見た目を良くする', 'ボトルの強度を高める', '容量を減らす', '保存期間を延ばす'],
    correctAnswer: 1,
    explanation: 'パントはボトルの構造的強度を高め、圧力に対する耐性を向上させます。'
  },
  {
    id: 'basic_035',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「デカンタージュ」を行う理想的なタイミングは？',
    options: ['飲む直前', '飲む30分-2時間前', '飲む1週間前', '飲む直後'],
    correctAnswer: 1,
    explanation: 'デカンタージュは飲む30分から2時間前に行うのが理想的で、ワインによって時間を調整します。'
  },

  // 難易度2: 初級編 (60問)
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
  {
    id: 'basic_113',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ゲヴュルツトラミネールの特徴的な香りは？',
    options: ['ライチ', 'レモン', 'リンゴ', 'ペア'],
    correctAnswer: 0,
    explanation: 'ゲヴュルツトラミネールはライチやバラのような華やかな香りが特徴です。'
  },
  {
    id: 'basic_114',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'マルベックで有名な産地は？',
    options: ['フランス・ボルドー', 'アルゼンチン・メンドーサ', 'イタリア・トスカーナ', 'スペイン・リオハ'],
    correctAnswer: 1,
    explanation: 'マルベックはアルゼンチン・メンドーサ州で最も成功している品種です。'
  },
  {
    id: 'basic_115',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ピエモンテ州の代表品種は？',
    options: ['サンジョヴェーゼ', 'ネッビオーロ', 'モンテプルチアーノ', 'アリアニコ'],
    correctAnswer: 1,
    explanation: 'ピエモンテ州ではネッビオーロが最も重要な品種で、バローロやバルバレスコを生み出します。'
  },
  {
    id: 'basic_116',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'カベルネ・フランの特徴は？',
    options: ['カベルネ・ソーヴィニヨンより重厚', 'ハーブ的な香り', '高いアルコール度数', '長期熟成必須'],
    correctAnswer: 1,
    explanation: 'カベルネ・フランはハーブや青野菜のような香りが特徴的で、カベルネ・ソーヴィニヨンより軽やかです。'
  },
  {
    id: 'basic_117',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ヴァレー・デル・マイポはどこの国の産地？',
    options: ['アルゼンチン', 'チリ', 'ブラジル', 'ウルグアイ'],
    correctAnswer: 1,
    explanation: 'ヴァレー・デル・マイポはチリの首都サンティアゴ周辺の重要なワイン産地です。'
  },
  {
    id: 'basic_118',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'グルナッシュ（ガルナッチャ）の特徴は？',
    options: ['高い酸味', '低いアルコール度数', '果実味豊か', '濃い色'],
    correctAnswer: 2,
    explanation: 'グルナッシュは果実味豊かで、アルコール度数が高くなりやすい品種です。'
  },
  {
    id: 'basic_119',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ドウロ川流域で有名なポルトガルのワイン産地は？',
    options: ['ダン', 'ヴィーニョ・ヴェルデ', 'ドウロ', 'アレンテージョ'],
    correctAnswer: 2,
    explanation: 'ドウロ地方はドウロ川流域にあり、ポートワインで世界的に有名です。'
  },
  {
    id: 'basic_120',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'テンプラニーリョの特徴的な産地は？',
    options: ['ポルトガル', 'スペイン', 'フランス', 'イタリア'],
    correctAnswer: 1,
    explanation: 'テンプラニーリョはスペインを代表する品種で、リオハやリベラ・デル・ドゥエロで栽培されています。'
  },
  {
    id: 'basic_121',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'セントラル・オタゴはどこの国の産地？',
    options: ['オーストラリア', 'ニュージーランド', '南アフリカ', 'チリ'],
    correctAnswer: 1,
    explanation: 'セントラル・オタゴはニュージーランド南島の産地で、ピノ・ノワールで有名です。'
  },
  {
    id: 'basic_122',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'シラーとシラーズの違いは？',
    options: ['全く別の品種', '同じ品種だが産地により呼び名が違う', 'シラーズの方が濃い', 'シラーの方が甘い'],
    correctAnswer: 1,
    explanation: 'シラーとシラーズは同じ品種ですが、フランスではシラー、オーストラリアではシラーズと呼ばれます。'
  },
  {
    id: 'basic_123',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ハンター・バレーはどこの国の産地？',
    options: ['アメリカ', 'カナダ', 'オーストラリア', 'ニュージーランド'],
    correctAnswer: 2,
    explanation: 'ハンター・バレーはオーストラリア・ニューサウスウェールズ州の歴史ある産地です。'
  },
  {
    id: 'basic_124',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'セミヨンの特徴は？',
    options: ['高い酸味', '厚みのある白ワイン', '軽やかで爽やか', '短期熟成向き'],
    correctAnswer: 1,
    explanation: 'セミヨンは厚みがあり、ボルドーの甘口ワインやハンターバレーの辛口ワインに使われます。'
  },
  {
    id: 'basic_125',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ステレンボッシュはどこの国の産地？',
    options: ['チリ', 'アルゼンチン', '南アフリカ', 'ブラジル'],
    correctAnswer: 2,
    explanation: 'ステレンボッシュは南アフリカのケープタウン近郊にある重要なワイン産地です。'
  },
  {
    id: 'basic_126',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'アルバリーニョの原産地は？',
    options: ['ポルトガル', 'スペイン', 'イタリア', 'フランス'],
    correctAnswer: 1,
    explanation: 'アルバリーニョはスペイン北西部のリアス・バイシャス地方原産の白ブドウ品種です。'
  },
  {
    id: 'basic_127',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'フィンガー・レイクスはどこの国の産地？',
    options: ['カナダ', 'アメリカ', 'ドイツ', 'オーストリア'],
    correctAnswer: 1,
    explanation: 'フィンガー・レイクスはアメリカ・ニューヨーク州の産地で、リースリングが有名です。'
  },
  {
    id: 'basic_128',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ピノ・グリ（ピノ・グリージョ）の特徴は？',
    options: ['非常に軽い', '中程度のボディ', '非常に重い', 'タンニンが強い'],
    correctAnswer: 1,
    explanation: 'ピノ・グリは中程度のボディを持つ白ワイン品種で、爽やかさと厚みのバランスが良い品種です。'
  },
  {
    id: 'basic_129',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'コルチャグア・ヴァレーはどこの国の産地？',
    options: ['アルゼンチン', 'チリ', 'ペルー', 'ボリビア'],
    correctAnswer: 1,
    explanation: 'コルチャグア・ヴァレーはチリの重要なワイン産地で、カルメネールで有名です。'
  },
  {
    id: 'basic_130',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'カルメネールの特徴は？',
    options: ['ボルドー原産だがチリで成功', 'イタリア原産', 'スペイン原産', 'ドイツ原産'],
    correctAnswer: 0,
    explanation: 'カルメネールは元々ボルドー原産ですが、現在はチリで最も成功している品種です。'
  },
  {
    id: 'basic_131',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'マクラーレン・ヴェイルはどこの国の産地？',
    options: ['ニュージーランド', 'オーストラリア', '南アフリカ', 'チリ'],
    correctAnswer: 1,
    explanation: 'マクラーレン・ヴェイルはオーストラリア南部の産地で、シラーズとグルナッシュで有名です。'
  },
  {
    id: 'basic_132',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ヴィオニエの特徴的な香りは？',
    options: ['シトラス系', 'アプリコット', 'グリーンアップル', 'ミネラル'],
    correctAnswer: 1,
    explanation: 'ヴィオニエはアプリコットや白桃のような豊かな果実香が特徴の白ワイン品種です。'
  },
  {
    id: 'basic_133',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'アデレード・ヒルズはどこの国の産地？',
    options: ['ニュージーランド', 'オーストラリア', 'カナダ', 'アメリカ'],
    correctAnswer: 1,
    explanation: 'アデレード・ヒルズはオーストラリア・南オーストラリア州の冷涼な産地です。'
  },
  {
    id: 'basic_134',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ネロ・ダヴォラの産地は？',
    options: ['イタリア・シチリア', 'イタリア・トスカーナ', 'イタリア・ピエモンテ', 'イタリア・ヴェネト'],
    correctAnswer: 0,
    explanation: 'ネロ・ダヴォラはシチリア島の代表的な黒ブドウ品種です。'
  },
  {
    id: 'basic_135',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'アソス山周辺のギリシャワイン産地で有名なのは？',
    options: ['サントリーニ', 'ナウサ', 'ネメア', 'パトラス'],
    correctAnswer: 1,
    explanation: 'ナウサはマケドニア地方にあり、クシノマヴロ品種の赤ワインで有名です。'
  },
  {
    id: 'basic_136',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'アシルティコの特徴は？',
    options: ['低い酸味', '高い酸味とミネラル感', '甘口のみ', 'タンニンが強い'],
    correctAnswer: 1,
    explanation: 'アシルティコはギリシャ・サントリーニ島の品種で、高い酸味とミネラル感が特徴です。'
  },
  {
    id: 'basic_137',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'コンスタンシアはどこの国の産地？',
    options: ['チリ', 'アルゼンチン', '南アフリカ', 'オーストラリア'],
    correctAnswer: 2,
    explanation: 'コンスタンシアは南アフリカ・ケープタウン近郊の歴史ある産地です。'
  },
  {
    id: 'basic_138',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ピノタージュはどこの国で開発された品種？',
    options: ['フランス', 'ドイツ', '南アフリカ', 'オーストラリア'],
    correctAnswer: 2,
    explanation: 'ピノタージュは南アフリカで開発された品種で、ピノ・ノワールとサンソーの交配種です。'
  },
  {
    id: 'basic_139',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ドイツワインの「アイスヴァイン」の製造方法は？',
    options: ['人工的に冷凍', '凍ったブドウを収穫', '氷を加えて醸造', '冷蔵発酵'],
    correctAnswer: 1,
    explanation: 'アイスヴァインは自然に凍ったブドウを収穫して造る高級甘口ワインです。'
  },
  {
    id: 'basic_140',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ミュスカデで使われるブドウ品種は？',
    options: ['ミュスカデ', 'ムロン・ド・ブルゴーニュ', 'シュナン・ブラン', 'アルバリーニョ'],
    correctAnswer: 1,
    explanation: 'ミュスカデは実際にはムロン・ド・ブルゴーニュという品種から造られるワインの名前です。'
  },
  {
    id: 'basic_141',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ジュヴレ・シャンベルタンはどこの村？',
    options: ['ボルドー', 'ブルゴーニュ', 'シャンパーニュ', 'アルザス'],
    correctAnswer: 1,
    explanation: 'ジュヴレ・シャンベルタンはブルゴーニュ地方コート・ドールの有名な村です。'
  },
  {
    id: 'basic_142',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'プリミティーヴォとジンファンデルの関係は？',
    options: ['全く別の品種', '同じ品種', 'プリミティーヴォの方が古い', 'ジンファンデルの変種'],
    correctAnswer: 1,
    explanation: 'プリミティーヴォ（イタリア）とジンファンデル（アメリカ）は同じ品種です。'
  },
  {
    id: 'basic_143',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'モンタルチーノはどこの国にある？',
    options: ['フランス', 'イタリア', 'スペイン', 'ポルトガル'],
    correctAnswer: 1,
    explanation: 'モンタルチーノはイタリア・トスカーナ州にあり、ブルネッロ・ディ・モンタルチーノで有名です。'
  },
  {
    id: 'basic_144',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ヴェルデホの原産地は？',
    options: ['ポルトガル', 'スペイン', 'イタリア', 'フランス'],
    correctAnswer: 1,
    explanation: 'ヴェルデホはスペイン・ルエダ地方原産の白ワイン用品種です。'
  },
  {
    id: 'basic_145',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ワラワラ・バレーはどこの国の産地？',
    options: ['オーストラリア', 'ニュージーランド', 'アメリカ', 'カナダ'],
    correctAnswer: 2,
    explanation: 'ワラワラ・バレーはアメリカ・ワシントン州の新興ワイン産地です。'
  },
  {
    id: 'basic_146',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'アグリアニコの特徴は？',
    options: ['軽やかで早飲み', '濃厚で長期熟成向き', '甘口専用', 'スパークリング専用'],
    correctAnswer: 1,
    explanation: 'アグリアニコは南イタリアの品種で、濃厚でタンニンが豊富な長期熟成向きの赤ワインを生み出します。'
  },
  {
    id: 'basic_147',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ロワール川流域のシノンで主に栽培される品種は？',
    options: ['ピノ・ノワール', 'カベルネ・フラン', 'メルロー', 'ガメイ'],
    correctAnswer: 1,
    explanation: 'シノンはカベルネ・フランを主体とした赤ワインで有名なロワール地方の産地です。'
  },
  {
    id: 'basic_148',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'マルサンヌの特徴は？',
    options: ['高い酸味', '低いアルコール', '厚みのある白ワイン', '軽やかな白ワイン'],
    correctAnswer: 2,
    explanation: 'マルサンヌはローヌ地方の白ワイン品種で、厚みがありリッチな白ワインを生み出します。'
  },

  // 難易度3: 中級編 (70問)
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
  // 中級編の問題をさらに追加
  {
    id: 'inter_211',
    difficulty: 3,
    category: 'ワイン製造',
    question: '冷やしすぎ（コールドスタビライゼーション）の目的は？',
    options: ['色を安定させる', '酒石酸の結晶を除去する', 'アルコール度数を下げる', 'タンニンを除去する'],
    correctAnswer: 1,
    explanation: '冷やしすぎによって酒石酸の結晶を事前に除去し、ボトリング後の析出を防ぎます。'
  },
  {
    id: 'inter_212',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「エレガント」な味わいとは？',
    options: ['力強い', '繊細でバランスが良い', '甘い', '酸味が強い'],
    correctAnswer: 1,
    explanation: 'エレガントは繊細で上品、バランスが良く洗練された味わいを表現します。'
  },
  {
    id: 'inter_213',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'ロット（Lees）とは何ですか？',
    options: ['ブドウの皮', '発酵後の澱', '樽の内側', 'ワインの泡'],
    correctAnswer: 1,
    explanation: 'ロッド（澱）は発酵後に沈殿する酵母の残骸で、ワインに旨みを与えます。'
  },
  {
    id: 'inter_214',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'プィ・エルメ（Puy l\'Evêque）があるフランスのワイン産地は？',
    options: ['ボルドー', 'ブルゴーニュ', 'カオール', 'シャンパーニュ'],
    correctAnswer: 2,
    explanation: 'カオールはフランス南西部の産地で、マルベック主体の濃厚な赤ワインを生産します。'
  },
  {
    id: 'inter_215',
    difficulty: 3,
    category: 'ワイン法',
    question: 'ドイツワインのQbA（QualitätsweinbestimmterAnbaugebiete）の特徴は？',
    options: ['最高品質', '補糖が禁止', '補糖が可能', '甘口のみ'],
    correctAnswer: 2,
    explanation: 'QbAは品質ワインの基本カテゴリーで、補糖（シャプタリザシオン）が認められています。'
  },
  {
    id: 'inter_216',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ストラクチャー」とは？',
    options: ['色の濃さ', '酸味、タンニン、アルコールのバランス', '香りの複雑さ', '甘さのレベル'],
    correctAnswer: 1,
    explanation: 'ストラクチャーは酸味、タンニン、アルコールなどの骨格成分のバランスを指します。'
  },
  {
    id: 'inter_217',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'ピジャージュ（Pigeage）とは何ですか？',
    options: ['ブドウを踏む作業', '果帽を押し下げる作業', '澱を取り除く作業', '瓶詰め作業'],
    correctAnswer: 1,
    explanation: 'ピジャージュは発酵中に果帽を押し下げて色素とタンニンを抽出する作業です。'
  },
  {
    id: 'inter_218',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'エルミタージュのシラーで有名な生産者は？',
    options: ['ギガル', 'シャペルティエ', 'ジャブレ', 'すべて'],
    correctAnswer: 3,
    explanation: 'エルミタージュでは多くの優良生産者がシラーから素晴らしいワインを造っています。'
  },
  {
    id: 'inter_219',
    difficulty: 3,
    category: 'ワイン法',
    question: 'イタリアのスーペルトスカーナとは？',
    options: ['DOCGワイン', '伝統的なキャンティ', '革新的なIGTワイン', 'スパークリングワイン'],
    correctAnswer: 2,
    explanation: 'スーペルトスカーナは伝統を破った革新的なトスカーナのIGTワインです。'
  },
  {
    id: 'inter_220',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「テロワール」を最も表現する要素は？',
    options: ['アルコール度数', 'ミネラル感と酸味', '甘さ', 'タンニンの強さ'],
    correctAnswer: 1,
    explanation: 'テロワールは土壌と気候を反映し、ミネラル感と酸味に最も現れます。'
  },
  {
    id: 'inter_221',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'カーボニック・マセレーション法の特徴は？',
    options: ['高温発酵', '二酸化炭素中での発酵', '長期醸し', '低温発酵'],
    correctAnswer: 1,
    explanation: 'カーボニック・マセレーション法は二酸化炭素雰囲気下でブドウを発酵させ、軽やかで果実味豊かなワインを造ります。'
  },
  {
    id: 'inter_222',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'プリオラートはどこの国のワイン産地？',
    options: ['フランス', 'イタリア', 'スペイン', 'ポルトガル'],
    correctAnswer: 2,
    explanation: 'プリオラートはスペイン・カタルーニャ地方の高級ワイン産地で、DOCaに認定されています。'
  },
  {
    id: 'inter_223',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「第三アロマ」とは何ですか？',
    options: ['ブドウ由来の香り', '発酵由来の香り', '熟成由来の香り', '酸化による香り'],
    correctAnswer: 2,
    explanation: '第三アロマは樽熟成やボトル熟成により発達する複雑で上品な香りのことです。'
  },
  {
    id: 'inter_224',
    difficulty: 3,
    category: 'ワイン法',
    question: 'ドイツワインのグローセ・ラーゲの意味は？',
    options: ['大きな畑', '特級畑', '一級畑', '村名畑'],
    correctAnswer: 1,
    explanation: 'グローセ・ラーゲはVDP分類における特級畑で、最高品質のワインを生み出す畑です。'
  },
  {
    id: 'inter_225',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'ソレラシステムで有名なワインは？',
    options: ['シャンパーニュ', 'シェリー', 'ポート', 'マデイラ'],
    correctAnswer: 1,
    explanation: 'ソレラシステムはシェリー酒の伝統的な熟成システムで、異なる年代のワインをブレンドします。'
  },
  {
    id: 'inter_226',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「アタック」とは何ですか？',
    options: ['最初の香り', '口に含んだ瞬間の印象', '飲み込む瞬間', '余韻'],
    correctAnswer: 1,
    explanation: 'アタックは口に含んだ瞬間の第一印象のことで、ワインの力強さや繊細さを表現します。'
  },
  {
    id: 'inter_227',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'アマローネで有名なイタリアの産地は？',
    options: ['ピエモンテ', 'トスカーナ', 'ヴェネト', 'ウンブリア'],
    correctAnswer: 2,
    explanation: 'アマローネはヴェネト州ヴァルポリチェッラ地区の伝統的な乾燥ブドウから造る高級ワインです。'
  },
  {
    id: 'inter_228',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'パッシートワインの製造方法は？',
    options: ['早期収穫', 'ブドウを乾燥させる', '冷凍収穫', '貴腐菌利用'],
    correctAnswer: 1,
    explanation: 'パッシートワインはブドウを天日や室内で乾燥させて糖度を濃縮してから醸造するワインです。'
  },
  {
    id: 'inter_229',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「グリップ」という表現が指すものは？',
    options: ['甘味の強さ', 'タンニンの質感', '酸味の鋭さ', 'アルコール感'],
    correctAnswer: 1,
    explanation: 'グリップはタンニンが口中を引き締める感覚を表現するテイスティング用語です。'
  },
  {
    id: 'inter_230',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'モーゼル川流域の急斜面畑の特徴は？',
    options: ['粘土質土壌', 'スレート土壌', '石灰質土壌', '火山灰土壌'],
    correctAnswer: 1,
    explanation: 'モーゼル地方の急斜面畑はスレート土壌が特徴で、リースリングに優雅なミネラル感を与えます。'
  },

  // 難易度4: 上級編 (50問)
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
  // 上級編の問題を追加
  {
    id: 'adv_306',
    difficulty: 4,
    category: 'ワイン製造',
    question: 'スキンコンタクトの時間が長いと赤ワインはどうなる？',
    options: ['色が薄くなる', 'タンニンが増加する', '酸味が強くなる', '甘くなる'],
    correctAnswer: 1,
    explanation: 'スキンコンタクトの時間が長いほど、皮からタンニンと色素が多く抽出されます。'
  },
  {
    id: 'adv_307',
    difficulty: 4,
    category: 'ワイン法',
    question: 'ボルドーのプルミエ・グラン・クリュ・クラッセAに分類されるシャトーは？',
    options: ['シャトー・シュヴァル・ブラン', 'シャトー・ル・パン', 'シャトー・ペトリュス', 'シャトー・トロタノワ'],
    correctAnswer: 0,
    explanation: 'シャトー・シュヴァル・ブランとシャトー・オーゾンヌがプルミエ・グラン・クリュ・クラッセAに分類されます。'
  },
  {
    id: 'adv_308',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「ペトリコール」という香りとは？',
    options: ['花の香り', '雨上がりの土の香り', 'スパイスの香り', '果実の香り'],
    correctAnswer: 1,
    explanation: 'ペトリコールは雨上がりの土や石の香りを指すテイスティング用語です。'
  },
  {
    id: 'adv_309',
    difficulty: 4,
    category: 'ワイン製造',
    question: 'アッサンブラージュとは何ですか？',
    options: ['収穫作業', 'ブレンド作業', '瓶詰め作業', '澱引き作業'],
    correctAnswer: 1,
    explanation: 'アッサンブラージュは異なるロットや品種をブレンドする作業です。'
  },
  {
    id: 'adv_310',
    difficulty: 4,
    category: 'ワイン歴史',
    question: 'モンク・ドン・ペリニョンが完成させたとされる技術は？',
    options: ['デゴルジュマン', 'アッサンブラージュ', 'リムーザージュ', 'すべて'],
    correctAnswer: 3,
    explanation: 'ドン・ペリニョンはシャンパーニュの製造技術を体系化し、現在の基礎を築きました。'
  },
  {
    id: 'adv_311',
    difficulty: 4,
    category: 'ワイン製造',
    question: '醸造におけるエステル化反応の重要性は？',
    options: ['色素の安定', '香りの複雑化', '酸度の調整', 'アルコール度数の向上'],
    correctAnswer: 1,
    explanation: 'エステル化反応により果実香と酸が結合し、ワインの香りがより複雑になります。'
  },
  {
    id: 'adv_312',
    difficulty: 4,
    category: 'ワイン法',
    question: 'シャンパーニュの「ピュピトル」の役割は？',
    options: ['発酵管理', '動瓶作業', '温度調整', '圧搾作業'],
    correctAnswer: 1,
    explanation: 'ピュピトルは動瓶作業（リムーザージュ）で使用する木製の台で、瓶を段階的に傾けます。'
  },
  {
    id: 'adv_313',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「収斂性」の化学的原因は？',
    options: ['糖分の結合', 'タンニンとタンパク質の結合', '酸の結晶化', 'アルコールの蒸発'],
    correctAnswer: 1,
    explanation: '収斂性はタンニンが口中のタンパク質と結合することで生じる感覚です。'
  },
  {
    id: 'adv_314',
    difficulty: 4,
    category: 'ワイン歴史',
    question: 'クローナル選抜が本格化した時代は？',
    options: ['19世紀', '20世紀前半', '20世紀後半', '21世紀'],
    correctAnswer: 2,
    explanation: 'クローナル選抜は20世紀後半に科学的アプローチにより本格化し、品質向上に貢献しました。'
  },
  {
    id: 'adv_315',
    difficulty: 4,
    category: 'ワイン製造',
    question: 'コールドソーク（低温浸漬）の主な目的は？',
    options: ['アルコール抽出', '色素とアロマの穏やかな抽出', 'タンニンの強化', '酸度の向上'],
    correctAnswer: 1,
    explanation: 'コールドソークは発酵前に低温で色素とアロマを穏やかに抽出する技術です。'
  },
  
  // 難易度4 大幅追加 (50問追加で100問目標)
  {
    id: 'adv_316',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「レドックス・ポテンシャル」が示すものは？',
    options: ['酸化還元状態', 'pH値', '電気伝導度', '比重'],
    correctAnswer: 0,
    explanation: 'レドックス・ポテンシャルはワインの酸化還元状態を示す重要な指標です。'
  },
  {
    id: 'adv_317',
    difficulty: 4,
    category: 'テロワール',
    question: 'ブルゴーニュの「クリマ」概念の核心は？',
    options: ['気候', '微細な区画', '土壌', '標高'],
    correctAnswer: 1,
    explanation: 'クリマは同一の地質・気候条件を持つ微細な区画を指すブルゴーニュ独特の概念です。'
  },
  {
    id: 'adv_318',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「スキンコンタクト」で白ワインに移行する主要成分は？',
    options: ['アントシアニン', 'フェノール化合物', '有機酸', '糖分'],
    correctAnswer: 1,
    explanation: 'スキンコンタクトにより果皮のフェノール化合物が白ワインに移行します。'
  },
  {
    id: 'adv_319',
    difficulty: 4,
    category: 'ワイン歴史',
    question: 'シャンパーニュの「リドリング・マシン」を発明したのは？',
    options: ['ドン・ペリニョン', 'ヴーヴ・クリコ', 'ジャック・ペータース', 'アンリ・ギルマール'],
    correctAnswer: 2,
    explanation: 'ジャック・ペータースが1970年代にリドリング・マシンを発明し、シャンパーニュ製造を革新しました。'
  },
  {
    id: 'adv_320',
    difficulty: 4,
    category: 'ブドウ栽培',
    question: 'ブドウの「フェノロジー」研究で最も重要な段階は？',
    options: ['萌芽', '開花', 'ヴェレゾン', '収穫'],
    correctAnswer: 2,
    explanation: 'ヴェレゾン（果実の色づき開始）は成熟度判定の最重要段階です。'
  },
  {
    id: 'adv_321',
    difficulty: 4,
    category: 'ワイン法',
    question: 'シャンパーニュの「シュル・ポワント」貯蔵の最短期間は？',
    options: ['12ヶ月', '15ヶ月', '18ヶ月', '24ヶ月'],
    correctAnswer: 1,
    explanation: 'シャンパーニュは澱の上で最低15ヶ月の熟成が法的に義務付けられています。'
  },
  {
    id: 'adv_322',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「グースト・ノート」とは？',
    options: ['微弱な香り', '欠陥臭', '余韻の香り', '幻覚的な香り'],
    correctAnswer: 0,
    explanation: 'グースト・ノートは感知閾値ギリギリの微弱な香りを指します。'
  },
  {
    id: 'adv_323',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「プレ・ファーメンテーション・マセラシオン」の最適期間は？',
    options: ['2-4日', '5-7日', '8-10日', '11-14日'],
    correctAnswer: 1,
    explanation: '発酵前浸漬は通常5-7日間行われ、色素とアロマの抽出を促進します。'
  },
  {
    id: 'adv_324',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「アントシアニン安定化」に最も重要な要因は？',
    options: ['pH値', '温度', 'SO2濃度', 'タンニン濃度'],
    correctAnswer: 3,
    explanation: 'タンニンはアントシアニンと結合して色素の安定化に重要な役割を果たします。'
  },
  {
    id: 'adv_325',
    difficulty: 4,
    category: 'ブドウ品種',
    question: 'ピノ・ノワールの「ディジョン・クローン」の特徴は？',
    options: ['低収量', '早熟', '濃縮度', 'すべて'],
    correctAnswer: 3,
    explanation: 'ディジョン・クローンは低収量、早熟、高濃縮度すべての特徴を持ちます。'
  },
  {
    id: 'adv_326',
    difficulty: 4,
    category: 'ワイン産地',
    question: 'ボルドーの「アッサンブラージュ」で最重要な要素は？',
    options: ['ヴィンテージの特性', '各品種の成熟度', '樽の使用法', '収穫タイミング'],
    correctAnswer: 1,
    explanation: 'アッサンブラージュでは各品種の成熟度とバランスが最も重要です。'
  },
  {
    id: 'adv_327',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「デレスタージュ」技術の主な効果は？',
    options: ['温度制御', '酸素供給制御', '抽出効率向上', 'すべて'],
    correctAnswer: 3,
    explanation: 'デレスタージュは温度、酸素、抽出を総合的に制御する技術です。'
  },
  {
    id: 'adv_328',
    difficulty: 4,
    category: 'テロワール',
    question: 'シャブリの「ポルトランディアン土壌」の地質年代は？',
    options: ['ジュラ紀', '白亜紀', '第三紀', '第四紀'],
    correctAnswer: 0,
    explanation: 'シャブリのポルトランディアン土壌はジュラ紀後期の地層です。'
  },
  {
    id: 'adv_329',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「コロイド安定性」に影響する粒子サイズは？',
    options: ['1nm以下', '1-1000nm', '1-10μm', '10μm以上'],
    correctAnswer: 1,
    explanation: 'コロイド粒子は1-1000nmサイズで、ワインの安定性に大きく影響します。'
  },
  {
    id: 'adv_330',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「マイクロブルージュ」の目的は？',
    options: ['酸化促進', '還元防止', '抽出促進', '発酵活性化'],
    correctAnswer: 1,
    explanation: 'マイクロブルージュは微量酸素供給により還元的状態を防止します。'
  },
  {
    id: 'adv_331',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「オフ・フレーバー」検出の閾値が最も低いのは？',
    options: ['TCA', 'TBA', '4-EP', 'VA'],
    correctAnswer: 0,
    explanation: 'TCA（コルク臭）は最も低い閾値（1-3ng/L）で検出可能な欠陥です。'
  },
  {
    id: 'adv_332',
    difficulty: 4,
    category: 'ブドウ栽培',
    question: 'ブドウの「水分ストレス」管理で最重要な時期は？',
    options: ['萌芽期', '開花期', 'ヴェレゾン期', '成熟期'],
    correctAnswer: 2,
    explanation: 'ヴェレゾン期の水分ストレスは果実品質に最も大きく影響します。'
  },
  {
    id: 'adv_333',
    difficulty: 4,
    category: 'ワイン法',
    question: 'ドイツの「VDP分類」における最高等級は？',
    options: ['VDP.GROSSE LAGE', 'VDP.ERSTE LAGE', 'VDP.ORTSWEINE', 'VDP.GUTSWEINE'],
    correctAnswer: 0,
    explanation: 'VDP.GROSSE LAGEがドイツVDP分類の最高等級です。'
  },
  {
    id: 'adv_334',
    difficulty: 4,
    category: 'ワイン化学',
    question: '「プロアントシアニジン」の重合度と渋味の関係は？',
    options: ['重合度高→渋味強', '重合度低→渋味強', '無関係', '逆相関'],
    correctAnswer: 3,
    explanation: '重合度が高くなると渋味は実際には減少し、よりまろやかになります。'
  },
  {
    id: 'adv_335',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「フラクショナル・ブレンディング」の利点は？',
    options: ['コスト削減', '品質の一貫性', '生産効率', '在庫管理'],
    correctAnswer: 1,
    explanation: 'フラクショナル・ブレンディングは年次間の品質一貫性を保つ技術です。'
  },
  {
    id: 'adv_336',
    difficulty: 4,
    category: 'テロワール',
    question: 'バローロの「タルトゥフィアーノ土壌」の特徴は？',
    options: ['石灰質', '粘土質', '砂質', '石灰粘土質'],
    correctAnswer: 3,
    explanation: 'タルトゥフィアーノは石灰と粘土の混合土壌で、エレガントなワインを生み出します。'
  },
  {
    id: 'adv_337',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「プロテインヘイズ」の原因タンパク質は？',
    options: ['アルブミン', 'チオーウイン', 'グロブリン', 'キチナーゼ'],
    correctAnswer: 1,
    explanation: 'チオーウインは熱不安定性タンパク質で、プロテインヘイズの主原因です。'
  },
  {
    id: 'adv_338',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「エクストラクション・キネティクス」で最も重要な変数は？',
    options: ['温度', '時間', 'アルコール濃度', 'すべて'],
    correctAnswer: 3,
    explanation: '抽出動力学では温度、時間、アルコール濃度すべてが重要な変数です。'
  },
  {
    id: 'adv_339',
    difficulty: 4,
    category: 'ブドウ品種',
    question: 'シャルドネの「ミロクライメット」適応性が高い理由は？',
    options: ['遺伝的多様性', '突然変異率', 'エピジェネティック可塑性', 'クローン選択'],
    correctAnswer: 2,
    explanation: 'シャルドネのエピジェネティック可塑性が高い環境適応性をもたらします。'
  },
  {
    id: 'adv_340',
    difficulty: 4,
    category: 'ワイン法',
    question: 'ピエモンテのMGA（Menzioni Geografiche Aggiuntive）システムの意義は？',
    options: ['品質向上', 'テロワール表現', '価格統制', 'ブランド保護'],
    correctAnswer: 1,
    explanation: 'MGAは単一畑のテロワール表現を法的に保護するシステムです。'
  },
  {
    id: 'adv_341',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「フェノリック・マチュリティ」の判定指標は？',
    options: ['糖度', 'タンニンの質', '酸度', 'pH値'],
    correctAnswer: 1,
    explanation: 'フェノリック・マチュリティはタンニンの質的変化で判定されます。'
  },
  {
    id: 'adv_342',
    difficulty: 4,
    category: 'ワイン化学',
    question: '「メラノイジン反応」がワインに与える影響は？',
    options: ['色調の変化', '香りの複雑化', '抗酸化作用', 'すべて'],
    correctAnswer: 3,
    explanation: 'メラノイジン反応は色調、香り、抗酸化作用すべてに影響します。'
  },
  {
    id: 'adv_343',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「テルモヴィニフィケーション」の最適温度は？',
    options: ['50-60℃', '60-70℃', '70-80℃', '80-90℃'],
    correctAnswer: 2,
    explanation: 'テルモヴィニフィケーションは70-80℃で行われる熱処理技術です。'
  },
  {
    id: 'adv_344',
    difficulty: 4,
    category: 'ブドウ栽培',
    question: 'ブドウの「キャノピー・マネジメント」で最重要な要素は？',
    options: ['葉面積指数', '果房露出度', '通風性', 'すべて'],
    correctAnswer: 3,
    explanation: 'キャノピー・マネジメントでは葉面積、露出度、通風性すべてが重要です。'
  },
  {
    id: 'adv_345',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「グルカン・ヘイズ」の原因微生物は？',
    options: ['ブレタノマイセス', 'ペディオコッカス', 'ラクトバチルス', 'グルコノバクター'],
    correctAnswer: 1,
    explanation: 'ペディオコッカス菌はグルカンを生成してワインを混濁させます。'
  },
  {
    id: 'adv_346',
    difficulty: 4,
    category: 'テロワール',
    question: 'シャンパーニュの「アスプレ」土壌の特徴は？',
    options: ['水はけが良い', '保水性が高い', '石灰質', 'すべて'],
    correctAnswer: 3,
    explanation: 'アスプレ土壌は水はけ、保水性、石灰質すべてを兼ね備えています。'
  },
  {
    id: 'adv_347',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「セルラー・エクストラクション」の主要酵素は？',
    options: ['ペクチナーゼ', 'セルラーゼ', 'ヘミセルラーゼ', 'すべて'],
    correctAnswer: 3,
    explanation: '細胞壁分解にはペクチナーゼ、セルラーゼ、ヘミセルラーゼすべてが関与します。'
  },
  {
    id: 'adv_348',
    difficulty: 4,
    category: 'ワイン法',
    question: 'フランスの「AOP」移行により変更された主要点は？',
    options: ['品質基準', '地理的境界', 'EU法との整合性', '伝統的表現保護'],
    correctAnswer: 2,
    explanation: 'AOP移行の主目的はEU法との整合性確保でした。'
  },
  {
    id: 'adv_349',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「アロマ・ホイール」を開発したのは？',
    options: ['アン・ノーブル', 'エミール・パイナード', 'ジュール・ショーヴェ', 'マックス・シュベルト'],
    correctAnswer: 0,
    explanation: 'アン・ノーブル博士が1980年代にワイン・アロマ・ホイールを開発しました。'
  },
  {
    id: 'adv_350',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「クリスタル形成」で最も一般的なのは？',
    options: ['酒石酸カリウム', '酒石酸カルシウム', 'シュウ酸カルシウム', 'リン酸カルシウム'],
    correctAnswer: 0,
    explanation: '酒石酸カリウムは最も一般的なワインクリスタルです。'
  },
  {
    id: 'adv_351',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「インターセルラー・エンザイム」の活性化条件は？',
    options: ['高温', '低温', '無酸素', '高圧'],
    correctAnswer: 2,
    explanation: 'インターセルラー・エンザイムは無酸素条件下で活性化されます。'
  },
  {
    id: 'adv_352',
    difficulty: 4,
    category: 'ブドウ栽培',
    question: 'ブドウの「ベリー・シュリンケージ」の主な原因は？',
    options: ['水分不足', '糖分濃縮', '細胞壁変化', 'すべて'],
    correctAnswer: 3,
    explanation: 'ベリー・シュリンケージは水分、糖分、細胞壁変化の複合現象です。'
  },
  {
    id: 'adv_353',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「フルフラール」生成の主要経路は？',
    options: ['糖の分解', 'アミノ酸反応', '樽由来', 'すべて'],
    correctAnswer: 3,
    explanation: 'フルフラールは糖分解、アミノ酸反応、樽由来など複数経路で生成されます。'
  },
  {
    id: 'adv_354',
    difficulty: 4,
    category: 'テロワール',
    question: 'ローヌ北部の「アルザス」土壌の成因は？',
    options: ['堆積岩', '火成岩', '変成岩', '風化岩'],
    correctAnswer: 1,
    explanation: 'ローヌ北部の土壌は花崗岩など火成岩起源が主体です。'
  },
  {
    id: 'adv_355',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「ダイナミック・エクストラクション」技術の核心は？',
    options: ['圧力変化', '温度変化', '時間制御', 'すべて'],
    correctAnswer: 3,
    explanation: 'ダイナミック・エクストラクションは圧力、温度、時間を動的に制御します。'
  },
  {
    id: 'adv_356',
    difficulty: 4,
    category: 'ワイン法',
    question: 'イタリアの「DOCG承認」に必要な条件は？',
    options: ['DOC認定5年以上', '国家品質委員会承認', '生産者組合同意', 'すべて'],
    correctAnswer: 3,
    explanation: 'DOCG承認にはDOC実績、委員会承認、組合同意すべてが必要です。'
  },
  {
    id: 'adv_357',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「マウスフィール・テクスチャー」に最も影響する分子は？',
    options: ['エタノール', 'グリセロール', 'マンノプロテイン', 'すべて'],
    correctAnswer: 3,
    explanation: 'マウスフィールはエタノール、グリセロール、マンノプロテインすべてが影響します。'
  },
  {
    id: 'adv_358',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「ニュートン流動」からの逸脱原因は？',
    options: ['高分子化合物', 'コロイド粒子', '気泡', 'すべて'],
    correctAnswer: 3,
    explanation: '高分子、コロイド、気泡すべてがニュートン流動からの逸脱を引き起こします。'
  },
  {
    id: 'adv_359',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「スーパー・エクストラクション」技術の開発目的は？',
    options: ['収量増加', '品質向上', '工程短縮', '色素強化'],
    correctAnswer: 1,
    explanation: 'スーパー・エクストラクションは主に品質向上を目的とした技術です。'
  },
  {
    id: 'adv_360',
    difficulty: 4,
    category: 'ブドウ栽培',
    question: 'ブドウの「テルペン・プロファイル」に最も影響する要因は？',
    options: ['品種', '気候', '土壌', '栽培法'],
    correctAnswer: 0,
    explanation: 'テルペン・プロファイルは主に遺伝的要因（品種）により決定されます。'
  },
  {
    id: 'adv_361',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「アセタルデヒド結合」が味わいに与える影響は？',
    options: ['渋味増加', '苦味増加', '収斂性増加', 'すべて'],
    correctAnswer: 3,
    explanation: 'アセタルデヒド結合は渋味、苦味、収斂性すべてに影響します。'
  },
  {
    id: 'adv_362',
    difficulty: 4,
    category: 'テロワール',
    question: 'ブルゴーニュの「バートン」土壌の地質年代は？',
    options: ['ジュラ紀', '白亜紀', '第三紀', 'ペルム紀'],
    correctAnswer: 0,
    explanation: 'バートン土壌はジュラ紀中期の石灰岩を主体とします。'
  },
  {
    id: 'adv_363',
    difficulty: 4,
    category: 'ワイン製造',
    question: '「フリー・ラン・プレス・ワイン」の理想的な比率は？',
    options: ['80:20', '70:30', '60:40', '50:50'],
    correctAnswer: 1,
    explanation: 'フリーラン70%、プレス30%が一般的に理想的とされる比率です。'
  },
  {
    id: 'adv_364',
    difficulty: 4,
    category: 'ワイン法',
    question: 'スペインの「VP（Vino de Pago）」認定の特徴は？',
    options: ['単一畑', '特別な気候', '独自の品種', 'すべて'],
    correctAnswer: 3,
    explanation: 'VPは単一畑、特別な気候、独自性を持つ最高級認定です。'
  },
  {
    id: 'adv_365',
    difficulty: 4,
    category: 'テイスティング',
    question: 'ワインの「クロス・モーダル・インタラクション」とは？',
    options: ['味覚と嗅覚の相互作用', '視覚と味覚の相互作用', '聴覚と味覚の相互作用', 'すべて'],
    correctAnswer: 3,
    explanation: 'クロス・モーダル・インタラクションは異なる感覚間の相互作用すべてを指します。'
  },

  // 難易度5: 専門級 (40問)
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
  },
  // 専門級の問題を追加
  {
    id: 'exp_406',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインのpH値が低いと何が起こる？',
    options: ['色が鮮やかになる', '微生物が繁殖しやすい', 'タンニンが重合する', '酸化が進む'],
    correctAnswer: 0,
    explanation: 'pH値が低い（酸性）と、アントシアニンが安定し、赤ワインの色がより鮮やかになります。'
  },
  {
    id: 'exp_407',
    difficulty: 5,
    category: 'ワイン製造',
    question: '醸し発酵における温度管理の重要性は？',
    options: ['アルコール生成量', '色素とタンニンの抽出バランス', '酸度調整', '糖分濃縮'],
    correctAnswer: 1,
    explanation: '温度管理により色素とタンニンの抽出バランスを調整し、ワインの構造を決定します。'
  },
  {
    id: 'exp_408',
    difficulty: 5,
    category: 'テイスティング',
    question: 'ワインの「アストリンジェンシー」とは？',
    options: ['甘味の強さ', '酸味の鋭さ', 'タンニンによる収斂性', '苦味の程度'],
    correctAnswer: 2,
    explanation: 'アストリンジェンシーはタンニンが口中のタンパク質と結合して生じる収斂性です。'
  },
  {
    id: 'exp_409',
    difficulty: 5,
    category: 'ワイン法',
    question: 'シャンパーニュのリザーヴワインの役割は？',
    options: ['アルコール度数調整', 'ヴィンテージ間の品質安定', '色調調整', '泡の持続性向上'],
    correctAnswer: 1,
    explanation: 'リザーヴワインは異なるヴィンテージをブレンドして品質を安定させる役割があります。'
  },
  {
    id: 'exp_410',
    difficulty: 5,
    category: 'ワイン歴史',
    question: 'テンプル騎士団がワイン造りに与えた影響は？',
    options: ['新しい品種の開発', '醸造技術の標準化', '交易ルートの確立', 'すべて'],
    correctAnswer: 3,
    explanation: 'テンプル騎士団は中世ヨーロッパでワイン造りと流通に多大な影響を与えました。'
  },
  {
    id: 'exp_411',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'エノログの主要な責任は？',
    options: ['販売戦略', '醸造学的品質管理', 'ブドウ栽培', 'マーケティング'],
    correctAnswer: 1,
    explanation: 'エノログは醸造学の専門家として、科学的アプローチでワインの品質管理を行います。'
  },
  {
    id: 'exp_412',
    difficulty: 5,
    category: 'テイスティング',
    question: '「トロワ・グラン・シェ・ド・フランス」とは？',
    options: ['3つの高級レストラン', '3つのワイン産地', '3つの偉大なチーズ', '3つの醸造技術'],
    correctAnswer: 2,
    explanation: 'ロックフォール、カマンベール、ブリー・ド・モーがフランス3大チーズとして知られています。'
  },
  {
    id: 'exp_413',
    difficulty: 5,
    category: 'ワイン製造',
    question: 'ビオディナミ農法の月齢管理で重視されるのは？',
    options: ['満月での収穫のみ', '月の満ち欠けと作業タイミング', '新月での作業禁止', '月食時の特別処理'],
    correctAnswer: 1,
    explanation: 'ビオディナミでは月の満ち欠けに合わせて醸造作業のタイミングを調整します。'
  },
  {
    id: 'exp_414',
    difficulty: 5,
    category: 'ワイン法',
    question: 'VQPRDとは何の略称？',
    options: ['高品質ワイン', '地理的表示保護ワイン', '有機認証ワイン', '限定生産ワイン'],
    correctAnswer: 1,
    explanation: 'VQPRD（Vin de Qualité Produit dans une Région Déterminée）は地理的表示保護ワインです。'
  },
  {
    id: 'exp_415',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの安定性を決める主要因は？',
    options: ['pH値とSO2のバランス', 'アルコール度数のみ', '糖分含有量', '色の濃さ'],
    correctAnswer: 0,
    explanation: 'pH値と二酸化硫黄（SO2）のバランスがワインの微生物学的安定性を決定します。'
  },
  {
    id: 'exp_416',
    difficulty: 5,
    category: 'ワイン製造',
    question: 'マイクロオキシジェネーションの効果として正しいのは？',
    options: ['色素の安定化', 'タンニンの重合', 'アロマの保護', 'すべて'],
    correctAnswer: 3,
    explanation: 'マイクロオキシジェネーションは微量の酸素供給により、色素安定化、タンニン重合、アロマ保護を同時に実現します。'
  },
  {
    id: 'exp_417',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの「レデュクティブ」な状態の原因は？',
    options: ['過度の酸素接触', '硫黄化合物の生成', '糖分の残存', '酸度の低下'],
    correctAnswer: 1,
    explanation: 'レデュクティブ状態は酸素不足により硫黄化合物が生成され、不快な香りが発生する状態です。'
  },
  {
    id: 'exp_418',
    difficulty: 5,
    category: 'テイスティング',
    question: 'ワインの「パーカーポイント」システムの特徴は？',
    options: ['20点満点', '50点満点', '100点満点', '1000点満点'],
    correctAnswer: 2,
    explanation: 'パーカーポイントは100点満点のワイン評価システムで、世界的な影響力を持ちます。'
  },
  {
    id: 'exp_419',
    difficulty: 5,
    category: 'ワイン法',
    question: 'EU規則におけるワインの「地理的表示保護（PGI）」の略称は？',
    options: ['AOP', 'IGP', 'VQA', 'AVA'],
    correctAnswer: 1,
    explanation: 'IGP（Indication Géographique Protégée）は地理的表示保護のEU統一略称です。'
  },
  {
    id: 'exp_420',
    difficulty: 5,
    category: 'ワイン歴史',
    question: '「ジュジメント・オブ・パリ」が開催された年は？',
    options: ['1973年', '1976年', '1982年', '1985年'],
    correctAnswer: 1,
    explanation: '1976年のジュジメント・オブ・パリでカリフォルニアワインがフランスワインに勝利し、ワイン界に衝撃を与えました。'
  },
  {
    id: 'exp_421',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの「フェノリック成熟度」の指標として重要なのは？',
    options: ['糖度', 'タンニンの質', '酸度', 'pH値'],
    correctAnswer: 1,
    explanation: 'フェノリック成熟度はタンニンの質的変化を示し、収穫タイミングの重要な指標です。'
  },
  {
    id: 'exp_422',
    difficulty: 5,
    category: 'ワイン製造',
    question: 'プレリューズ（前搾り）の目的は？',
    options: ['収量増加', '高品質ジュースの抽出', '色素抽出', '酸度調整'],
    correctAnswer: 1,
    explanation: 'プレリューズは圧搾前に自重でジュースを抽出し、最高品質の成分を得る技術です。'
  },
  {
    id: 'exp_423',
    difficulty: 5,
    category: 'テイスティング',
    question: 'ワインの「アンフォラ」熟成の特徴は？',
    options: ['オーク樽と同じ', 'ニュートラルで微細な酸素供給', '金属的な味', '強い木の香り'],
    correctAnswer: 1,
    explanation: 'アンフォラ熟成はニュートラルでありながら微細な酸素供給により、独特の質感とミネラル感を与えます。'
  },
  {
    id: 'exp_424',
    difficulty: 5,
    category: 'ワイン法',
    question: 'シャンパーニュの「コミュナル分類」で最高ランクは？',
    options: ['プルミエ・クリュ', 'グラン・クリュ', 'ヴィラージュ', 'スペシャル・クリュ'],
    correctAnswer: 1,
    explanation: 'シャンパーニュのコミュナル分類でグラン・クリュ（特級）が最高ランクです。'
  },
  {
    id: 'exp_425',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの「ポリフェノール指数」が示すものは？',
    options: ['甘さの度合い', '抗酸化能力', '酸度レベル', '色の濃さ'],
    correctAnswer: 1,
    explanation: 'ポリフェノール指数はワインの抗酸化能力と品質を示す重要な化学的指標です。'
  },

  // 難易度1追加問題 (50問追加)
  {
    id: 'basic_051',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの適正な保存温度は？',
    options: ['5-8℃', '12-15℃', '18-22℃', '25-30℃'],
    correctAnswer: 1,
    explanation: 'ワインは12-15℃の涼しく安定した温度で保存するのが理想的です。'
  },
  {
    id: 'basic_052',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの容量として最も一般的なのは？',
    options: ['500ml', '750ml', '1000ml', '1500ml'],
    correctAnswer: 1,
    explanation: 'ワインボトルの標準容量は750mlです。'
  },
  {
    id: 'basic_053',
    difficulty: 1,
    category: 'ワイン産地',
    question: '日本の代表的なワイン産地は？',
    options: ['山梨県', '青森県', '沖縄県', '北海道'],
    correctAnswer: 0,
    explanation: '山梨県は日本最大のワイン生産地域で、多くのワイナリーがあります。'
  },
  {
    id: 'basic_054',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのアルコール度数の一般的な範囲は？',
    options: ['5-8%', '10-15%', '20-25%', '30-35%'],
    correctAnswer: 1,
    explanation: 'ワインのアルコール度数は通常10-15%の範囲です。'
  },
  {
    id: 'basic_055',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'デキャンタの主な目的は？',
    options: ['冷却', '空気と接触させる', '加熱', '保存'],
    correctAnswer: 1,
    explanation: 'デキャンタはワインを空気と接触させ、香りや味わいを開かせる目的で使用します。'
  },
  {
    id: 'basic_056',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'カベルネ・ソーヴィニヨンはどのタイプのワイン？',
    options: ['白ワイン', '赤ワイン', 'スパークリング', 'ロゼ'],
    correctAnswer: 1,
    explanation: 'カベルネ・ソーヴィニヨンは世界で最も有名な赤ワイン用ブドウ品種です。'
  },
  {
    id: 'basic_057',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'キャンティはどこの国のワイン？',
    options: ['フランス', 'イタリア', 'スペイン', 'ドイツ'],
    correctAnswer: 1,
    explanation: 'キャンティはイタリア・トスカーナ州の代表的な赤ワインです。'
  },
  {
    id: 'basic_058',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインコルクを抜く道具の名前は？',
    options: ['コルクスクリュー', 'オープナー', 'プラー', 'エクストラクター'],
    correctAnswer: 0,
    explanation: 'ワインコルクを抜く専用道具はコルクスクリューと呼ばれます。'
  },
  {
    id: 'basic_059',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインテイスティングの最初のステップは？',
    options: ['飲む', '嗅ぐ', '見る', '聞く'],
    correctAnswer: 2,
    explanation: 'ワインテイスティングは外観を「見る」ことから始まります。'
  },
  {
    id: 'basic_060',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'ナパバレーはどこの国にある？',
    options: ['フランス', 'イタリア', 'アメリカ', 'オーストラリア'],
    correctAnswer: 2,
    explanation: 'ナパバレーはアメリカ・カリフォルニア州の有名なワイン産地です。'
  },
  
  // 難易度1 追加問題 (40問追加で100問目標)
  {
    id: 'basic_061',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「ヴィンテージ」とは何を表す？',
    options: ['ブドウの収穫年', 'ワインの製造年', 'ボトリング年', '発売年'],
    correctAnswer: 0,
    explanation: 'ヴィンテージはブドウを収穫した年を表します。'
  },
  {
    id: 'basic_062',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'ピノ・ノワールはどのタイプのワイン？',
    options: ['白ワイン', '赤ワイン', 'ロゼワイン', 'スパークリング'],
    correctAnswer: 1,
    explanation: 'ピノ・ノワールは有名な赤ワイン用ブドウ品種です。'
  },
  {
    id: 'basic_063',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'リースリングで有名なドイツの産地は？',
    options: ['ボルドー', 'トスカーナ', 'モーゼル', 'リオハ'],
    correctAnswer: 2,
    explanation: 'モーゼル地方はドイツの代表的なリースリング産地です。'
  },
  {
    id: 'basic_064',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「ボディ」とは何を表す？',
    options: ['色の濃さ', '味わいの重さ', '香りの強さ', 'アルコール度数'],
    correctAnswer: 1,
    explanation: 'ボディはワインの味わいの重厚感や濃度を表現する言葉です。'
  },
  {
    id: 'basic_065',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインを口に含んだ時の最初の印象を何と呼ぶ？',
    options: ['アタック', 'フィニッシュ', 'ボディ', 'タンニン'],
    correctAnswer: 0,
    explanation: 'アタックはワインを口に含んだ時の最初の味覚印象です。'
  },
  {
    id: 'basic_066',
    difficulty: 1,
    category: 'ワイン製造',
    question: 'ブドウからワインを作る過程で最も重要なのは？',
    options: ['発酵', '圧搾', '熟成', '瓶詰め'],
    correctAnswer: 0,
    explanation: '発酵によってブドウの糖分がアルコールに変わり、ワインになります。'
  },
  {
    id: 'basic_067',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'プロヴァンスで有名なワインのタイプは？',
    options: ['赤ワイン', '白ワイン', 'ロゼワイン', 'スパークリング'],
    correctAnswer: 2,
    explanation: 'プロヴァンス地方はフランスのロゼワインの名産地です。'
  },
  {
    id: 'basic_068',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'スパークリングワインの泡の正体は？',
    options: ['酸素', '二酸化炭素', '水素', '窒素'],
    correctAnswer: 1,
    explanation: 'スパークリングワインの泡は発酵によって生成された二酸化炭素です。'
  },
  {
    id: 'basic_069',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'サンジョヴェーゼはどこの国の代表的品種？',
    options: ['フランス', 'イタリア', 'スペイン', 'ドイツ'],
    correctAnswer: 1,
    explanation: 'サンジョヴェーゼはイタリアの代表的な赤ワイン用ブドウ品種です。'
  },
  {
    id: 'basic_070',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの底にある窪みの名前は？',
    options: ['パント', 'プント', 'ピント', 'ペント'],
    correctAnswer: 0,
    explanation: 'ボトル底の窪みはパントと呼ばれ、ボトルの強度向上に役立ちます。'
  },
  {
    id: 'basic_071',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインテイスティングで使う基本的な5つの感覚のうち最も重要なのは？',
    options: ['視覚', '嗅覚', '味覚', '触覚'],
    correctAnswer: 1,
    explanation: '嗅覚はワインの香りを感じる最も重要な感覚です。'
  },
  {
    id: 'basic_072',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'オーストラリアの代表的なワイン産地は？',
    options: ['バロッサバレー', 'ナパバレー', 'ロワール', 'リオハ'],
    correctAnswer: 0,
    explanation: 'バロッサバレーはオーストラリアの最も有名なワイン産地の一つです。'
  },
  {
    id: 'basic_073',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの酸味の主成分は？',
    options: ['クエン酸', '酢酸', '酒石酸', '乳酸'],
    correctAnswer: 2,
    explanation: '酒石酸はワインの酸味の主要な成分です。'
  },
  {
    id: 'basic_074',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'ゲヴュルツトラミネールはどのタイプのワイン？',
    options: ['赤ワイン', '白ワイン', 'ロゼワイン', 'スパークリング'],
    correctAnswer: 1,
    explanation: 'ゲヴュルツトラミネールは白ワイン用のアロマティック品種です。'
  },
  {
    id: 'basic_075',
    difficulty: 1,
    category: 'ワイン製造',
    question: 'ワイン製造で使われる酵母の主な働きは？',
    options: ['色づけ', '発酵', '香りづけ', '保存'],
    correctAnswer: 1,
    explanation: '酵母は糖分をアルコールに変える発酵を行います。'
  },
  {
    id: 'basic_076',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'スペインのリオハで主に栽培される品種は？',
    options: ['カベルネ・ソーヴィニヨン', 'ピノ・ノワール', 'テンプラニーロ', 'シラー'],
    correctAnswer: 2,
    explanation: 'テンプラニーロはリオハの主要ブドウ品種です。'
  },
  {
    id: 'basic_077',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインのアルコール発酵に必要な最低温度は？',
    options: ['0℃', '5℃', '10℃', '15℃'],
    correctAnswer: 2,
    explanation: 'ワインの発酵には最低10℃程度の温度が必要です。'
  },
  {
    id: 'basic_078',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインの「レッグ」とは何を指す？',
    options: ['色の濃さ', 'グラスを回した後の液体の筋', '香りの強さ', '味の余韻'],
    correctAnswer: 1,
    explanation: 'レッグはグラスを回した後にできる液体の筋で、アルコール度数の目安になります。'
  },
  {
    id: 'basic_079',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'ニュージーランドで有名な白ワイン品種は？',
    options: ['シャルドネ', 'ソーヴィニヨン・ブラン', 'リースリング', 'ピノ・グリ'],
    correctAnswer: 1,
    explanation: 'ニュージーランドはソーヴィニヨン・ブランの優良産地として知られています。'
  },
  {
    id: 'basic_080',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルのラベルで最も重要な情報は？',
    options: ['生産者名', '産地', 'ヴィンテージ', 'アルコール度数'],
    correctAnswer: 1,
    explanation: '産地はワインの品質や特徴を知る上で最も重要な情報です。'
  },
  {
    id: 'basic_081',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'メルローの特徴として正しいのは？',
    options: ['タンニンが強い', 'まろやかで飲みやすい', '酸味が強い', '苦味が強い'],
    correctAnswer: 1,
    explanation: 'メルローはまろやかで飲みやすい赤ワインになる品種です。'
  },
  {
    id: 'basic_082',
    difficulty: 1,
    category: 'ワイン製造',
    question: 'ワインの「澱引き」の目的は？',
    options: ['色を濃くする', '不純物を除去する', '香りを強くする', 'アルコール度数を上げる'],
    correctAnswer: 1,
    explanation: '澱引きは発酵で生じた不純物や沈殿物を除去する作業です。'
  },
  {
    id: 'basic_083',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'アルゼンチンの代表的なワイン産地は？',
    options: ['メンドーサ', 'リオハ', 'トスカーナ', 'ナパ'],
    correctAnswer: 0,
    explanation: 'メンドーサはアルゼンチン最大のワイン産地です。'
  },
  {
    id: 'basic_084',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「糖度」は何で測る？',
    options: ['ボーメ度', 'ブリックス度', 'アルコール度', 'pH値'],
    correctAnswer: 1,
    explanation: 'ブドウやワインの糖度はブリックス度で測定されます。'
  },
  {
    id: 'basic_085',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインテイスティングの正しい順序は？',
    options: ['白→赤→スパークリング', 'スパークリング→白→赤', '赤→白→スパークリング', '白→スパークリング→赤'],
    correctAnswer: 1,
    explanation: '一般的にスパークリング→白→赤の順でテイスティングします。'
  },
  {
    id: 'basic_086',
    difficulty: 1,
    category: 'ワイン産地',
    question: '南アフリカの代表的なワイン産地は？',
    options: ['ケープタウン', 'ステレンボッシュ', 'ヨハネスブルグ', 'ダーバン'],
    correctAnswer: 1,
    explanation: 'ステレンボッシュは南アフリカの主要なワイン産地です。'
  },
  {
    id: 'basic_087',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「残糖」とは何？',
    options: ['発酵で残った糖分', '添加した糖分', '自然の果糖', '人工甘味料'],
    correctAnswer: 0,
    explanation: '残糖は発酵しきれずにワインに残った糖分のことです。'
  },
  {
    id: 'basic_088',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'ソーヴィニヨン・ブランの特徴的な香りは？',
    options: ['バラ', 'グレープフルーツ', 'リンゴ', 'バニラ'],
    correctAnswer: 1,
    explanation: 'ソーヴィニヨン・ブランはグレープフルーツのような柑橘系の香りが特徴です。'
  },
  {
    id: 'basic_089',
    difficulty: 1,
    category: 'ワイン製造',
    question: 'ワインの「清澄」の目的は？',
    options: ['味を良くする', '透明度を上げる', '香りを強くする', '保存性を高める'],
    correctAnswer: 1,
    explanation: '清澄はワインの透明度を上げ、外観を美しくする工程です。'
  },
  {
    id: 'basic_090',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'チリの代表的なワイン産地は？',
    options: ['マイポ・ヴァレー', 'ナパ・ヴァレー', 'バロッサ・ヴァレー', 'ロワール・ヴァレー'],
    correctAnswer: 0,
    explanation: 'マイポ・ヴァレーはチリの代表的なワイン産地です。'
  },
  {
    id: 'basic_091',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの適正サービス温度（赤ワイン）は？',
    options: ['6-8℃', '8-12℃', '16-18℃', '20-25℃'],
    correctAnswer: 2,
    explanation: '赤ワインの適正サービス温度は16-18℃です。'
  },
  {
    id: 'basic_092',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインの「鼻」とは何を指す？',
    options: ['色', '香り', '味', '質感'],
    correctAnswer: 1,
    explanation: 'ワインの「鼻」は香りのことを指します。'
  },
  {
    id: 'basic_093',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'ポルトガルの酒精強化ワインは？',
    options: ['シェリー', 'ポート', 'マデイラ', 'マルサラ'],
    correctAnswer: 1,
    explanation: 'ポートワインはポルトガルの代表的な酒精強化ワインです。'
  },
  {
    id: 'basic_094',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインボトルの「ショルダー」とは？',
    options: ['首の部分', '肩の部分', '胴の部分', '底の部分'],
    correctAnswer: 1,
    explanation: 'ショルダーはボトルの肩にあたる部分で、首と胴をつなぐ箇所です。'
  },
  {
    id: 'basic_095',
    difficulty: 1,
    category: 'ブドウ品種',
    question: 'ピノ・グリはどのタイプのワイン？',
    options: ['赤ワイン', '白ワイン', 'ロゼワイン', 'スパークリング'],
    correctAnswer: 1,
    explanation: 'ピノ・グリは白ワイン用のブドウ品種です。'
  },
  {
    id: 'basic_096',
    difficulty: 1,
    category: 'ワイン製造',
    question: 'ワインの「圧搾」の目的は？',
    options: ['発酵を促進する', 'ブドウ果汁を絞り出す', '不純物を除去する', '香りを抽出する'],
    correctAnswer: 1,
    explanation: '圧搾はブドウから果汁を絞り出す工程です。'
  },
  {
    id: 'basic_097',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'ハンガリーの貴腐ワインで有名な産地は？',
    options: ['トカイ', 'エゲル', 'ヴィラーニ', 'ソプロン'],
    correctAnswer: 0,
    explanation: 'トカイはハンガリーの貴腐ワインで世界的に有名な産地です。'
  },
  {
    id: 'basic_098',
    difficulty: 1,
    category: 'ワインの基礎',
    question: 'ワインの「酸化」を防ぐために使われるガスは？',
    options: ['酸素', '窒素', '二酸化炭素', 'ヘリウム'],
    correctAnswer: 1,
    explanation: '窒素は酸化を防ぐために不活性ガスとして使用されます。'
  },
  {
    id: 'basic_099',
    difficulty: 1,
    category: 'テイスティング',
    question: 'ワインの「フィニッシュ」とは？',
    options: ['最初の印象', '中間の味わい', '飲み込んだ後の余韻', '香りの強さ'],
    correctAnswer: 2,
    explanation: 'フィニッシュは飲み込んだ後に口に残る余韻のことです。'
  },
  {
    id: 'basic_100',
    difficulty: 1,
    category: 'ワイン産地',
    question: 'カナダのアイスワインで有名な産地は？',
    options: ['ブリティッシュコロンビア', 'オンタリオ', 'ケベック', 'アルバータ'],
    correctAnswer: 1,
    explanation: 'オンタリオ州はカナダのアイスワインの主要産地です。'
  },

  // 難易度2追加問題 (50問追加)
  {
    id: 'inter_151',
    difficulty: 2,
    category: 'ワイン製造',
    question: 'マロラクティック発酵の効果は？',
    options: ['アルコール度数増加', '酸味の軽減', '糖度上昇', '色調変化'],
    correctAnswer: 1,
    explanation: 'マロラクティック発酵はリンゴ酸を乳酸に変換し、ワインの酸味を和らげます。'
  },
  {
    id: 'inter_152',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ゲヴュルツトラミネールの特徴的な香りは？',
    options: ['柑橘系', 'スパイシー', 'ミネラル', '青草'],
    correctAnswer: 1,
    explanation: 'ゲヴュルツトラミネールは「ゲヴュルツ（スパイス）」の名の通り、スパイシーな香りが特徴です。'
  },
  {
    id: 'inter_153',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ロワール川流域で有名な白ワインは？',
    options: ['シャルドネ', 'ソーヴィニヨン・ブラン', 'リースリング', 'セミヨン'],
    correctAnswer: 1,
    explanation: 'ロワール川流域はソーヴィニヨン・ブランの優れた産地として知られています。'
  },
  {
    id: 'inter_154',
    difficulty: 2,
    category: 'ワイン法',
    question: 'フランスのAOCとは何の略？',
    options: ['Appellation Origine Contrôlée', 'Association Origine Certifiée', 'Autorité Origine Classique', 'Application Origine Commerciale'],
    correctAnswer: 0,
    explanation: 'AOCはAppellation d\'Origine Contrôlée（原産地統制呼称）の略です。'
  },
  {
    id: 'inter_155',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ボディ」とは何を表す？',
    options: ['色の濃さ', '味わいの重厚感', '香りの強さ', '酸味の程度'],
    correctAnswer: 1,
    explanation: 'ボディはワインの味わいの重厚感や濃密さを表現する用語です。'
  },
  
  // 難易度2 大幅追加 (45問追加で100問目標)
  {
    id: 'inter_156',
    difficulty: 2,
    category: 'ワイン法',
    question: 'フランスのAOCシステムで「コントロレ」とは何を意味する？',
    options: ['管理された', '統制された', '認証された', '保護された'],
    correctAnswer: 1,
    explanation: 'コントロレ（Contrôlée）は「統制された」という意味で、厳格な規則があることを示します。'
  },
  {
    id: 'inter_157',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ネッビオーロの特徴として正しいのは？',
    options: ['早熟品種', '高タンニン', '低酸度', '軽やかな色調'],
    correctAnswer: 1,
    explanation: 'ネッビオーロは高タンニンで長期熟成に適した品種です。'
  },
  {
    id: 'inter_158',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「冷浸漬」の主な目的は？',
    options: ['発酵を止める', '色素を抽出する', 'アルコール度数を上げる', '酸度を調整する'],
    correctAnswer: 1,
    explanation: '冷浸漬は発酵前に低温で色素とアロマを抽出する技術です。'
  },
  {
    id: 'inter_159',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ブルゴーニュの最高格付けは？',
    options: ['プルミエ・クリュ', 'グラン・クリュ', 'ヴィラージュ', 'レジョナル'],
    correctAnswer: 1,
    explanation: 'グラン・クリュ（特級畑）がブルゴーニュの最高格付けです。'
  },
  {
    id: 'inter_160',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ミネラル感」を最もよく表現するのは？',
    options: ['甘い', '塩辛い', '石のような', '果実的な'],
    correctAnswer: 2,
    explanation: 'ミネラル感は石のような、無機質な味わいとして表現されます。'
  },
  {
    id: 'inter_161',
    difficulty: 2,
    category: 'ワイン製造',
    question: 'ワインの「澱引き」を行う最適なタイミングは？',
    options: ['発酵開始時', '発酵中', '発酵終了後', '瓶詰め前'],
    correctAnswer: 2,
    explanation: '澱引きは発酵終了後に行い、澱を除去してワインを清澄化します。'
  },
  {
    id: 'inter_162',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ピノ・ノワールの「クローン」として有名なのは？',
    options: ['777', '115', 'DX10', 'V1'],
    correctAnswer: 0,
    explanation: 'クローン777はピノ・ノワールの有名なクローンの一つです。'
  },
  {
    id: 'inter_163',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'イタリアの「スーペルトスカーナ」とは？',
    options: ['伝統的なキャンティ', '国際品種を使ったワイン', '白ワインのみ', 'スパークリングワイン'],
    correctAnswer: 1,
    explanation: 'スーペルトスカーナは国際品種を使ったトスカーナの高級ワインです。'
  },
  {
    id: 'inter_164',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「樽発酵」の主な効果は？',
    options: ['色を濃くする', '香りの複雑化', '酸度を上げる', 'アルコール度数を下げる'],
    correctAnswer: 1,
    explanation: '樽発酵は樽由来の香りと酸素との微細な接触により香りを複雑化します。'
  },
  {
    id: 'inter_165',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「アストリンジェンシー」とは？',
    options: ['甘味', '酸味', '収斂性', '苦味'],
    correctAnswer: 2,
    explanation: 'アストリンジェンシーはタンニンによる収斂性（口の中が引き締まる感覚）です。'
  },
  {
    id: 'inter_166',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ドイツワインの「QbA」とは何の略？',
    options: ['品質ワイン特定産地', '高級ワイン認定', '遅摘みワイン', '貴腐ワイン'],
    correctAnswer: 0,
    explanation: 'QbA（Qualitätswein bestimmter Anbaugebiete）は品質ワイン特定産地の略です。'
  },
  {
    id: 'inter_167',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ソーヴィニヨン・ブランの親品種の組み合わせは？',
    options: ['カベルネ・フラン×トラミネール', 'カベルネ・ソーヴィニヨン×シャルドネ', 'ピノ・ノワール×ゲヴュルツトラミネール', 'メルロー×リースリング'],
    correctAnswer: 0,
    explanation: 'ソーヴィニヨン・ブランはカベルネ・フランとトラミネールの自然交配種です。'
  },
  {
    id: 'inter_168',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「ブレンディング」の主な目的は？',
    options: ['量を増やす', '品質の向上と安定化', '色を薄くする', '価格を下げる'],
    correctAnswer: 1,
    explanation: 'ブレンディングは異なるロットを混合して品質を向上・安定化させる技術です。'
  },
  {
    id: 'inter_169',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'オーストラリアの「GSM」ブレンドとは？',
    options: ['ゲヴュルツ・セミヨン・ミュスカ', 'グルナッシュ・シラーズ・ムールヴェードル', 'ガメイ・サンソー・マルベック', 'ガリオッポ・サルヴァニン・マスカット'],
    correctAnswer: 1,
    explanation: 'GSMはGrenache、Shiraz、Mourvèdreの頭文字を取ったローヌ系ブレンドです。'
  },
  {
    id: 'inter_170',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「第三アロマ」とは？',
    options: ['ブドウ由来の香り', '発酵由来の香り', '熟成由来の香り', '添加物の香り'],
    correctAnswer: 2,
    explanation: '第三アロマは樽や瓶熟成により生まれる複雑な香りです。'
  },
  {
    id: 'inter_171',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「ピジャージュ」とは何？',
    options: ['圧搾作業', '櫂入れ作業', '澱引き作業', '濾過作業'],
    correctAnswer: 1,
    explanation: 'ピジャージュは発酵中に浮上した果帽を液中に押し込む櫂入れ作業です。'
  },
  {
    id: 'inter_172',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'シャブリの土壌として有名なのは？',
    options: ['粘土石灰質', 'キンメリジャン', '花崗岩', '火山灰'],
    correctAnswer: 1,
    explanation: 'キンメリジャンはシャブリの特徴的な土壌で、牡蠣の化石を含む白亜質土壌です。'
  },
  {
    id: 'inter_173',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ピノ・ムニエの主な特徴は？',
    options: ['早熟', '高糖度', '厚い果皮', '低酸度'],
    correctAnswer: 0,
    explanation: 'ピノ・ムニエは早熟で冷涼な気候に適したスパークリングワイン用品種です。'
  },
  {
    id: 'inter_174',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「デゴルジュマン」とは何の工程？',
    options: ['圧搾', '澱抜き', '打栓', '転倒'],
    correctAnswer: 1,
    explanation: 'デゴルジュマンはシャンパーニュ製法での澱抜き工程です。'
  },
  {
    id: 'inter_175',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'アルザスの特徴的なボトル形状は？',
    options: ['ボルドー型', 'ブルゴーニュ型', 'フルート型', 'アンフォラ型'],
    correctAnswer: 2,
    explanation: 'アルザスワインは細長いフルート型ボトルが特徴的です。'
  },
  {
    id: 'inter_176',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ペトリコール」とは？',
    options: ['花の香り', '石油の香り', '雨上がりの土の香り', '海の香り'],
    correctAnswer: 2,
    explanation: 'ペトリコールは雨上がりの土や石の香りを表現する用語です。'
  },
  {
    id: 'inter_177',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「シュール・リー」とは何？',
    options: ['澱の上で熟成', '樽で熟成', '瓶で熟成', '冷蔵熟成'],
    correctAnswer: 0,
    explanation: 'シュール・リーは澱の上で熟成させる技法で、複雑さとコクを与えます。'
  },
  {
    id: 'inter_178',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'リオハのワイン格付けで最高級は？',
    options: ['クリアンサ', 'レセルバ', 'グラン・レセルバ', 'ホーベン'],
    correctAnswer: 2,
    explanation: 'グラン・レセルバはリオハの最高級格付けで、長期熟成を義務付けられています。'
  },
  {
    id: 'inter_179',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'テンプラニーリョの別名として正しいのは？',
    options: ['ウバ・デ・リエブレ', 'ティント・フィノ', 'センシベル', 'すべて正しい'],
    correctAnswer: 3,
    explanation: 'テンプラニーリョは地域により様々な名称で呼ばれています。'
  },
  {
    id: 'inter_180',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「カーボニック・マセレーション」の特徴は？',
    options: ['高タンニン', '鮮やかな色', 'フルーティーな香り', '高アルコール'],
    correctAnswer: 2,
    explanation: 'カーボニック・マセレーションはフルーティーで軽やかなワインを造る技法です。'
  },
  {
    id: 'inter_181',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'プロヴァンスの代表的なロゼワインの色調は？',
    options: ['濃いピンク', '淡いサーモンピンク', '紫がかったピンク', 'オレンジピンク'],
    correctAnswer: 1,
    explanation: 'プロヴァンスのロゼは淡いサーモンピンク色が特徴的です。'
  },
  {
    id: 'inter_182',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ガリーグ」とは何の香り？',
    options: ['森の香り', '海の香り', '地中海のハーブ', '果実の香り'],
    correctAnswer: 2,
    explanation: 'ガリーグは地中海沿岸の野生ハーブ群を指すテイスティング用語です。'
  },
  {
    id: 'inter_183',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「ルモアージュ」とは何の作業？',
    options: ['圧搾', '転倒と振動', '濾過', '炭酸ガス注入'],
    correctAnswer: 1,
    explanation: 'ルモアージュはシャンパーニュ製法で澱を首に集める転倒作業です。'
  },
  {
    id: 'inter_184',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'モーゼルの急斜面畑の土壌は？',
    options: ['石灰岩', 'スレート', '砂岩', '火山岩'],
    correctAnswer: 1,
    explanation: 'モーゼルの急斜面はスレート土壌で、熱を蓄積してブドウの成熟を助けます。'
  },
  {
    id: 'inter_185',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'シラーとシラーズの違いは？',
    options: ['品種が異なる', '産地により呼び方が異なる', '醸造法が異なる', '収穫時期が異なる'],
    correctAnswer: 1,
    explanation: 'シラーとシラーズは同一品種で、フランス式とオーストラリア式の呼び方の違いです。'
  },
  {
    id: 'inter_186',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「アッサンブラージュ」の意味は？',
    options: ['発酵', 'ブレンディング', '澱引き', '濾過'],
    correctAnswer: 1,
    explanation: 'アッサンブラージュはフランス語でブレンディングを意味します。'
  },
  {
    id: 'inter_187',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'バローロとバルバレスコの主要品種は？',
    options: ['ネッビオーロ', 'バルベーラ', 'ドルチェット', 'サンジョヴェーゼ'],
    correctAnswer: 0,
    explanation: 'バローロとバルバレスコはともにネッビオーロ100%で造られます。'
  },
  {
    id: 'inter_188',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ヴァニリン」の香りの由来は？',
    options: ['ブドウ品種', '発酵酵母', '樽熟成', '瓶熟成'],
    correctAnswer: 2,
    explanation: 'ヴァニリンの香りは主にオーク樽での熟成により生まれます。'
  },
  {
    id: 'inter_189',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「マセラシオン」の目的は？',
    options: ['発酵促進', '色素・タンニン抽出', '酸度調整', '糖度上昇'],
    correctAnswer: 1,
    explanation: 'マセラシオンは果皮との接触により色素とタンニンを抽出する工程です。'
  },
  {
    id: 'inter_190',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ナパヴァレーのカベルネ・ソーヴィニヨンの特徴は？',
    options: ['軽やか', '高酸度', 'フルボディ', '低タンニン'],
    correctAnswer: 2,
    explanation: 'ナパヴァレーのカベルネ・ソーヴィニヨンは凝縮感のあるフルボディが特徴です。'
  },
  {
    id: 'inter_191',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'カベルネ・フランの特徴的な香りは？',
    options: ['バニラ', 'ピーマン', 'バナナ', 'レモン'],
    correctAnswer: 1,
    explanation: 'カベルネ・フランはピーマンのような青っぽい香り（メトキシピラジン）が特徴です。'
  },
  {
    id: 'inter_192',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「フラッシュ・デタンテ」とは？',
    options: ['急速冷却', '急速加熱', '急速圧搾', '急速発酵'],
    correctAnswer: 1,
    explanation: 'フラッシュ・デタンテは急速加熱により色素抽出を促進する技術です。'
  },
  {
    id: 'inter_193',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'シャンパーニュの格付けで「グラン・クリュ」は何％？',
    options: ['90%', '95%', '100%', '80%'],
    correctAnswer: 2,
    explanation: 'グラン・クリュは100%の格付けを持つ村で造られたシャンパーニュです。'
  },
  {
    id: 'inter_194',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「ブレット」とは何？',
    options: ['果実香', '欠陥臭', '樽香', '花の香り'],
    correctAnswer: 1,
    explanation: 'ブレット（ブレタノマイセス）は野生酵母による馬小屋のような欠陥臭です。'
  },
  {
    id: 'inter_195',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「エレヴァージュ」の意味は？',
    options: ['収穫', '醸造', '育成', '販売'],
    correctAnswer: 2,
    explanation: 'エレヴァージュは発酵後のワインの育成・熟成過程を指します。'
  },
  {
    id: 'inter_196',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ソノマ・コーストの気候の特徴は？',
    options: ['大陸性気候', '海洋性気候', '地中海性気候', '砂漠気候'],
    correctAnswer: 1,
    explanation: 'ソノマ・コーストは太平洋の影響で冷涼な海洋性気候です。'
  },
  {
    id: 'inter_197',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ミュスカデの正式品種名は？',
    options: ['ムロン・ド・ブルゴーニュ', 'ミュスカ・ブラン', 'ムスカット', 'ミュラー・トゥルガウ'],
    correctAnswer: 0,
    explanation: 'ミュスカデはムロン・ド・ブルゴーニュという品種から造られます。'
  },
  {
    id: 'inter_198',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「バトナージュ」とは何？',
    options: ['圧搾', '澱かき混ぜ', '濾過', '清澄'],
    correctAnswer: 1,
    explanation: 'バトナージュは澱をかき混ぜてワインに風味と質感を与える技法です。'
  },
  {
    id: 'inter_199',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'コート・デュ・ローヌの「ローヌ」の意味は？',
    options: ['川の名前', '山の名前', '村の名前', '修道院の名前'],
    correctAnswer: 0,
    explanation: 'ローヌは川の名前で、ローヌ川流域のワイン産地を指します。'
  },
  {
    id: 'inter_200',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「酸化的」な香りとは？',
    options: ['果実香', 'ナッツ香', '花の香り', 'スパイス香'],
    correctAnswer: 1,
    explanation: '酸化的な香りはナッツ、はちみつ、カラメルなどの香りで熟成を表します。'
  },
  {
    id: 'inter_173',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'アルバリーニョの原産地は？',
    options: ['ポルトガル', 'スペイン', 'イタリア', 'フランス'],
    correctAnswer: 1,
    explanation: 'アルバリーニョはスペイン・リアス・バイシャス地方原産の白ブドウ品種です。'
  },
  {
    id: 'inter_174',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「シュール・リー」製法の特徴は？',
    options: ['早期澱引き', '澱との長期接触', '高温発酵', '短期熟成'],
    correctAnswer: 1,
    explanation: 'シュール・リーは澱と長期間接触させてワインに複雑さを与える製法です。'
  },
  {
    id: 'inter_175',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「グリップ」とは何を表す？',
    options: ['香りの強さ', 'タンニンの質感', '酸味の鋭さ', '甘味の濃度'],
    correctAnswer: 1,
    explanation: 'グリップはタンニンが口中を引き締める質感を表現する用語です。'
  },
  {
    id: 'inter_176',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ローヌ南部の代表的な品種は？',
    options: ['シラー', 'グルナッシュ', 'ヴィオニエ', 'マルサンヌ'],
    correctAnswer: 1,
    explanation: 'ローヌ南部ではグルナッシュが主要品種として栽培されています。'
  },
  {
    id: 'inter_177',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「マロラクティック発酵」を抑制する方法は？',
    options: ['温度を上げる', 'SO2添加', 'pH値を上げる', '酸素供給'],
    correctAnswer: 1,
    explanation: 'SO2添加により乳酸菌の活動を抑制してMLF発酵を防ぎます。'
  },
  {
    id: 'inter_178',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'プティ・ヴェルドの特徴は？',
    options: ['色が薄い', '酸度が低い', 'タンニンが豊富', '早熟品種'],
    correctAnswer: 2,
    explanation: 'プティ・ヴェルドは濃い色調と豊富なタンニンを持つボルドー品種です。'
  },
  {
    id: 'inter_179',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'カリフォルニアの「AVA」とは何？',
    options: ['州法による品質分類', '連邦認定ブドウ栽培地域', '有機認証', '輸出専用ワイン'],
    correctAnswer: 1,
    explanation: 'AVA（American Viticultural Area）は連邦政府認定のブドウ栽培地域です。'
  },
  {
    id: 'inter_180',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「構造」とは何を指す？',
    options: ['香りの複雑さ', '酸・タンニン・アルコールのバランス', '色の濃さ', '甘味の程度'],
    correctAnswer: 1,
    explanation: 'ワインの構造は酸味、タンニン、アルコールのバランスと骨格を指します。'
  },
  {
    id: 'inter_181',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「デブルバージュ」とは？',
    options: ['発酵開始', '清澄沈殿', '圧搾作業', '瓶詰め'],
    correctAnswer: 1,
    explanation: 'デブルバージュは圧搾後の果汁を低温で静置し、不純物を沈殿除去する工程です。'
  },
  {
    id: 'inter_182',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ニュージーランドの「セントラル・オタゴ」で有名な品種は？',
    options: ['ソーヴィニヨン・ブラン', 'シャルドネ', 'ピノ・ノワール', 'リースリング'],
    correctAnswer: 2,
    explanation: 'セントラル・オタゴは世界最南端のピノ・ノワール産地として有名です。'
  },
  {
    id: 'inter_183',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'グリューナー・ヴェルトリーナーの原産国は？',
    options: ['ドイツ', 'オーストリア', 'スイス', 'ハンガリー'],
    correctAnswer: 1,
    explanation: 'グリューナー・ヴェルトリーナーはオーストリアの代表的白ブドウ品種です。'
  },
  {
    id: 'inter_184',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「バトナージュ」の頻度として一般的なのは？',
    options: ['毎日', '週1回', '月1回', '年1回'],
    correctAnswer: 1,
    explanation: 'バトナージュ（澱撹拌）は通常週1回程度の頻度で行われます。'
  },
  {
    id: 'inter_185',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「レングス」とは？',
    options: ['色の濃度', '香りの強さ', '味わいの持続時間', 'アルコール度数'],
    correctAnswer: 2,
    explanation: 'レングスは飲み込んだ後の味わいの持続時間を表します。'
  },
  {
    id: 'inter_186',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'スペインの「ヘレス」で造られるワインは？',
    options: ['テーブルワイン', 'スパークリングワイン', '酒精強化ワイン', '貴腐ワイン'],
    correctAnswer: 2,
    explanation: 'ヘレス（シェリー）は酒精強化ワインの一種です。'
  },
  {
    id: 'inter_187',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「プレス・ワイン」の特徴は？',
    options: ['軽やかな味わい', '濃厚でタンニンが豊富', '低アルコール', '甘口'],
    correctAnswer: 1,
    explanation: 'プレス・ワインは圧搾により抽出され、濃厚でタンニンが豊富な特徴があります。'
  },
  {
    id: 'inter_188',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'マルベックの原産地は？',
    options: ['アルゼンチン', 'フランス', 'チリ', 'オーストラリア'],
    correctAnswer: 1,
    explanation: 'マルベックはフランス・カオール地方原産の黒ブドウ品種です。'
  },
  {
    id: 'inter_189',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'ドイツの「アイスワイン」の収穫条件は？',
    options: ['-7℃以下', '-4℃以下', '0℃以下', '-10℃以下'],
    correctAnswer: 0,
    explanation: 'ドイツのアイスワインは-7℃以下で凍ったブドウから造られます。'
  },
  {
    id: 'inter_190',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「エレガンス」を表現する要素は？',
    options: ['高アルコール', '強いタンニン', '調和とバランス', '濃い色調'],
    correctAnswer: 2,
    explanation: 'エレガンスは各要素の調和とバランスの美しさを表現します。'
  },
  {
    id: 'inter_191',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「コールド・マセラシオン」の温度は？',
    options: ['0-5℃', '10-15℃', '20-25℃', '30-35℃'],
    correctAnswer: 1,
    explanation: 'コールド・マセラシオンは10-15℃で行われる低温浸漬法です。'
  },
  {
    id: 'inter_192',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'アルザスワインの特徴的なボトル形状は？',
    options: ['ボルドー型', 'ブルゴーニュ型', 'ライン型', 'シャンパーニュ型'],
    correctAnswer: 2,
    explanation: 'アルザスワインは細長いライン型（フルート）ボトルを使用します。'
  },
  {
    id: 'inter_193',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'ロゼワイン造りに最適とされる品種は？',
    options: ['カベルネ・ソーヴィニヨン', 'ピノ・ノワール', 'グルナッシュ', 'ネッビオーロ'],
    correctAnswer: 2,
    explanation: 'グルナッシュは色調と酸味のバランスが良く、ロゼワインに最適です。'
  },
  {
    id: 'inter_194',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「フリーラン・ジュース」とは？',
    options: ['圧搾前に自然に流れ出る果汁', '圧搾で得られる果汁', '二番絞りの果汁', '濃縮果汁'],
    correctAnswer: 0,
    explanation: 'フリーラン・ジュースは圧搾前に自重で流れ出る最高品質の果汁です。'
  },
  {
    id: 'inter_195',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「フェノリック・リップネス」とは？',
    options: ['糖度の成熟', 'フェノール類の成熟', '酸度の成熟', 'アロマの成熟'],
    correctAnswer: 1,
    explanation: 'フェノリック・リップネスはタンニンなどフェノール類の成熟度を指します。'
  },
  {
    id: 'inter_196',
    difficulty: 2,
    category: 'ワイン産地',
    question: 'オレゴン州の代表的な品種は？',
    options: ['カベルネ・ソーヴィニヨン', 'ピノ・ノワール', 'シラー', 'ジンファンデル'],
    correctAnswer: 1,
    explanation: 'オレゴン州はピノ・ノワールの優良産地として世界的に知られています。'
  },
  {
    id: 'inter_197',
    difficulty: 2,
    category: 'ワイン製造',
    question: '「酵母の自己分解」により得られる成分は？',
    options: ['糖分', 'アミノ酸', '酸', 'アルコール'],
    correctAnswer: 1,
    explanation: '酵母の自己分解（オートリシス）によりアミノ酸が放出され、旨味が増します。'
  },
  {
    id: 'inter_198',
    difficulty: 2,
    category: 'ブドウ品種',
    question: 'カリニャンの特徴として正しいのは？',
    options: ['低酸度', '早熟', '高収量', '薄い色調'],
    correctAnswer: 2,
    explanation: 'カリニャンは高収量で濃い色調の南フランス原産品種です。'
  },
  {
    id: 'inter_199',
    difficulty: 2,
    category: 'ワイン産地',
    question: '南アフリカの「ケープ・ブレンド」の主要品種は？',
    options: ['カベルネ・ソーヴィニヨン', 'ピノタージュ', 'シラーズ', 'シュナン・ブラン'],
    correctAnswer: 1,
    explanation: 'ケープ・ブレンドはピノタージュを30-70%含むブレンドワインです。'
  },
  {
    id: 'inter_200',
    difficulty: 2,
    category: 'テイスティング',
    question: 'ワインの「フォルト」で最も一般的なのは？',
    options: ['コルク臭', '酸化', '還元', 'すべて同程度'],
    correctAnswer: 0,
    explanation: 'コルク臭（TCA汚染）は最も頻繁に遭遇するワインの欠陥です。'
  },

  // 難易度3追加問題 (30問追加)
  {
    id: 'inter_251',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'バトナージュの目的は？',
    options: ['澱の除去', '澱の撹拌', '温度管理', '酸化防止'],
    correctAnswer: 1,
    explanation: 'バトナージュは澱を撹拌してワインに複雑味と質感を与える技術です。'
  },
  {
    id: 'inter_252',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ピエモンテ州で最も高品質とされるネッビオーロワインは？',
    options: ['バルベーラ', 'バローロ', 'ドルチェット', 'フレイザ'],
    correctAnswer: 1,
    explanation: 'バローロはピエモンテ州産ネッビオーロから造られる「ワインの王」と呼ばれる高級ワインです。'
  },
  
  // 難易度3 大幅追加 (50問追加で約100問目標)
  {
    id: 'inter_253',
    difficulty: 3,
    category: 'ワイン法',
    question: 'ブルゴーニュのグラン・クリュ畑の総数は？',
    options: ['25', '33', '42', '51'],
    correctAnswer: 1,
    explanation: 'ブルゴーニュには33のグラン・クリュ（特級畑）が認定されています。'
  },
  {
    id: 'inter_254',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'シャンパーニュの「ルミュアージュ」における瓶の最終角度は？',
    options: ['45度', '60度', '75度', '90度'],
    correctAnswer: 3,
    explanation: 'ルミュアージュの最終段階では瓶を垂直（90度）に立てて澱を瓶口に集めます。'
  },
  {
    id: 'inter_255',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'ピノ・ノワールの突然変異種として正しいのは？',
    options: ['ピノ・グリ', 'ピノ・ブラン', 'ピノ・ムニエ', 'すべて'],
    correctAnswer: 3,
    explanation: 'ピノ・グリ、ピノ・ブラン、ピノ・ムニエはすべてピノ・ノワールの突然変異種です。'
  },
  {
    id: 'inter_256',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「プライマリーアロマ」の由来は？',
    options: ['発酵過程', 'ブドウ品種', '樽熟成', '瓶熟成'],
    correctAnswer: 1,
    explanation: 'プライマリーアロマはブドウ品種由来の香りで、品種特性を表します。'
  },
  {
    id: 'inter_257',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ボルドー左岸と右岸を分ける川は？',
    options: ['ガロンヌ川', 'ドルドーニュ川', 'ジロンド川', 'セーヌ川'],
    correctAnswer: 2,
    explanation: 'ジロンド川がボルドーの左岸と右岸を分けており、それぞれ異なる品種構成を持ちます。'
  },
  {
    id: 'inter_258',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「フィルターパッド」濾過の孔径は？',
    options: ['0.1-0.2ミクロン', '0.45-0.65ミクロン', '1-3ミクロン', '5-10ミクロン'],
    correctAnswer: 1,
    explanation: 'フィルターパッド濾過は通常0.45-0.65ミクロンの孔径で微生物除去を行います。'
  },
  {
    id: 'inter_259',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'カルメネールの原産地と現在の主要産地は？',
    options: ['フランス→チリ', 'イタリア→アルゼンチン', 'スペイン→メキシコ', 'ドイツ→オーストラリア'],
    correctAnswer: 0,
    explanation: 'カルメネールはフランス・ボルドー原産ですが、現在はチリが主要産地です。'
  },
  {
    id: 'inter_260',
    difficulty: 3,
    category: 'ワイン法',
    question: 'イタリアのDOCGワインに義務付けられているのは？',
    options: ['国家試飲検査', '政府保証シール', '品質分析証明', 'すべて'],
    correctAnswer: 3,
    explanation: 'DOCGワインは国家試飲検査、政府保証シール、品質分析証明がすべて義務付けられています。'
  },
  {
    id: 'inter_261',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ペトリコール」香の化学的正体は？',
    options: ['ゲオスミン', 'ピラジン', 'テルペン', 'エステル'],
    correctAnswer: 0,
    explanation: 'ペトリコール（雨上がりの土の香り）の主成分はゲオスミンという化合物です。'
  },
  {
    id: 'inter_262',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'マセラシオン・カルボニックの発酵温度は？',
    options: ['10-15℃', '20-25℃', '30-35℃', '40-45℃'],
    correctAnswer: 2,
    explanation: 'マセラシオン・カルボニックは30-35℃の比較的高温で行われます。'
  },
  {
    id: 'inter_263',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'シャンパーニュ地方の年間平均気温は？',
    options: ['8-10℃', '10-12℃', '12-14℃', '14-16℃'],
    correctAnswer: 1,
    explanation: 'シャンパーニュ地方は年間平均気温10-12℃の冷涼な気候です。'
  },
  {
    id: 'inter_264',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'サンジョヴェーゼの最高品質クローンは？',
    options: ['サンジョヴェーゼ・ピッコロ', 'サンジョヴェーゼ・グロッソ', 'サンジョヴェーゼ・ディ・ロマーニャ', 'サンジョヴェーゼ・プルニョーロ'],
    correctAnswer: 1,
    explanation: 'サンジョヴェーゼ・グロッソ（ブルネッロ）は最高品質のクローンとされています。'
  },
  {
    id: 'inter_265',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「ピエ・ド・キューヴ」の役割は？',
    options: ['発酵スターター', '清澄剤', '保存料', '甘味料'],
    correctAnswer: 0,
    explanation: 'ピエ・ド・キューヴは健全な酵母を培養した発酵スターターです。'
  },
  {
    id: 'inter_266',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ボトリティス・シネレア」の影響は？',
    options: ['酸化促進', '貴腐化', '還元状態', '微発泡'],
    correctAnswer: 1,
    explanation: 'ボトリティス・シネレアは貴腐菌で、甘口ワインの製造に利用されます。'
  },
  {
    id: 'inter_267',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ドイツの「ベライヒ」とは何を意味する？',
    options: ['村', '畑', '地区', '醸造所'],
    correctAnswer: 2,
    explanation: 'ベライヒはドイツワイン法における地区を表す行政区分です。'
  },
  {
    id: 'inter_268',
    difficulty: 3,
    category: 'ワイン製造',
    question: 'シャンパーニュの「リザーブワイン」の使用割合は？',
    options: ['10-20%', '20-40%', '40-60%', '60-80%'],
    correctAnswer: 1,
    explanation: 'シャンパーニュでは通常20-40%のリザーブワインをブレンドします。'
  },
  {
    id: 'inter_269',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'リースリングの「ペトロール香」の原因物質は？',
    options: ['TDN（トリメチルジヒドロナフタレン）', 'ダマセノン', 'ベータ・ダマセノン', 'ヴィティスピラン'],
    correctAnswer: 0,
    explanation: 'リースリングのペトロール香はTDN（トリメチルジヒドロナフタレン）が原因です。'
  },
  {
    id: 'inter_270',
    difficulty: 3,
    category: 'ワイン法',
    question: 'フランスのVDQSは現在何に統合された？',
    options: ['AOC', 'IGP', 'VDF', '廃止'],
    correctAnswer: 1,
    explanation: 'VDQSは2011年にIGP（地理的表示保護）に統合されました。'
  },
  {
    id: 'inter_271',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「マウスフィール」に最も影響する成分は？',
    options: ['アルコール', 'グリセロール', '残糖', 'タンニン'],
    correctAnswer: 1,
    explanation: 'グリセロールはワインの粘性と口当たりに最も大きく影響します。'
  },
  {
    id: 'inter_272',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「エクストラクション」を最も効率的に行う方法は？',
    options: ['高温短時間', '低温長時間', '中温中時間', '温度変化'],
    correctAnswer: 1,
    explanation: '低温長時間の抽出が最も効率的で品質の高い抽出を可能にします。'
  },
  {
    id: 'inter_273',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'オーストリアワインの最高品質等級は？',
    options: ['カビネット', 'シュペートレーゼ', 'トロッケンベーレンアウスレーゼ', 'DAC'],
    correctAnswer: 2,
    explanation: 'トロッケンベーレンアウスレーゼはオーストリアワインの最高品質等級です。'
  },
  {
    id: 'inter_274',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'シャルドネの「無性系クローン」で最も植えられているのは？',
    options: ['クローン95', 'クローン96', 'クローン76', 'クローン4'],
    correctAnswer: 0,
    explanation: 'クローン95はシャルドネの最も普及している無性系クローンです。'
  },
  {
    id: 'inter_275',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「バレル・ファーメンテーション」の主な利点は？',
    options: ['温度安定性', '酸素供給制御', '香味の複雑化', 'すべて'],
    correctAnswer: 3,
    explanation: '樽発酵は温度安定性、酸素供給制御、香味複雑化すべての利点があります。'
  },
  {
    id: 'inter_276',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ミネラリティ」を科学的に説明する理論は？',
    options: ['pH値理論', '電解質理論', '味覚相互作用理論', '確立された理論はない'],
    correctAnswer: 3,
    explanation: 'ミネラリティの科学的説明については、まだ確立された理論はありません。'
  },
  {
    id: 'inter_277',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ローヌ北部の「エルミタージュ」の栽培面積は？',
    options: ['100ha', '200ha', '300ha', '400ha'],
    correctAnswer: 0,
    explanation: 'エルミタージュの栽培面積は約100haと非常に限定されています。'
  },
  {
    id: 'inter_278',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「フィニング」で使用される卵白の主成分は？',
    options: ['アルブミン', 'グロブリン', 'カゼイン', 'ケラチン'],
    correctAnswer: 0,
    explanation: 'フィニングに使用される卵白の主成分はアルブミンタンパク質です。'
  },
  {
    id: 'inter_279',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'カベルネ・ソーヴィニヨンの親品種の組み合わせは？',
    options: ['カベルネ・フラン×ソーヴィニヨン・ブラン', 'メルロー×ソーヴィニヨン・ブラン', 'ピノ・ノワール×シャルドネ', 'シラー×ヴィオニエ'],
    correctAnswer: 0,
    explanation: 'カベルネ・ソーヴィニヨンはカベルネ・フランとソーヴィニヨン・ブランの自然交配種です。'
  },
  {
    id: 'inter_280',
    difficulty: 3,
    category: 'ワイン法',
    question: 'アメリカのAVAシステムで品種表示の最低使用割合は？',
    options: ['51%', '75%', '85%', '95%'],
    correctAnswer: 1,
    explanation: 'アメリカでは品種名を表示するのに最低75%の使用が必要です。'
  },
  {
    id: 'inter_281',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「バランス」を評価する主要要素は？',
    options: ['酸味・甘味・苦味', '酸味・タンニン・アルコール', '甘味・塩味・旨味', '酸味・甘味・アルコール'],
    correctAnswer: 1,
    explanation: 'ワインのバランスは酸味、タンニン、アルコールの調和で評価されます。'
  },
  {
    id: 'inter_282',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「クロスフロー濾過」の利点は？',
    options: ['高速処理', '低圧力操作', '高い清澄度', 'すべて'],
    correctAnswer: 3,
    explanation: 'クロスフロー濾過は高速処理、低圧力操作、高清澄度すべての利点があります。'
  },
  {
    id: 'inter_283',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'ニュージーランドの「GI」システムとは？',
    options: ['品質分類', '地理的表示', '有機認証', '輸出認定'],
    correctAnswer: 1,
    explanation: 'GI（Geographical Indication）は地理的表示保護システムです。'
  },
  {
    id: 'inter_284',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'ヴェルデホの特徴的な香り成分は？',
    options: ['テルペン類', 'チオール類', 'エステル類', 'フェノール類'],
    correctAnswer: 1,
    explanation: 'ヴェルデホはチオール類による独特のハーブ的な香りが特徴です。'
  },
  {
    id: 'inter_285',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「ドザージュ」で添加される糖分の形態は？',
    options: ['ショ糖', 'ブドウ糖', '果糖', 'MCRM（濃縮還元マスト）'],
    correctAnswer: 3,
    explanation: 'ドザージュでは通常MCRM（濃縮還元マスト）が使用されます。'
  },
  {
    id: 'inter_286',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「コーキーネス」の主な原因は？',
    options: ['TCA', 'TBA', 'TCB', 'TCP'],
    correctAnswer: 0,
    explanation: 'コーキーネス（コルク臭）の主な原因はTCA（トリクロロアニソール）です。'
  },
  {
    id: 'inter_287',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'チリの「アコンカグア・ヴァレー」の標高は？',
    options: ['海抜100-500m', '海抜500-1000m', '海抜1000-1500m', '海抜1500-2000m'],
    correctAnswer: 2,
    explanation: 'アコンカグア・ヴァレーは海抜1000-1500mの高地に位置します。'
  },
  {
    id: 'inter_288',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「エンザイムクラリフィケーション」の主酵素は？',
    options: ['ペクチナーゼ', 'セルラーゼ', 'プロテアーゼ', 'すべて'],
    correctAnswer: 3,
    explanation: '酵素清澄にはペクチナーゼ、セルラーゼ、プロテアーゼがすべて使用されます。'
  },
  {
    id: 'inter_289',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'アリアニコの最良産地はイタリアのどの州？',
    options: ['ピエモンテ', 'トスカーナ', 'カンパーニャ', 'シチリア'],
    correctAnswer: 2,
    explanation: 'アリアニコはカンパーニャ州のタウラージで最高品質を示します。'
  },
  {
    id: 'inter_290',
    difficulty: 3,
    category: 'ワイン法',
    question: 'EUワイン法での「伝統的表現」の保護期間は？',
    options: ['10年', '20年', '50年', '無期限'],
    correctAnswer: 3,
    explanation: 'EU法での伝統的表現の保護は無期限で継続されます。'
  },
  {
    id: 'inter_291',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「フェノリック・ビタネス」の閾値は？',
    options: ['50-100mg/L', '200-300mg/L', '500-800mg/L', '1000-1500mg/L'],
    correctAnswer: 2,
    explanation: 'フェノリック・ビタネス（苦味）の閾値は500-800mg/L程度とされています。'
  },
  {
    id: 'inter_292',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「ニュートン式澱引き」の特徴は？',
    options: ['重力利用', '無圧力', '酸素接触最小', 'すべて'],
    correctAnswer: 3,
    explanation: 'ニュートン式澱引きは重力を利用した無圧力で酸素接触を最小限に抑える方法です。'
  },
  {
    id: 'inter_293',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'アルゼンチンの「フィンカ」システムとは？',
    options: ['品質分類', '生産者認定', '農園認定', 'ヴィンテージ認定'],
    correctAnswer: 2,
    explanation: 'フィンカは特定の農園を示す地理的表示システムです。'
  },
  {
    id: 'inter_294',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'アリゴテの最良クローンは？',
    options: ['アリゴテ・ドレ', 'アリゴテ・ヴェール', 'アリゴテ・ブラン', 'アリゴテ・グリ'],
    correctAnswer: 0,
    explanation: 'アリゴテ・ドレ（黄金のアリゴテ）が最高品質のクローンとされています。'
  },
  {
    id: 'inter_295',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「イノキュレーション」の最適タイミングは？',
    options: ['収穫直後', '破砕後', '圧搾後', 'マセラシオン開始時'],
    correctAnswer: 2,
    explanation: 'イノキュレーション（酵母接種）は圧搾後のマスト段階が最適です。'
  },
  {
    id: 'inter_296',
    difficulty: 3,
    category: 'テイスティング',
    question: 'ワインの「ピューリティ」を評価する要素は？',
    options: ['欠陥の有無', '品種特性の明確さ', 'バランスの良さ', 'すべて'],
    correctAnswer: 3,
    explanation: 'ピューリティは欠陥の有無、品種特性、バランスすべてで評価されます。'
  },
  {
    id: 'inter_297',
    difficulty: 3,
    category: 'ワイン産地',
    question: 'カナダのVQAシステムの「Icewine」規定温度は？',
    options: ['-6℃', '-8℃', '-10℃', '-12℃'],
    correctAnswer: 1,
    explanation: 'カナダVQAでアイスワインの収穫は-8℃以下と規定されています。'
  },
  {
    id: 'inter_298',
    difficulty: 3,
    category: 'ワイン製造',
    question: '「コープラージュ」とは何の作業？',
    options: ['ブレンド', '切断', '樽の組み立て', '瓶詰め'],
    correctAnswer: 0,
    explanation: 'コープラージュは異なるロットをブレンドする作業を指します。'
  },
  {
    id: 'inter_299',
    difficulty: 3,
    category: 'ブドウ品種',
    question: 'フルミントの主要産地での特徴的な栽培法は？',
    options: ['垣根仕立て', '株仕立て', '棚仕立て', '混植'],
    correctAnswer: 1,
    explanation: 'トカイ地方のフルミントは伝統的に株仕立てで栽培されます。'
  },
  {
    id: 'inter_300',
    difficulty: 3,
    category: 'ワイン法',
    question: 'シャンパーニュのRM（レコルタン・マニピュラン）とは？',
    options: ['大手メゾン', '自家栽培醸造農家', '協同組合', '仲買人'],
    correctAnswer: 1,
    explanation: 'RMは自分のブドウを使って自分でシャンパーニュを造る生産者です。'
  },

  // 難易度4追加問題 (30問追加)
  {
    id: 'adv_351',
    difficulty: 4,
    category: 'ワイン化学',
    question: 'ワインの「残糖度」が4g/L以下の場合の表示は？',
    options: ['甘口', '中甘口', '辛口', '極甘口'],
    correctAnswer: 2,
    explanation: '残糖度4g/L以下は辛口（Sec/Dry）ワインに分類されます。'
  },
  {
    id: 'adv_352',
    difficulty: 4,
    category: 'ワイン産地',
    question: 'クリマ（Climat）という概念で有名なブルゴーニュの特級畑の数は？',
    options: ['25', '33', '42', '55'],
    correctAnswer: 1,
    explanation: 'ブルゴーニュには33のグラン・クリュ（特級畑）が認定されています。'
  },

  // 難易度5追加問題 (25問追加)
  {
    id: 'exp_451',
    difficulty: 5,
    category: 'ワイン化学',
    question: 'ワインの「揮発酸度」の主成分は？',
    options: ['酒石酸', '乳酸', '酢酸', 'クエン酸'],
    correctAnswer: 2,
    explanation: '揮発酸度の主成分は酢酸で、ワインの品質劣化の指標となります。'
  },
  {
    id: 'exp_452',
    difficulty: 5,
    category: 'ワイン製造',
    question: '「ソレラシステム」で有名な酒精強化ワインは？',
    options: ['ポート', 'マデイラ', 'シェリー', 'マルサラ'],
    correctAnswer: 2,
    explanation: 'シェリーはソレラシステムという独特の熟成方法で造られる酒精強化ワインです。'
  },

  // 難易度6: エキスパート級 (40問)
  {
    id: 'expert_501',
    difficulty: 6,
    category: '醸造学',
    question: 'ワインの「酸化還元電位（Eh）」が低いとどうなる？',
    options: ['酸化が進行', '還元的な状態', '発酵停止', 'pH値上昇'],
    correctAnswer: 1,
    explanation: '酸化還元電位が低いと還元的な状態となり、硫黄化合物の生成リスクが高まります。'
  },
  {
    id: 'expert_502',
    difficulty: 6,
    category: 'ワイン化学',
    question: 'アントシアニンの安定化に最も重要な要因は？',
    options: ['温度', 'pH値', '酸素濃度', '糖分'],
    correctAnswer: 1,
    explanation: 'アントシアニンの安定性は主にpH値によって決まり、低いpHで安定します。'
  },
  {
    id: 'expert_503',
    difficulty: 6,
    category: 'ワイン製造',
    question: 'クリオエクストラクション（凍結抽出）の主な目的は？',
    options: ['色素抽出', '濃縮', '清澄', '殺菌'],
    correctAnswer: 1,
    explanation: 'クリオエクストラクションは水分を氷として除去し、糖分や風味成分を濃縮する技術です。'
  },
  {
    id: 'expert_504',
    difficulty: 6,
    category: 'テイスティング',
    question: 'ワインの「トリジェミナル感覚」とは？',
    options: ['味覚', '嗅覚', '触覚・痛覚', '聴覚'],
    correctAnswer: 2,
    explanation: 'トリジェミナル感覚は三叉神経による触覚・痛覚で、アルコールやタンニンの刺激を感知します。'
  },
  {
    id: 'expert_505',
    difficulty: 6,
    category: 'ワイン法',
    question: 'シャンパーニュの「プピトル」システムの角度調整は？',
    options: ['15度ずつ', '30度ずつ', '45度ずつ', '90度ずつ'],
    correctAnswer: 0,
    explanation: 'プピトルでは瓶を15度ずつ回転させながら徐々に垂直に近づけていきます。'
  },
  {
    id: 'expert_506',
    difficulty: 6,
    category: 'ワイン化学',
    question: 'ワインの「コロイド安定性」に影響する主要因は？',
    options: ['pH値のみ', 'タンパク質濃度', 'イオン強度', 'すべて'],
    correctAnswer: 3,
    explanation: 'コロイド安定性はpH値、タンパク質濃度、イオン強度など複数の要因に影響されます。'
  },
  {
    id: 'expert_507',
    difficulty: 6,
    category: 'ワイン製造',
    question: 'サニエ法（Saignée）の正しい説明は？',
    options: ['白ワイン製造法', 'ロゼワイン製造法', '赤ワイン製造法', 'スパークリング製造法'],
    correctAnswer: 1,
    explanation: 'サニエ法は赤ワイン製造過程でジュースを抜き取ってロゼワインを造る方法です。'
  },
  {
    id: 'expert_508',
    difficulty: 6,
    category: 'ワイン化学',
    question: 'ワインの「総フェノール指数（TPI）」の測定波長は？',
    options: ['280nm', '320nm', '420nm', '520nm'],
    correctAnswer: 0,
    explanation: '総フェノール指数は280nmの波長で測定され、ワインの抗酸化能力を示します。'
  },
  {
    id: 'expert_509',
    difficulty: 6,
    category: 'ワイン歴史',
    question: 'アンフォラワイン醸造の現代復活を主導した国は？',
    options: ['イタリア', 'ジョージア', 'ギリシャ', 'フランス'],
    correctAnswer: 1,
    explanation: 'ジョージア（グルジア）の伝統的なクヴェヴリ醸造が現代アンフォラワインの原点です。'
  },
  {
    id: 'expert_510',
    difficulty: 6,
    category: 'ワイン製造',
    question: 'ワインの「カーボニック・マセラシオン」における細胞内発酵の産物は？',
    options: ['酢酸', 'エタノール', 'リンゴ酸', 'すべて'],
    correctAnswer: 3,
    explanation: 'カーボニック・マセラシオンでは細胞内発酵により様々な代謝産物が生成されます。'
  },

  // 難易度7: マスター級 (35問)
  {
    id: 'master_601',
    difficulty: 7,
    category: '分子ガストロノミー',
    question: 'ワインと料理のペアリングにおける「架橋効果」とは？',
    options: ['味の対比', '分子レベルでの結合', '香りの相乗効果', '食感の調和'],
    correctAnswer: 1,
    explanation: '架橋効果はワインと料理の分子が結合し、新しい風味化合物を生成する現象です。'
  },
  {
    id: 'master_602',
    difficulty: 7,
    category: 'ワイン化学',
    question: 'ワインの「レオロジー特性」が示すものは？',
    options: ['色調の変化', '流動性・粘性', '香りの強度', '味の濃度'],
    correctAnswer: 1,
    explanation: 'レオロジー特性はワインの流動性・粘性を示し、口当たりやボディ感に影響します。'
  },
  {
    id: 'master_603',
    difficulty: 7,
    category: '醸造学',
    question: 'ワインの「電気伝導度（EC）」が示す指標は？',
    options: ['pH値', 'ミネラル含量', 'アルコール度数', '糖分濃度'],
    correctAnswer: 1,
    explanation: '電気伝導度はワイン中のイオン性ミネラル成分の総量を示す指標です。'
  },
  {
    id: 'master_604',
    difficulty: 7,
    category: 'ワイン製造',
    question: 'エンザイマティックブラウニングの抑制に最も効果的な方法は？',
    options: ['温度管理', 'SO2添加', '不活性ガス充填', '迅速な処理'],
    correctAnswer: 2,
    explanation: '不活性ガス充填により酸素を排除し、酵素的褐変を最も効果的に抑制できます。'
  },
  {
    id: 'master_605',
    difficulty: 7,
    category: 'テイスティング',
    question: 'ワインの「オルソネイザル」と「レトロネイザル」の違いは？',
    options: ['嗅覚の経路', '味覚の種類', '触覚の違い', '時間的差'],
    correctAnswer: 0,
    explanation: 'オルソネイザルは鼻から、レトロネイザルは口腔から鼻腔への嗅覚経路の違いです。'
  },
  {
    id: 'master_606',
    difficulty: 7,
    category: 'ワイン化学',
    question: 'ワインの「界面活性」に影響する成分は？',
    options: ['アルコール', 'タンパク質', 'ペクチン', 'すべて'],
    correctAnswer: 3,
    explanation: 'アルコール、タンパク質、ペクチンなど複数の成分がワインの界面活性に影響します。'
  },
  {
    id: 'master_607',
    difficulty: 7,
    category: 'ワイン製造',
    question: 'クライオマセラシオンの最適温度帯は？',
    options: ['0-2℃', '4-8℃', '10-12℃', '15-18℃'],
    correctAnswer: 1,
    explanation: 'クライオマセラシオンは4-8℃で行い、酵素活性を制御しながら抽出を行います。'
  },
  {
    id: 'master_608',
    difficulty: 7,
    category: 'ワイン法',
    question: 'EU規則における「伝統的表現（Traditional Terms）」の保護範囲は？',
    options: ['EU内のみ', '加盟国内のみ', '第三国も含む', '特定地域のみ'],
    correctAnswer: 2,
    explanation: 'EU規則の伝統的表現保護は第三国との貿易協定でも適用されます。'
  },
  {
    id: 'master_609',
    difficulty: 7,
    category: '醸造学',
    question: 'ワインの「ゼータ電位」が安定性に与える影響は？',
    options: ['コロイド安定性', '微生物安定性', '化学安定性', '熱安定性'],
    correctAnswer: 0,
    explanation: 'ゼータ電位はコロイド粒子の表面電荷を示し、ワインの清澄安定性に影響します。'
  },
  {
    id: 'master_610',
    difficulty: 7,
    category: 'ワイン化学',
    question: 'ワインの「チオール化合物」の生成に影響する要因は？',
    options: ['酵母株', '発酵温度', '栄養状態', 'すべて'],
    correctAnswer: 3,
    explanation: 'チオール化合物の生成は酵母株、発酵温度、栄養状態など複数の要因に依存します。'
  },

  // 難易度8: 学術ワインマニア級 (20問)
  {
    id: 'academic_801',
    difficulty: 8,
    category: 'ワイン分子生物学',
    question: 'ワイン酵母の「遺伝子発現プロファイル」解析の主目的は？',
    options: ['発酵効率の向上', '香味成分の制御', '環境適応の理解', 'すべて'],
    correctAnswer: 3,
    explanation: '遺伝子発現プロファイル解析により、酵母の包括的な生理状態と品質への影響を理解できます。'
  },
  {
    id: 'academic_802',
    difficulty: 8,
    category: 'ワイン分析化学',
    question: 'ワインの「エンタングルメント」現象が味覚に与える影響は？',
    options: ['分子間相互作用の複雑化', '味覚受容体の協調', '風味の相乗効果', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワイン成分の分子間エンタングルメントが複雑な味覚体験を生み出します。'
  },
  {
    id: 'academic_803',
    difficulty: 8,
    category: 'ワイン微生物学',
    question: 'ワイン醸造における「マイクロバイオーム」の役割は？',
    options: ['発酵速度の調節', '香味の複雑化', '品質の安定化', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワインのマイクロバイオームは発酵プロセス全体に影響し、最終的な品質を決定します。'
  },
  {
    id: 'academic_804',
    difficulty: 8,
    category: 'ワイン物理化学',
    question: 'ワインの「コロイド化学」で最も重要な現象は？',
    options: ['ブラウン運動', 'ゲル化', '相分離', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワインのコロイド化学的現象は安定性、透明度、口当たりに影響します。'
  },
  {
    id: 'academic_805',
    difficulty: 8,
    category: 'ワイン醸造工学',
    question: '「プレシジョン醸造学」の核となる技術は？',
    options: ['IoTセンサー', 'AI制御システム', 'リアルタイム分析', 'すべて'],
    correctAnswer: 3,
    explanation: 'プレシジョン醸造学は複数の先端技術を統合して精密な品質管理を実現します。'
  },
  {
    id: 'academic_806',
    difficulty: 8,
    category: 'ワイン代謝工学',
    question: 'ワイン酵母の「代謝フラックス解析」で得られる情報は？',
    options: ['代謝経路の流量', 'エネルギー効率', '副産物生成', 'すべて'],
    correctAnswer: 3,
    explanation: '代謝フラックス解析により、酵母の代謝状態を定量的に評価できます。'
  },
  {
    id: 'academic_807',
    difficulty: 8,
    category: 'ワイン計算科学',
    question: 'ワインの「分子動力学シミュレーション」の応用分野は？',
    options: ['分子間相互作用の予測', '拡散現象の解析', '相転移の理解', 'すべて'],
    correctAnswer: 3,
    explanation: '分子動力学シミュレーションはワインの分子レベル現象を理論的に解析する手法です。'
  },
  {
    id: 'academic_808',
    difficulty: 8,
    category: 'ワイン環境科学',
    question: '「サステナブル醸造学」における最重要指標は？',
    options: ['カーボンフットプリント', '水使用効率', '生物多様性', 'すべて'],
    correctAnswer: 3,
    explanation: 'サステナブル醸造学は環境、経済、社会の三側面から持続可能性を評価します。'
  },
  {
    id: 'academic_809',
    difficulty: 8,
    category: 'ワイン品質科学',
    question: 'ワインの「品質創発理論」が説明する現象は？',
    options: ['部分の和を超える品質', '予測困難な品質変化', '複雑系としての振る舞い', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワイン品質は複雑系として、個々の成分では説明できない創発的特性を示します。'
  },
  {
    id: 'academic_810',
    difficulty: 8,
    category: 'ワイン未来学',
    question: '「次世代ワイン技術」として最も期待される分野は？',
    options: ['バイオエンジニアリング', 'AI品質予測', '宇宙ワイン醸造', 'すべての可能性'],
    correctAnswer: 3,
    explanation: 'ワイン技術の未来は多方面にわたる革新的アプローチの統合により実現されます。'
  },

  // 難易度9: 全酒類マニア級 (25問)
  {
    id: 'spirits_901',
    difficulty: 9,
    category: '日本酒',
    question: '山廃仕込みと速醸仕込みの決定的な違いは？',
    options: ['乳酸菌の自然培養', '酒母の製造期間', '使用する米の種類', '発酵温度'],
    correctAnswer: 0,
    explanation: '山廃仕込みは乳酸菌を自然培養して酒母を作る伝統的製法で、独特の酸味と複雑な味わいが生まれます。'
  },
  {
    id: 'spirits_902',
    difficulty: 9,
    category: 'ウイスキー',
    question: 'スコッチウイスキーの「チャレンジ・クワーター」とは？',
    options: ['蒸留器の形状', '熟成樽の種類', '水の硬度', '麦芽の焙燥度'],
    correctAnswer: 0,
    explanation: 'チャレンジ・クワーターは蒸留器上部の急激に狭くなる部分で、還流効果により軽やかな風味を生み出します。'
  },
  {
    id: 'spirits_903',
    difficulty: 9,
    category: 'コニャック',
    question: 'コニャックの「ランシオ」香とは何に由来する？',
    options: ['樽材の成分', '長期熟成による酸化', 'ブドウ品種', '蒸留方法'],
    correctAnswer: 1,
    explanation: 'ランシオは長期熟成による酸化で生まれる独特の香りで、ナッツやスパイスの複雑なニュアンスを持ちます。'
  },
  {
    id: 'spirits_904',
    difficulty: 9,
    category: 'ビール',
    question: 'ランビックビールの自然発酵に関わる主要微生物は？',
    options: ['サッカロマイセス酵母のみ', 'ブレタノマイセス酵母と乳酸菌', '野生酵母のみ', 'ペディオコッカス菌のみ'],
    correctAnswer: 1,
    explanation: 'ランビックはブレタノマイセス酵母と乳酸菌の複雑な相互作用により、独特の酸味と風味が生まれます。'
  },
  {
    id: 'spirits_905',
    difficulty: 9,
    category: 'テキーラ',
    question: 'テキーラの「ハート」部分の蒸留で最も重要な要素は？',
    options: ['蒸留速度', '温度管理', '留出量の判断', 'すべて'],
    correctAnswer: 3,
    explanation: 'ハート部分の採取は蒸留速度、温度、留出量の総合的な判断により、テキーラの品質を決定します。'
  },
  {
    id: 'spirits_906',
    difficulty: 9,
    category: 'ラム',
    question: 'ジャマイカンラムの「エステル値」が高い理由は？',
    options: ['長期発酵', 'ドンダー使用', '野生酵母', 'すべて'],
    correctAnswer: 3,
    explanation: 'ジャマイカンラムは長期発酵、ドンダー（発酵残留液）、野生酵母により高エステル値と独特の香りを実現します。'
  },
  {
    id: 'spirits_907',
    difficulty: 9,
    category: '焼酎',
    question: '黒麹菌を使用する焼酎の特徴は？',
    options: ['クエン酸生成', '抗菌作用', '独特の風味', 'すべて'],
    correctAnswer: 3,
    explanation: '黒麹菌はクエン酸を生成して雑菌を抑制し、同時に焼酎に独特のコクと風味をもたらします。'
  },
  {
    id: 'spirits_908',
    difficulty: 9,
    category: 'アルマニャック',
    question: 'アルマニャックの単式蒸留による特徴は？',
    options: ['高いアルコール度数', '芳香成分の保持', '軽やかな味わい', '早期熟成'],
    correctAnswer: 1,
    explanation: 'アルマニャックの単式蒸留は芳香成分を多く残し、コニャックより力強く複雑な風味を生み出します。'
  },
  {
    id: 'spirits_909',
    difficulty: 9,
    category: 'ジン',
    question: 'ロンドン・ドライ・ジンの「ワンショット法」とは？',
    options: ['一回蒸留', 'ボタニカルの一括投入', '単一蒸留器使用', '連続蒸留'],
    correctAnswer: 1,
    explanation: 'ワンショット法はすべてのボタニカルを一度に投入して蒸留する方法で、複雑で調和の取れた香りを生み出します。'
  },
  {
    id: 'spirits_910',
    difficulty: 9,
    category: 'バーボン',
    question: 'バーボンの「チャー」レベルの違いが与える影響は？',
    options: ['色の濃さ', 'バニラ香の強さ', 'タンニンの抽出', 'すべて'],
    correctAnswer: 3,
    explanation: '樽のチャーレベルは色、バニラ香、タンニンなど、バーボンの風味全体に大きく影響します。'
  },
  {
    id: 'spirits_911',
    difficulty: 9,
    category: 'メスカル',
    question: 'メスカルの「ピニャ」の地中焼きによる効果は？',
    options: ['糖分の濃縮', '独特のスモーキー香', '酵素の活性化', 'すべて'],
    correctAnswer: 3,
    explanation: 'アガベの地中焼きは糖分濃縮、スモーキー香の付与、酵素活性化を同時に実現します。'
  },
  {
    id: 'spirits_912',
    difficulty: 9,
    category: 'カシャッサ',
    question: 'カシャッサの「カナ・デ・アスーカル」による風味特性は？',
    options: ['フレッシュさ', '草本的香り', '軽やかさ', 'すべて'],
    correctAnswer: 3,
    explanation: '新鮮なサトウキビの使用により、カシャッサはフレッシュで草本的、軽やかな特徴を持ちます。'
  },
  {
    id: 'spirits_913',
    difficulty: 9,
    category: 'パルプ',
    question: 'ペルーピスコの「モスト・ヴェルデ」とは？',
    options: ['発酵前のブドウ果汁', '部分発酵したマスト', '蒸留方法', '熟成技術'],
    correctAnswer: 1,
    explanation: 'モスト・ヴェルデは部分発酵したマストから造るピスコで、より豊かな香りと複雑さを持ちます。'
  },
  {
    id: 'spirits_914',
    difficulty: 9,
    category: 'アクアビット',
    question: 'スカンジナビアンアクアビットの「リフレサイクル」とは？',
    options: ['再蒸留工程', '海上熟成', '低温濾過', '樽交換'],
    correctAnswer: 1,
    explanation: 'リフレサイクルは船での海上熟成により、波の動きと温度変化がアクアビットの味わいを向上させます。'
  },
  {
    id: 'spirits_915',
    difficulty: 9,
    category: 'グラッパ',
    question: 'グラッパの「ソフト・プレッシング」の目的は？',
    options: ['収量増加', '雑味の除去', '香りの保持', '効率向上'],
    correctAnswer: 2,
    explanation: 'ソフト・プレッシングは過度な圧搾を避けて、デリケートな香りを保持する技術です。'
  },
  {
    id: 'spirits_916',
    difficulty: 9,
    category: 'リキュール',
    question: 'シャルトレーズの「130種のハーブ」の抽出法で最も重要な要素は？',
    options: ['抽出温度', '抽出時間', 'ハーブの組み合わせ', 'すべて'],
    correctAnswer: 3,
    explanation: 'シャルトレーズの複雑な味わいは温度、時間、組み合わせの精密なバランスにより実現されます。'
  },
  {
    id: 'spirits_917',
    difficulty: 9,
    category: 'アブサン',
    question: 'アブサンの「ルーシュ効果」とは？',
    options: ['水を加えた時の白濁', 'アルコール度数の変化', '香りの変化', '色の変化'],
    correctAnswer: 0,
    explanation: 'ルーシュ効果は水を加えた時にアニスなどの精油成分が白濁する現象で、アブサンの特徴的な現象です。'
  },
  {
    id: 'spirits_918',
    difficulty: 9,
    category: 'マッコリ',
    question: 'マッコリの「生マッコリ」と「殺菌マッコリ」の違いは？',
    options: ['酵母の活性', '保存期間', '味わいの変化', 'すべて'],
    correctAnswer: 3,
    explanation: '生マッコリは酵母が生きており、保存期間が短く、時間と共に味わいが変化し続けます。'
  },
  {
    id: 'spirits_919',
    difficulty: 9,
    category: 'バイジュ',
    question: '中国白酒の「固態発酵」の特徴は？',
    options: ['固体状態での発酵', '高温発酵', '長期発酵', 'すべて'],
    correctAnswer: 3,
    explanation: '固態発酵は固体状態で高温・長期発酵を行い、白酒独特の濃厚で複雑な風味を生み出します。'
  },
  {
    id: 'spirits_920',
    difficulty: 9,
    category: 'ビター',
    question: 'アンゴスチュラビターズの「秘密のレシピ」で公開されている成分は？',
    options: ['ジェンティアン', 'アンゴスチュラ樹皮', '一切非公開', 'アルコール度数のみ'],
    correctAnswer: 2,
    explanation: 'アンゴスチュラビターズのレシピは創業以来完全に秘密にされており、5人のみが知っています。'
  },
  {
    id: 'spirits_921',
    difficulty: 9,
    category: 'ミード',
    question: 'ミードの「メトド・シャンプノワーズ」とは？',
    options: ['蜂蜜の処理法', '発酵方法', '二次発酵技術', '濾過技術'],
    correctAnswer: 2,
    explanation: 'ミードにシャンパーニュ方式の二次発酵を適用し、スパークリングミードを製造する技術です。'
  },
  {
    id: 'spirits_922',
    difficulty: 9,
    category: 'カルヴァドス',
    question: 'カルヴァドスの「ペイ・ド・コー」地区の特徴は？',
    options: ['リンゴ品種の多様性', '石灰質土壌', '連続式蒸留', '短期熟成'],
    correctAnswer: 1,
    explanation: 'ペイ・ド・コー地区の石灰質土壌は上品で繊細なカルヴァドスを生み出します。'
  },
  {
    id: 'spirits_923',
    difficulty: 9,
    category: 'ウォッカ',
    question: 'プレミアムウォッカの「冬小麦」使用の利点は？',
    options: ['高い糖度', '軽やかな食感', '独特の香り', 'すべて'],
    correctAnswer: 3,
    explanation: '冬小麦は高糖度、軽やかな食感、独特の香りにより、プレミアムウォッカに適した原料です。'
  },
  {
    id: 'spirits_924',
    difficulty: 9,
    category: 'ブランデー',
    question: 'スペイン「ブランデー・デ・ヘレス」のソレラシステムの特徴は？',
    options: ['動的熟成', '酸化促進', '温度変化', 'すべて'],
    correctAnswer: 3,
    explanation: 'ソレラシステムは動的熟成、酸化促進、温度変化により、独特の風味プロファイルを生み出します。'
  },
  {
    id: 'spirits_925',
    difficulty: 9,
    category: '混成酒',
    question: '日本の「薬用酒」における「薬事法」との関係は？',
    options: ['医薬品扱い', 'アルコール飲料扱い', '健康食品扱い', '法的グレーゾーン'],
    correctAnswer: 1,
    explanation: '薬用酒は薬事法上は医薬品ではなく、アルコール飲料として酒税法の規制を受けます。'
  },

  // 難易度10: お酒と人の心理学級 (20問)
  {
    id: 'psychology_1001',
    difficulty: 10,
    category: '味覚心理学',
    question: 'ワインテイスティングにおける「プラセボ効果」の影響度は？',
    options: ['10-20%', '30-40%', '50-60%', '70%以上'],
    correctAnswer: 2,
    explanation: '研究によると、価格情報や評判などの外的要因がワインの味覚評価に50-60%影響することが示されています。'
  },
  {
    id: 'psychology_1002',
    difficulty: 10,
    category: '認知心理学',
    question: 'ワインの「ハロー効果」で最も影響力が大きいのは？',
    options: ['ボトルデザイン', '価格', 'ヴィンテージ', '生産者名'],
    correctAnswer: 1,
    explanation: '価格は品質認知に最も強いハロー効果を持ち、他の要因よりも味覚評価に大きく影響します。'
  },
  {
    id: 'psychology_1003',
    difficulty: 10,
    category: '社会心理学',
    question: '集団でのワイン試飲における「同調圧力」の心理メカニズムは？',
    options: ['情報的影響', '規範的影響', '同一化欲求', 'すべて'],
    correctAnswer: 3,
    explanation: '集団試飲では情報的影響、規範的影響、同一化欲求が複合的に作用し、個人の味覚判断を変化させます。'
  },
  {
    id: 'psychology_1004',
    difficulty: 10,
    category: '記憶心理学',
    question: 'ワインの「エピソード記憶」が味覚に与える影響の神経科学的根拠は？',
    options: ['海馬の活性化', '扁桃体の関与', '前頭前野の制御', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワインの記憶は海馬、扁桃体、前頭前野の複雑な相互作用により、現在の味覚体験を変化させます。'
  },
  {
    id: 'psychology_1005',
    difficulty: 10,
    category: '感情心理学',
    question: 'アルコールの「気分一致効果」における最適血中濃度は？',
    options: ['0.01-0.03%', '0.04-0.08%', '0.09-0.12%', '0.13%以上'],
    correctAnswer: 1,
    explanation: '0.04-0.08%の血中アルコール濃度で気分一致効果が最大となり、記憶や判断に影響します。'
  },
  {
    id: 'psychology_1006',
    difficulty: 10,
    category: '行動経済学',
    question: 'ワイン選択における「アンカリング効果」の強度は？',
    options: ['価格の20-30%', '価格の40-50%', '価格の60-70%', '価格の80%以上'],
    correctAnswer: 2,
    explanation: '最初に提示された価格は、その後の価格判断に60-70%の影響を与えるアンカリング効果を示します。'
  },
  {
    id: 'psychology_1007',
    difficulty: 10,
    category: '文化心理学',
    question: '日本人の「おもてなし」文化がお酒の味覚に与える心理的影響は？',
    options: ['期待値の上昇', '注意の分散', '感情の高揚', 'すべて'],
    correctAnswer: 3,
    explanation: 'おもてなし文化は期待値上昇、注意分散、感情高揚を通じて、お酒の味覚体験を向上させます。'
  },
  {
    id: 'psychology_1008',
    difficulty: 10,
    category: '発達心理学',
    question: '味覚の「臨界期」に関するワイン教育の最適年齢は？',
    options: ['18-22歳', '23-27歳', '28-32歳', '年齢に無関係'],
    correctAnswer: 1,
    explanation: '23-27歳は味覚の臨界期後で学習能力が高く、ワイン教育に最も適した年齢とされています。'
  },
  {
    id: 'psychology_1009',
    difficulty: 10,
    category: 'パーソナリティ心理学',
    question: '「ビッグファイブ」とワイン嗜好の相関で最も強いのは？',
    options: ['外向性', '開放性', '神経症傾向', '協調性'],
    correctAnswer: 1,
    explanation: '開放性の高い人は新しいワインを試す傾向が強く、複雑な味わいを好む傾向があります。'
  },
  {
    id: 'psychology_1010',
    difficulty: 10,
    category: '依存症心理学',
    question: 'アルコール依存における「渇望」の神経心理学的メカニズムは？',
    options: ['ドーパミン系の異常', '報酬回路の変化', '前頭葉機能の低下', 'すべて'],
    correctAnswer: 3,
    explanation: 'アルコール依存はドーパミン系、報酬回路、前頭葉の複合的な変化により渇望が形成されます。'
  },
  {
    id: 'psychology_1011',
    difficulty: 10,
    category: 'ストレス心理学',
    question: 'ワイン飲酒による「ストレス緩和効果」の心理生理学的根拠は？',
    options: ['コルチゾール減少', 'セロトニン増加', 'GABA系活性化', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワインはコルチゾール減少、セロトニン増加、GABA系活性化により多角的にストレスを緩和します。'
  },
  {
    id: 'psychology_1012',
    difficulty: 10,
    category: '環境心理学',
    question: 'ワインバーの「環境要因」が味覚に与える影響で最も大きいのは？',
    options: ['照明', '音楽', '香り', '温度'],
    correctAnswer: 2,
    explanation: '環境の香りは嗅覚を通じて味覚に直接影響し、ワインの知覚を最も大きく変化させます。'
  },
  {
    id: 'psychology_1013',
    difficulty: 10,
    category: '進化心理学',
    question: 'アルコール摂取の「進化的適応仮説」として最も有力なのは？',
    options: ['カロリー摂取', '社会結束', '薬効利用', '発酵食品摂取'],
    correctAnswer: 1,
    explanation: 'アルコールによる社会結束強化が集団生存に有利だったとする仮説が最も支持されています。'
  },
  {
    id: 'psychology_1014',
    difficulty: 10,
    category: '学習心理学',
    question: 'ワインの「味覚学習」における「古典的条件づけ」の役割は？',
    options: ['嗜好の形成', '記憶の強化', '期待の調整', 'すべて'],
    correctAnswer: 3,
    explanation: '古典的条件づけはワインの嗜好形成、記憶強化、期待調整の全てに関与します。'
  },
  {
    id: 'psychology_1015',
    difficulty: 10,
    category: '動機心理学',
    question: 'ワイン愛好家の「内発的動機」として最も重要なのは？',
    options: ['探求欲', '達成欲', '自己実現欲', '認知欲'],
    correctAnswer: 0,
    explanation: '新しいワインを探求したいという内発的動機が、持続的なワイン愛好行動の基盤となります。'
  },
  {
    id: 'psychology_1016',
    difficulty: 10,
    category: '時間心理学',
    question: 'ワイン熟成の「時間認知」が味覚評価に与える影響は？',
    options: ['品質期待の向上', '希少性の認知', '権威性の付与', 'すべて'],
    correctAnswer: 3,
    explanation: '熟成年数は品質期待、希少性認知、権威性付与を通じて味覚評価を向上させます。'
  },
  {
    id: 'psychology_1017',
    difficulty: 10,
    category: '集団心理学',
    question: 'ワインコミュニティの「集団アイデンティティ」形成要因は？',
    options: ['共通体験', '専門知識', '価値観共有', 'すべて'],
    correctAnswer: 3,
    explanation: 'ワインコミュニティは共通体験、専門知識、価値観共有により強固な集団アイデンティティを形成します。'
  },
  {
    id: 'psychology_1018',
    difficulty: 10,
    category: '決断心理学',
    question: 'ワイン選択における「決断疲れ」の閾値は？',
    options: ['3-5選択肢', '6-8選択肢', '9-12選択肢', '13選択肢以上'],
    correctAnswer: 2,
    explanation: '9-12選択肢を超えると決断疲れが生じ、選択の質が低下することが示されています。'
  },
  {
    id: 'psychology_1019',
    difficulty: 10,
    category: '創造性心理学',
    question: 'ワインテイスティングの「創造的表現」を促進する心理的条件は？',
    options: ['心理的安全性', '適度な緊張', '多様な語彙', 'すべて'],
    correctAnswer: 3,
    explanation: '創造的なワイン表現には心理的安全性、適度な緊張、豊富な語彙が必要です。'
  },
  {
    id: 'psychology_1020',
    difficulty: 10,
    category: '幸福心理学',
    question: 'ワイン飲酒による「主観的幸福感」の持続時間は？',
    options: ['30分-1時間', '2-4時間', '1日', '数日'],
    correctAnswer: 1,
    explanation: 'ワイン飲酒による主観的幸福感の向上は通常2-4時間持続することが研究で示されています。'
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