// 評論分析儀表板組件
// 功能：提供完整的評論統計、趨勢分析、維度分析和改進建議
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Star,
  Users,
  MessageSquare,
  ThumbsUp,
  Eye,
  Share2,
  Award,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Target,
  PieChart,
  LineChart,
  Activity
} from 'lucide-react';
import type { ReviewStatistics, ReviewAnalyticsReport, RatingDimension } from '@/types/review';

// 組件屬性介面
interface ReviewAnalyticsDashboardProps {
  targetId: string;                    // 目標 ID（服務或導遊）
  targetType: 'service' | 'guide';    // 目標類型
  timeRange?: 'week' | 'month' | 'quarter' | 'year'; // 時間範圍
  className?: string;                  // 自定義樣式
}

// 時間範圍選項
const TIME_RANGES = [
  { value: 'week', label: '最近 7 天' },
  { value: 'month', label: '最近 30 天' },
  { value: 'quarter', label: '最近 3 個月' },
  { value: 'year', label: '最近 1 年' }
];

// 維度標籤對應
const DIMENSION_LABELS: Record<RatingDimension, string> = {
  overall: '整體滿意度',
  communication: '溝通能力',
  punctuality: '準時性',
  knowledge: '專業知識',
  friendliness: '友善度',
  value: '物有所值',
  safety: '安全性',
  flexibility: '彈性配合',
  professionalism: '專業性'
};

/**
 * 評論分析儀表板主組件
 */
