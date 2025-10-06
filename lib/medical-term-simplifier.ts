interface SimplifiedTerm {
  term: string
  explanation: string
  familyFriendly: string
}

const medicalTermsDatabase: Record<string, SimplifiedTerm> = {
  発作: {
    term: "発作について",
    explanation:
      "発作とは、脳の神経細胞が一時的に異常な電気信号を出すことで起こる症状です。けいれん（体が震える）、意識がなくなる、体が硬くなるなどの症状が見られます。",
    familyFriendly: "体が震えたり、意識がなくなったりする症状",
  },
  バイタルサイン: {
    term: "バイタルサイン（生命徴候）について",
    explanation:
      "バイタルサインとは、体温、血圧、脈拍、呼吸、酸素飽和度（SpO2）など、生命の状態を示す基本的な数値のことです。これらを定期的に測定することで、健康状態を把握します。",
    familyFriendly: "体温や血圧など、体の状態を示す数値",
  },
  服薬: {
    term: "服薬管理について",
    explanation:
      "服薬管理とは、医師が処方した薬を正しい時間に正しい量を飲むことです。薬の効果を最大限に引き出し、副作用を防ぐために重要です。",
    familyFriendly: "お薬を正しく飲むこと",
  },
  吸引: {
    term: "吸引について",
    explanation:
      "吸引とは、口や鼻、気管から痰（たん）や唾液を吸い取る医療的ケアです。呼吸を楽にし、誤嚥（食べ物や唾液が気管に入ること）を防ぎます。",
    familyFriendly: "痰や唾液を吸い取るケア",
  },
  経管栄養: {
    term: "経管栄養について",
    explanation:
      "経管栄養とは、口から食べることが難しい場合に、チューブを通して栄養を直接胃に送る方法です。必要な栄養をしっかり摂取できます。",
    familyFriendly: "チューブを使って栄養を摂る方法",
  },
  体位変換: {
    term: "体位変換について",
    explanation:
      "体位変換とは、同じ姿勢で長時間いることによる床ずれ（褥瘡）を防ぐため、定期的に体の向きを変えることです。血行を良くし、快適な姿勢を保ちます。",
    familyFriendly: "床ずれを防ぐために体の向きを変えること",
  },
  誤嚥: {
    term: "誤嚥について",
    explanation:
      "誤嚥とは、食べ物や飲み物、唾液が誤って気管に入ってしまうことです。肺炎の原因になるため、注意深く見守る必要があります。",
    familyFriendly: "食べ物が気管に入ってしまうこと",
  },
  SpO2: {
    term: "SpO2（酸素飽和度）について",
    explanation:
      "SpO2とは、血液中にどれくらい酸素が含まれているかを示す数値です。通常は95%以上が正常値です。指先に機器を付けて測定します。",
    familyFriendly: "血液中の酸素の量を示す数値",
  },
}

export function simplifyMedicalTerms(term: string): SimplifiedTerm {
  return (
    medicalTermsDatabase[term] || {
      term: term,
      explanation: "専門スタッフにお尋ねください。",
      familyFriendly: term,
    }
  )
}

export function getAllSimplifiedTerms(): SimplifiedTerm[] {
  return Object.values(medicalTermsDatabase)
}
