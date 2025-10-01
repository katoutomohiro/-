/**
 * AI分析機能テスト用のサンプルデータ生成スクリプト
 * 開発者コンソールで実行して、AIダッシュボードの動作をテストできます
 */

// テストデータ生成関数
function generateSampleCareData() {
  const users = ['利用者A', '利用者B', '利用者C']
  const eventTypes = ['vitals', 'seizure', 'expression', 'hydration', 'activity', 'communication']
  
  const sampleEvents = []
  
  // 過去30日間のサンプルデータを生成
  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    users.forEach(userId => {
      // 1日に2-5回のケアイベントを生成
      const eventsPerDay = Math.floor(Math.random() * 4) + 2
      
      for (let j = 0; j < eventsPerDay; j++) {
        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)]
        const time = new Date(date)
        time.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
        
        let eventData = {
          id: `test-${Date.now()}-${Math.random()}`,
          eventType,
          timestamp: time.toISOString(),
          userId,
          time: time.toTimeString().slice(0, 5),
          notes: `サンプル記録 - ${eventType}`
        }
        
        // イベントタイプ別の詳細データ
        switch (eventType) {
          case 'vitals':
            eventData = {
              ...eventData,
              systolicBP: (Math.random() * 40 + 100).toFixed(0), // 100-140
              diastolicBP: (Math.random() * 30 + 60).toFixed(0), // 60-90
              heartRate: (Math.random() * 40 + 60).toFixed(0), // 60-100
              temperature: (Math.random() * 2 + 36).toFixed(1), // 36-38
              oxygenSaturation: (Math.random() * 5 + 95).toFixed(0) // 95-100
            }
            break
            
          case 'seizure':
            eventData = {
              ...eventData,
              seizureType: ['partial', 'generalized', 'absence'][Math.floor(Math.random() * 3)],
              duration: Math.floor(Math.random() * 300) + 30, // 30-330秒
              intensity: ['mild', 'moderate', 'severe'][Math.floor(Math.random() * 3)]
            }
            break
            
          case 'expression':
            eventData = {
              ...eventData,
              emotionalState: ['happy', 'calm', 'anxious', 'sad', 'neutral'][Math.floor(Math.random() * 5)],
              facialExpression: ['smile', 'frown', 'neutral', 'grimace'][Math.floor(Math.random() * 4)]
            }
            break
            
          case 'hydration':
            eventData = {
              ...eventData,
              amount: Math.floor(Math.random() * 300) + 50, // 50-350ml
              method: ['oral', 'tube', 'iv'][Math.floor(Math.random() * 3)]
            }
            break
            
          case 'activity':
            eventData = {
              ...eventData,
              activityType: ['rest', 'physical_therapy', 'occupational_therapy', 'recreation'][Math.floor(Math.random() * 4)],
              participationLevel: ['none', 'minimal', 'moderate', 'active'][Math.floor(Math.random() * 4)]
            }
            break
            
          case 'communication':
            eventData = {
              ...eventData,
              communicationMethod: ['verbal', 'gesture', 'device', 'eye_movement'][Math.floor(Math.random() * 4)],
              responseLevel: ['none', 'minimal', 'good', 'excellent'][Math.floor(Math.random() * 4)]
            }
            break
        }
        
        sampleEvents.push(eventData)
      }
    })
  }
  
  return sampleEvents
}

// LocalStorageにサンプルデータを保存
function saveSampleData() {
  try {
    const sampleEvents = generateSampleCareData()
    
    // 既存のデータと合成
    const existingEvents = JSON.parse(localStorage.getItem('careEvents') || '[]')
    const allEvents = [...existingEvents, ...sampleEvents]
    
    localStorage.setItem('careEvents', JSON.stringify(allEvents))
    
    console.log(`✅ ${sampleEvents.length}件のサンプルケアイベントを生成しました`)
    console.log('📊 AI分析ダッシュボードで分析を実行してください')
    
    return sampleEvents.length
  } catch (error) {
    console.error('❌ サンプルデータの生成に失敗:', error)
    return 0
  }
}

// ユーザープロファイルのサンプルデータも生成
function generateUserProfiles() {
  const users = ['利用者A', '利用者B', '利用者C']
  const profiles = users.map(name => ({
    id: `user-${name.toLowerCase().replace('利用者', '')}`,
    name,
    dateOfBirth: '1990-01-01',
    medicalNumber: `MED-${Math.floor(Math.random() * 10000)}`,
    careLevel: ['要介護1', '要介護2', '要介護3'][Math.floor(Math.random() * 3)],
    allergies: ['なし'],
    medications: ['サンプル薬剤A', 'サンプル薬剤B'],
    emergencyContact: {
      name: '家族',
      phone: '090-0000-0000',
      relationship: '父母'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
  
  localStorage.setItem('userProfiles', JSON.stringify(profiles))
  console.log(`✅ ${profiles.length}件のユーザープロファイルを生成しました`)
}

// 実行関数
function setupAIAnalysisDemo() {
  console.log('🤖 AI分析機能のデモセットアップを開始します...')
  
  generateUserProfiles()
  const eventCount = saveSampleData()
  
  console.log(`🎉 セットアップ完了！`)
  console.log(`📈 生成されたデータ: ${eventCount}件のケアイベント`)
  console.log(`🔄 ページをリロードして「🤖 AI分析」タブをクリックしてください`)
  
  return { eventCount, users: 3 }
}

// 実行
// setupAIAnalysisDemo()

// コンソールで実行するためのヘルプ
console.log(`
🤖 AI分析機能デモセットアップ

以下のコマンドを開発者コンソールで実行してください:

1. サンプルデータ生成:
   setupAIAnalysisDemo()

2. データクリア (必要時):
   localStorage.removeItem('careEvents')
   localStorage.removeItem('userProfiles')

3. 現在のデータ確認:
   JSON.parse(localStorage.getItem('careEvents') || '[]').length
`)

// グローバルに関数を公開
if (typeof window !== 'undefined') {
  window.setupAIAnalysisDemo = setupAIAnalysisDemo
  window.generateSampleCareData = generateSampleCareData
  window.saveSampleData = saveSampleData
}