"use client"

import { useState } from "react"
import Image from "next/image"
import Cropper from "react-easy-crop"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, Pencil, Plus, Upload, Loader2, Image as ImageIcon } from "lucide-react"

interface ShopItem {
  id: string
  code: string
  name: string
  price: number
  unit: string
  category: string
  stock?: number
  status?: string
  images?: string[]
  description?: string
}

interface ShopItemsTableProps {
  initialItems: ShopItem[]
  errorMsg?: string
}

const categoryOptions = [
  { value: "processed", label: "Sản phẩm chế biến (Rượu, sâm khô...)" },
  { value: "supplies", label: "Vật tư nông nghiệp (Phân bón, giống...)" },
  { value: "organic", label: "Sản phẩm hữu cơ" },
  { value: "beverage", label: "Đồ uống sâm" },
  { value: "other", label: "Khác" },
]

const categoryNameMap: Record<string, string> = {
  processed: "Sản phẩm chế biến",
  supplies: "Vật tư nông nghiệp",
  organic: "Sản phẩm hữu cơ",
  beverage: "Đồ uống sâm",
  other: "Khác",
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image()
    img.addEventListener("load", () => resolve(img))
    img.addEventListener("error", (err) => reject(err))
    img.src = imageSrc
  })

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, "image/jpeg", 0.9)
  })
}

