"use client"

import { useState, useEffect, useCallback, type KeyboardEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CareFormModal } from "@/components/care-form-modal"
import { PdfPreviewModal } from "@/components/pdf/pdf-preview-modal"
import { DataBackupPanel } from "@/components/data-backup-panel"
import { StatisticsDashboard } from "@/components/statistics-dashboard"
import { SettingsPanel } from "@/components/settings-panel"
import { A4RecordSheet } from "@/components/a4-record-sheet"
import { DailyLogExportService } from "@/services/daily-log-export-service"
import { DataStorageService } from "@/services/data-storage-service"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AdminPasswordAuth } from "@/components/admin-password-auth"
import AIDashboard from "@/components/ai-dashboard"

const eventCategories = [
  {
    id: "seizure",
    name: "逋ｺ菴懆ｨ倬鹸",
    icon: "笞｡",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    iconBg: "bg-red-100 text-red-600",
    description: "逋ｺ菴懊・遞ｮ鬘槭・譎る俣繝ｻ蟇ｾ蠢懊ｒ險倬鹸",
  },
  {
    id: "expression",
    name: "陦ｨ諠・・蜿榊ｿ・,
    icon: "・",
    color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100",
    iconBg: "bg-amber-100 text-amber-600",
    description: "陦ｨ諠・ｄ蜿榊ｿ懊・螟牙喧繧定ｨ倬鹸",
  },
  {
    id: "vitals",
    name: "繝舌う繧ｿ繝ｫ",
    icon: "笶､・・,
    color: "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100",
    iconBg: "bg-rose-100 text-rose-600",
    description: "菴捺ｸｩ繝ｻ陦蝨ｧ繝ｻ閼域牛繧定ｨ倬鹸",
  },
  {
    id: "hydration",
    name: "豌ｴ蛻・｣懃ｵｦ",
    icon: "挑",
    color: "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100",
    iconBg: "bg-sky-100 text-sky-600",
    description: "豌ｴ蛻・曹蜿夜㍼繝ｻ譁ｹ豕輔ｒ險倬鹸",
  },
  {
    id: "excretion",
    name: "謗呈ｳ・,
    icon: "埒",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
    iconBg: "bg-emerald-100 text-emerald-600",
    description: "謗貞ｰｿ繝ｻ謗剃ｾｿ縺ｮ迥ｶ豕√ｒ險倬鹸",
  },
  {
    id: "activity",
    name: "豢ｻ蜍・,
    icon: "純",
    color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100",
    iconBg: "bg-violet-100 text-violet-600",
    description: "譌･蟶ｸ豢ｻ蜍輔・繝ｪ繝上ン繝ｪ繧定ｨ倬鹸",
  },
  {
    id: "skin_oral_care",
    name: "逧ｮ閹壹・蜿｣閻斐こ繧｢",
    icon: "孱・・,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    iconBg: "bg-indigo-100 text-indigo-600",
    description: "逧ｮ閹夂憾諷九・蜿｣閻斐こ繧｢繧定ｨ倬鹸",
  },
  {
    id: "tube_feeding",
    name: "邨檎ｮ｡譬・､・,
    icon: "鎖・・,
    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    iconBg: "bg-orange-100 text-orange-600",
    description: "邨檎ｮ｡譬・､翫・螳滓命迥ｶ豕√ｒ險倬鹸",
  },
  {
    id: "respiratory",
    name: "蜻ｼ蜷ｸ邂｡逅・,
    icon: "ｫ・,
    color: "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100",
    iconBg: "bg-cyan-100 text-cyan-600",
    description: "蜻ｼ蜷ｸ迥ｶ諷九・莠ｺ蟾･蜻ｼ蜷ｸ蝎ｨ邂｡逅・ｒ險倬鹸",
  },
  {
    id: "positioning",
    name: "菴謎ｽ榊､画鋤繝ｻ蟋ｿ蜍｢邂｡逅・,
    icon: "売",
    color: "bg-lime-50 text-lime-700 border-lime-200 hover:bg-lime-100",
    iconBg: "bg-lime-100 text-lime-600",
    description: "菴謎ｽ榊､画鋤繝ｻ蟋ｿ蜍｢隱ｿ謨ｴ繧定ｨ倬鹸",
  },
  {
    id: "swallowing",
    name: "鞫る｣溷嗇荳狗ｮ｡逅・,
    icon: "鎖・・,
    color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    iconBg: "bg-pink-100 text-pink-600",
    description: "蝴･荳区ｩ溯・繝ｻ隱､蝴･繝ｪ繧ｹ繧ｯ邂｡逅・ｒ險倬鹸",
  },
  {
    id: "infection-prevention",
    name: "諢滓沒莠磯亟邂｡逅・,
    icon: "孱・・,
    color: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
    iconBg: "bg-yellow-100 text-yellow-600",
    description: "諢滓沒蜈・吶・莠磯亟遲門ｮ滓命繧定ｨ倬鹸",
  },
  {
    id: "communication",
    name: "繧ｳ繝溘Η繝九こ繝ｼ繧ｷ繝ｧ繝ｳ謾ｯ謠ｴ",
    icon: "町",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    iconBg: "bg-purple-100 text-purple-600",
    description: "諢乗晉鮪騾壹・謾ｯ謠ｴ讖溷勣菴ｿ逕ｨ繧定ｨ倬鹸",
  },
]

