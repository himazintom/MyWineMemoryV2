/**
 * Learning Insight Service
 * Generates personalized learning insights using LLM based on user's quiz performance and wine records
 */

import type { QuizQuestion } from '../types';

export interface LearningInsight {
  message: string;
  type: 'encouragement' | 'tip' | 'fact' | 'recommendation';
  timestamp: Date;
}

export interface QuizPerformanceData {
  correctAnswers: number;
  totalQuestions: number;
  difficulty: number;
  wrongQuestions?: QuizQuestion[];
  timeSpent?: number;
}

export interface WineRecordData {
  wineName: string;
  wineType?: string;
  country?: string;
  region?: string;
  rating: number;
  notes?: string;
  grapeVarieties?: string[];
}

class LearningInsightService {
  private apiKey: string | null = null;
  private apiUrl: string = '';
  private model: string = '';
  
  constructor() {
    // Initialize with environment variables if available
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || null;
    this.apiUrl = import.meta.env.VITE_OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    this.model = import.meta.env.VITE_LLM_MODEL || 'meta-llama/llama-3.2-3b-instruct:free';
  }

  /**
   * Generate learning insight for quiz performance
   */
  async generateQuizInsight(performanceData: QuizPerformanceData): Promise<LearningInsight> {
    try {
      // If no API key, return fallback insights
      if (!this.apiKey) {
        return this.getFallbackQuizInsight(performanceData);
      }

      const percentage = (performanceData.correctAnswers / performanceData.totalQuestions) * 100;
      
      const prompt = `
あなたはワイン学習アプリの親切な先生です。
ユーザーがクイズを完了しました。以下の結果に基づいて、20-30文字以内の短い学習アドバイスを日本語で1つ提供してください。

結果:
- 正解率: ${percentage.toFixed(0)}%
- 正解数: ${performanceData.correctAnswers}/${performanceData.totalQuestions}
- 難易度: レベル${performanceData.difficulty}

アドバイスは以下のいずれかのタイプにしてください:
1. 励ましのメッセージ（正解率が高い場合）
2. 学習のヒント（正解率が中程度の場合）
3. ワインの豆知識（どの正解率でも可）
4. 次の学習への提案（正解率が低い場合）

回答は1文のみで、絵文字を1つ含めてください。
`;

      const response = await this.callLLM(prompt);
      
      if (response) {
        return {
          message: response,
          type: this.determineInsightType(percentage),
          timestamp: new Date()
        };
      }

      return this.getFallbackQuizInsight(performanceData);
    } catch (error) {
      console.error('Failed to generate quiz insight:', error);
      return this.getFallbackQuizInsight(performanceData);
    }
  }

  /**
   * Generate learning insight for wine record
   */
  async generateWineInsight(wineData: WineRecordData): Promise<LearningInsight> {
    try {
      // If no API key, return fallback insights
      if (!this.apiKey) {
        return this.getFallbackWineInsight(wineData);
      }

      const prompt = `
あなたはワイン学習アプリの親切なソムリエです。
ユーザーが以下のワインを記録しました。20-30文字以内の短い学習ポイントを日本語で1つ提供してください。

ワイン情報:
- 名前: ${wineData.wineName}
- タイプ: ${wineData.wineType || '不明'}
- 産地: ${wineData.country || '不明'} ${wineData.region || ''}
- 評価: ${wineData.rating}/10
${wineData.grapeVarieties ? `- ブドウ品種: ${wineData.grapeVarieties.join(', ')}` : ''}

以下のいずれかの観点でアドバイスしてください:
1. このワインの特徴的なポイント
2. 同じ産地の他のワインとの比較
3. フードペアリングの提案
4. テイスティングのコツ

回答は1文のみで、絵文字を1つ含めてください。
`;

      const response = await this.callLLM(prompt);
      
      if (response) {
        return {
          message: response,
          type: 'tip',
          timestamp: new Date()
        };
      }

      return this.getFallbackWineInsight(wineData);
    } catch (error) {
      console.error('Failed to generate wine insight:', error);
      return this.getFallbackWineInsight(wineData);
    }
  }

