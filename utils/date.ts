export function now(): Date {
  return new Date()
}

export function formatLocalDateJP(d: Date = now()): string {
  return d.toLocaleDateString("ja-JP")
}

export function getReiwaYear(d: Date = now()): number {
  return d.getFullYear() - 2018
}

export function getMonth(d: Date = now()): number {
  return d.getMonth() + 1
}

export function getDateNumber(d: Date = now()): number {
  return d.getDate()
}

export function isoNowDate(): string {
  return now().toISOString().split("T")[0]
}
