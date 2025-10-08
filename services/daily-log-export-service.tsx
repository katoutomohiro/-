import { pdf } from "@react-pdf/renderer"
import { DailyLogPdfDoc } from "@/components/pdf/daily-log-pdf-doc"

export class DailyLogExportService {
  static async generatePdfBlob(dailyLog: any, careEvents: any[]): Promise<Blob> {
    try {
      const doc = <DailyLogPdfDoc dailyLog={dailyLog} careEvents={careEvents} />
      const blob = await pdf(doc).toBlob()

      return blob
    } catch (error) {
      throw new Error("PDF生成に失敗しました")
    }
  }

  static async downloadPdf(dailyLog: any, careEvents: any[]): Promise<void> {
    try {
      const blob = await this.generatePdfBlob(dailyLog, careEvents)
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      link.href = url
      link.download = `daily-log-${dailyLog.user}-${dailyLog.date.replace(/\//g, "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      // PDF download completed successfully
    } catch (error) {
      throw error
    }
  }

  static async exportToCsv(dailyLog: any, careEvents: any[]): Promise<void> {
    try {
      // Validate input data
      if (!dailyLog || !dailyLog.user || !dailyLog.date) {
        throw new Error("日次ログデータが不正です")
      }

      if (!Array.isArray(careEvents)) {
        throw new Error("ケアイベントデータが不正です")
      }

      // Create CSV content with UTF-8 BOM for proper Japanese character display
      let csvContent = "\uFEFF日常ケア記録レポート\n\n"
      csvContent += `利用者,${dailyLog.user || "未設定"}\n`
      csvContent += `記録日,${dailyLog.date || "未設定"}\n`
      csvContent += `生成日時,${new Date().toLocaleString("ja-JP")}\n\n`

      csvContent += "記録サマリー\n"
      csvContent += "ケア項目,記録回数,最終記録時刻\n"

      // Safely process events
      if (dailyLog.events && Array.isArray(dailyLog.events)) {
        dailyLog.events.forEach((event: any) => {
          if (event && event.name) {
            csvContent += `${event.name || "未設定"},${event.count || 0},${event.lastRecorded || "未記録"}\n`
          }
        })
      }

      csvContent += "\n詳細記録\n"
      csvContent += "記録時刻,ケア項目,詳細情報,備考\n"

      // Filter today's events safely
      const todayEvents = careEvents.filter((event: any) => {
        try {
          if (!event || !event.timestamp) return false
          const eventDate = new Date(event.timestamp).toDateString()
          const today = new Date().toDateString()
          return eventDate === today
        } catch (error) {
          return false
        }
      })

      todayEvents.forEach((event: any) => {
        try {
          const time = new Date(event.timestamp).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
          const eventName = this.getEventTypeName(event.eventType || "")
          const details = this.formatEventDetails(event).replace(/,/g, "；") // Replace commas to avoid CSV issues
          const notes = (event.notes || "").replace(/,/g, "；").replace(/\"/g, '""') // Escape quotes
          csvContent += `${time},${eventName},"${details}","${notes}"\n`
        } catch (error) {
        }
      })

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")

      const safeFileName = `daily-log-${(dailyLog.user || "user").replace(/[^a-zA-Z0-9\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, "_")}-${(dailyLog.date || "date").replace(/\//g, "-")}.csv`
      
      link.href = url
      link.download = safeFileName
      link.style.display = "none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)

      // CSV export completed successfully
    } catch (error) {
      throw new Error(`CSV出力に失敗しました: ${error instanceof Error ? error.message : "不明なエラー"}`)
    }
  }

  private static getEventTypeName(eventType: string): string {
    if (!eventType || typeof eventType !== "string") {
      return "不明なケア項目"
    }

    const typeNames: { [key: string]: string } = {
      seizure: "発作記録",
      expression: "表情・反応",
      vitals: "バイタルサイン",
      hydration: "水分補給",
      excretion: "排泄",
      activity: "活動",
      skin_oral_care: "皮膚・口腔ケア",
      tube_feeding: "経管栄養",
      communication: "コミュニケーション",
      medication: "服薬管理",
      therapy: "リハビリテーション",
      "family-communication": "家族連携",
      "swallowing": "摂食嚥下管理",
      "infection-prevention": "感染予防管理"
    }
    return typeNames[eventType] || eventType
  }

  private static formatEventDetails(event: any): string {
    if (!event || !event.eventType) {
      return "詳細情報なし"
    }

    try {
      switch (event.eventType) {
        case "seizure":
          return `種類: ${event.type || "未記録"}, 持続時間: ${event.duration || "未記録"}秒, 重症度: ${event.severity || "未記録"}`
        case "vitals":
          return `体温: ${event.temperature || "未記録"}℃, 血圧: ${event.bloodPressureSystolic || event.systolicBP || "未記録"}/${event.bloodPressureDiastolic || event.diastolicBP || "未記録"}, 心拍数: ${event.heartRate || "未記録"}回/分`
        case "hydration":
          return `水分量: ${event.amount || "未記録"}ml, 種類: ${event.fluidType || "未記録"}, 方法: ${event.method || "未記録"}`
        case "tube_feeding":
          return `注入量: ${event.amount || "未記録"}ml, 栄養剤: ${event.nutritionBrand || "未記録"}, 方法: ${event.infusionMethod || "未記録"}`
        case "expression":
          return `表情: ${event.facialExpression || "未記録"}, 気分: ${event.emotionalState || "未記録"}`
        case "activity":
          return `活動: ${event.activityType || "未記録"}, 参加度: ${event.participationLevel || "未記録"}`
        case "communication":
          return `方法: ${event.communicationMethod || "未記録"}, 反応: ${event.responseLevel || "未記録"}`
        default:
          return "詳細情報なし"
      }
    } catch (error) {
      return "詳細情報の取得に失敗"
    }
  }

  static generateDailyLogFromStorage(selectedUser: string): any {
    try {
      const careEventsRaw = localStorage.getItem("careEvents")
      if (!careEventsRaw) {
        // No care events found in storage
        return this.createEmptyDailyLog(selectedUser)
      }

      const careEvents = JSON.parse(careEventsRaw)
      if (!Array.isArray(careEvents)) {
        return this.createEmptyDailyLog(selectedUser)
      }

      // Filter today's events with error handling
      const todayEvents = careEvents.filter((event: any) => {
        try {
          if (!event || !event.timestamp) return false
          if (!event.userId || event.userId !== selectedUser) return false
          
          const eventDate = new Date(event.timestamp).toDateString()
          const today = new Date().toDateString()
          return eventDate === today
        } catch (error) {
          return false
        }
      })

      const eventCategories = [
        { id: "seizure", name: "発作記録" },
        { id: "expression", name: "表情・反応" },
        { id: "vitals", name: "バイタル" },
        { id: "hydration", name: "水分補給" },
        { id: "excretion", name: "排泄" },
        { id: "activity", name: "活動" },
        { id: "skin_oral_care", name: "皮膚・口腔ケア" },
        { id: "tube_feeding", name: "経管栄養" },
        { id: "communication", name: "コミュニケーション" },
        { id: "medication", name: "服薬管理" },
        { id: "therapy", name: "リハビリテーション" },
        { id: "family-communication", name: "家族連携" },
        { id: "swallowing", name: "摂食嚥下管理" },
        { id: "infection-prevention", name: "感染予防管理" }
      ]

      return {
        user: selectedUser || "未設定",
        date: new Date().toLocaleDateString("ja-JP"),
        events: eventCategories.map((category) => {
          const categoryEvents = todayEvents.filter((event: any) => event.eventType === category.id)
          return {
            type: category.id,
            name: category.name,
            count: categoryEvents.length,
            lastRecorded:
              categoryEvents.length > 0
                ? (() => {
                    try {
                      return new Date(categoryEvents[categoryEvents.length - 1].timestamp).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    } catch (error) {
                      return "時刻不明"
                    }
                  })()
                : "未記録",
          }
        }),
      }
    } catch (error) {
      return this.createEmptyDailyLog(selectedUser)
    }
  }

  private static createEmptyDailyLog(selectedUser: string): any {
    const eventCategories = [
      { id: "seizure", name: "発作記録" },
      { id: "expression", name: "表情・反応" },
      { id: "vitals", name: "バイタル" },
      { id: "hydration", name: "水分補給" },
      { id: "excretion", name: "排泄" },
      { id: "activity", name: "活動" },
      { id: "skin_oral_care", name: "皮膚・口腔ケア" },
      { id: "tube_feeding", name: "経管栄養" }
    ]

    return {
      user: selectedUser || "未設定",
      date: new Date().toLocaleDateString("ja-JP"),
      events: eventCategories.map((category) => ({
        type: category.id,
        name: category.name,
        count: 0,
        lastRecorded: "未記録"
      }))
    }
  }
}
