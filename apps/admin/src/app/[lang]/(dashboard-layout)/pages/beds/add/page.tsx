import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { AddBedForm } from "./_components/add-bed-form"

export const metadata: Metadata = {
  title: "Thêm luống trồng mới | Sâm Ngọc Linh Admin",
  description: "Tạo một luống trồng sâm mới trong khu vườn",
}

interface Garden {
  id: string
  code: string
  name: string
}

export default async function AddBedPage() {
  let gardens: Garden[] = []
  let errorMsg = ""

  try {
    const res = await fetchApi("/user/cultivation/gardens/list")
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Không thể tải danh sách vườn"
    } else {
      gardens = Array.isArray(payload.data) ? payload.data : []
    }
  } catch (e) {
    console.error("Error loading gardens:", e)
    errorMsg = "Không thể kết nối đến máy chủ API để lấy danh sách vườn"
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-xl">
      <AddBedForm gardens={gardens} initialError={errorMsg} />
    </div>
  )
}
