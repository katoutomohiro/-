import type { UserProfile } from "@/services/data-storage-service"

/**
 * 24名の実際の利用者データ（正確な情報）
 * 提供されたテキストファイルから一語一句正確に反映
 */

// 生活介護利用者（14名）- 五十音順
export const dailyCareUsersData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "A・T",
    furigana: "えー・てぃー",
    age: 36,
    gender: "male",
    dateOfBirth: "1988-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺、てんかん、遠視性弱視、側湾症、両上下肢機能障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "I・K",
    furigana: "あい・けー",
    age: 47,
    gender: "female",
    dateOfBirth: "1977-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺、側湾症、体幹四肢機能障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "I・K",
    furigana: "あい・けー",
    age: 40,
    gender: "male",
    dateOfBirth: "1984-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺、体幹四肢機能障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "I・T",
    furigana: "あい・てぃー",
    age: 24,
    gender: "male",
    dateOfBirth: "2000-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["胃ろう注入"],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "U・S",
    furigana: "ゆー・えす",
    age: 19,
    gender: "male",
    dateOfBirth: "2005-01-01",
    serviceType: "daily-care",
    disabilityLevel: "障がい程度区分6",
    medicalCareNeeds: ["気管切開", "気管内吸引", "吸入", "浣腸"],
    careLevel: "全介助",
    notes: "基礎疾患: クリッペファイル症候群、高度難聴、気管狭窄症、両下肢機能障害。手帳: 身体障害者手帳1級",
  },
  {
    name: "O・S",
    furigana: "おー・えす",
    age: 40,
    gender: "female",
    dateOfBirth: "1984-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺、体幹四肢機能障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "O・M",
    furigana: "おー・えむ",
    age: 23,
    gender: "male",
    dateOfBirth: "2001-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳性麻痺、視覚障害（全盲）、難聴、網膜症、脳原生移動障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "M・S",
    furigana: "えむ・えす",
    age: 18,
    gender: "male",
    dateOfBirth: "2006-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes:
      "基礎疾患: 水頭症、脳原生上肢機能障害、脳原生上肢移動障害、側湾症、発作（5分以上けいれん発作が持続は救急搬送）。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "M・O",
    furigana: "えむ・おー",
    age: 18,
    gender: "female",
    dateOfBirth: "2006-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["胃ろう注入", "吸引", "IVH埋め込み"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 脳原生上肢機能障害、脳原生上肢移動障害、発作（四肢、顔面のミオクローヌスあり）。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "N・M",
    furigana: "えぬ・えむ",
    age: 32,
    gender: "male",
    dateOfBirth: "1992-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["胃ろう注入", "エアウェイ装着", "カフアシスト使用", "グリセリン浣腸（火・木）", "吸引", "吸入"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 痙性四肢麻痺、重度知的障害、てんかん（強直間代発作がほぼ毎日1～5回の頻度で出現）。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "S・M",
    furigana: "えす・えむ",
    age: 43,
    gender: "male",
    dateOfBirth: "1981-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["吸引", "腸瘻"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 脳性麻痺、脳炎後遺症、てんかん（現在も服用中）、精神遅滞、側湾症、両上下肢機能障害。医療ケア: 最近腸瘻トラブル多く腸瘻バルーンの抜去など頻回。医大の医師からは対応策がないとの見解。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "S・Y",
    furigana: "えす・わい",
    age: 41,
    gender: "female",
    dateOfBirth: "1983-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["鼻腔栄養注入"],
    careLevel: "全介助",
    notes: "基礎疾患: 脳原生上肢機能障害、脳原生上肢移動障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "W・M",
    furigana: "だぶりゅー・えむ",
    age: 32,
    gender: "female",
    dateOfBirth: "1992-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes: "基礎疾患: 脳原生上肢機能障害、脳原生上肢移動障害、上下肢機能障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "Y・K",
    furigana: "わい・けー",
    age: 22,
    gender: "male",
    dateOfBirth: "2002-01-01",
    serviceType: "daily-care",
    disabilityLevel: "重症心身障害者、障がい程度区分6",
    medicalCareNeeds: ["鼻腔チューブ使用（内服時のみ）", "導尿"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 二分脊椎症、水頭症（シャント内臓）、急性脳症後遺症、膀胱機能障害者、両上下肢機能障害、体幹機能障害、自閉症スペクトラム障害。手帳: 療育手帳A、身体障害者手帳1級",
  },
]

