// Helper functions and constants for contract creation wizard

export const STEPS = [
  { id: 1, title: "Thông tin", desc: "Khách hàng & Loại hợp đồng", icon: null },
  {
    id: 2,
    title: "Điều khoản",
    desc: "Giá trị & Thời hạn hiệu lực",
    icon: null,
  },
  { id: 3, title: "Nội dung", desc: "Mẫu văn bản & Xem trước", icon: null },
  { id: 4, title: "Phát hành", desc: "Kiểm tra & Xác nhận gửi", icon: null },
]

export function docSoBaChuSo(baChuSo: number): string {
  const chuSo = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ]
  const tram = Math.floor(baChuSo / 100)
  const chuc = Math.floor((baChuSo % 100) / 10)
  const donVi = baChuSo % 10
  let res = ""

  if (tram === 0 && chuc === 0 && donVi === 0) return ""
  if (tram !== 0) {
    res += chuSo[tram] + " trăm"
    if (chuc === 0 && donVi !== 0) res += " linh"
  }
  if (chuc !== 0 && chuc !== 1) {
    res += " " + chuSo[chuc] + " mươi"
    if (chuc === 0 && donVi !== 0) res += " linh"
  }
  if (chuc === 1) res += " mười"
  switch (donVi) {
    case 1:
      if (chuc !== 0 && chuc !== 1) res += " mốt"
      else res += " " + chuSo[donVi]
      break
    case 5:
      if (chuc === 0) res += " " + chuSo[donVi]
      else res += " lăm"
      break
    default:
      if (donVi !== 0) res += " " + chuSo[donVi]
      break
  }
  return res.trim()
}

export function docTienBangChu(soTien: number): string {
  if (!soTien || soTien === 0) return "Không đồng"
  const donViTien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"]
  let str = ""
  let i = 0
  let temp = Math.abs(Math.round(soTien))

  while (temp > 0) {
    const baChuSo = temp % 1000
    if (baChuSo !== 0) {
      const s = docSoBaChuSo(baChuSo)
      str = s + " " + donViTien[i] + " " + str
    }
    temp = Math.floor(temp / 1000)
    i++
  }
  str = str.trim() + " đồng"
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function docSoLuongCay(qty: number): string {
  const map: Record<number, string> = {
    1: "Một cây",
    2: "Hai cây",
    3: "Ba cây",
    4: "Bốn cây",
    5: "Năm cây",
    10: "Mười cây",
  }
  return map[qty] || `${qty} cây`
}

export const STANDARD_PLACEHOLDERS = new Set([
  "TEN_KHACH_HANG",
  "CCCD_MST",
  "DIA_CHI",
  "SO_DIEN_THOAI",
  "EMAIL",
  "MA_HOP_DONG",
  "TONG_GIA_TRI",
  "TONG_GIA_TRI_CHU",
  "PHI_CHAM_SOC",
  "PHI_CHAM_SOC_CHU",
  "SO_LUONG_CAY",
  "SO_LUONG_CAY_CHU",
  "NGAY_KY",
  "NGAY_HET_HAN",
])

export function extractCustomPlaceholders(html: string): string[] {
  if (!html) return []
  const matches = html.match(/\{\{([A-Z0-9_]+)\}\}/g) || []
  const allKeys = Array.from(
    new Set(matches.map((m) => m.replace(/[{}]/g, "")))
  )
  return allKeys.filter((k) => !STANDARD_PLACEHOLDERS.has(k))
}

export function formatPlaceholderLabel(key: string): string {
  return key
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parseLocalDate(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined
  const parts = dateStr.split("-")
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const d = parseInt(parts[2], 10)
    if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
      return new Date(y, m, d)
    }
  }
  const fallback = new Date(dateStr)
  return isNaN(fallback.getTime()) ? undefined : fallback
}

export function formatDateViDisplay(dateStr?: string): string {
  if (!dateStr) return "—"
  const d = parseLocalDate(dateStr)
  if (!d) return dateStr
  const day = String(d.getDate()).padStart(2, "0")
  const month = String(d.getMonth() + 1).padStart(2, "0")
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}
