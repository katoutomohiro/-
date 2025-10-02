type ClassValue = string | undefined | null | boolean | { [k: string]: any }

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = []

  for (const input of inputs) {
    if (!input) continue

    if (typeof input === 'string') {
      classes.push(input)
      continue
    }

    if (typeof input === 'object') {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && input[key]) {
          classes.push(key)
        }
      }
      continue
    }

    // booleans are ignored (they were allowed previously)
  }

  return classes.join(' ').trim()
}
