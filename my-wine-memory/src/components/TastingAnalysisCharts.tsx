import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Radar, Bar, Line } from 'react-chartjs-2';
import type { TastingRecord } from '../types';

// Chart.jsの要素を登録
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TastingAnalysisChartsProps {
  record: TastingRecord;
}

const TastingAnalysisCharts: React.FC<TastingAnalysisChartsProps> = ({ record }) => {
  const { detailedAnalysis } = record;

  // CSS変数からテーマカラーを取得
  const rootStyles = getComputedStyle(document.documentElement);
  const primaryDarkFull = rootStyles.getPropertyValue('--primary-dark-full').trim() || 'rgba(114, 47, 55, 1)';
  const primaryDarkAlpha20 = rootStyles.getPropertyValue('--primary-dark-alpha-20').trim() || 'rgba(114, 47, 55, 0.2)';
  const primaryDarkAlpha10 = rootStyles.getPropertyValue('--primary-dark-alpha-10').trim() || 'rgba(114, 47, 55, 0.1)';
  const textPrimary = rootStyles.getPropertyValue('--text-primary').trim() || '#fff';

  if (!detailedAnalysis) {
    return (
      <div className="no-detailed-analysis">
        <p>詳細分析データが記録されていません</p>
      </div>
    );
  }

  // 成分分析レーダーチャート
  const componentRadarData = {
    labels: ['酸味', 'タンニン', '甘味', 'ボディ', 'アルコール感'],
    datasets: [
      {
        label: '成分バランス',
        data: [
          detailedAnalysis.structure?.acidity?.intensity || 5,
          detailedAnalysis.structure?.tannins?.intensity || 5,
          detailedAnalysis.structure?.sweetness || 5,
          detailedAnalysis.structure?.body || 5,
          5 // アルコール感のデフォルト値
        ],
        backgroundColor: primaryDarkAlpha20,
        borderColor: primaryDarkFull,
        borderWidth: 2,
        pointBackgroundColor: primaryDarkFull,
        pointBorderColor: textPrimary,
        pointHoverBackgroundColor: textPrimary,
        pointHoverBorderColor: primaryDarkFull,
      },
    ],
  };

  const componentRadarOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '成分バランス分析',
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 10,
        pointLabels: {
          font: {
            size: 12
          }
        },
        ticks: {
          display: true,
          stepSize: 2,
        }
      },
    },
  };

  // 香りカテゴリー棒グラフ
  const aromaCategories = detailedAnalysis.aroma?.categories;
  const aromaCategoryData = {
    labels: ['果実系', '花系', 'スパイス系', 'ハーブ系', '土系', '木系', 'その他'],
    datasets: [
      {
        label: '香りの強さ',
        data: [
          (aromaCategories?.fruity || 0) * 5,
          (aromaCategories?.floral || 0) * 5,
          (aromaCategories?.spicy || 0) * 5,
          (aromaCategories?.herbal || 0) * 5,
          (aromaCategories?.earthy || 0) * 5,
          (aromaCategories?.woody || 0) * 5,
          (aromaCategories?.other || 0) * 2
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const aromaCategoryOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '香りカテゴリー分析',
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: '強度',
        },
        ticks: {
          stepSize: 2,
        }
      },
      x: {
        title: {
          display: true,
          text: '香りカテゴリー',
        }
      }
    },
  };

  // 味わいの展開チャート（時系列）
  const tasteEvolutionData = {
    labels: ['アタック', '展開', 'フィニッシュ'],
    datasets: [
      {
        label: '強度の変化',
        data: [
          detailedAnalysis.taste?.attack?.intensity || 5,
          detailedAnalysis.taste?.development?.complexity || 5,
          detailedAnalysis.taste?.finish?.length || 5
        ],
        borderColor: primaryDarkFull,
        backgroundColor: primaryDarkAlpha10,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: primaryDarkFull,
        pointBorderColor: textPrimary,
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const tasteEvolutionOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '味わいの展開',
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary') || '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: '強度・複雑さ',
        },
        ticks: {
          stepSize: 2,
        }
      },
      x: {
        title: {
          display: true,
          text: '味わいの段階',
        }
      }
    },
  };

  return (
    <div className="tasting-analysis-charts">
      <div className="charts-grid">
        {/* 成分バランス レーダーチャート */}
        <div className="chart-container">
          <Radar data={componentRadarData} options={componentRadarOptions} />
        </div>

        {/* 香りカテゴリー 棒グラフ */}
        <div className="chart-container">
          <Bar data={aromaCategoryData} options={aromaCategoryOptions} />
        </div>

        {/* 味わいの展開 線グラフ */}
        <div className="chart-container">
          <Line data={tasteEvolutionData} options={tasteEvolutionOptions} />
        </div>
      </div>

      {/* 詳細テキスト情報 */}
      <div className="detailed-text-analysis">
        <div className="analysis-section">
          <h4>外観</h4>
          <div className="analysis-details">
            <p><strong>色合い:</strong> {detailedAnalysis.appearance?.color || '記録なし'}</p>
            <p><strong>透明度:</strong> {detailedAnalysis.appearance?.clarity || '記録なし'}</p>
            <p><strong>粘性:</strong> {detailedAnalysis.appearance?.viscosity || '記録なし'}</p>
          </div>
        </div>

        <div className="analysis-section">
          <h4>香り</h4>
          <div className="analysis-details">
            <p><strong>第一印象:</strong> {detailedAnalysis.aroma?.firstImpression?.notes || '記録なし'}</p>
            <p><strong>スワリング後:</strong> {detailedAnalysis.aroma?.afterSwirling?.notes || '記録なし'}</p>
            <p><strong>具体的な香り:</strong> {detailedAnalysis.aroma?.specificAromas?.join(', ') || '記録なし'}</p>
          </div>
        </div>

        <div className="analysis-section">
          <h4>味わい</h4>
          <div className="analysis-details">
            <p><strong>アタック:</strong> {detailedAnalysis.taste?.attack?.notes || '記録なし'}</p>
            <p><strong>展開:</strong> {detailedAnalysis.taste?.development?.notes || '記録なし'}</p>
            <p><strong>フィニッシュ:</strong> {detailedAnalysis.taste?.finish?.notes || '記録なし'}</p>
            <p><strong>余韻の長さ:</strong> {detailedAnalysis.taste?.finish?.length || 5}/10</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TastingAnalysisCharts;