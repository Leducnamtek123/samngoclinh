import { NextResponse } from "next/server"

import { SignInSchema } from "@/schemas/sign-in-schema"
import { API_KEY } from "@/lib/api-key"

export async function POST(req: Request) {
  const body = await req.json()
  const parsedData = SignInSchema.safeParse(body)

  // If validation fails, return an error response with a 400 status
  if (!parsedData.success) {
    return NextResponse.json(parsedData.error, { status: 400 })
  }

  const { email, password } = parsedData.data

  try {
    const endpoint = 'http://127.0.0.1:3000/api/v1/public/user/login/credential'
    const bodyPayload = {
      email,
      password,
      from: 'website',
      device: {
        fingerprint: 'admin-web-fingerprint',
      },
    }

    const apiRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: JSON.stringify(bodyPayload),
    })

    const payload = await apiRes.json()

    if (apiRes.status >= 400 || !payload.data?.tokens?.accessToken) {
      return NextResponse.json(
        { message: payload?.message ?? 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.' },
        { status: apiRes.status }
      )
    }

    const accessToken = payload.data.tokens.accessToken
    const refreshToken = payload.data.tokens.refreshToken
    const expiresIn = payload.data.tokens.expiresIn

    let name = "Admin User"
    let id = "admin-id"
    let userEmail = email

    const parts = accessToken.split('.')
    if (parts.length === 3) {
      try {
        const decodedPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
        id = decodedPayload.userId || id
        name = decodedPayload.username || name
        userEmail = decodedPayload.email || userEmail
      } catch (e) {
        console.error('Failed to decode JWT token payload:', e)
      }
    }

    // Return success response with user data if credentials are correct
    return NextResponse.json(
      {
        id,
        name,
        email: userEmail,
        avatar: "/images/avatars/male-01.svg",
        status: "ONLINE",
        accessToken,
        refreshToken,
        expiresIn,
      },
      { status: 200 }
    )
  } catch (e) {
    console.error("Error signing in:", e)
    return NextResponse.json({ error: "Error signing in" }, { status: 500 })
  }
}
