// x-api-key gửi tới backend (dùng ở code server-side). Production đặt secret API_KEY để ghi đè.
export const API_KEY =
  process.env.API_KEY || process.env.NEXT_PUBLIC_API_KEY || ""
