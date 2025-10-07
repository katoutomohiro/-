export interface CareEvent {
  id: string
  eventType: string
  timestamp: string
  userId: string
  time: string
  timeOfDay?: "morning" | "afternoon" | "evening" | "night"
  notes?: string
  photos?: string[]
  [key: string]: any
}

export interface UserProfile {
  id: string
  name: string
  furigana?: string
  age?: number
  gender?: "male" | "female" | "other"
  dateOfBirth?: string
  serviceType?: "daily-care" | "after-school" | "day-support" | "group-home" | "home-care"
  disabilityLevel?: string
  medicalCareNeeds?: string[]
  guardianName?: string
  guardianPhone?: string
  address?: string
  medicalNumber?: string
  careLevel?: string
  allergies?: string[]
  medications?: string[]
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CaseRecord {
  id: string
  userId: string
  date: string
  dayOfWeek: string
  staff: string[]

  vitals: {
    time: string
    temperature: number
  }[]

  excretion: {
    time: string
    urine: string
    stool: string
  }[]

  hydration: {
    time: string
    content: string
    amount?: string
  }[]

  oralIntake: {
    time: string
    food: string
    amount: string
    notes: string
  }[]

  eyeDrops: {
    time: string
    medication: string
    eye: string
  }[]

  bathing: boolean

  seizures: {
    occurred: boolean
    details?: string
  }

  other: string

  posture: {
    am: string
    pm: string
  }

  choking: boolean
  expression: "明るい" | "暗い" | ""
  lipPursing: boolean
  otherObservations: string

  massage: {
    areas: string[]
    condition: string
    content: string
  }

  healthManagement: {
    abdominalDistension: "－" | "軽" | "＋" | ""
    bowelSounds: "弱" | "良" | "亢進" | ""
    gastrostomyAbnormality: boolean
    skinTrouble: boolean
  }

  physicalFunction: string

  contracturePrevention: {
    progressingContractures: string[]
    careDetails: string
  }

  physicalRestraint: {
    buggy: boolean
    bedCushion: boolean
    details: string
  }

  specialNotes: string
  activities: string

  staffSignatures: string[]

  createdAt: string
  updatedAt: string
}

export class DataStorageService {
  private static readonly CARE_EVENTS_KEY = "careEvents"
  private static readonly USER_PROFILES_KEY = "userProfiles"
  private static readonly APP_SETTINGS_KEY = "appSettings"
  private static readonly CUSTOM_USER_NAMES_KEY = "customUserNames"
  private static readonly FORM_OPTIONS_KEY = "form-options"
  private static readonly CASE_RECORDS_KEY = "caseRecords"

  // Care Events Management
  static saveCareEvent(event: Omit<CareEvent, "id">): CareEvent {
    try {
      const events = this.getAllCareEvents()
      const newEvent: CareEvent = {
        ...event,
        id: this.generateId(),
      } as CareEvent

      events.push(newEvent)
      localStorage.setItem(this.CARE_EVENTS_KEY, JSON.stringify(events))

      // Care event saved successfully
      return newEvent
    } catch (error) {
      console.error("[v0] Failed to save care event:", error)
      throw new Error("ケア記録の保存に失敗しました")
    }
  }

  static getAllCareEvents(): CareEvent[] {
    try {
      const events = localStorage.getItem(this.CARE_EVENTS_KEY)
      return events ? JSON.parse(events) : []
    } catch (error) {
      console.error("[v0] Failed to load care events:", error)
      return []
    }
  }

  static getCareEventsByUser(userId: string): CareEvent[] {
    return this.getAllCareEvents().filter((event) => event.userId === userId)
  }

  static getCareEventsByDate(date: string, userId?: string): CareEvent[] {
    const events = userId ? this.getCareEventsByUser(userId) : this.getAllCareEvents()
    return events.filter((event) => {
      const eventDate = new Date(event.timestamp).toDateString()
      const targetDate = new Date(date).toDateString()
      return eventDate === targetDate
    })
  }

  static getCareEventById(eventId: string): CareEvent | null {
    const allEvents = this.getAllCareEvents()
    return allEvents.find((event) => event.id === eventId) || null
  }