  /**
   * Call LLM API
   */
  private async callLLM(prompt: string): Promise<string | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'MyWineMemory'
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a helpful wine education assistant. Always respond in Japanese with short, encouraging messages.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 100
        })
      });

      if (!response.ok) {
        console.error('LLM API error:', response.status);
        return null;
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || null;
    } catch (error) {
      console.error('Failed to call LLM:', error);
      return null;
    }
  }

  /**
   * Determine insight type based on performance
   */
  private determineInsightType(percentage: number): LearningInsight['type'] {
    if (percentage >= 80) return 'encouragement';
    if (percentage >= 60) return 'tip';
    if (percentage >= 40) return 'fact';
    return 'recommendation';
  }

  /**
   * Get fallback quiz insight when LLM is not available
   */
  private getFallbackQuizInsight(performanceData: QuizPerformanceData): LearningInsight {
    const percentage = (performanceData.correctAnswers / performanceData.totalQuestions) * 100;
    const insights: Record<string, string[]> = {
      excellent: [
        '🎯 完璧！この調子で頑張ろう！',
        '🌟 素晴らしい知識ですね！',
        '🏆 ワインマスターへの道！',
        '✨ 見事な正解率です！',
        '🍷 プロ級の知識力！'
      ],
      good: [
        '👍 もう少しで完璧です！',
        '📚 良い調子で学習中！',
        '🌱 着実に成長しています！',
        '💪 あと一歩で満点！',
        '🎓 知識が定着してきました！'
      ],
      medium: [
        '📖 復習すれば完璧に！',
        '🔍 細かい点も覚えよう！',
        '💡 ヒント：産地を意識して！',
        '🗺️ 地図を見ながら学ぼう！',
        '🍇 ブドウ品種を覚えよう！'
      ],
      needsWork: [
        '🌈 一歩ずつ前進しよう！',
        '📝 メモを取りながら学ぼう！',
        '🎯 基礎から確実に！',
        '⏰ 毎日少しずつ勉強！',
        '🚀 ここから成長開始！'
      ]
    };

    let category: string;
    let type: LearningInsight['type'];
    
    if (percentage >= 80) {
      category = 'excellent';
      type = 'encouragement';
    } else if (percentage >= 60) {
      category = 'good';
      type = 'tip';
    } else if (percentage >= 40) {
      category = 'medium';
      type = 'fact';
    } else {
      category = 'needsWork';
      type = 'recommendation';
    }

    const messages = insights[category];
    const message = messages[Math.floor(Math.random() * messages.length)];

    return {
      message,
      type,
      timestamp: new Date()
    };
  }

  /**
   * Get fallback wine insight when LLM is not available
   */
  private getFallbackWineInsight(wineData: WineRecordData): LearningInsight {
    const insights = [
      `🍷 ${wineData.wineName}は素晴らしい選択！`,
      `🌍 ${wineData.country || 'この産地'}のワインは個性的！`,
      `⭐ 評価${wineData.rating}点、記録に残そう！`,
      `📝 テイスティングノートを詳しく！`,
      `🍇 ブドウの特徴を感じて！`,
      `🥂 次は違う産地も試してみて！`,
      `📚 このワインの歴史も調べてみよう！`,
      `🍽️ 料理とのペアリングを試して！`,
      `🌡️ 適温で飲むと更に美味しい！`,
      `🎯 香りの変化を楽しんで！`
    ];

    const message = insights[Math.floor(Math.random() * insights.length)];

    return {
      message,
      type: 'tip',
      timestamp: new Date()
    };
  }

  /**
   * Check if LLM service is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Update API configuration
   */
  updateConfiguration(apiKey: string, apiUrl?: string, model?: string) {
    this.apiKey = apiKey;
    if (apiUrl) this.apiUrl = apiUrl;
    if (model) this.model = model;
  }
}

export const learningInsightService = new LearningInsightService();