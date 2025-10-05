export async function generateQRCodeDataUrl(text: string, options?: { width?: number }) {
  try {
    // dynamic import so build doesn't fail if package not installed during static analysis
    const QRCode = await import("qrcode")
    // @ts-ignore
    return await QRCode.toDataURL(text, { width: options?.width || 240 })
  } catch (err) {
    console.error("QR generation failed:", err)
    return ""
  }
}

export type QRCodeOptions = { width?: number }