export function ShopItemsTable({ initialItems, errorMsg: initialError }: ShopItemsTableProps) {
  const [items, setItems] = useState<ShopItem[]>(initialItems)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

  // Image Cropping States
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "processed",
    unit: "cái",
    price: 50000,
    stock: 100,
    status: "active",
    description: "",
    imageUrl: "",
  })

  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm thương mại này?")) return
    setDeletingId(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/catalog/shop-items/${id}`, {
        method: "DELETE",
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa sản phẩm.")
      } else {
        setItems(items.filter((item) => item.id !== id))
        setSuccessMsg("Xóa sản phẩm thành công!")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setDeletingId(null)
    }
  }

  const openCreateDialog = () => {
    setDialogMode("create")
    setSelectedItem(null)
    setFormData({
      code: "prod-" + Math.floor(Math.random() * 10000),
      name: "",
      category: "processed",
      unit: "cái",
      price: 50000,
      stock: 100,
      status: "active",
      description: "",
      imageUrl: "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: ShopItem) => {
    setDialogMode("edit")
    setSelectedItem(item)
    setFormData({
      code: item.code,
      name: item.name,
      category: item.category || "processed",
      unit: item.unit || "cái",
      price: item.price || 0,
      stock: item.stock || 0,
      status: item.status || "active",
      description: item.description || "",
      imageUrl: item.images?.[0] || "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string)
      setIsCropDialogOpen(true)
    })
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploadingImage(true)
    setDialogError("")

    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (!croppedImageBlob) {
        setDialogError("Không thể cắt hình ảnh.")
        setUploadingImage(false)
        return
      }

      const fd = new FormData()
      fd.append("file", croppedImageBlob, "cropped-product.jpg")

      const res = await fetchApi("/admin/catalog/upload", {
        method: "POST",
        body: fd,
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogError(payload?.message || "Tải ảnh lên thất bại")
      } else {
        setFormData((prev) => ({
          ...prev,
          imageUrl: payload.data?.url || "",
        }))
        setIsCropDialogOpen(false)
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối khi tải ảnh lên")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogLoading(true)
    setDialogError("")

    const bodyData = {
      code: formData.code,
      name: formData.name,
      category: formData.category,
      unit: formData.unit,
      price: formData.price,
      stock: formData.stock,
      status: formData.status,
      description: formData.description || undefined,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    }

    try {
      let res
      if (dialogMode === "create") {
        res = await fetchApi("/admin/catalog/shop-items", {
          method: "POST",
          body: JSON.stringify(bodyData),
        })
      } else {
        res = await fetchApi(`/admin/catalog/shop-items/${selectedItem?.id}`, {
          method: "PUT",
          body: JSON.stringify(bodyData),
        })
      }

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogError(payload?.message || "Lưu thông tin sản phẩm thất bại.")
      } else {
        const savedItem = payload.data
        if (dialogMode === "create") {
          setItems([savedItem, ...items])
          setSuccessMsg("Tạo mới sản phẩm thành công!")
        } else {
          setItems(items.map((item) => (item.id === savedItem.id ? savedItem : item)))
          setSuccessMsg("Cập nhật thông tin sản phẩm thành công!")
        }
        setIsDialogOpen(false)
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi kết nối khi lưu thông tin sản phẩm.")
    } finally {
      setDialogLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm thương mại & vật tư</h1>
          <p className="text-muted-foreground">
            Quản lý các sản phẩm chế biến từ sâm, vật tư nông nghiệp phục vụ kinh doanh.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="size-4 mr-2" />
          Thêm sản phẩm
        </Button>
      </div>

      {successMsg && (
        <Alert className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-800 dark:text-emerald-300">
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="space-y-1">
              <CardTitle>Danh sách sản phẩm</CardTitle>
              <CardDescription>
                Hiển thị danh sách chi tiết các mặt hàng đang kinh doanh trong hệ thống.
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Input
                placeholder="Tìm tên hoặc mã sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tất cả danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label.split(" (")[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Không tìm thấy sản phẩm thương mại nào phù hợp.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Mã sản phẩm</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Đơn vị</TableHead>
                  <TableHead>Đơn giá</TableHead>
                  <TableHead>Tồn kho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.images?.[0] ? (
                        <div className="relative size-12 rounded-md overflow-hidden border">
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="size-12 rounded-md bg-muted flex items-center justify-center border text-muted-foreground">
                          <ImageIcon className="size-5" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-semibold">{item.code}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground max-w-xs truncate">
                          {item.description || "Không có mô tả"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {categoryNameMap[item.category] || item.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell className="font-semibold text-emerald-700 dark:text-emerald-400">
                      {formatVND(item.price)}
                    </TableCell>
                    <TableCell className="font-medium">{item.stock}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "active" ? "default" : "secondary"} className={item.status === "active" ? "bg-emerald-600 text-white" : ""}>
                        {item.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(item)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive hover:bg-destructive/15"
                          disabled={deletingId === item.id}
                          onClick={() => handleDelete(item.id)}
                        >
                          {deletingId === item.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Interactive Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "create" ? "Thêm sản phẩm thương mại mới" : "Chỉnh sửa sản phẩm thương mại"}
            </DialogTitle>
            <DialogDescription>
              Nhập các trường thông tin cần thiết dưới đây để lưu sản phẩm thương mại.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 my-2">
            {dialogError && (
              <Alert variant="destructive">
                <AlertDescription>{dialogError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã sản phẩm</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleFormChange}
                  disabled={dialogMode === "edit"}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên sản phẩm</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Danh mục phân loại</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Đơn vị tính</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, unit: val }))}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Đơn vị tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cái">Cái / Chiếc</SelectItem>
                    <SelectItem value="chai">Chai</SelectItem>
                    <SelectItem value="hộp">Hộp</SelectItem>
                    <SelectItem value="gói">Gói</SelectItem>
                    <SelectItem value="kg">Kg (Kilogam)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Đơn giá (VND)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Tồn kho ban đầu</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="status">Trạng thái kinh doanh</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động (Được mở bán)</SelectItem>
                    <SelectItem value="inactive">Tạm ngưng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Nhập thông số hoặc mô tả sản phẩm..."
                  rows={3}
                />
              </div>

              <div className="space-y-2 col-span-2 border-t pt-4">
                <Label>Hình ảnh sản phẩm</Label>
                <div className="flex gap-4 items-center">
                  <div className="relative size-24 rounded-md overflow-hidden border bg-muted flex items-center justify-center text-muted-foreground">
                    {formData.imageUrl ? (
                      <Image
                        src={formData.imageUrl}
                        alt="Product Preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-8" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-file"
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="max-w-xs"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tải lên hình ảnh sản phẩm. Hệ thống sẽ mở khung cắt ảnh tỉ lệ vuông 1:1.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6 border-t pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={dialogLoading} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {dialogLoading && <Loader2 className="size-4 mr-2 animate-spin" />}
                Lưu sản phẩm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cắt ảnh sản phẩm (Tỉ lệ vuông 1:1)</DialogTitle>
            <DialogDescription>
              Kéo thả khung cắt để chọn góc ảnh đại diện đẹp nhất cho sản phẩm thương mại.
            </DialogDescription>
          </DialogHeader>

          {imageSrc && (
            <div className="relative w-full h-80 bg-muted rounded-md overflow-hidden my-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1} // 1:1 Aspect ratio
                onCropChange={setCrop}
                onCropComplete={handleCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Độ phóng đại (Zoom)</Label>
            <Input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              disabled={uploadingImage}
              onClick={() => setIsCropDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={uploadingImage}
              onClick={handleCropSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {uploadingImage && <Loader2 className="size-4 mr-2 animate-spin" />}
              Cắt & Tải lên Cloudinary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
