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