  static deleteCareEvent(eventId: string): boolean {
    try {
      const events = this.getAllCareEvents()
      const filteredEvents = events.filter((event) => event.id !== eventId)

      if (events.length === filteredEvents.length) {
        return false // Event not found
      }

      localStorage.setItem(this.CARE_EVENTS_KEY, JSON.stringify(filteredEvents))
      // Care event deleted successfully
      return true
    } catch (error) {
      console.error("[v0] Failed to delete care event:", error)
      throw new Error("ケア記録の削除に失敗しました")
    }
  }

  // User Profile Management
  static saveUserProfile(profile: Omit<UserProfile, "id" | "createdAt" | "updatedAt">): UserProfile {
    try {
      const profiles = this.getAllUserProfiles()
      const existingProfile = profiles.find((p) => p.name === profile.name)

      if (existingProfile) {
        // Update existing profile
        const updatedProfile: UserProfile = {
          ...existingProfile,
          ...profile,
          updatedAt: new Date().toISOString(),
        }

        const updatedProfiles = profiles.map((p) => (p.id === existingProfile.id ? updatedProfile : p))

        localStorage.setItem(this.USER_PROFILES_KEY, JSON.stringify(updatedProfiles))
        // User profile updated successfully
        return updatedProfile
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          ...profile,
          id: this.generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        profiles.push(newProfile)
        localStorage.setItem(this.USER_PROFILES_KEY, JSON.stringify(profiles))
        // User profile created successfully
        return newProfile
      }
    } catch (error) {
      console.error("[v0] Failed to save user profile:", error)
      throw new Error("利用者プロフィールの保存に失敗しました")
    }
  }

  static getAllUserProfiles(): UserProfile[] {
    try {
      const profiles = localStorage.getItem(this.USER_PROFILES_KEY)
      return profiles ? JSON.parse(profiles) : []
    } catch (error) {
      console.error("[v0] Failed to load user profiles:", error)
      return []
    }
  }

  static getUserProfile(userId: string): UserProfile | null {
    return this.getAllUserProfiles().find((profile) => profile.id === userId) || null
  }

  // Alias for getAllUserProfiles for compatibility
  static getUsers(): UserProfile[] {
    return this.getAllUserProfiles()
  }

  static deleteUserProfile(userId: string): boolean {
    try {
      const profiles = this.getAllUserProfiles()
      const filteredProfiles = profiles.filter((profile) => profile.id !== userId)

      if (profiles.length === filteredProfiles.length) {
        return false // Profile not found
      }

      localStorage.setItem(this.USER_PROFILES_KEY, JSON.stringify(filteredProfiles))
      // User profile deleted successfully
      return true
    } catch (error) {
      console.error("[v0] Failed to delete user profile:", error)
      throw new Error("利用者プロフィールの削除に失敗しました")
    }
  }

  // Custom User Names Management
  static getCustomUserNames(): string[] {
    try {
      const userNames = localStorage.getItem(this.CUSTOM_USER_NAMES_KEY)
      return userNames ? JSON.parse(userNames) : []
    } catch (error) {
      console.error("[v0] Failed to load custom user names:", error)
      return []
    }
  }

  static saveCustomUserNames(userNames: string[]): void {
    try {
      localStorage.setItem(this.CUSTOM_USER_NAMES_KEY, JSON.stringify(userNames))
      // Custom user names saved successfully
    } catch (error) {
      console.error("[v0] Failed to save custom user names:", error)
      throw new Error("利用者名の保存に失敗しました")
    }
  }

  static updateUserNameInEvents(oldName: string, newName: string): void {
    try {
      const events = this.getAllCareEvents()
      const updatedEvents = events.map((event) => (event.userId === oldName ? { ...event, userId: newName } : event))
      localStorage.setItem(this.CARE_EVENTS_KEY, JSON.stringify(updatedEvents))
      // User name updated in events successfully
    } catch (error) {
      console.error("[v0] Failed to update user name in events:", error)
      throw new Error("記録データの利用者名更新に失敗しました")
    }
  }