const users = [
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
  "蛻ｩ逕ｨ閠・",
]

const welfareServices = [
  {
    id: "life-care",
    name: "逕滓ｴｻ莉玖ｭｷ",
    icon: "唱",
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
    description: "譌･荳ｭ豢ｻ蜍輔・蜑ｵ菴懈ｴｻ蜍輔・逕溽肇豢ｻ蜍輔・險倬鹸縺ｨ謾ｯ謠ｴ險育判邂｡逅・,
    features: ["蛟句挨謾ｯ謠ｴ險育判", "豢ｻ蜍戊ｨ倬鹸", "蛛･蠎ｷ邂｡逅・, "螳ｶ譌城｣謳ｺ"],
  },
  {
    id: "after-school",
    name: "謾ｾ隱ｲ蠕檎ｭ峨ョ繧､繧ｵ繝ｼ繝薙せ",
    icon: "雌",
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
    description: "蟄ｦ鮨｢譛溘・逋りご繝ｻ髮・屮豢ｻ蜍輔・蛟句挨謾ｯ謠ｴ縺ｮ險倬鹸",
    features: ["逋りご繝励Ο繧ｰ繝ｩ繝", "逋ｺ驕疲髪謠ｴ", "蟄ｦ鄙呈髪謠ｴ", "遉ｾ莨壽ｧ閧ｲ謌・],
  },
  {
    id: "day-support",
    name: "譌･荳ｭ荳譎よ髪謠ｴ",
    icon: "竢ｰ",
    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
    description: "遏ｭ譛滄舌°繧翫・隕句ｮ医ｊ謾ｯ謠ｴ縺ｮ迥ｶ豕∬ｨ倬鹸",
    features: ["螳牙・邂｡逅・, "豢ｻ蜍墓髪謠ｴ", "邱頑･蟇ｾ蠢・, "螳ｶ譌乗髪謠ｴ"],
  },
  {
    id: "group-home",
    name: "繧ｰ繝ｫ繝ｼ繝励・繝ｼ繝",
    icon: "匠",
    color: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100",
    description: "蜈ｱ蜷檎函豢ｻ謠ｴ蜉ｩ繝ｻ螟憺俣謾ｯ謠ｴ繝ｻ逕滓ｴｻ逶ｸ隲・・險倬鹸",
    features: ["逕滓ｴｻ謾ｯ謠ｴ", "螟憺俣繧ｱ繧｢", "閾ｪ遶区髪謠ｴ", "蝨ｰ蝓滄｣謳ｺ"],
  },
  {
    id: "home-care",
    name: "驥榊ｺｦ險ｪ蝠丈ｻ玖ｭｷ",
    icon: "囁",
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    description: "蝨ｨ螳・髪謠ｴ繝ｻ螟門・謾ｯ謠ｴ繝ｻ霄ｫ菴謎ｻ玖ｭｷ縺ｮ險倬鹸",
    features: ["霄ｫ菴謎ｻ玖ｭｷ", "螳ｶ莠区髪謠ｴ", "螟門・謾ｯ謠ｴ", "蛹ｻ逋る｣謳ｺ"],
  },
]

const enhancedEventCategories = [
  ...eventCategories,
  {
    id: "medication",
    name: "譛崎脈邂｡逅・,
    icon: "抽",
    color: "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100",
    iconBg: "bg-teal-100 text-teal-600",
    description: "蜃ｦ譁ｹ阮ｬ縺ｮ譛崎脈迥ｶ豕√・蜑ｯ菴懃畑繝ｻ蜉ｹ譫懊・險倬鹸",
  },
  {
    id: "therapy",
    name: "繝ｪ繝上ン繝ｪ繝・・繧ｷ繝ｧ繝ｳ",
    icon: "純窶坂凾・・,
    color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100",
    iconBg: "bg-indigo-100 text-indigo-600",
    description: "逅・ｭｦ逋よｳ輔・菴懈･ｭ逋よｳ輔・險隱樒凾豕輔・螳滓命險倬鹸",
  },
  {
    id: "family-communication",
    name: "螳ｶ譌城｣謳ｺ",
    icon: "捉窶昨汨ｩ窶昨汨ｧ窶昨汨ｦ",
    color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100",
    iconBg: "bg-pink-100 text-pink-600",
    description: "螳ｶ譌上→縺ｮ諠・ｱ蜈ｱ譛峨・逶ｸ隲・・謾ｯ謠ｴ險育判縺ｮ隱ｿ謨ｴ",
  },
]

export default function WorldClassSoulCareApp() {
  const [customUserNames, setCustomUserNames] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("蛻ｩ逕ｨ閠・")
  const [dailyLog, setDailyLog] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentFormType, setCurrentFormType] = useState<string | null>(null)
  const [isPdfPreviewOpen, setIsPdfPreviewOpen] = useState(false)
  const [isA4RecordSheetOpen, setIsA4RecordSheetOpen] = useState(false)
  const [careEvents, setCareEvents] = useState<any[]>([])
  const [currentView, setCurrentView] = useState<"dashboard" | "statistics" | "settings" | "ai-analysis">("dashboard")
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [appTitle, setAppTitle] = useState("譌･蟶ｸ繧ｱ繧｢險倬鹸繧ｷ繧ｹ繝・Β")
  const [appSubtitle, setAppSubtitle] = useState("驥咲裸蠢・ｺｫ髫懊′縺・・閠・髪謠ｴ繧｢繝励Μ - PROJECT SOUL")
  const [isClient, setIsClient] = useState(false)
  const { toast } = useToast()

  // Client-side only initialization to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
    const savedTitle = localStorage.getItem("app-title")
    const savedSubtitle = localStorage.getItem("app-subtitle")
    if (savedTitle) setAppTitle(savedTitle)
    if (savedSubtitle) setAppSubtitle(savedSubtitle)
  }, [])

  const generateDailyLog = useCallback(() => {
    const events = DataStorageService.getCareEventsByUser(selectedUser)
    setCareEvents(events)
    const log = DailyLogExportService.generateDailyLogFromStorage(selectedUser)
    setDailyLog(log)
  }, [selectedUser])

  const openForm = (formType: string) => {
    setCurrentFormType(formType)
    setIsModalOpen(true)
  }

  const handleFormSubmit = (data: any) => {
    toast({
      type: "success",
      title: "險倬鹸繧剃ｿ晏ｭ倥＠縺ｾ縺励◆",
      description: `${data.eventType}縺ｮ險倬鹸縺梧ｭ｣蟶ｸ縺ｫ菫晏ｭ倥＆繧後∪縺励◆`,
    })
    generateDailyLog() // Refresh the daily log
  }

  const handlePdfPreview = useCallback(() => {
    setIsLoading(true)
    try {
      generateDailyLog()
      setIsPdfPreviewOpen(true)
      toast({
        type: "success",
        title: "PDF繝励Ξ繝薙Η繝ｼ繧帝幕縺阪∪縺励◆",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "PDF繝励Ξ繝薙Η繝ｼ縺ｮ逕滓・縺ｫ螟ｱ謨励＠縺ｾ縺励◆",
        description: "繧ゅ≧荳蠎ｦ縺願ｩｦ縺励￥縺縺輔＞",
      })
    } finally {
      setIsLoading(false)
    }
  }, [generateDailyLog, toast])

  const handleExcelExport = useCallback(async () => {
    try {
      setIsExporting(true)
      generateDailyLog()

      await DailyLogExportService.exportToCsv(dailyLog, careEvents)

      toast({
        type: "success",
        title: "CSV蜃ｺ蜉帙′螳御ｺ・＠縺ｾ縺励◆",
        description: "繝輔ぃ繧､繝ｫ縺後ム繧ｦ繝ｳ繝ｭ繝ｼ繝峨＆繧後∪縺励◆",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "CSV蜃ｺ蜉帙↓螟ｱ謨励＠縺ｾ縺励◆",
        description: "繧ゅ≧荳蠎ｦ縺願ｩｦ縺励￥縺縺輔＞",
      })
    } finally {
      setIsExporting(false)
    }
  }, [generateDailyLog, dailyLog, careEvents, toast])

  const handleA4RecordSheetPreview = useCallback(() => {
    setIsLoading(true)
    try {
      generateDailyLog()
      setIsA4RecordSheetOpen(true)
      toast({
        type: "success",
        title: "A4險倬鹸逕ｨ邏吶ｒ髢九″縺ｾ縺励◆",
      })
    } catch (error) {
      toast({
        type: "error",
        title: "A4險倬鹸逕ｨ邏吶・逕滓・縺ｫ螟ｱ謨励＠縺ｾ縺励◆",
        description: "繧ゅ≧荳蠎ｦ縺願ｩｦ縺励￥縺縺輔＞",
      })
    } finally {
      setIsLoading(false)
    }
  }, [generateDailyLog, toast])

  const handleA4RecordSheetPrint = useCallback(() => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const recordSheetElement = document.getElementById("a4-record-sheet")
      if (recordSheetElement) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>莉玖ｭｷ險倬鹸逕ｨ邏・- ${selectedUser}</title>
              <style>
                @media print {
                  @page { margin: 0; size: A4; }
                  body { margin: 0; font-family: sans-serif; }
                }
                ${document.head.querySelector("style")?.innerHTML || ""}
              </style>
            </head>
            <body>
              ${recordSheetElement.outerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }, [selectedUser])

  const handleDataChange = useCallback(() => {
    generateDailyLog()
    const savedUserNames = DataStorageService.getCustomUserNames()
    if (savedUserNames.length > 0) {
      setCustomUserNames(savedUserNames)
      // Update selected user if current selection doesn't exist in restored names
      if (!savedUserNames.includes(selectedUser)) {
        setSelectedUser(savedUserNames[0])
      }
    }
    toast({
      type: "success",
      title: "繝・・繧ｿ縺梧峩譁ｰ縺輔ｌ縺ｾ縺励◆",
    })
  }, [generateDailyLog, addToast, selectedUser])

  const handleUserNamesUpdate = (newUserNames: string[]) => {
    setCustomUserNames(newUserNames)
    // Update selected user if current selection doesn't exist in new names
    if (!newUserNames.includes(selectedUser)) {
      setSelectedUser(newUserNames[0] || "蛻ｩ逕ｨ閠・")
    }
  }

  const handleAppTitleUpdate = (title: string, subtitle: string) => {
    setAppTitle(title)
    setAppSubtitle(subtitle)
  }

  useEffect(() => {
    if (!isClient) return
    
    const savedUserNames = DataStorageService.getCustomUserNames()
    if (savedUserNames.length > 0) {
      setCustomUserNames(savedUserNames)
      // Update selected user if current selection doesn't exist in custom names
      if (!savedUserNames.includes(selectedUser)) {
        setSelectedUser(savedUserNames[0] || "蛻ｩ逕ｨ閠・")
      }
    } else {
      setCustomUserNames(users)
    }
  }, [selectedUser, isClient])

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case "1":
            event.preventDefault()
            setCurrentView("dashboard")
            break
          case "2":
            event.preventDefault()
            setCurrentView("statistics")
            break
          case "3":
            event.preventDefault()
            setCurrentView("settings")
            break
          case "4":
            event.preventDefault()
            setCurrentView("ai-analysis")
            break
          case "p":
            event.preventDefault()
            handlePdfPreview()
            break
          case "e":
            event.preventDefault()
            handleExcelExport()
            break
          case "a":
            event.preventDefault()
            handleA4RecordSheetPreview()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePdfPreview, handleExcelExport, handleA4RecordSheetPreview])

  const currentUsers = customUserNames.length > 0 ? customUserNames : users

  // Prevent hydration mismatch by not rendering until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">驥榊ｿ・こ繧｢繧｢繝励Μ - PROJECT SOUL</h1>
              <p className="text-muted-foreground font-medium">驥咲裸蠢・ｺｫ髫懊′縺・・閠・・蛹・峡逧・ｦ冗･画髪謠ｴ繧ｷ繧ｹ繝・Β</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
              <select className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary">
                <option value="">繧ｵ繝ｼ繝薙せ遞ｮ蛻･繧帝∈謚・/option>
                {welfareServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md min-w-[120px]"
                aria-label="蛻ｩ逕ｨ閠・ｒ驕ｸ謚・
              >
                {currentUsers.map((user) => (
                  <option key={user} value={user}>
                    {user}
                  </option>
                ))}
              </select>
              <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Badge>
            </div>
          </div>

          {/* 繝薙Η繝ｼ蛻・ｊ譖ｿ縺医リ繝薙ご繝ｼ繧ｷ繝ｧ繝ｳ */}
          <div className="border-t border-border/50 pt-4 mt-6">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={currentView === "dashboard" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("dashboard")}
                className="flex items-center gap-2"
              >
                匠 繝繝・す繝･繝懊・繝・
              </Button>
              <Button
                variant={currentView === "statistics" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("statistics")}
                className="flex items-center gap-2"
              >
                投 邨ｱ險医・蛻・梵
              </Button>
              <Button
                variant={currentView === "ai-analysis" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("ai-analysis")}
                className="flex items-center gap-2"
              >
                ､・AI蛻・梵
              </Button>
              <Button
                variant={currentView === "settings" ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentView("settings")}
                className="flex items-center gap-2"
              >
                笞呻ｸ・險ｭ螳・
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {welfareServices.map((service) => (
            <Card
              key={service.id}
              className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-[1.02] ${service.color}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-white/50 text-2xl transition-all duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold">{service.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <div className="flex flex-wrap gap-1">
                  {service.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                <Button size="sm" className="w-full">
                  {service.name}險倬鹸
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {currentView === "dashboard" ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {enhancedEventCategories.map((category) => (
                <Card
                  key={category.id}
                  className={`group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary/30 hover:scale-[1.02] ${category.color} backdrop-blur-sm min-h-[200px] flex flex-col`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${category.iconBg} text-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm flex-shrink-0`}
                      >
                        {category.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold leading-tight">{category.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{category.description}</p>
                    <Button
                      size="sm"
                      className="w-full transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium mt-auto"
                      onClick={() => openForm(category.id)}
                      aria-label={`${category.name}繧定ｨ倬鹸縺吶ｋ`}
                    >
                      險倬鹸縺吶ｋ
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">塘</div>
                    險倬鹸縺ｮ蜃ｺ蜉・
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={handleA4RecordSheetPreview}
                      className="flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg w-full"
                      disabled={isLoading}
                      title="A4險倬鹸逕ｨ邏吶・繝ｬ繝薙Η繝ｼ (Ctrl+A)"
                    >
                      {isLoading ? <LoadingSpinner size="sm" /> : "搭"}
                      A4險倬鹸逕ｨ邏・
                    </Button>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={handlePdfPreview}
                        className="flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg flex-1"
                        disabled={isLoading}
                        title="PDF繝励Ξ繝薙Η繝ｼ (Ctrl+P)"
                      >
                        {isLoading ? <LoadingSpinner size="sm" /> : "早・・}
                        PDF繝励Ξ繝薙Η繝ｼ
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleExcelExport}
                        className="flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg flex-1 bg-transparent"
                        disabled={isExporting}
                        title="CSV蜃ｺ蜉・(Ctrl+E)"
                      >
                        {isExporting ? <LoadingSpinner size="sm" /> : "踏"}
                        CSV蜃ｺ蜉・
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <DataBackupPanel onDataChange={handleDataChange} />
            </div>

            {dailyLog && (
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-secondary/10 rounded-lg">投</div>
                    譛ｬ譌･縺ｮ險倬鹸繧ｵ繝槭Μ繝ｼ - {dailyLog.user}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {dailyLog.events.map((event: any) => (
                      <div
                        key={event.type}
                        className="text-center p-4 bg-gradient-to-br from-muted/50 to-muted rounded-xl hover:shadow-md transition-all duration-300 hover:scale-105"
                      >
                        <div className="text-3xl font-bold text-primary mb-1">{event.count}</div>
                        <div className="text-sm font-medium text-foreground mb-1">{event.name}</div>
                        <div className="text-xs text-muted-foreground">譛邨・ {event.lastRecorded}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : currentView === "statistics" ? (
          <StatisticsDashboard selectedUser={selectedUser} />
        ) : currentView === "ai-analysis" ? (
          <AIDashboard selectedUserId={selectedUser} />
        ) : (
          <div className="space-y-6">
            <AdminPasswordAuth onUserNamesUpdate={handleUserNamesUpdate} onAppTitleUpdate={handleAppTitleUpdate} />
            <SettingsPanel selectedUser={selectedUser} onUserChange={setSelectedUser} />
          </div>
        )}

        <CareFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formType={currentFormType}
          onSubmit={handleFormSubmit}
          selectedUser={selectedUser}
        />

        <PdfPreviewModal
          isOpen={isPdfPreviewOpen}
          onClose={() => setIsPdfPreviewOpen(false)}
          dailyLog={dailyLog}
          careEvents={careEvents}
        />

        {isA4RecordSheetOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">A4險倬鹸逕ｨ邏・- {selectedUser}</h2>
                <div className="flex gap-2">
                  <Button onClick={handleA4RecordSheetPrint} className="flex items-center gap-2" size="sm">
                    蜜・・蜊ｰ蛻ｷ
                  </Button>
                  <Button onClick={() => setIsA4RecordSheetOpen(false)} variant="outline" size="sm">
                    髢峨§繧・
                  </Button>
                </div>
              </div>
              <div className="overflow-auto max-h-[calc(90vh-80px)]">
                <div id="a4-record-sheet">
                  <A4RecordSheet
                    selectedUser={selectedUser}
                    dailyRecords={careEvents}
                    date={new Date().toLocaleDateString("ja-JP")}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
