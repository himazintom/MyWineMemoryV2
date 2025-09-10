import type { QuizQuestion } from '../../../../types';

// TSGトレーニング 基礎をここからもう一度 - クイズ問題
export const studyTsg01Questions: QuizQuestion[] = [
  {
    id: 'STUDY_TSG_01_001',
    difficulty: 1,
    category: 'TSG基礎',
    question: 'ワインテイスティングの3つの基本ステップの正しい順序はどれか？',
    options: ['香り → 外観 → 味わい', '外観 → 香り → 味わい', '味わい → 香り → 外観', '香り → 味わい → 外観'],
    correctAnswer: 1,
    explanation: 'ワインテイスティングの基本は、外観 → 香り → 味わいの順序で行います。まず視覚で観察し、次に嗅覚、最後に味覚で評価します。'
  },
  {
    id: 'STUDY_TSG_01_002',
    difficulty: 2,
    category: 'TSG基礎',
    question: 'テイスティング時にワインの色調を確認する部位として正しいものはどれか？',
    options: ['グラスの深い部分', 'グラスの中ほど（遊泳ゾーン）', 'グラスの一番端', 'グラス全体'],
    correctAnswer: 1,
    explanation: 'ワインの色調は、グラスの中ほど（遊泳ゾーン）で確認します。深い部分は濃さ、端は熟成度を見る部位です。'
  },
  {
    id: 'STUDY_TSG_01_003',
    difficulty: 2,
    category: 'TSG基礎',
    question: 'スワーリング（グラスを回す）をやりすぎることの弊害は何か？',
    options: ['香りが強くなりすぎる', '酸化が促進され酸っぱくなる', '泡が消える', '温度が上がる'],
    correctAnswer: 1,
    explanation: 'スワーリングをやりすぎると酸化が促進され、ワインが酸っぱくなる可能性があります。また、揮発性の高い香り（トップノート）が消失してしまいます。'
  },
  {
    id: 'STUDY_TSG_01_004',
    difficulty: 3,
    category: 'TSG基礎',
    question: 'ワインの香りを取る位置による違いで正しいものはどれか？',
    options: ['遠い位置：果物、花の香り', '遠い位置：甘い、動物的な香り', '距離による違いはない', '近い位置：ミネラルの香り'],
    correctAnswer: 1,
    explanation: 'グラスから遠い位置では揮発性の低い甘い、動物的な香りを感じ、近づけると揮発性の高い果物、花の香りを感じます。'
  },
  {
    id: 'STUDY_TSG_01_005',
    difficulty: 2,
    category: 'TSG基礎',
    question: 'テイスティング時に酸味を感じやすい舌の部位はどこか？',
    options: ['舌の先端', '舌の両端', '舌の奥', '舌全体'],
    correctAnswer: 1,
    explanation: '酸味は舌の両端で最も感じやすく、部分トレーニングでは意識的にこの部位に注目します。渋味は歯茎の裏側で感じます。'
  },
  {
    id: 'STUDY_TSG_01_006',
    difficulty: 1,
    category: 'TSGアルコール知識',
    question: 'ワインのアルコール生成過程として正しいものはどれか？',
    options: ['デンプン → 糖化 → 発酵', 'ブドウの糖分 → 酵母 → 発酵', '麦芽 → 糖化 → 発酵', 'お米 → 糖化 → 発酵'],
    correctAnswer: 1,
    explanation: 'ワインはブドウの糖分を酵母が発酵させてアルコールを生成します。ビールや日本酒はデンプンを糖化してから発酵させます。'
  },
  {
    id: 'STUDY_TSG_01_007',
    difficulty: 3,
    category: 'TSGテイスティング',
    question: 'バランスの取れたワインの定義として最も適切なものはどれか？',
    options: ['アルコール度数が高い', '果実味、酸味、渋みが調和している', '価格が高い', '熟成期間が長い'],
    correctAnswer: 1,
    explanation: 'バランスの取れたワインとは、果実味、酸味、渋みが調和し、どの要素も突出せずに全体として美味しく感じられるワインのことです。'
  },
  {
    id: 'STUDY_TSG_01_008',
    difficulty: 2,
    category: 'TSG実践',
    question: 'ワインの変化を学ぶための効果的な方法はどれか？',
    options: ['一度に全て飲む', '数日かけて飲み変化を観察', '冷蔵庫で保存しない', '必ず同じ温度で飲む'],
    correctAnswer: 1,
    explanation: 'ワインを数日かけて飲むことで、時間による変化や熟成ポテンシャルを理解でき、ワインの奥深さを学ぶことができます。'
  },
  {
    id: 'STUDY_TSG_01_009',
    difficulty: 1,
    category: 'TSGサブスク',
    question: 'TSGトレーニングセットのスタンダードセットの価格はいくらか？',
    options: ['9,900円', '19,000円', '39,000円', '49,000円'],
    correctAnswer: 1,
    explanation: 'TSGトレーニングセットのスタンダードセット（4本組）は19,000円で提供されています。ライトプランは9,900円（2本組）です。'
  },
  {
    id: 'STUDY_TSG_01_010',
    difficulty: 2,
    category: 'TSG教育',
    question: 'ワインテイスティング能力向上の副次的効果として適切でないものはどれか？',
    options: ['嗅覚・味覚の向上', '表現力の向上', '自動的に高級ワインを識別できる', '人との繋がりの拡大'],
    correctAnswer: 2,
    explanation: 'ワインテイスティングは嗅覚・味覚・表現力を向上させ、人との繋がりを深めますが、自動的に高級ワインを識別できるようになるわけではありません。継続的な学習が必要です。'
  }
];