  static updateUserNameInProfiles(oldName: string, newName: string): void {
    try {
      const profiles = this.getAllUserProfiles()
      const updatedProfiles = profiles.map((profile) =>
        profile.name === oldName ? { ...profile, name: newName, updatedAt: new Date().toISOString() } : profile,
      )
      localStorage.setItem(this.USER_PROFILES_KEY, JSON.stringify(updatedProfiles))
      // User name updated in profiles successfully
    } catch (error) {
      console.error("[v0] Failed to update user name in profiles:", error)
      throw new Error("プロフィールデータの利用者名更新に失敗しました")
    }
  }

  // Form Options Management
  static getFormOptions(): any {
    try {
      const options = localStorage.getItem(this.FORM_OPTIONS_KEY)
      return options ? JSON.parse(options) : {}
    } catch (error) {
      console.error("[v0] Failed to load form options:", error)
      return {}
    }
  }

  static saveFormOptions(options: any): void {
    try {
      localStorage.setItem(this.FORM_OPTIONS_KEY, JSON.stringify(options))
      // Form options saved successfully
    } catch (error) {
      console.error("[v0] Failed to save form options:", error)
      throw new Error("フォーム選択項目の保存に失敗しました")
    }
  }

  static resetFormOptions(): void {
    try {
      localStorage.removeItem(this.FORM_OPTIONS_KEY)
      // Form options reset to default successfully
    } catch (error) {
      console.error("[v0] Failed to reset form options:", error)
      throw new Error("フォーム選択項目のリセットに失敗しました")
    }
  }

  // Case Record Management
  static saveCaseRecord(record: Partial<CaseRecord>): CaseRecord {
    try {
      const records = this.getAllCaseRecords()
      const now = new Date().toISOString()

      const newRecord: CaseRecord = {
        id: record.id || this.generateId(),
        userId: record.userId || "",
        date: record.date || new Date().toISOString().split("T")[0],
        dayOfWeek: record.dayOfWeek || "",
        staff: record.staff || [],
        vitals: record.vitals || [],
        excretion: record.excretion || [],
        hydration: record.hydration || [],
        oralIntake: record.oralIntake || [],
        eyeDrops: record.eyeDrops || [],
        bathing: record.bathing || false,
        seizures: record.seizures || { occurred: false },
        other: record.other || "",
        posture: record.posture || { am: "", pm: "" },
        choking: record.choking || false,
        expression: record.expression || "",
        lipPursing: record.lipPursing || false,
        otherObservations: record.otherObservations || "",
        massage: record.massage || { areas: [], condition: "", content: "" },
        healthManagement: record.healthManagement || {
          abdominalDistension: "",
          bowelSounds: "",
          gastrostomyAbnormality: false,
          skinTrouble: false,
        },
        physicalFunction: record.physicalFunction || "",
        contracturePrevention: record.contracturePrevention || {
          progressingContractures: [],
          careDetails: "",
        },
        physicalRestraint: record.physicalRestraint || {
          buggy: false,
          bedCushion: false,
          details: "",
        },
        specialNotes: record.specialNotes || "",
        activities: record.activities || "",
        staffSignatures: record.staffSignatures || [],
        createdAt: record.createdAt || now,
        updatedAt: now,
      }

      const existingIndex = records.findIndex((r) => r.id === newRecord.id)
      if (existingIndex >= 0) {
        records[existingIndex] = newRecord
      } else {
        records.push(newRecord)
      }

      localStorage.setItem(this.CASE_RECORDS_KEY, JSON.stringify(records))
      return newRecord
    } catch (error) {
      console.error("[v0] Failed to save case record:", error)
      throw new Error("ケース記録の保存に失敗しました")
    }
  }

  static getAllCaseRecords(): CaseRecord[] {
    try {
      const records = localStorage.getItem(this.CASE_RECORDS_KEY)
      return records ? JSON.parse(records) : []
    } catch (error) {
      console.error("[v0] Failed to load case records:", error)
      return []
    }
  }

  static getCaseRecordsByUserId(userId: string): CaseRecord[] {
    return this.getAllCaseRecords().filter((record) => record.userId === userId)
  }

  static getCaseRecordByDate(userId: string, date: string): CaseRecord | null {
    const records = this.getCaseRecordsByUserId(userId)
    return records.find((record) => record.date === date) || null
  }

