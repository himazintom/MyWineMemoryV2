import type { QuizQuestion } from '../../../../types';

// TSGトレーニング 品種解説編「シャルドネ」 - クイズ問題
export const studyTsg05Questions: QuizQuestion[] = [
  {
    id: 'STUDY_TSG_05_001',
    difficulty: 1,
    category: 'TSGシャルドネ',
    question: 'シャルドネの品種特性として正しいものはどれか？',
    options: ['アロマティック品種', 'ニュートラル品種', '赤ワイン用品種', '高タンニン品種'],
    correctAnswer: 1,
    explanation: 'シャルドネはニュートラル品種で、個性が強くなく、土壌・環境・作り手の個性が強く表現される品種です。'
  },
  {
    id: 'STUDY_TSG_05_002',
    difficulty: 2,
    category: 'TSGシャルドネ',
    question: 'シャブリで使用される品種はどれか？',
    options: ['ソーヴィニヨン・ブラン', 'シャルドネ', 'リースリング', 'ピノ・グリ'],
    correctAnswer: 1,
    explanation: 'シャブリは地名であり、使用される品種はシャルドネです。シャルドネはボーノワ（シノニム）とも呼ばれます。'
  },
  {
    id: 'STUDY_TSG_05_003',
    difficulty: 2,
    category: 'TSGシャルドネ',
    question: '冷涼地で栽培されたシャルドネの香りの特徴はどれか？',
    options: ['トロピカルフルーツ、蜂蜜', '柑橘、青リンゴ', 'バター、バニラ', 'スパイス、ハーブ'],
    correctAnswer: 1,
    explanation: '冷涼地のシャルドネは柑橘や青リンゴの香りが特徴的で、温暖地ではトロピカルフルーツや蜂蜜の香りになります。'
  },
  {
    id: 'STUDY_TSG_05_004',
    difficulty: 3,
    category: 'TSGシャルドネ',
    question: 'ロウキャップの開け方として最近主流になっている方法はどれか？',
    options: ['キャップシール同様にカット', 'ソムリエナイフで中央を刺す', '叩いて割る', 'ロウソクで溶かす'],
    correctAnswer: 1,
    explanation: '最近主流になっているロウキャップの開け方は、ソムリエナイフで中央を刺す方法ですが、カスに注意が必要です。'
  },
  {
    id: 'STUDY_TSG_05_005',
    difficulty: 3,
    category: 'TSGシャルドネ',
    question: '白ワインのpHと輝きの関係として正しいものはどれか？',
    options: ['pH高い＝輝き強い', 'pH低い＝輝き強い', 'pHと輝きは無関係', 'pH中性＝輝き強い'],
    correctAnswer: 1,
    explanation: '白ワインのpHは3～3.8で、pH低いほど酸味が増し、輝きが強い＝pH低い可能性があります。'
  },
  {
    id: 'STUDY_TSG_05_006',
    difficulty: 2,
    category: 'TSGシャルドネ製法',
    question: '醸造方法由来でシャルドネに現れる香りはどれか？',
    options: ['柑橘系の香り', 'バター、バニラ、ナッツ', 'フローラルな香り', 'ミネラルの香り'],
    correctAnswer: 1,
    explanation: '樽熟成やマロラクティック発酵により、バター、バニラ、ナッツの香りが醸造方法由来で現れます。'
  },
  {
    id: 'STUDY_TSG_05_007',
    difficulty: 3,
    category: 'TSGシャルドネ比較',
    question: '濁りのあるシャルドネ（旧世界スタイル）の製法特徴として正しいものはどれか？',
    options: ['高温発酵', '無濾過（澱引きなし）', '長期樽熟成', '遅摘み'],
    correctAnswer: 1,
    explanation: '旧世界スタイルの濁りのあるシャルドネは、無濾過（澱引きなし）、還元的な造り、自然派的手法で造られます。'
  },
  {
    id: 'STUDY_TSG_05_008',
    difficulty: 2,
    category: 'TSGシャルドネペアリング',
    question: '冷涼系シャルドネと相性が良い料理として適切でないものはどれか？',
    options: ['エスカルゴブルギニオン', '白身魚のレモンハーブ焼き', 'クラムチャウダー', '寿司（白身魚、イカ）'],
    correctAnswer: 2,
    explanation: 'クラムチャウダーは温暖系シャルドネ（クリーミーなソース）に合います。冷涼系は軽やかな料理との相性が良いです。'
  },
  {
    id: 'STUDY_TSG_05_009',
    difficulty: 3,
    category: 'TSGシャルドネ高級',
    question: 'ChatGPTが選んだ代表的な高級シャルドネ生産者に含まれないものはどれか？',
    options: ['ドメーヌ・ルフレーヴ', 'コシュ・デュリ', 'ドメーヌ・ルーロ', 'シャトー・マルゴー'],
    correctAnswer: 3,
    explanation: 'シャトー・マルゴーはボルドーの赤ワインの名門です。他はすべてブルゴーニュの高級シャルドネ生産者です。'
  },
  {
    id: 'STUDY_TSG_05_010',
    difficulty: 2,
    category: 'TSGシャルドネ地域',
    question: 'ソノマとナパの気候による栽培品種の違いとして正しいものはどれか？',
    options: ['ソノマ：カベルネ、ナパ：ブルゴーニュ品種', 'ソノマ：ブルゴーニュ品種、ナパ：カベルネ', '両地域とも同じ品種', '気候は関係ない'],
    correctAnswer: 1,
    explanation: 'ソノマは冷涼でブルゴーニュ品種（シャルドネ、ピノ・ノワール）、ナパは温暖でカベルネ・ソーヴィニヨンが栽培されます。'
  }
];