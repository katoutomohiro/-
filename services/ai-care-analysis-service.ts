/**
 * AI Care Analysis Service
 * 介護データの分析とインサイト生成を行うAIサービス
 */

import type { CareAnalysisData, CarePattern, CareRecommendation, CareAlert } from '@/types/ai-analysis'
import { DataStorageService } from './data-storage-service'

export class AICareAnalysisService {
  /**
   * 健康トレンド分析
   * バイタルサイン・発作データから健康傾向を分析
   */
  static analyzeHealthTrends(userId: string, days: number = 30): CareAnalysisData {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    
    const careEvents = DataStorageService.getCareEventsByUser(userId)
      .filter(event => {
        const eventDate = new Date(event.timestamp)
        return eventDate >= startDate && eventDate <= endDate
      })

    // バイタルサイン分析
    const vitalEvents = careEvents.filter(e => e.eventType === 'vitals')
    const seizureEvents = careEvents.filter(e => e.eventType === 'seizure')
    const hydrationEvents = careEvents.filter(e => e.eventType === 'hydration')

    const patterns = this.generateHealthPatterns(vitalEvents, seizureEvents, hydrationEvents)
    const recommendations = this.generateHealthRecommendations(patterns)
    const alerts = this.generateHealthAlerts(patterns)

    return {
      userId,
      analysisType: 'health_trend',
      timeRange: { start: startDate, end: endDate },
      insights: { patterns, recommendations, alerts }
    }
  }

  /**
   * 行動パターン分析
   * 表情・活動・コミュニケーションデータからパターンを検出
   */
  static analyzeBehaviorPatterns(userId: string, days: number = 14): CareAnalysisData {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)
    
    const careEvents = DataStorageService.getCareEventsByUser(userId)
      .filter(event => {
        const eventDate = new Date(event.timestamp)
        return eventDate >= startDate && eventDate <= endDate
      })

    // 行動関連イベント分析
    const expressionEvents = careEvents.filter(e => e.eventType === 'expression')
    const activityEvents = careEvents.filter(e => e.eventType === 'activity')
    const communicationEvents = careEvents.filter(e => e.eventType === 'communication')

    const patterns = this.generateBehaviorPatterns(expressionEvents, activityEvents, communicationEvents)
    const recommendations = this.generateBehaviorRecommendations(patterns)
    const alerts = this.generateBehaviorAlerts(patterns)