  static deleteCaseRecord(id: string): boolean {
    try {
      const records = this.getAllCaseRecords().filter((record) => record.id !== id)
      localStorage.setItem(this.CASE_RECORDS_KEY, JSON.stringify(records))
      return true
    } catch (error) {
      console.error("[v0] Failed to delete case record:", error)
      throw new Error("ケース記録の削除に失敗しました")
    }
  }

  // Data Backup and Restore
  static exportAllData(): string {
    try {
      const data = {
        careEvents: this.getAllCareEvents(),
        userProfiles: this.getAllUserProfiles(),
        appSettings: this.getAppSettings(),
        customUserNames: this.getCustomUserNames(),
        formOptions: this.getFormOptions(),
        caseRecords: this.getAllCaseRecords(),
        exportDate: new Date().toISOString(),
        version: "1.1",
      }

      // Data exported successfully
      return JSON.stringify(data, null, 2)
    } catch (error) {
      console.error("[v0] Failed to export data:", error)
      throw new Error("データのエクスポートに失敗しました")
    }
  }

  static importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)

      // Validate data structure
      if (!data.careEvents || !Array.isArray(data.careEvents)) {
        throw new Error("Invalid care events data")
      }

      if (!data.userProfiles || !Array.isArray(data.userProfiles)) {
        throw new Error("Invalid user profiles data")
      }

      // Backup current data
      const backup = this.exportAllData()
      localStorage.setItem("dataBackup", backup)

      // Import new data
      localStorage.setItem(this.CARE_EVENTS_KEY, JSON.stringify(data.careEvents))
      localStorage.setItem(this.USER_PROFILES_KEY, JSON.stringify(data.userProfiles))

      if (data.appSettings) {
        localStorage.setItem(this.APP_SETTINGS_KEY, JSON.stringify(data.appSettings))
      }

      if (data.customUserNames && Array.isArray(data.customUserNames)) {
        localStorage.setItem(this.CUSTOM_USER_NAMES_KEY, JSON.stringify(data.customUserNames))
      }

      if (data.formOptions && typeof data.formOptions === "object") {
        localStorage.setItem(this.FORM_OPTIONS_KEY, JSON.stringify(data.formOptions))
      }

      if (data.caseRecords && Array.isArray(data.caseRecords)) {
        localStorage.setItem(this.CASE_RECORDS_KEY, JSON.stringify(data.caseRecords))
      }

      // Data imported successfully
      return true
    } catch (error) {
      console.error("[v0] Failed to import data:", error)
      throw new Error("データのインポートに失敗しました")
    }
  }

  // App Settings
  static getAppSettings(): any {
    try {
      const settings = localStorage.getItem(this.APP_SETTINGS_KEY)
      return settings
        ? JSON.parse(settings)
        : {
            theme: "light",
            language: "ja",
            autoSave: true,
            notifications: true,
          }
    } catch (error) {
      console.error("[v0] Failed to load app settings:", error)
      return {}
    }
  }

  static saveAppSettings(settings: any): void {
    try {
      localStorage.setItem(this.APP_SETTINGS_KEY, JSON.stringify(settings))
      // App settings saved successfully
    } catch (error) {
      console.error("[v0] Failed to save app settings:", error)
      throw new Error("設定の保存に失敗しました")
    }
  }

  // Utility Methods
  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  static clearAllData(): void {
    try {
      localStorage.removeItem(this.CARE_EVENTS_KEY)
      localStorage.removeItem(this.USER_PROFILES_KEY)
      localStorage.removeItem(this.APP_SETTINGS_KEY)
      localStorage.removeItem(this.CUSTOM_USER_NAMES_KEY)
      localStorage.removeItem(this.FORM_OPTIONS_KEY)
      localStorage.removeItem(this.CASE_RECORDS_KEY)
      // All data cleared successfully
    } catch (error) {
      console.error("[v0] Failed to clear data:", error)
      throw new Error("データの削除に失敗しました")
    }
  }

  static getStorageInfo(): { used: number; available: number; percentage: number } {
    try {
      let used = 0
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length
        }
      }

      // Estimate available space (5MB typical limit)
      const available = 5 * 1024 * 1024 - used
      const percentage = (used / (5 * 1024 * 1024)) * 100

      return { used, available, percentage }
    } catch (error) {
      console.error("[v0] Failed to get storage info:", error)
      return { used: 0, available: 0, percentage: 0 }
    }
  }
}

