"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"

import { authOptions } from "@/configs/next-auth"
import { fetchApi } from "@/lib/api"

async function verifyAuth() {
  const session = await getServerSession(authOptions)
  return !!session
}

export async function createArticleAction(payload: Record<string, unknown>) {
  try {
    if (!(await verifyAuth())) {
      return { success: false, error: "Unauthorized. Bạn cần đăng nhập." }
    }
    const res = await fetchApi("/admin/content/articles", {
      method: "POST",
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      return { success: false, error: err.message || "Lỗi khi tạo bài viết." }
    }
    revalidatePath("/[lang]/content")
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Có lỗi xảy ra"
    return { success: false, error: message }
  }
}

export async function updateArticleAction(
  id: string,
  payload: Record<string, unknown>
) {
  try {
    if (!(await verifyAuth())) {
      return { success: false, error: "Unauthorized. Bạn cần đăng nhập." }
    }
    const res = await fetchApi(`/admin/content/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.json()
      return {
        success: false,
        error: err.message || "Lỗi khi cập nhật bài viết.",
      }
    }
    revalidatePath("/[lang]/content")
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Có lỗi xảy ra"
    return { success: false, error: message }
  }
}

export async function deleteArticleAction(id: string) {
  try {
    if (!(await verifyAuth())) {
      return { success: false, error: "Unauthorized. Bạn cần đăng nhập." }
    }
    const res = await fetchApi(`/admin/content/articles/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      const err = await res.json()
      return {
        success: false,
        error: err.message || "Lỗi khi xóa bài viết.",
      }
    }
    revalidatePath("/[lang]/content")
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Có lỗi xảy ra"
    return { success: false, error: message }
  }
}

export async function updateBannersAction(
  page: string,
  banners: Array<Record<string, unknown>>
) {
  try {
    if (!(await verifyAuth())) {
      return { success: false, error: "Unauthorized. Bạn cần đăng nhập." }
    }
    const res = await fetchApi(`/admin/content/banners/${page}`, {
      method: "PUT",
      body: JSON.stringify({ banners }),
    })
    if (!res.ok) {
      const err = await res.json()
      return {
        success: false,
        error: err.message || "Lỗi khi cập nhật banner.",
      }
    }
    revalidatePath("/[lang]/content")
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Có lỗi xảy ra"
    return { success: false, error: message }
  }
}

export async function updateSettingAction(key: string, value: string) {
  try {
    if (!(await verifyAuth())) {
      return { success: false, error: "Unauthorized. Bạn cần đăng nhập." }
    }
    const res = await fetchApi(`/admin/settings/${key}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    })
    if (!res.ok) {
      const err = await res.json()
      return {
        success: false,
        error: err.message || "Lỗi khi cập nhật cài đặt.",
      }
    }
    revalidatePath("/[lang]/content")
    return { success: true }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Có lỗi xảy ra"
    return { success: false, error: message }
  }
}
