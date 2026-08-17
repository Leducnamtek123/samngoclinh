import { fetchApi, fetchApiJson } from "@/lib/api"

export interface AdminRegisterRequest {
  firstName: string
  lastName: string
  username: string
  email: string
  password?: string
}

export interface AdminVerifyEmailRequest {
  email: string
  otp?: string
}

export async function apiAdminRegister(payload: AdminRegisterRequest) {
  const name = `${payload.lastName || ""} ${payload.firstName || ""}`.trim() || payload.username
  const body = {
    email: payload.email,
    name,
    password: payload.password,
    username: payload.username,
    marketing: true,
    cookies: true,
    from: "website",
  }

  const res = await fetchApi("/v1/public/user/sign-up", {
    method: "POST",
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || "Đăng ký không thành công.")
  }

  return res.json()
}

export async function apiAdminVerifyEmail(payload: AdminVerifyEmailRequest) {
  if (payload.otp) {
    const res = await fetchApi("/v1/public/user/verify/email", {
      method: "PATCH",
      body: JSON.stringify({
        email: payload.email,
        otp: payload.otp,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Xác thực email thất bại.")
    }

    return res.json()
  } else {
    const res = await fetchApi("/v1/public/user/send/email", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email,
      }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.message || "Gửi email xác thực thất bại.")
    }

    return res.json()
  }
}
