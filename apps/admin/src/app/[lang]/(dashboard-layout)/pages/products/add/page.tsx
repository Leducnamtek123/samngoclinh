"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import type { LocaleType } from "@/types"

import { fetchApi } from "@/lib/api"
import { ensureLocalizedPathname } from "@/lib/i18n"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AddProductPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    ageYear: 1,
    price: 0,
    stock: 1,
    description: "",
  })
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "ageYear" || name === "price" || name === "stock"
          ? Number(value)
          : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi("/admin/catalog/plants", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          status: "active",
        }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Đã xảy ra lỗi khi thêm sản phẩm")
      } else {
        setSuccessMsg("Thêm sâm thành công! Đang chuyển hướng...")
        setTimeout(() => {
          router.push(ensureLocalizedPathname("/pages/products", locale))
        }, 1500)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container p-4 md:p-6 mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Thêm sâm Ngọc Linh
        </h1>
        <p className="text-muted-foreground">
          Thêm một độ tuổi hoặc chủng loại sâm mới vào danh mục sản phẩm tại
          vườn.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin sâm</CardTitle>
          <CardDescription>
            Nhập đầy đủ thông tin bên dưới để khởi tạo sản phẩm.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <Alert variant="destructive">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{errorMsg}</AlertDescription>
              </Alert>
            )}

            {successMsg && (
              <Alert className="border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                <AlertTitle>Thành công</AlertTitle>
                <AlertDescription>{successMsg}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã sản phẩm (Code)</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="Ví dụ: plant-5y"
                  required
                  value={formData.code}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên hiển thị</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ví dụ: Cây Sâm Ngọc Linh 5 năm"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageYear">Tuổi (năm)</Label>
                <Input
                  id="ageYear"
                  name="ageYear"
                  type="number"
                  min="1"
                  required
                  value={formData.ageYear}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Giá bán (VND)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Tồn kho ban đầu</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="1"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả sản phẩm</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Nhập mô tả chi tiết về xuất xứ, đặc điểm của sâm..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="flex gap-4 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    ensureLocalizedPathname("/pages/products", locale)
                  )
                }
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Đang xử lý..." : "Thêm mới"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