// 放課後等デイサービス利用者（10名）- 五十音順
export const afterSchoolUsersData: Omit<UserProfile, "id" | "createdAt" | "updatedAt">[] = [
  {
    name: "I・K",
    furigana: "あい・けー",
    age: 9,
    gender: "other",
    dateOfBirth: "2015-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["胃ろう注入"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 脳性麻痺、側弯あり、吸引頻回（呼吸筋が脆弱のため）、籠り熱の際は嘔吐リスクあり。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "K・S",
    furigana: "けー・えす",
    age: 7,
    gender: "female",
    dateOfBirth: "2017-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes:
      "基礎疾患: 発達遅延、肢体不自由、けいれん発作（5分以上続くようなら救急搬送）。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "K・Y",
    furigana: "けー・わい",
    age: 9,
    gender: "female",
    dateOfBirth: "2015-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes:
      "基礎疾患: 脳性麻痺、脳原生上肢機能障害、脳原始移動機能障害、側湾症。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "S・K",
    furigana: "えす・けー",
    age: 15,
    gender: "male",
    dateOfBirth: "2009-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["シャント内臓"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 脳腫瘍適切後遺症、脳原生上肢機能障害、脳原始移動機能障害、アレルギー性鼻炎、食物アレルギー。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "S・K",
    furigana: "えす・けー",
    age: 14,
    gender: "female",
    dateOfBirth: "2010-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["経胃ろう十二指腸チューブからの経管栄養", "ポートからのCV栄養注入併用"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 滑脳症（TUBA1A遺伝子異常）、小脳底形成、上腸間膜症候群、症候性てんかん、重度精神運動発達遅滞。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "F・M",
    furigana: "えふ・えむ",
    age: 13,
    gender: "female",
    dateOfBirth: "2011-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: [],
    careLevel: "全介助",
    notes:
      "基礎疾患: 症候性てんかん、股関節亜脱臼、脳原生上肢機能障害、脳原始移動機能障害、側湾症。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "M・I",
    furigana: "えむ・あい",
    age: 17,
    gender: "male",
    dateOfBirth: "2007-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["鼻腔注入"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 慢性肺疾患、先天性性疾患、染色体異常、脳の形成不全、抗てんかん（ミオクロニー発作あり）。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "M・M",
    furigana: "えむ・えむ",
    age: 15,
    gender: "female",
    dateOfBirth: "2009-01-01",
    serviceType: "after-school",
    disabilityLevel: "知的障がい",
    medicalCareNeeds: [],
    careLevel: "一部介助あり",
    notes: "発作あり。特別支援学校在学中。手帳: 療育手帳1級",
  },
  {
    name: "N・T",
    furigana: "えぬ・てぃー",
    age: 9,
    gender: "male",
    dateOfBirth: "2015-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["胃ろう注入"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 発達遅延、神経セロイドリポフスチン8型、両上肢・体感機能障害、てんかん（ミオクローヌスなど重積発作リスクあり）。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
  {
    name: "Y・S",
    furigana: "わい・えす",
    age: 6,
    gender: "female",
    dateOfBirth: "2018-01-01",
    serviceType: "after-school",
    disabilityLevel: "重症心身障害児",
    medicalCareNeeds: ["筋緊張（ITB療法中）"],
    careLevel: "全介助",
    notes:
      "基礎疾患: 症候性てんかん、脳原生上肢機能障害、脳原始移動機能障害。特別支援学校在学中。手帳: 療育手帳A、身体障害者手帳1級",
  },
]

// 全利用者データ（24名）
export const allUsersData = [...dailyCareUsersData, ...afterSchoolUsersData]

/**
 * 利用者データを初期化する関数
 * DataStorageServiceに24名の利用者を登録
 */
export function initializeRealUsersData() {
  const { DataStorageService } = require("@/services/data-storage-service")

  // 既存の利用者データをチェック
  const existingUsers = DataStorageService.getAllUserProfiles()

  // 実際の利用者データ（A・T、I・Kなど）が既に存在するかチェック
  const hasRealUsers = existingUsers.some((user: UserProfile) => user.name.includes("・"))

  if (hasRealUsers) {
    console.log("[v0] Real users data already exists, skipping initialization")
    return existingUsers
  }

  console.log("[v0] Initializing 24 real users data...")

  // 24名の利用者データを保存
  const createdUsers = allUsersData.map((userData) => DataStorageService.saveUserProfile(userData))

  console.log(`[v0] Successfully initialized ${createdUsers.length} users`)

  return createdUsers
}
