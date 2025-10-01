"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Heart,
  Activity,
  Zap,
  Calendar,
  Users,
  BarChart3,
  Lightbulb
} from 'lucide-react'
import type { CareAnalysisData, CarePattern, CareRecommendation, CareAlert } from '@/types/ai-analysis'
import { AICareAnalysisService } from '@/services/ai-care-analysis-service'
import { DataStorageService } from '@/services/data-storage-service'

interface AIDashboardProps {
  selectedUserId?: string
}

/**
 * AI分析ダッシュボードコンポーネント
 * 健康トレンド、行動パターン、ケア最適化の分析結果を表示
 */
export default function AIDashboard({ selectedUserId }: AIDashboardProps) {
  const [analysisData, setAnalysisData] = useState<{
    health?: CareAnalysisData
    behavior?: CareAnalysisData  
    optimization?: CareAnalysisData
  }>({})
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('health')
  const [users, setUsers] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState(selectedUserId || '')

  useEffect(() => {
    // ユーザー一覧の取得
    const userList = DataStorageService.getUsers()
    setUsers(userList)
    if (!currentUser && userList.length > 0) {
      setCurrentUser(userList[0].id)
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      performAnalysis()
    }
  }, [currentUser])

  /**
   * AI分析実行
   */
  const performAnalysis = async () => {
    if (!currentUser) return

    setLoading(true)
    try {
      // 並列で3種類の分析を実行
      const [healthData, behaviorData, optimizationData] = await Promise.all([
        Promise.resolve(AICareAnalysisService.analyzeHealthTrends(currentUser)),
        Promise.resolve(AICareAnalysisService.analyzeBehaviorPatterns(currentUser)),
        Promise.resolve(AICareAnalysisService.analyzeCareOptimization(currentUser))
      ])

      setAnalysisData({
        health: healthData,
        behavior: behaviorData,
        optimization: optimizationData
      })
    } catch (error) {
      console.error('AI分析エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * トレンドアイコン取得
   */
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'declining':
      case 'concerning':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-blue-500" />
    }
  }

  /**
   * 優先度バッジ取得
   */
  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const

    return (
      <Badge variant={variants[priority as keyof typeof variants] || 'default'}>
        {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
      </Badge>
    )
  }

  /**
   * 重要度スコア取得
   */
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  /**
   * パターンカードコンポーネント
   */
  const PatternCard = ({ pattern }: { pattern: CarePattern }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {getTrendIcon(pattern.trend)}
            {pattern.description}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              信頼度: {Math.round(pattern.confidence * 100)}%
            </span>
            <Progress value={pattern.confidence * 100} className="w-16 h-2" />
          </div>
        </div>
      </CardHeader>
      {pattern.data && pattern.data.length > 0 && (
        <CardContent>
          <p className="text-xs text-muted-foreground">
            データポイント: {pattern.data.length}件
          </p>
        </CardContent>
      )}
    </Card>
  )

  /**
   * 推奨事項カードコンポーネント
   */
  const RecommendationCard = ({ recommendation }: { recommendation: CareRecommendation }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              {recommendation.title}
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              {recommendation.description}
            </CardDescription>
          </div>
          {getPriorityBadge(recommendation.priority)}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground">実行項目:</h4>
          <ul className="text-xs space-y-1">
            {recommendation.actionItems.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-3 p-2 bg-muted rounded text-xs">
            <strong>期待される結果:</strong> {recommendation.expectedOutcome}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  /**
   * アラートカードコンポーネント
   */
  const AlertCard = ({ alert }: { alert: CareAlert }) => (
    <Alert className={`mb-3 ${getSeverityColor(alert.severity)}`}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle className="text-sm font-medium">
        {alert.type === 'health_risk' ? '健康リスク' : 'ケアアラート'}
      </AlertTitle>
      <AlertDescription className="text-xs mt-1">
        <div>{alert.message}</div>
        <div className="mt-2 font-medium">推奨アクション: {alert.suggestedAction}</div>
        {alert.deadline && (
          <div className="mt-1 text-muted-foreground">
            期限: {alert.deadline.toLocaleDateString('ja-JP')}
          </div>
        )}
      </AlertDescription>
    </Alert>
  )

  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-500" />
            AI ケア分析ダッシュボード
          </h1>
          <p className="text-muted-foreground">
            AIによる介護データの高度な分析と洞察
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* ユーザー選択 */}
          <select 
            value={currentUser} 
            onChange={(e) => setCurrentUser(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="">ユーザーを選択</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
          
          <Button 
            onClick={performAnalysis} 
            disabled={loading || !currentUser}
            size="sm"
          >
            {loading ? (
              <>
                <Activity className="h-4 w-4 mr-2 animate-spin" />
                分析中...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                分析実行
              </>
            )}
          </Button>
        </div>
      </div>

      {/* アラート表示 */}
      {Object.values(analysisData).some(data => data?.insights.alerts.length > 0) && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            重要なアラート
          </h2>
          {Object.values(analysisData).map(data => 
            data?.insights.alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))
          )}
        </div>
      )}

      {/* 分析結果タブ */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            健康トレンド
          </TabsTrigger>
          <TabsTrigger value="behavior" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            行動パターン
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            ケア最適化
          </TabsTrigger>
        </TabsList>

        {/* 健康トレンド分析 */}
        <TabsContent value="health" className="space-y-4">
          {analysisData.health ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* パターン */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  検出パターン
                </h3>
                {analysisData.health.insights.patterns.length > 0 ? (
                  analysisData.health.insights.patterns.map(pattern => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      十分なデータが蓄積されていません
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* 推奨事項 */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  推奨事項
                </h3>
                {analysisData.health.insights.recommendations.length > 0 ? (
                  analysisData.health.insights.recommendations.map(rec => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      現在推奨事項はありません
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                分析を実行してください
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* 行動パターン分析 */}
        <TabsContent value="behavior" className="space-y-4">
          {analysisData.behavior ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  行動パターン
                </h3>
                {analysisData.behavior.insights.patterns.length > 0 ? (
                  analysisData.behavior.insights.patterns.map(pattern => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      行動データが不足しています
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  改善提案
                </h3>
                {analysisData.behavior.insights.recommendations.length > 0 ? (
                  analysisData.behavior.insights.recommendations.map(rec => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      現在改善提案はありません
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                分析を実行してください
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ケア最適化 */}
        <TabsContent value="optimization" className="space-y-4">
          {analysisData.optimization ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  最適化ポイント
                </h3>
                {analysisData.optimization.insights.patterns.length > 0 ? (
                  analysisData.optimization.insights.patterns.map(pattern => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      最適化ポイントを分析中...
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  最適化提案
                </h3>
                {analysisData.optimization.insights.recommendations.length > 0 ? (
                  analysisData.optimization.insights.recommendations.map(rec => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                      最適化提案を準備中...
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                分析を実行してください
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* 分析情報 */}
      {currentUser && Object.keys(analysisData).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              分析情報
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysisData.health && (
                <div>
                  <strong>健康トレンド:</strong>
                  <br />
                  期間: {analysisData.health.timeRange.start.toLocaleDateString()} - {analysisData.health.timeRange.end.toLocaleDateString()}
                  <br />
                  パターン: {analysisData.health.insights.patterns.length}件
                </div>
              )}
              {analysisData.behavior && (
                <div>
                  <strong>行動パターン:</strong>
                  <br />
                  期間: {analysisData.behavior.timeRange.start.toLocaleDateString()} - {analysisData.behavior.timeRange.end.toLocaleDateString()}
                  <br />
                  パターン: {analysisData.behavior.insights.patterns.length}件
                </div>
              )}
              {analysisData.optimization && (
                <div>
                  <strong>ケア最適化:</strong>
                  <br />
                  期間: {analysisData.optimization.timeRange.start.toLocaleDateString()} - {analysisData.optimization.timeRange.end.toLocaleDateString()}
                  <br />
                  提案: {analysisData.optimization.insights.recommendations.length}件
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}