export default function ReviewAnalyticsDashboard({
  targetId,
  targetType,
  timeRange = 'month',
  className = ''
}: ReviewAnalyticsDashboardProps) {
  // 狀態管理
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [analyticsReport, setAnalyticsReport] = useState<ReviewAnalyticsReport | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'dimensions' | 'insights'>('overview');

  /**
   * 載入統計數據
   */
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模擬統計數據
      const mockStats: ReviewStatistics = {
        totalReviews: 156,
        averageRating: 4.6,
        totalRatings: 720,
        ratingDistribution: { 5: 89, 4: 45, 3: 15, 2: 5, 1: 2 },
        dimensionAverages: {
          communication: 4.7,
          punctuality: 4.8,
          knowledge: 4.5,
          friendliness: 4.6,
          value: 4.4,
          safety: 4.9,
          flexibility: 4.3,
          professionalism: 4.6
        },
        verifiedReviewsCount: 142,
        featuredReviewsCount: 23,
        withPhotosCount: 67,
        withResponsesCount: 134,
        totalHelpfulVotes: 892,
        totalViews: 3456,
        totalShares: 234,
        recentReviewsCount: 28,
        responseRate: 86.0,
        averageResponseTime: 4.2,
        qualityScore: 92,
        recommendationRate: 94.2,
        returnCustomerRate: 34.8,
        popularTags: [
          { tag: '專業知識豐富', count: 67, percentage: 43.0 },
          { tag: '準時可靠', count: 58, percentage: 37.2 },
          { tag: '親切友善', count: 52, percentage: 33.3 },
          { tag: '溝通良好', count: 49, percentage: 31.4 },
          { tag: '行程安排佳', count: 43, percentage: 27.6 }
        ],
        monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i, 1).toISOString().slice(0, 7),
          reviewCount: Math.floor(Math.random() * 20) + 10,
          averageRating: 4.2 + Math.random() * 0.6
        }))
      };

      // 生成分析報告
      const mockReport: ReviewAnalyticsReport = {
        overview: {
          totalReviews: mockStats.totalReviews,
          averageRating: mockStats.averageRating,
          qualityScore: mockStats.qualityScore,
          recommendationRate: mockStats.recommendationRate
        },
        trends: {
          ratingTrend: mockStats.monthlyTrends.slice(-6).map(m => ({
            period: m.month,
            rating: m.averageRating,
            count: m.reviewCount
          })),
          volumeTrend: mockStats.monthlyTrends.slice(-6).map(m => ({
            period: m.month,
            count: m.reviewCount
          }))
        },
        dimensionAnalysis: {
          communication: { average: 4.7, trend: 'up', benchmark: 4.3 },
          punctuality: { average: 4.8, trend: 'stable', benchmark: 4.5 },
          knowledge: { average: 4.5, trend: 'up', benchmark: 4.2 },
          friendliness: { average: 4.6, trend: 'stable', benchmark: 4.4 },
          value: { average: 4.4, trend: 'down', benchmark: 4.1 },
          safety: { average: 4.9, trend: 'up', benchmark: 4.6 },
          flexibility: { average: 4.3, trend: 'down', benchmark: 4.0 },
          professionalism: { average: 4.6, trend: 'stable', benchmark: 4.3 }
        },
        competitorComparison: {
          averageRating: 4.6,
          marketAverage: 4.2,
          percentile: 78
        },
        recommendations: [
          {
            category: '服務改進',
            priority: 'high',
            suggestion: '提升彈性配合度，可考慮提供更多客製化選項',
            impact: '預期可提升整體滿意度 3-5%'
          },
          {
            category: '價值提升',
            priority: 'medium',
            suggestion: '強化服務內容說明，讓客戶更了解服務價值',
            impact: '可改善物有所值評分'
          }
        ]
      };

      setStatistics(mockStats);
      setAnalyticsReport(mockReport);

    } catch (err) {
      setError(err instanceof Error ? err.message : '載入統計數據失敗');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [targetId, targetType, selectedTimeRange]);

  /**
   * 計算趨勢指標
   */
  const trendIndicators = useMemo(() => {
    if (!statistics || !analyticsReport) return null;

    const currentMonth = statistics.monthlyTrends[statistics.monthlyTrends.length - 1];
    const previousMonth = statistics.monthlyTrends[statistics.monthlyTrends.length - 2];

    if (!currentMonth || !previousMonth) return null;

    const ratingChange = currentMonth.averageRating - previousMonth.averageRating;
    const volumeChange = currentMonth.reviewCount - previousMonth.reviewCount;

    return {
      rating: {
        value: ratingChange,
        trend: ratingChange > 0 ? 'up' : ratingChange < 0 ? 'down' : 'stable',
        percentage: Math.abs((ratingChange / previousMonth.averageRating) * 100)
      },
      volume: {
        value: volumeChange,
        trend: volumeChange > 0 ? 'up' : volumeChange < 0 ? 'down' : 'stable',
        percentage: Math.abs((volumeChange / previousMonth.reviewCount) * 100)
      }
    };
  }, [statistics, analyticsReport]);

  /**
   * 渲染載入狀態
   */
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-8 ${className}`}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p style={{
            marginTop: '16px',
            fontSize: '16px',
            color: '#6b7280'
          }}>
            載入分析數據中...
          </p>
        </div>
      </div>
    );
  }

  /**
   * 渲染錯誤狀態
   */
  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-lg border p-8 ${className}`}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <AlertTriangle size={48} color="#ef4444" />
          <p style={{
            marginTop: '16px',
            fontSize: '16px',
            color: '#ef4444',
            textAlign: 'center'
          }}>
            {error}
          </p>
          <button
            onClick={fetchStatistics}
            style={{
              marginTop: '16px',
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  if (!statistics || !analyticsReport) return null;

  return (
    <div className={`bg-white rounded-lg shadow-lg border ${className}`} style={{ padding: '24px' }}>
      {/* 標題和控制項 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            margin: '0 0 4px 0'
          }}>
            評論分析儀表板
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '0'
          }}>
            {targetType === 'service' ? '服務' : '導遊'}評論數據分析與洞察
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* 時間範圍選擇 */}
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            style={{
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            {TIME_RANGES.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* 重新載入按鈕 */}
          <button
            onClick={fetchStatistics}
            style={{
              padding: '8px',
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RefreshCw size={16} />
          </button>

          {/* 匯出按鈕 */}
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px'
            }}
          >
            <Download size={16} />
            匯出報告
          </button>
        </div>
      </div>

      {/* 標籤導航 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '24px'
      }}>
        {[
          { key: 'overview', label: '總覽', icon: BarChart3 },
          { key: 'trends', label: '趨勢', icon: TrendingUp },
          { key: 'dimensions', label: '維度分析', icon: Target },
          { key: 'insights', label: '洞察建議', icon: Activity }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 16px',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === tab.key ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === tab.key ? '2px solid #3b82f6' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 總覽頁面 */}
      {activeTab === 'overview' && (
        <div>
          {/* 關鍵指標卡片 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            {/* 總評論數 */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>總評論數</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                    {statistics.totalReviews}
                  </p>
                  {trendIndicators && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      {trendIndicators.volume.trend === 'up' ? (
                        <TrendingUp size={14} color="#059669" />
                      ) : trendIndicators.volume.trend === 'down' ? (
                        <TrendingDown size={14} color="#dc2626" />
                      ) : null}
                      <span style={{
                        fontSize: '12px',
                        color: trendIndicators.volume.trend === 'up' ? '#059669' : 
                               trendIndicators.volume.trend === 'down' ? '#dc2626' : '#6b7280'
                      }}>
                        {trendIndicators.volume.trend !== 'stable' && 
                         `${trendIndicators.volume.percentage.toFixed(1)}%`}
                      </span>
                    </div>
                  )}
                </div>
                <MessageSquare size={32} color="#3b82f6" />
              </div>
            </div>

            {/* 平均評分 */}
            <div style={{
              padding: '20px',
              backgroundColor: '#fefce8',
              borderRadius: '8px',
              border: '1px solid #fde68a'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#92400e', margin: '0 0 4px 0' }}>平均評分</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p style={{ fontSize: '24px', fontWeight: '700', color: '#92400e', margin: '0' }}>
                      {statistics.averageRating.toFixed(1)}
                    </p>
                    <div style={{ display: 'flex' }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={16}
                          color={i < Math.round(statistics.averageRating) ? '#fbbf24' : '#d1d5db'}
                          fill={i < Math.round(statistics.averageRating) ? '#fbbf24' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  {trendIndicators && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      {trendIndicators.rating.trend === 'up' ? (
                        <TrendingUp size={14} color="#059669" />
                      ) : trendIndicators.rating.trend === 'down' ? (
                        <TrendingDown size={14} color="#dc2626" />
                      ) : null}
                      <span style={{
                        fontSize: '12px',
                        color: trendIndicators.rating.trend === 'up' ? '#059669' : 
                               trendIndicators.rating.trend === 'down' ? '#dc2626' : '#6b7280'
                      }}>
                        {trendIndicators.rating.trend !== 'stable' && 
                         `${trendIndicators.rating.percentage.toFixed(1)}%`}
                      </span>
                    </div>
                  )}
                </div>
                <Star size={32} color="#fbbf24" fill="#fbbf24" />
              </div>
            </div>

            {/* 品質評分 */}
            <div style={{
              padding: '20px',
              backgroundColor: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#166534', margin: '0 0 4px 0' }}>品質評分</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#166534', margin: '0' }}>
                    {statistics.qualityScore}
                  </p>
                  <p style={{ fontSize: '12px', color: '#166534', margin: '4px 0 0 0' }}>
                    {statistics.qualityScore >= 90 ? '優秀' :
                     statistics.qualityScore >= 80 ? '良好' :
                     statistics.qualityScore >= 70 ? '一般' : '需改進'}
                  </p>
                </div>
                <Award size={32} color="#059669" />
              </div>
            </div>

            {/* 推薦率 */}
            <div style={{
              padding: '20px',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              border: '1px solid #bfdbfe'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#1e40af', margin: '0 0 4px 0' }}>推薦率</p>
                  <p style={{ fontSize: '24px', fontWeight: '700', color: '#1e40af', margin: '0' }}>
                    {statistics.recommendationRate.toFixed(1)}%
                  </p>
                  <p style={{ fontSize: '12px', color: '#1e40af', margin: '4px 0 0 0' }}>
                    {statistics.ratingDistribution[5] + statistics.ratingDistribution[4]} 位推薦
                  </p>
                </div>
                <ThumbsUp size={32} color="#3b82f6" />
              </div>
            </div>
          </div>

          {/* 評分分布圖 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {/* 評分分布 */}
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                評分分布
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = statistics.ratingDistribution[rating] || 0;
                  const percentage = statistics.totalReviews > 0 
                    ? (count / statistics.totalReviews) * 100 
                    : 0;

                  return (
                    <div key={rating} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: '60px' }}>
                        <span style={{ fontSize: '14px', color: '#374151' }}>{rating}</span>
                        <Star size={12} color="#fbbf24" fill="#fbbf24" />
                      </div>
                      <div style={{
                        flex: 1,
                        height: '8px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: rating >= 4 ? '#059669' : rating >= 3 ? '#fbbf24' : '#ef4444',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <span style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        minWidth: '50px',
                        textAlign: 'right'
                      }}>
                        {count} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 熱門標籤 */}
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                熱門標籤
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {statistics.popularTags.slice(0, 8).map((tag, index) => (
                  <div key={tag.tag} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '50%',
                        fontSize: '12px',
                        color: '#6b7280'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{ fontSize: '14px', color: '#374151' }}>
                        {tag.tag}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', color: '#6b7280' }}>
                        {tag.count}
                      </span>
                      <span style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {tag.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 附加統計 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>已驗證評論</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                {statistics.verifiedReviewsCount}
              </p>
              <p style={{ fontSize: '10px', color: '#64748b', margin: '4px 0 0 0' }}>
                ({((statistics.verifiedReviewsCount / statistics.totalReviews) * 100).toFixed(1)}%)
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>含照片評論</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                {statistics.withPhotosCount}
              </p>
              <p style={{ fontSize: '10px', color: '#64748b', margin: '4px 0 0 0' }}>
                ({((statistics.withPhotosCount / statistics.totalReviews) * 100).toFixed(1)}%)
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>回覆率</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                {statistics.responseRate.toFixed(1)}%
              </p>
              <p style={{ fontSize: '10px', color: '#64748b', margin: '4px 0 0 0' }}>
                平均 {statistics.averageResponseTime.toFixed(1)} 小時
              </p>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px 0' }}>回頭客率</p>
              <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                {statistics.returnCustomerRate.toFixed(1)}%
              </p>
              <p style={{ fontSize: '10px', color: '#64748b', margin: '4px 0 0 0' }}>
                客戶忠誠度指標
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 趨勢頁面 */}
      {activeTab === 'trends' && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* 評分趨勢 */}
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                評分趨勢
              </h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LineChart size={64} color="#d1d5db" />
                <p style={{ marginLeft: '16px', color: '#6b7280' }}>趨勢圖表</p>
              </div>
            </div>

            {/* 評論量趨勢 */}
            <div style={{
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                評論量趨勢
              </h3>
              <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart3 size={64} color="#d1d5db" />
                <p style={{ marginLeft: '16px', color: '#6b7280' }}>柱狀圖表</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 維度分析頁面 */}
      {activeTab === 'dimensions' && analyticsReport.dimensionAnalysis && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '16px'
          }}>
            {Object.entries(analyticsReport.dimensionAnalysis).map(([dimension, analysis]) => (
              <div key={dimension} style={{
                padding: '20px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1f2937',
                    margin: '0'
                  }}>
                    {DIMENSION_LABELS[dimension as RatingDimension]}
                  </h4>
                  {analysis.trend === 'up' ? (
                    <TrendingUp size={16} color="#059669" />
                  ) : analysis.trend === 'down' ? (
                    <TrendingDown size={16} color="#dc2626" />
                  ) : (
                    <Activity size={16} color="#6b7280" />
                  )}
                </div>

                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937' }}>
                      {analysis.average.toFixed(1)}
                    </span>
                    <div style={{ display: 'flex' }}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color={i < Math.round(analysis.average) ? '#fbbf24' : '#d1d5db'}
                          fill={i < Math.round(analysis.average) ? '#fbbf24' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                    行業平均: {analysis.benchmark.toFixed(1)}
                  </p>
                </div>

                <div style={{
                  padding: '8px 12px',
                  backgroundColor: analysis.average > analysis.benchmark ? '#f0fdf4' : '#fef2f2',
                  borderRadius: '6px',
                  border: `1px solid ${analysis.average > analysis.benchmark ? '#bbf7d0' : '#fecaca'}`
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: analysis.average > analysis.benchmark ? '#166534' : '#991b1b',
                    margin: '0'
                  }}>
                    {analysis.average > analysis.benchmark ? '高於' : '低於'}行業平均 
                    {Math.abs(analysis.average - analysis.benchmark).toFixed(1)} 分
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 洞察建議頁面 */}
      {activeTab === 'insights' && (
        <div>
          {/* 競爭力分析 */}
          {analyticsReport.competitorComparison && (
            <div style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px'
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1f2937',
                marginBottom: '16px'
              }}>
                競爭力分析
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>您的評分</p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                    {analyticsReport.competitorComparison.averageRating.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>市場平均</p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                    {analyticsReport.competitorComparison.marketAverage.toFixed(1)}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 4px 0' }}>排名百分位</p>
                  <p style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
                    {analyticsReport.competitorComparison.percentile}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 改進建議 */}
          <div>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '16px'
            }}>
              改進建議
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analyticsReport.recommendations.map((rec, index) => (
                <div key={index} style={{
                  padding: '16px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${
                    rec.priority === 'high' ? '#ef4444' :
                    rec.priority === 'medium' ? '#f59e0b' : '#10b981'
                  }`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      margin: '0'
                    }}>
                      {rec.category}
                    </h4>
                    <span style={{
                      fontSize: '12px',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: rec.priority === 'high' ? '#fee2e2' :
                                      rec.priority === 'medium' ? '#fef3c7' : '#d1fae5',
                      color: rec.priority === 'high' ? '#991b1b' :
                             rec.priority === 'medium' ? '#92400e' : '#166534'
                    }}>
                      {rec.priority === 'high' ? '高優先級' :
                       rec.priority === 'medium' ? '中優先級' : '低優先級'}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#374151', margin: '0 0 8px 0' }}>
                    {rec.suggestion}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: '0' }}>
                    預期影響：{rec.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS 動畫 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}