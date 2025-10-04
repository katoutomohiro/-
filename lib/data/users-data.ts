// 利用者データ型定義
export interface User {
  id: string
  name: string
  age: number
  gender: "male" | "female"
  service: "daily-care" | "after-school"
  disability: string
  medicalCare: string[]
  nursingLevel?: string // 生活介護用（要介護度）
  handbookGrade?: string // 放課後等デイサービス用（支援度）
  notes?: string
}

// 生活介護利用者データ（14名、五十音順）
export const DAILY_CARE_USERS: User[] = [
  {
    id: "daily-care-001",
    name: "A・T",
    age: 60,
    gender: "male",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5",
    notes: "吸引頻度高め、座位保持困難"
  },
  {
    id: "daily-care-002", 
    name: "I・K",
    age: 48,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引", "経管栄養"],
    nursingLevel: "要介護5",
    notes: "胃瘻造設、経管栄養1日4回"
  },
  {
    id: "daily-care-003",
    name: "I・T", 
    age: 52,
    gender: "male",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: [],
    nursingLevel: "要介護4",
    notes: "車椅子移乗、コミュニケーション良好"
  },
  {
    id: "daily-care-004",
    name: "U・S",
    age: 46,
    gender: "male", 
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5",
    notes: "痰の量多め、夜間吸引必要"
  },
  {
    id: "daily-care-005",
    name: "O・S",
    age: 50,
    gender: "male",
    service: "daily-care", 
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5",
    notes: "座位保持可能、発作履歴あり"
  },
  {
    id: "daily-care-006",
    name: "O・M",
    age: 45,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺", 
    medicalCare: [],
    nursingLevel: "要介護4",
    notes: "経口摂取可能、音楽療法効果的"
  },
  {
    id: "daily-care-007",
    name: "M・S",
    age: 49,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5", 
    notes: "側弯症あり、体位変換頻回"
  },
  {
    id: "daily-care-008",
    name: "M・O",
    age: 47,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: [],
    nursingLevel: "要介護4",
    notes: "車椅子自操可能、作業活動参加積極的"
  },
  {
    id: "daily-care-009",
    name: "N・M",
    age: 51,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引", "経管栄養"],
    nursingLevel: "要介護5",
    notes: "胃瘻・腸瘻併用、栄養管理重要"
  },
  {
    id: "daily-care-010", 
    name: "S・M",
    age: 43,
    gender: "male",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引", "腸瘻"],
    nursingLevel: "要介護5",
    notes: "腸瘻造設、水分・栄養注入管理"
  },
  {
    id: "daily-care-011",
    name: "S・Y",
    age: 44,
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: [],
    nursingLevel: "要介護4",
    notes: "経口摂取良好、リハビリ意欲高い"
  },
  {
    id: "daily-care-012",
    name: "W・M",
    age: 53,
    gender: "female", 
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5",
    notes: "呼吸状態不安定、酸素飽和度モニタリング"
  },
  {
    id: "daily-care-013",
    name: "Y・K",
    age: 42,
    gender: "male",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    nursingLevel: "要介護5",
    notes: "てんかん発作あり、抗てんかん薬服用"
  },
  {
    id: "daily-care-014",
    name: "I・K",
    age: 41, 
    gender: "female",
    service: "daily-care",
    disability: "脳性麻痺",
    medicalCare: [],
    nursingLevel: "要介護4",
    notes: "座位保持良好、創作活動好き"
  }
]

// 放課後等デイサービス利用者データ（10名、五十音順）
export const AFTER_SCHOOL_USERS: User[] = [
  {
    id: "after-school-001",
    name: "I・K",
    age: 15,
    gender: "male",
    service: "after-school",
    disability: "自閉症スペクトラム",
    medicalCare: [],
    handbookGrade: "支援度3",
    notes: "こだわり強い、ルーティン重視"
  },
  {
    id: "after-school-002",
    name: "K・S", 
    age: 14,
    gender: "female",
    service: "after-school",
    disability: "ダウン症",
    medicalCare: [],
    handbookGrade: "支援度2",
    notes: "社交性あり、音楽活動好き"
  },
  {
    id: "after-school-003",
    name: "K・Y",
    age: 16,
    gender: "male",
    service: "after-school",
    disability: "脳性麻痺",
    medicalCare: [],
    handbookGrade: "支援度4",
    notes: "車椅子使用、学習意欲高い"
  },
  {
    id: "after-school-004",
    name: "S・K",
    age: 13,
    gender: "male",
    service: "after-school", 
    disability: "自閉症スペクトラム",
    medicalCare: [],
    handbookGrade: "支援度3",
    notes: "感覚過敏あり、静かな環境好む"
  },
  {
    id: "after-school-005",
    name: "S・K",
    age: 17,
    gender: "female",
    service: "after-school",
    disability: "知的障害",
    medicalCare: [],
    handbookGrade: "支援度2",
    notes: "手先が器用、作業活動得意"
  },
  {
    id: "after-school-006",
    name: "F・M",
    age: 12,
    gender: "male",
    service: "after-school",
    disability: "ADHD", 
    medicalCare: [],
    handbookGrade: "支援度1",
    notes: "多動傾向、運動好き"
  },
  {
    id: "after-school-007",
    name: "M・I",
    age: 18,
    gender: "male",
    service: "after-school",
    disability: "脳性麻痺",
    medicalCare: ["吸引"],
    handbookGrade: "支援度6",
    notes: "医療的ケア児、吸引1日数回"
  },
  {
    id: "after-school-008",
    name: "M・M",
    age: 11,
    gender: "female",
    service: "after-school",
    disability: "ダウン症", 
    medicalCare: [],
    handbookGrade: "支援度2",
    notes: "人懐っこい性格、集団活動好き"
  },
  {
    id: "after-school-009",
    name: "N・T",
    age: 10,
    gender: "male",
    service: "after-school",
    disability: "自閉症スペクトラム",
    medicalCare: [],
    handbookGrade: "支援度3",
    notes: "パニック起こしやすい、視覚支援有効"
  },
  {
    id: "after-school-010",
    name: "Y・S",
    age: 9,
    gender: "female",
    service: "after-school",
    disability: "知的障害",
    medicalCare: [],
    handbookGrade: "支援度2",
    notes: "明るい性格、ダンス好き"
  }
]

// エクスポート関数
export function getDailyCareUsers(): User[] {
  return DAILY_CARE_USERS
}

export function getAfterSchoolUsers(): User[] {
  return AFTER_SCHOOL_USERS
}

export function getUserById(id: string): User | undefined {
  const allUsers = [...DAILY_CARE_USERS, ...AFTER_SCHOOL_USERS]
  return allUsers.find(user => user.id === id)
}

export function getAllUsers(): User[] {
  return [...DAILY_CARE_USERS, ...AFTER_SCHOOL_USERS]
}