    return {
      userId,
      analysisType: 'behavior_pattern',
      timeRange: { start: startDate, end: endDate },
      insights: { patterns, recommendations, alerts }
    }
  }

  /**
   * ケア最適化分析
   * 全ケアデータから最適化提案を生成
   */
  static analyzeCareOptimization(userId: string): CareAnalysisData {
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 60 * 24 * 60 * 60 * 1000) // 60日間

    const careEvents = DataStorageService.getCareEventsByUser(userId)
      .filter(event => {
        const eventDate = new Date(event.timestamp)
        return eventDate >= startDate && eventDate <= endDate
      })

    const patterns = this.generateCareOptimizationPatterns(careEvents)
    const recommendations = this.generateCareOptimizationRecommendations(patterns, careEvents)
    const alerts = this.generateCareOptimizationAlerts(patterns)

    return {
      userId,
      analysisType: 'care_optimization',
      timeRange: { start: startDate, end: endDate },
      insights: { patterns, recommendations, alerts }
    }
  }

  /**
   * 健康パターン生成
   */
  private static generateHealthPatterns(
    vitalEvents: any[], 
    seizureEvents: any[], 
    hydrationEvents: any[]
  ): CarePattern[] {
    const patterns: CarePattern[] = []

    // 発作頻度パターン分析
    if (seizureEvents.length > 0) {
      const seizureFrequency = this.calculateSeizureFrequency(seizureEvents)
      patterns.push({
        id: 'seizure_frequency',
        type: 'seizure_frequency',
        confidence: 0.85,
        description: `過去30日間の発作頻度: 平均${seizureFrequency.toFixed(1)}回/週`,
        trend: seizureFrequency < 2 ? 'improving' : seizureFrequency > 5 ? 'concerning' : 'stable',
        data: seizureEvents
      })
    }

    // バイタル傾向分析
    if (vitalEvents.length > 0) {
      const vitalTrend = this.calculateVitalTrends(vitalEvents)
      patterns.push({
        id: 'vital_trends',
        type: 'vital_trends',
        confidence: 0.92,
        description: `血圧・心拍数の傾向: ${vitalTrend.description}`,
        trend: vitalTrend.trend,
        data: vitalEvents
      })
    }

    // 水分摂取パターン
    if (hydrationEvents.length > 0) {
      const hydrationPattern = this.calculateHydrationPattern(hydrationEvents)
      patterns.push({
        id: 'hydration_pattern',
        type: 'vital_trends',
        confidence: 0.78,
        description: `水分摂取パターン: ${hydrationPattern.description}`,
        trend: hydrationPattern.trend,
        data: hydrationEvents
      })
    }

    return patterns
  }

  /**
   * 行動パターン生成
   */
  private static generateBehaviorPatterns(
    expressionEvents: any[],
    activityEvents: any[],
    communicationEvents: any[]
  ): CarePattern[] {
    const patterns: CarePattern[] = []

    // 表情・気分パターン
    if (expressionEvents.length > 0) {
      const moodPattern = this.calculateMoodPattern(expressionEvents)
      patterns.push({
        id: 'mood_pattern',
        type: 'mood_changes',
        confidence: 0.73,
        description: `気分・表情パターン: ${moodPattern.description}`,
        trend: moodPattern.trend,
        data: expressionEvents
      })
    }

    // 活動レベルパターン
    if (activityEvents.length > 0) {
      const activityPattern = this.calculateActivityPattern(activityEvents)
      patterns.push({
        id: 'activity_level',
        type: 'activity_levels',
        confidence: 0.81,
        description: `活動レベル: ${activityPattern.description}`,
        trend: activityPattern.trend,
        data: activityEvents
      })
    }

    return patterns
  }

  /**
   * 健康推奨事項生成
   */
  private static generateHealthRecommendations(patterns: CarePattern[]): CareRecommendation[] {
    const recommendations: CareRecommendation[] = []

    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'seizure_frequency':
          if (pattern.trend === 'concerning') {
            recommendations.push({
              id: 'seizure_management',
              priority: 'high',
              category: 'medical',
              title: '発作管理の強化が必要です',
              description: '発作頻度が増加傾向にあります。医療チームとの相談を推奨します。',
              actionItems: [
                '医師との緊急相談を予約',
                '発作記録の詳細化',
                '環境要因の見直し',
                '服薬状況の確認'
              ],
              expectedOutcome: '発作頻度の安定化と予防策の確立'
            })
          }
          break

        case 'vital_trends':
          if (pattern.trend === 'concerning' || pattern.trend === 'declining') {
            recommendations.push({
              id: 'vital_monitoring',
              priority: 'medium',
              category: 'medical',
              title: 'バイタルサイン監視の強化',
              description: 'バイタルサインに変化が見られます。継続的な監視が必要です。',
              actionItems: [
                'バイタル測定頻度の増加',
                '医療スタッフへの報告',
                '生活リズムの見直し',
                'ストレス要因の調査'
              ],
              expectedOutcome: 'バイタルサインの安定化'
            })
          }
          break
      }
    })

    return recommendations
  }

  /**
   * アラート生成
   */
  private static generateHealthAlerts(patterns: CarePattern[]): CareAlert[] {
    const alerts: CareAlert[] = []

    patterns.forEach(pattern => {
      if (pattern.trend === 'concerning' && pattern.confidence > 0.8) {
        alerts.push({
          id: `alert_${pattern.id}`,
          severity: 'warning',
          type: 'health_risk',
          message: `${pattern.description} - 注意が必要です`,
          suggestedAction: '医療スタッフに相談し、詳細な検査を検討してください',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 1週間後
        })
      }
    })

    return alerts
  }

  /**
   * ヘルパーメソッド群
   */
  private static calculateSeizureFrequency(seizureEvents: any[]): number {
    const days = 30
    const weeksInPeriod = days / 7
    return seizureEvents.length / weeksInPeriod
  }

  private static calculateVitalTrends(vitalEvents: any[]): { description: string, trend: 'improving' | 'stable' | 'concerning' | 'declining' } {
    // 簡単な傾向分析（実際のアプリでは機械学習アルゴリズムを使用）
    const recentEvents = vitalEvents.slice(-10)
    const avgSystolic = recentEvents.reduce((sum, e) => sum + (parseInt(e.systolicBP) || 120), 0) / recentEvents.length
    
    if (avgSystolic < 90 || avgSystolic > 140) {
      return { description: '血圧に注意が必要な変化', trend: 'concerning' }
    } else if (avgSystolic >= 110 && avgSystolic <= 130) {
      return { description: '血圧が良好な範囲', trend: 'improving' }
    } else {
      return { description: '血圧が安定している', trend: 'stable' }
    }
  }

  private static calculateHydrationPattern(hydrationEvents: any[]): { description: string, trend: 'improving' | 'stable' | 'concerning' | 'declining' } {
    const dailyAverage = hydrationEvents.length / 7 // 週平均
    
    if (dailyAverage < 3) {
      return { description: '水分摂取が不足気味', trend: 'concerning' }
    } else if (dailyAverage > 6) {
      return { description: '水分摂取が十分', trend: 'improving' }
    } else {
      return { description: '水分摂取が適切', trend: 'stable' }
    }
  }

  private static calculateMoodPattern(expressionEvents: any[]): { description: string, trend: 'improving' | 'stable' | 'concerning' | 'declining' } {
    const positiveExpressions = expressionEvents.filter(e => 
      e.emotionalState === 'happy' || e.emotionalState === 'calm'
    ).length
    
    const ratio = positiveExpressions / expressionEvents.length
    
    if (ratio > 0.7) {
      return { description: 'ポジティブな表情が多い', trend: 'improving' }
    } else if (ratio < 0.3) {
      return { description: 'ネガティブな表情が目立つ', trend: 'concerning' }
    } else {
      return { description: '表情の変化は安定している', trend: 'stable' }
    }
  }

  private static calculateActivityPattern(activityEvents: any[]): { description: string, trend: 'improving' | 'stable' | 'concerning' | 'declining' } {
    const activeEvents = activityEvents.filter(e => 
      e.activityType !== 'rest' && e.participationLevel !== 'none'
    ).length
    
    const ratio = activeEvents / activityEvents.length
    
    if (ratio > 0.6) {
      return { description: '活発な活動参加', trend: 'improving' }
    } else if (ratio < 0.2) {
      return { description: '活動参加が少ない', trend: 'concerning' }
    } else {
      return { description: '活動レベルは安定', trend: 'stable' }
    }
  }

  private static generateCareOptimizationPatterns(careEvents: any[]): CarePattern[] {
    const patterns: CarePattern[] = []
    
    // ケア頻度パターン分析
    if (careEvents.length > 10) {
      const dailyEventCounts = this.groupEventsByDay(careEvents)
      const avgEventsPerDay = Object.values(dailyEventCounts).reduce((a, b) => a + b, 0) / Object.keys(dailyEventCounts).length
      
      patterns.push({
        id: 'care_frequency',
        type: 'care_optimization',
        confidence: 0.87,
        description: `1日平均${avgEventsPerDay.toFixed(1)}回のケアを実施`,
        trend: avgEventsPerDay < 3 ? 'concerning' : avgEventsPerDay > 8 ? 'concerning' : 'stable',
        data: careEvents
      })
    }
    
    // ケアタイミング分析
    const timeDistribution = this.analyzeTimeDistribution(careEvents)
    if (timeDistribution.peakHours.length > 0) {
      patterns.push({
        id: 'care_timing',
        type: 'care_optimization',
        confidence: 0.76,
        description: `ケア集中時間: ${timeDistribution.peakHours.join(', ')}時頃`,
        trend: 'stable',
        data: careEvents
      })
    }
    
    return patterns
  }

  private static generateCareOptimizationRecommendations(patterns: CarePattern[], careEvents: any[]): CareRecommendation[] {
    const recommendations: CareRecommendation[] = []
    
    patterns.forEach(pattern => {
      if (pattern.type === 'care_optimization') {
        if (pattern.id === 'care_frequency' && pattern.trend === 'concerning') {
          recommendations.push({
            id: 'optimize_care_schedule',
            priority: 'medium',
            category: 'operational',
            title: 'ケア頻度の最適化',
            description: '現在のケア頻度を見直し、より効果的なスケジュールを検討しましょう。',
            actionItems: [
              'ケアタイミングの分散化',
              '予防的ケアの強化',
              'スタッフ配置の見直し',
              '利用者の生活リズム分析'
            ],
            expectedOutcome: 'より効率的で利用者中心のケア提供の実現'
          })
        }
        
        if (pattern.id === 'care_timing') {
          recommendations.push({
            id: 'balance_care_timing',
            priority: 'low',
            category: 'operational',
            title: 'ケアタイミングの分散',
            description: 'ケアが特定の時間帯に集中しています。負荷分散を検討しましょう。',
            actionItems: [
              'ピーク時間の特定と分析',
              '非ピーク時間の活用検討',
              'スタッフシフトの調整',
              '利用者の個別ニーズ分析'
            ],
            expectedOutcome: 'ケア品質の向上とスタッフ負荷の軽減'
          })
        }
      }
    })
    
    return recommendations
  }

  private static generateBehaviorRecommendations(patterns: CarePattern[]): CareRecommendation[] {
    const recommendations: CareRecommendation[] = []
    
    patterns.forEach(pattern => {
      switch (pattern.type) {
        case 'mood_changes':
          if (pattern.trend === 'concerning') {
            recommendations.push({
              id: 'mood_support',
              priority: 'medium',
              category: 'therapeutic',
              title: '気分状態のサポート強化',
              description: 'ネガティブな表情や気分が多く見られます。支援方法を見直しましょう。',
              actionItems: [
                '環境要因の調査・改善',
                'コミュニケーション方法の見直し',
                '活動プログラムの調整',
                '医療チームとの連携強化'
              ],
              expectedOutcome: 'ポジティブな表情・気分の増加'
            })
          }
          break
          
        case 'activity_levels':
          if (pattern.trend === 'concerning') {
            recommendations.push({
              id: 'activity_enhancement',
              priority: 'medium',
              category: 'therapeutic',
              title: '活動参加の促進',
              description: '活動参加レベルが低下しています。動機向上策を検討しましょう。',
              actionItems: [
                '個別の興味・関心の把握',
                '参加しやすい活動の企画',
                '段階的な参加目標設定',
                '成功体験の提供機会創出'
              ],
              expectedOutcome: '自発的な活動参加の増加'
            })
          }
          break
      }
    })
    
    return recommendations
  }

  private static generateBehaviorAlerts(patterns: CarePattern[]): CareAlert[] {
    const alerts: CareAlert[] = []
    
    patterns.forEach(pattern => {
      if (pattern.type === 'mood_changes' && pattern.trend === 'concerning' && pattern.confidence > 0.7) {
        alerts.push({
          id: `alert_mood_${pattern.id}`,
          severity: 'warning',
          type: 'behavior_concern',
          message: `気分・表情の変化が継続しています - 支援方法の見直しが必要`,
          suggestedAction: '医療・心理専門スタッフとの連携を強化し、包括的な支援計画を検討してください',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3日後
        })
      }
      
      if (pattern.type === 'activity_levels' && pattern.trend === 'declining' && pattern.confidence > 0.75) {
        alerts.push({
          id: `alert_activity_${pattern.id}`,
          severity: 'warning',
          type: 'engagement_risk',
          message: `活動参加レベルの低下傾向 - 早期介入が推奨`,
          suggestedAction: '作業療法士・生活支援員との連携により、個別の活動プログラムを見直してください',
          deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5日後
        })
      }
    })
    
    return alerts
  }

  private static generateCareOptimizationAlerts(patterns: CarePattern[]): CareAlert[] {
    const alerts: CareAlert[] = []
    
    patterns.forEach(pattern => {
      if (pattern.type === 'care_optimization' && pattern.trend === 'concerning') {
        if (pattern.id === 'care_frequency') {
          alerts.push({
            id: `alert_frequency_${pattern.id}`,
            severity: 'info',
            type: 'operational_improvement',
            message: `ケア頻度の最適化機会を検出 - 効率性向上の余地あり`,
            suggestedAction: 'ケアマネージャーと連携し、現在のケア計画の見直しを実施してください',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 2週間後
          })
        }
      }
    })
    
    return alerts
  }

  /**
   * ヘルパーメソッド: 日別イベント数集計
   */
  private static groupEventsByDay(careEvents: any[]): { [date: string]: number } {
    return careEvents.reduce((acc, event) => {
      const date = new Date(event.timestamp).toDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})
  }

  /**
   * ヘルパーメソッド: 時間帯分布分析
   */
  private static analyzeTimeDistribution(careEvents: any[]): { peakHours: number[] } {
    const hourCounts = careEvents.reduce((acc, event) => {
      const hour = new Date(event.timestamp).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {} as { [hour: number]: number })

    // 最も多い時間帯を特定（平均の1.5倍以上）
    const counts = Object.values(hourCounts) as number[]
    const avgCount = counts.reduce((a, b) => a + b, 0) / 24
    const peakHours = Object.entries(hourCounts)
      .filter(([_, count]) => (count as number) > avgCount * 1.5)
      .map(([hour, _]) => parseInt(hour))
      .sort((a, b) => a - b)

    return { peakHours }
  }
}
