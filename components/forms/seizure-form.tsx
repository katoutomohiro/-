'use client'

import type React from "react"

import { useState, useEffect } from "react"
import { Activity } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { NowButton } from "@/components/NowButton"
import { SEIZURE_TYPES } from "@/app/(records)/options"
import { CareFormLayout } from '@/components/care-form-layout'
// Saving is delegated to parent via onSubmit


interface SeizureFormProps {
  selectedUser: string // Added selectedUser prop to get current user
  onSubmit: (data: any) => void
  onCancel: () => void
}

const ClickableDropdown = ({
  value,
  onValueChange,
  placeholder,
  options,
  className = "",
}: {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <div
        className={`w-full h-12 px-3 py-2 border border-gray-300 rounded-md cursor-pointer flex items-center justify-between bg-white hover:border-gray-400 transition-colors`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value ? options.find((opt) => opt.value === value)?.label : placeholder}
        </span>
        <span className={`transform transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[1000] max-h-[200px] overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => {
                onValueChange(option.value)
                setIsOpen(false)
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const defaultSeizureSymptoms = [
  { value: "転倒", label: "転倒" },
  { value: "舌を噛む", label: "舌を噛む" },
  { value: "叫び声", label: "叫び声" },
  { value: "失禁（尿）", label: "失禁（尿）" },
  { value: "失禁（便）", label: "失禁（便）" },
  { value: "よだれ", label: "よだれ" },
  { value: "口から泡", label: "口から泡" },
  { value: "手足の動き", label: "手足の動き" },
  { value: "頭部の動き", label: "頭部の動き" },
  { value: "体幹の動き", label: "体幹の動き" },
  { value: "顔面の痙攣", label: "顔面の痙攣" },
  { value: "口の動き", label: "口の動き" },
]

const defaultMeasurementIssues = [
  { value: "severe-movement", label: "体動が激しい" },
  { value: "low-consciousness", label: "意識レベル低下" },
  { value: "poor-condition", label: "体調不良" },
  { value: "refusal", label: "拒否行動" },
  { value: "oral-issues", label: "口腔内問題" },
  { value: "breathing-difficulty", label: "呼吸困難" },
  { value: "postural-issues", label: "姿勢保持困難" },
  { value: "equipment-issues", label: "機器の問題" },
]

export function SeizureForm({ selectedUser, onSubmit, onCancel }: SeizureFormProps) {

  const [formData, setFormData] = useState({
    type: "",
    duration: "",
    severity: "",
    consciousness: "",
    skinColor: "",
    muscleResponse: "",
    eyeMovement: "",
    breathing: "",
    triggers: "",
    response: "",
    postSeizureState: "",
    observedSymptoms: [] as string[],
    measurementIssues: "",
    notes: "",
    time: new Date().toTimeString().slice(0, 5),
  })

  const [seizureTypes, setSeizureTypes] = useState(SEIZURE_TYPES.map((type) => ({ value: type, label: type })))
  const [seizureSymptoms, setSeizureSymptoms] = useState(defaultSeizureSymptoms)
  const [measurementIssues, setMeasurementIssues] = useState(defaultMeasurementIssues)

  const [stopwatchTime, setStopwatchTime] = useState(0)
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false)

  useEffect(() => {
    const loadCustomOptions = () => {
      try {
        const savedOptions = localStorage.getItem("form-options")
        if (savedOptions) {
          const parsed = JSON.parse(savedOptions)

          if (parsed.seizureTypes) {
            setSeizureTypes(parsed.seizureTypes.map((opt: any) => ({ value: opt.value, label: opt.label })))
          }

          if (parsed.seizureSymptoms) {
            setSeizureSymptoms(parsed.seizureSymptoms.map((opt: any) => ({ value: opt.label, label: opt.label })))
          }

          if (parsed.seizureMeasurementIssues) {
            setMeasurementIssues(
              parsed.seizureMeasurementIssues.map((opt: any) => ({ value: opt.value, label: opt.label })),
            )
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load custom seizure form options:", error)
      }
    }

    loadCustomOptions()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isStopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((time) => time + 1)
      }, 1000)
    } else if (!isStopwatchRunning && stopwatchTime !== 0) {
      if (interval) clearInterval(interval)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isStopwatchRunning, stopwatchTime])

  const startStopwatch = () => {
    setIsStopwatchRunning(true)
  }

  const stopStopwatch = () => {
    setIsStopwatchRunning(false)
    setFormData({ ...formData, duration: stopwatchTime.toString() })
  }

  const resetStopwatch = () => {
    setStopwatchTime(0)
    setIsStopwatchRunning(false)
    setFormData({ ...formData, duration: "" })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    // Build payload and delegate saving to parent (CareFormModal)
    const payload = {
      eventType: "seizure",
      time: formData.time,
      type: formData.type,
      seizureType: formData.type, // backward compatibility
      duration: formData.duration,
      severity: formData.severity,
      consciousness: formData.consciousness,
      skinColor: formData.skinColor,
      muscleResponse: formData.muscleResponse,
      eyeMovement: formData.eyeMovement,
      breathing: formData.breathing,
      triggers: formData.triggers,
      response: formData.response,
      postSeizureState: formData.postSeizureState,
      observedSymptoms: formData.observedSymptoms,
      measurementIssues: formData.measurementIssues,
      notes: formData.notes || "",
    }
    onSubmit(payload)
  }

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, observedSymptoms: [...formData.observedSymptoms, symptom] })
    } else {
      setFormData({ ...formData, observedSymptoms: formData.observedSymptoms.filter((s) => s !== symptom) })
    }
  }

  return (
    <CareFormLayout
      title="⚡ 発作記録"
      icon={<Activity className="h-5 w-5 text-red-500" />}
      onSave={handleSubmit}
      onCancel={onCancel}
      isSaving={false}
    >
      <div className="space-y-6">
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4">
            <Label htmlFor="time" className="text-blue-700 font-medium">
              ⏰ 発生時刻
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                className="text-lg flex-1"
              />
              {/* Convert ISO string to HH:mm for time input */}
              <NowButton onNow={(iso) => setFormData((prev) => ({ ...prev, time: new Date(iso).toTimeString().slice(0, 5) }))} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-4 pb-16">
            <Label className="text-red-700 font-medium mb-3 block">⚡ 発作の種類</Label>
            <ClickableDropdown
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
              placeholder="発作の種類を選択"
              options={seizureTypes}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/30">
          <CardContent className="p-4">
            <Label className="text-purple-700 font-medium mb-3 block">⏱️ 持続時間（秒）</Label>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-purple-700 mb-2">{formatTime(stopwatchTime)}</div>
                <div className="text-sm text-purple-600">{stopwatchTime}秒</div>
              </div>
              <div className="flex gap-2 justify-center flex-wrap">
                <Button
                  type="button"
                  onClick={startStopwatch}
                  disabled={isStopwatchRunning}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-base font-medium min-w-[80px] flex-shrink-0"
                >
                  開始
                </Button>
                <Button
                  type="button"
                  onClick={stopStopwatch}
                  disabled={!isStopwatchRunning}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 text-base font-medium min-w-[80px] flex-shrink-0"
                >
                  停止
                </Button>
                <Button
                  type="button"
                  onClick={resetStopwatch}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 px-6 py-3 text-base font-medium min-w-[80px] flex-shrink-0 bg-white"
                >
                  リセット
                </Button>
              </div>
              <div className="border-t border-purple-200 pt-4">
                <Label className="text-purple-600 text-sm mb-2 block">手動入力も可能</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="秒数を入力"
                  className="text-center text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4">
            <Label className="text-amber-700 font-medium mb-3 block">📊 重症度</Label>
            <ClickableDropdown
              value={formData.severity}
              onValueChange={(value) => setFormData({ ...formData, severity: value })}
              placeholder="重症度を選択してください"
              options={[
                { value: "mild", label: "軽度" },
                { value: "moderate", label: "中等度" },
                { value: "severe", label: "重度" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/30">
          <CardContent className="p-4">
            <Label className="text-indigo-700 font-medium mb-3 block">🧠 意識状態</Label>
            <ClickableDropdown
              value={formData.consciousness}
              onValueChange={(value) => setFormData({ ...formData, consciousness: value })}
              placeholder="意識状態を選択してください"
              options={[
                { value: "conscious", label: "意識あり" },
                { value: "unconscious", label: "意識なし" },
                { value: "confused", label: "混乱状態" },
                { value: "drowsy", label: "傾眠状態" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-pink-50/30">
          <CardContent className="p-4">
            <Label className="text-pink-700 font-medium mb-3 block">🎨 皮膚色の変化</Label>
            <ClickableDropdown
              value={formData.skinColor}
              onValueChange={(value) => setFormData({ ...formData, skinColor: value })}
              placeholder="皮膚色の変化を選択してください"
              options={[
                { value: "normal", label: "正常" },
                { value: "blue", label: "青色（チアノーゼ）" },
                { value: "pale", label: "蒼白" },
                { value: "red", label: "紅潮" },
                { value: "gray", label: "灰色" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-cyan-200 bg-cyan-50/30">
          <CardContent className="p-4">
            <Label className="text-cyan-700 font-medium mb-3 block">💪 筋肉の反応</Label>
            <ClickableDropdown
              value={formData.muscleResponse}
              onValueChange={(value) => setFormData({ ...formData, muscleResponse: value })}
              placeholder="筋肉の反応を選択してください"
              options={[
                { value: "normal", label: "正常" },
                { value: "stiffening", label: "硬直" },
                { value: "jerking", label: "痙攣" },
                { value: "limp", label: "脱力" },
                { value: "tremor", label: "振戦" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/30">
          <CardContent className="p-4">
            <Label className="text-emerald-700 font-medium mb-3 block">👁️ 眼球の動き</Label>
            <ClickableDropdown
              value={formData.eyeMovement}
              onValueChange={(value) => setFormData({ ...formData, eyeMovement: value })}
              placeholder="眼球の動きを選択してください"
              options={[
                { value: "normal", label: "正常" },
                { value: "rolled-back", label: "眼球上転" },
                { value: "staring", label: "凝視" },
                { value: "deviation", label: "偏視" },
                { value: "blinking", label: "瞬目" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-4">
            <Label className="text-teal-700 font-medium mb-3 block">🫁 呼吸パターン</Label>
            <ClickableDropdown
              value={formData.breathing}
              onValueChange={(value) => setFormData({ ...formData, breathing: value })}
              placeholder="呼吸パターンを選択してください"
              options={[
                { value: "normal", label: "正常" },
                { value: "fast", label: "速い" },
                { value: "slow", label: "遅い" },
                { value: "irregular", label: "不規則" },
                { value: "noisy", label: "雑音あり" },
                { value: "stopped", label: "停止" },
              ]}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-rose-200 bg-rose-50/30">
          <CardContent className="p-4">
            <Label className="text-rose-700 font-medium mb-3 block">📋 観察された症状</Label>
            <ClickableDropdown
              value={formData.observedSymptoms.join(", ")}
              onValueChange={(value) => {
                const symptoms = value ? [value] : []
                setFormData({ ...formData, observedSymptoms: symptoms })
              }}
              placeholder="観察された症状を選択してください"
              options={seizureSymptoms}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/30">
          <CardContent className="p-4">
            <Label className="text-orange-700 font-medium mb-3 block">⚠️ 測定困難な要因</Label>
            <ClickableDropdown
              value={formData.measurementIssues}
              onValueChange={(value) => setFormData({ ...formData, measurementIssues: value })}
              placeholder="測定困難な要因を選択してください"
              options={measurementIssues}
              className="text-lg"
            />
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-teal-50/30">
          <CardContent className="p-4">
            <Label htmlFor="triggers" className="text-teal-700 font-medium">
              🎯 誘因・きっかけ
            </Label>
            <Textarea
              id="triggers"
              value={formData.triggers}
              onChange={(e) => setFormData({ ...formData, triggers: e.target.value })}
              placeholder="光刺激、音、疲労など"
              rows={3}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-indigo-200 bg-indigo-50/30">
          <CardContent className="p-4">
            <Label htmlFor="response" className="text-indigo-700 font-medium">
              🏥 対応・処置
            </Label>
            <Textarea
              id="response"
              value={formData.response}
              onChange={(e) => setFormData({ ...formData, response: e.target.value })}
              placeholder="体位変換、酸素投与など"
              rows={3}
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card className="border-gray-200 bg-gray-50/30">
          <CardContent className="p-4">
            <Label htmlFor="notes" className="text-gray-700 font-medium">
              📝 備考
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="その他の観察事項"
              rows={3}
              className="mt-2"
            />
          </CardContent>
        </Card>
        </div>
      </div>
    </CareFormLayout>
  )
}
