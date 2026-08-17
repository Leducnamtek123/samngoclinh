// x-api-key gửi tới backend (dùng ở cả server-side và client-side).
export const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY ||
  process.env.API_KEY ||
  ""