/**
 * サンプルデータを初期化する関数
 * 既にデータが存在する場合は何もしない
 */
export function initializeSampleData(): void {
  // 既にデータが存在するかチェック
  const existingUsers = DataStorageService.getAllUserProfiles()
  if (existingUsers.length > 0) {
    console.log("[v0] Sample data already exists, skipping initialization")
    return
  }

  console.log("[v0] Initializing sample data...")

  // 生活介護のサンプル利用者
  const dailyCareUsers: Omit<UserProfile, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "山田 太郎",
      furigana: "やまだ たろう",
      dateOfBirth: "2010-04-15",
      age: 14,
      gender: "male",
      serviceType: "daily-care",
      disabilityLevel: "重度",
      medicalCareNeeds: ["吸引", "経管栄養"],
      guardianName: "山田 花子",
      guardianPhone: "090-1234-5678",
      address: "東京都渋谷区1-2-3",
      emergencyContact: {
        name: "山田 花子",
        phone: "090-1234-5678",
        relationship: "母",
      },
      notes: "吸引は1日3回必要です。",
    },
    {
      name: "佐藤 花子",
      furigana: "さとう はなこ",
      dateOfBirth: "2012-08-22",
      age: 12,
      gender: "female",
      serviceType: "daily-care",
      disabilityLevel: "中度",
      medicalCareNeeds: ["服薬管理"],
      guardianName: "佐藤 一郎",
      guardianPhone: "090-2345-6789",
      address: "東京都新宿区4-5-6",
      emergencyContact: {
        name: "佐藤 一郎",
        phone: "090-2345-6789",
        relationship: "父",
      },
      notes: "食事は刻み食が必要です。",
    },
    {
      name: "鈴木 健太",
      furigana: "すずき けんた",
      dateOfBirth: "2011-12-10",
      age: 13,
      gender: "male",
      serviceType: "daily-care",
      disabilityLevel: "重度",
      medicalCareNeeds: ["吸引", "酸素療法"],
      guardianName: "鈴木 美咲",
      guardianPhone: "090-3456-7890",
      address: "東京都世田谷区7-8-9",
      emergencyContact: {
        name: "鈴木 美咲",
        phone: "090-3456-7890",
        relationship: "母",
      },
      notes: "酸素濃度は常時モニタリングが必要です。",
    },
  ]

  // 放課後等デイサービスのサンプル利用者
  const afterSchoolUsers: Omit<UserProfile, "id" | "createdAt" | "updatedAt">[] = [
    {
      name: "田中 美咲",
      furigana: "たなか みさき",
      dateOfBirth: "2013-03-05",
      age: 11,
      gender: "female",
      serviceType: "after-school",
      disabilityLevel: "軽度",
      medicalCareNeeds: ["服薬管理"],
      guardianName: "田中 隆",
      guardianPhone: "090-4567-8901",
      address: "東京都品川区10-11-12",
      emergencyContact: {
        name: "田中 隆",
        phone: "090-4567-8901",
        relationship: "父",
      },
      notes: "集団活動が得意です。",
    },
    {
      name: "高橋 翔太",
      furigana: "たかはし しょうた",
      dateOfBirth: "2014-07-18",
      age: 10,
      gender: "male",
      serviceType: "after-school",
      disabilityLevel: "中度",
      medicalCareNeeds: ["経管栄養"],
      guardianName: "高橋 由美",
      guardianPhone: "090-5678-9012",
      address: "東京都目黒区13-14-15",
      emergencyContact: {
        name: "高橋 由美",
        phone: "090-5678-9012",
        relationship: "母",
      },
      notes: "音楽療法が効果的です。",
    },
  ]

  // サンプルデータを保存
  const allSampleUsers = [...dailyCareUsers, ...afterSchoolUsers]
  allSampleUsers.forEach((user) => {
    DataStorageService.saveUserProfile(user)
  })

  console.log(`[v0] Sample data initialized: ${allSampleUsers.length} users created`)
}
