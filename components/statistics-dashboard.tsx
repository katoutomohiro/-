"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DataStorageService } from "@/services/data-storage-service"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface StatisticsData {
  totalEvents: number
  eventsByType: { [key: string]: number }
  eventsByDate: { [key: string]: number }
  eventsByUser: { [key: string]: number }
  recentActivity: any[]
  weeklyTrend: { date: string; count: number }[]
  hourlyDistribution: { hour: string; count: number }[]
  eventTypePercentages: { name: string; value: number; color: string }[]
}

interface StatisticsDashboardProps {
  selectedUser?: string
}

export function StatisticsDashboard({ selectedUser }: StatisticsDashboardProps) {
  const [stats, setStats] = useState<StatisticsData | null>(null)
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week")
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  const eventTypeNames: { [key: string]: string } = {
    seizure: "発作記録",
    expression: "表情・反応",
    vitals: "バイタル",
    hydration: "水分補給",
    excretion: "排泄",
    activity: "活動",
    skin_oral_care: "皮膚・口腔ケア",
    tube_feeding: "経管栄養",
    respiratory: "呼吸管理",
    positioning: "体位変換",
    swallowing: "摂食嚥下",
    "infection-prevention": "感染予防",
    communication: "コミュニケーション",
    medication: "服薬管理",
    therapy: "リハビリ",
    "family-communication": "家族連携",
  }

  const eventTypeColors: { [key: string]: string } = {
    seizure: "#ef4444",
    expression: "#f59e0b",
    vitals: "#ec4899",
    hydration: "#06b6d4",
    excretion: "#10b981",
    activity: "#8b5cf6",
    skin_oral_care: "#6366f1",
    tube_feeding: "#f97316",
    respiratory: "#14b8a6",
    positioning: "#84cc16",
    swallowing: "#ec4899",
    "infection-prevention": "#eab308",
    communication: "#a855f7",
    medication: "#14b8a6",
    therapy: "#6366f1",
    "family-communication": "#ec4899",
  }

  const calculateStatistics = () => {
    const allEvents = selectedUser
      ? DataStorageService.getCareEventsByUser(selectedUser)
      : DataStorageService.getAllCareEvents()

    // Filter by time range
    const now = new Date()
    const filteredEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.timestamp)
      const daysDiff = Math.floor((now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24))

      switch (timeRange) {
        case "week":
          return daysDiff <= 7
        case "month":
          return daysDiff <= 30
        case "all":
        default:
          return true
      }
    })

    // Calculate statistics
    const eventsByType: { [key: string]: number } = {}
    const eventsByDate: { [key: string]: number } = {}
    const eventsByUser: { [key: string]: number } = {}
    const hourlyDistribution: { [key: string]: number } = {}

    filteredEvents.forEach((event) => {
      // By type
      eventsByType[event.eventType] = (eventsByType[event.eventType] || 0) + 1

      // By date
      const date = new Date(event.timestamp).toDateString()
      eventsByDate[date] = (eventsByDate[date] || 0) + 1

      // By user
      eventsByUser[event.userId] = (eventsByUser[event.userId] || 0) + 1

      const hour = new Date(event.timestamp).getHours()
      const hourKey = `${hour}:00`
      hourlyDistribution[hourKey] = (hourlyDistribution[hourKey] || 0) + 1
    })

    // Weekly trend (last 7 days)
    const weeklyTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toDateString()
      weeklyTrend.push({
        date: date.toLocaleDateString("ja-JP", { month: "short", day: "numeric" }),
        count: eventsByDate[dateStr] || 0,
      })
    }

    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      count: hourlyDistribution[`${i}:00`] || 0,
    }))

    const totalEventCount = Object.values(eventsByType).reduce((sum, count) => sum + count, 0)
    const eventTypePercentages = Object.entries(eventsByType).map(([type, count]) => ({
      name: eventTypeNames[type] || type,
      value: count,
      color: eventTypeColors[type] || "#94a3b8",
    }))

    // Recent activity (last 10 events)
    const recentActivity = filteredEvents
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)

    setStats({
      totalEvents: filteredEvents.length,
      eventsByType,
      eventsByDate,
      eventsByUser,
      recentActivity,
      weeklyTrend,
      hourlyDistribution: hourlyData,
      eventTypePercentages,
    })
  }

  useEffect(() => {
    calculateStatistics()
  }, [selectedUser, timeRange])

  if (!stats) {
    return <div className="flex items-center justify-center p-8">統計データを読み込み中...</div>
  }

  const maxCount = Object.values(stats.eventsByType).length > 0 ? Math.max(...Object.values(stats.eventsByType)) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">📊 統計ダッシュボード</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant={timeRange === "week" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("week")}>
            1週間
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            1ヶ月
          </Button>
          <Button variant={timeRange === "all" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("all")}>
            全期間
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">総記録数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.totalEvents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {timeRange === "week" ? "過去1週間" : timeRange === "month" ? "過去1ヶ月" : "全期間"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">記録種類数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{Object.keys(stats.eventsByType).length}</div>
            <p className="text-xs text-muted-foreground mt-1">異なるケアイベント</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">平均記録数/日</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {timeRange === "week"
                ? Math.round((stats.totalEvents / 7) * 10) / 10
                : timeRange === "month"
                  ? Math.round((stats.totalEvents / 30) * 10) / 10
                  : Math.round((stats.totalEvents / Math.max(Object.keys(stats.eventsByDate).length, 1)) * 10) / 10}
            </div>
            <p className="text-xs text-muted-foreground mt-1">1日あたり</p>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>週間推移</CardTitle>
            <div className="flex gap-2">
              <Button
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
              >
                棒グラフ
              </Button>
              <Button
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
              >
                折れ線
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "bar" ? (
              <BarChart data={stats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" name="記録数" />
              </BarChart>
            ) : (
              <LineChart data={stats.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} name="記録数" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>ケアイベント別記録数</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.eventTypePercentages}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.eventTypePercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>時間帯別記録分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.hourlyDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="記録数" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {!selectedUser && Object.keys(stats.eventsByUser).length > 1 && (
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>利用者別記録数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Object.entries(stats.eventsByUser)
                .sort(([, a], [, b]) => b - a)
                .map(([user, count]) => (
                  <div
                    key={user}
                    className="text-center p-4 bg-gradient-to-br from-muted/50 to-muted rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="text-2xl font-bold text-primary">{count}</div>
                    <div className="text-sm text-muted-foreground mt-1">{user}</div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>最近の記録</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs">
                      {eventTypeNames[event.eventType] || event.eventType}
                    </Badge>
                    <span className="text-sm font-medium">{event.userId}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleString("ja-JP")}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">記録がありません</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
