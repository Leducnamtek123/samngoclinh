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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Pencil, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Plant {
  id: string
  code: string
  name: string
  ageYear: number
  price: number
  stock: number
  status: string
  description?: string
  images?: string[]
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

interface PlantsTableProps {
  initialPlants: Plant[]
  errorMsg?: string
}

export function PlantsTable({ initialPlants, errorMsg: initialError }: PlantsTableProps) {
  const [plants, setBeds] = useState<Plant[]>(initialPlants)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [ageTab, setAgeTab] = useState("all")
  
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Selection state
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([])
  const [deletingBulk, setDeletingBulk] = useState(false)

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

  // Image Cropping States
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    ageYear: 1,
    price: 100000,
    stock: 50,
    status: "available",
    description: "",
    imageUrl: "",
  })

  const formatVND = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  // Filter logic
  const filteredPlants = plants.filter((plant) => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plant.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "available" && plant.status === "available") ||
                          (statusFilter === "harvested" && plant.status !== "available")
    const matchesAge = ageTab === "all" || plant.ageYear.toString() === ageTab
    return matchesSearch && matchesStatus && matchesAge
  })

  const handleToggleSelect = (id: string) => {
    setSelectedPlantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredPlants.map((p) => p.id)
    const isAllSelected = allFilteredIds.every((id) => selectedPlantIds.includes(id))

    if (isAllSelected) {
      setSelectedPlantIds((prev) => prev.filter((id) => !allFilteredIds.includes(id)))
    } else {
      setSelectedPlantIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedPlantIds.length === 0) return
    if (!confirm(`Bạn có chắc chắn muốn xóa ${selectedPlantIds.length} sản phẩm sâm đã chọn?`)) return

    setDeletingBulk(true)
    setErrorMsg("")
    setSuccessMsg("")

    let successCount = 0
    let failCount = 0

    await Promise.all(
      selectedPlantIds.map(async (id) => {
        try {
          const res = await fetchApi(`/admin/catalog/plants/${id}`, {
            method: "DELETE",
          })
          if (res.status < 400) {
            successCount++
          } else {
            failCount++
          }
        } catch (e) {
          console.error(e)
          failCount++
        }
      })
    )

    if (successCount > 0) {
      setBeds((prev) => prev.filter((p) => !selectedPlantIds.includes(p.id)))
      setSuccessMsg(`Đã xóa thành công ${successCount} sản phẩm!`)
    }

    if (failCount > 0) {
      setErrorMsg(`Có ${failCount} sản phẩm không thể xóa.`)
    }

    setSelectedPlantIds([])
    setDeletingBulk(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return
    setDeletingId(id)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/catalog/plants/${id}`, {
        method: "DELETE",
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa sản phẩm.")
      } else {
        setBeds(plants.filter((p) => p.id !== id))
        setSuccessMsg("Xóa sản phẩm thành công!")
        setSelectedPlantIds((prev) => prev.filter((item) => item !== id))
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
    setSelectedPlant(null)
    setFormData({
      code: "plant-sam-" + Math.floor(Math.random() * 1000),
      name: "",
      ageYear: 1,
      price: 100000,
      stock: 50,
      status: "available",
      description: "",
      imageUrl: "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (plant: Plant) => {
    setDialogMode("edit")
    setSelectedPlant(plant)
    setFormData({
      code: plant.code,
      name: plant.name,
      ageYear: plant.ageYear,
      price: plant.price,
      stock: plant.stock,
      status: plant.status,
      description: plant.description || "",
      imageUrl: plant.images?.[0] || "",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string)
      setIsCropDialogOpen(true)
    })
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCropSubmit = async () => {
    if (!imageSrc || !croppedAreaPixels) return
    setUploadingImage(true)
    setDialogError("")
    setIsCropDialogOpen(false)

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (!croppedBlob) {
        setDialogError("Lỗi xử lý cắt ảnh")
        setUploadingImage(false)
        return
      }

      const fd = new FormData()
      fd.append("file", croppedBlob, "product_image.jpg")

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
      }
    } catch (err) {
      console.error(err)
      setDialogError("Lỗi khi kết nối hoặc xử lý tải ảnh")
    } finally {
      setUploadingImage(false)
      setImageSrc(null)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }))
  }

  const handleSelectStatus = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      status: val,
    }))
  }

  const handleSavePlant = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setDialogError("Vui lòng nhập tên sản phẩm")
      return
    }
    if (!formData.code) {
      setDialogError("Vui lòng nhập mã code sản phẩm")
      return
    }

    setDialogLoading(true)
    setDialogError("")
    setErrorMsg("")
    setSuccessMsg("")

    const payloadBody = {
      code: formData.code,
      name: formData.name,
      ageYear: formData.ageYear,
      price: formData.price,
      stock: formData.stock,
      status: formData.status,
      description: formData.description,
      images: formData.imageUrl ? [formData.imageUrl] : [],
    }

    try {
      if (dialogMode === "create") {
        const res = await fetchApi("/admin/catalog/plants", {
          method: "POST",
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi tạo sản phẩm")
        } else {
          setBeds((prev) => [payload.data, ...prev])
          setSuccessMsg(`Đã tạo sản phẩm sâm "${formData.name}" thành công!`)
          setIsDialogOpen(false)
        }
      } else {
        if (!selectedPlant) return
        const res = await fetchApi(`/admin/catalog/plants/${selectedPlant.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            ageYear: formData.ageYear,
            price: formData.price,
            stock: formData.stock,
            status: formData.status,
            description: formData.description,
            images: formData.imageUrl ? [formData.imageUrl] : [],
          }),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi cập nhật sản phẩm")
        } else {
          setBeds((prev) =>
            prev.map((p) => (p.id === selectedPlant.id ? { ...p, ...payload.data } : p))
          )
          setSuccessMsg(`Cập nhật sản phẩm "${formData.name}" thành công!`)
          setIsDialogOpen(false)
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Không thể kết nối đến máy chủ API")
    } finally {
      setDialogLoading(false)
    }
  }

  // Group age years for tabs dynamically
  const ageYears = Array.from(new Set(plants.map((p) => p.ageYear))).sort((a, b) => a - b)

  const getPlantingDate = (ageYear: number) => {
    const currentYear = new Date().getFullYear()
    return `01/01/${currentYear - ageYear}`
  }

  const allFilteredSelected = filteredPlants.length > 0 && filteredPlants.every((p) => selectedPlantIds.includes(p.id))

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sản phẩm của tôi</h1>
          <p className="text-muted-foreground">
            Quản lý sản phẩm tại vườn và theo dõi độ tuổi sâm.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedPlantIds.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={deletingBulk}
              className="font-semibold flex items-center gap-2 shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
              Xóa {selectedPlantIds.length} mục đã chọn
            </Button>
          )}
          <Button
            onClick={openCreateDialog}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {successMsg && (
        <Alert className="border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi xảy ra</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* Search & Filter section */}
      <div className="flex flex-col gap-4 p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h3 className="font-semibold text-lg">Tìm kiếm &amp; Lọc</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div className="w-full md:w-56">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="available">Sâm đang phát triển</SelectItem>
                <SelectItem value="harvested">Sâm đã thu hoạch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      {plants.length > 0 && (
        <Tabs value={ageTab} onValueChange={setAgeTab} className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted/50">
            <TabsTrigger value="all" className="px-6 py-2">
              Tất cả ({plants.length})
            </TabsTrigger>
            {ageYears.map((age) => {
              const count = plants.filter((p) => p.ageYear === age).length
              return (
                <TabsTrigger key={age} value={age.toString()} className="px-6 py-2">
                  {age} tuổi ({count})
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>
            Hiển thị {filteredPlants.length} trong tổng số {plants.length} sản phẩm vườn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPlants.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Không tìm thấy sản phẩm nào khớp với bộ lọc.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={allFilteredSelected}
                      onCheckedChange={handleToggleAll}
                    />
                  </TableHead>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ảnh</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Duyệt</TableHead>
                  <TableHead>Giá / Tồn kho</TableHead>
                  <TableHead>Giá nhập</TableHead>
                  <TableHead>Ngày sinh</TableHead>
                  <TableHead>Tuổi (năm)</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlants.map((plant) => {
                  const isSelected = selectedPlantIds.includes(plant.id)
                  return (
                    <TableRow key={plant.id} className={isSelected ? "bg-slate-50 dark:bg-slate-900" : ""}>
                      <TableCell className="w-12">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleSelect(plant.id)}
                        />
                      </TableCell>
                      <TableCell className="font-semibold">{plant.name}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground text-sm">
                        {plant.description || `Sâm Ngọc Linh tự nhiên tuổi đời ${plant.ageYear} năm, củ chắc khỏe, hàm lượng saponin cao.`}
                      </TableCell>
                      <TableCell>
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border">
                          <Image
                            src={plant.images?.[0] || "/images/logo_ruou_sam.png"}
                            alt={plant.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {plant.status === "available" ? "đang phát triển" : "cây đã thu hoạch"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                          Đã duyệt
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                            {formatVND(plant.price)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Còn {plant.stock}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">0 đ</TableCell>
                      <TableCell className="text-sm">
                        {getPlantingDate(plant.ageYear)}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {plant.ageYear}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(plant)}
                            title="Sửa sản phẩm"
                          >
                            <Pencil className="w-4 h-4 text-slate-600 hover:text-emerald-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(plant.id)}
                            disabled={deletingId === plant.id}
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog Modal for Create & Edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[475px]">
          <form onSubmit={handleSavePlant}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Thêm sản phẩm sâm mới" : "Chỉnh sửa sản phẩm sâm"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Nhập các thông số chi tiết để đăng bán cây sâm Ngọc Linh."
                  : "Cập nhật các thông số chi tiết của sản phẩm đang bán."}
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <Alert variant="destructive" className="my-3">
                <AlertTitle>Lỗi</AlertTitle>
                <AlertDescription>{dialogError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-name">Tên sản phẩm sâm</Label>
                  <Input
                    id="dialog-name"
                    name="name"
                    placeholder="Ví dụ: Cây Sâm Ngọc Linh 4 năm"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-code">Mã code định danh</Label>
                  <Input
                    id="dialog-code"
                    name="code"
                    placeholder="Ví dụ: plant-sam-4y"
                    value={formData.code}
                    onChange={handleFormChange}
                    disabled={dialogMode === "edit"}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-ageYear">Tuổi (năm)</Label>
                  <Input
                    id="dialog-ageYear"
                    name="ageYear"
                    type="number"
                    min={0}
                    value={formData.ageYear}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-price">Giá bán (VND)</Label>
                  <Input
                    id="dialog-price"
                    name="price"
                    type="number"
                    min={0}
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-stock">Số lượng kho</Label>
                  <Input
                    id="dialog-stock"
                    name="stock"
                    type="number"
                    min={0}
                    value={formData.stock}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dialog-status">Trạng thái</Label>
                  <Select value={formData.status} onValueChange={handleSelectStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Sâm đang phát triển</SelectItem>
                      <SelectItem value="harvested">Sâm đã thu hoạch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="dialog-image">Ảnh sản phẩm</Label>
                  <Input
                    id="dialog-image"
                    name="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                  />
                  {uploadingImage && <span className="text-xs text-slate-500">Đang tải ảnh lên Cloudinary...</span>}
                  {formData.imageUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border mt-1">
                      <img src={formData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-description">Mô tả sản phẩm</Label>
                <Textarea
                  id="dialog-description"
                  name="description"
                  placeholder="Nhập mô tả sản phẩm tại đây..."
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={dialogLoading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {dialogLoading ? "Đang lưu..." : dialogMode === "create" ? "Thêm mới" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog for Image Cropping */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Cắt ảnh sản phẩm (Tỉ lệ 1:1)</DialogTitle>
            <DialogDescription>
              Di chuyển và phóng to/thu nhỏ để có khung hình ưng ý nhất cho sản phẩm sâm giống.
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full h-[300px] bg-slate-100 rounded-lg overflow-hidden border my-4">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground">Zoom:</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => {
                setIsCropDialogOpen(false)
                setImageSrc(null)
              }}>
                Hủy
              </Button>
              <Button type="button" onClick={handleCropSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Áp dụng
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
