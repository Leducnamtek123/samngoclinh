"use client"

import { useState } from "react"
import Cropper from "react-easy-crop"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Upload, Image as ImageIcon, Check, Loader2, Link as LinkIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Banner {
  id: string
  pageKey: string
  title: string
  subtitle: string
  image: string
  order: number
}

interface BannersManagerProps {
  initialBanners: Banner[]
  errorMsg?: string
}

const pageOptions = [
  { value: "home", label: "Trang chủ (Slideshow)" },
  { value: "products", label: "Trang Trồng sâm" },
  { value: "ginseng", label: "Trang Cửa hàng" },
  { value: "campaigns", label: "Trang Khuyến mãi" },
  { value: "about", label: "Trang Giới thiệu" },
  { value: "news", label: "Trang Tin tức" },
]

const pageNameMap: Record<string, string> = {
  home: "Trang chủ",
  products: "Trang Trồng sâm",
  ginseng: "Trang Cửa hàng",
  campaigns: "Trang Khuyến mãi",
  about: "Trang Giới thiệu",
  news: "Trang Tin tức",
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
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

export function BannersManager({ initialBanners, errorMsg: initialError }: BannersManagerProps) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    pageKey: "home",
    title: "",
    subtitle: "",
    image: "",
    order: 0,
  })

  // Crop Dialog State
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null)
  const [cropFileName, setCropFileName] = useState<string>("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)

  const handleCreateClick = () => {
    setDialogMode("create")
    setFormData({
      pageKey: "home",
      title: "",
      subtitle: "",
      image: "",
      order: banners.filter(b => b.pageKey === "home").length,
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleEditClick = (banner: Banner) => {
    setDialogMode("edit")
    setSelectedBanner(banner)
    setFormData({
      pageKey: banner.pageKey,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      order: banner.order,
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCropFileName(file.name)
    const reader = new FileReader()
    reader.addEventListener("load", () => {
      setCropImageSrc(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setIsCropDialogOpen(true)
    })
    reader.readAsDataURL(file)
    e.target.value = "" // clear value
  }

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixels) return

    setUploadingImage(true)
    setIsCropDialogOpen(false)
    setDialogError("")

    try {
      const croppedBlob = await getCroppedImg(cropImageSrc, croppedAreaPixels)
      if (!croppedBlob) {
        throw new Error("Không thể cắt hình ảnh")
      }

      const file = new File([croppedBlob], cropFileName, { type: "image/jpeg" })
      const fd = new FormData()
      fd.append("file", file)

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
          image: payload.data?.url || "",
        }))
      }
    } catch (err: any) {
      console.error(err)
      setDialogError(err?.message || "Lỗi kết nối khi tải ảnh lên")
    } finally {
      setUploadingImage(false)
      setCropImageSrc(null)
    }
  }


  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogLoading(true)
    setDialogError("")

    try {
      const isEdit = dialogMode === "edit"
      const url = isEdit ? `/admin/banners/${selectedBanner?.id}` : "/admin/banners"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetchApi(url, {
        method,
        body: JSON.stringify({
          pageKey: formData.pageKey,
          title: formData.title,
          subtitle: formData.subtitle,
          image: formData.image,
          order: Number(formData.order),
        }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogError(payload?.message || "Cấu hình banner thất bại")
      } else {
        const savedItem = payload.data
        if (isEdit) {
          setBanners((prev) =>
            prev.map((b) => (b.id === selectedBanner?.id ? savedItem : b))
          )
          setSuccessMsg(`Cập nhật banner cho "${pageNameMap[savedItem.pageKey] || savedItem.pageKey}" thành công!`)
        } else {
          setBanners((prev) => [...prev, savedItem])
          setSuccessMsg(`Tạo mới banner cho "${pageNameMap[savedItem.pageKey] || savedItem.pageKey}" thành công!`)
        }
        setIsDialogOpen(false)
        setTimeout(() => setSuccessMsg(""), 4000)
      }
    } catch (err) {
      console.error(err)
      setDialogError("Không thể kết nối đến máy chủ API")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    setDeleteLoading(true)

    try {
      const res = await fetchApi(`/admin/banners/${deletingId}`, {
        method: "DELETE",
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Xóa banner thất bại")
      } else {
        setBanners((prev) => prev.filter((b) => b.id !== deletingId))
        setSuccessMsg("Xóa cấu hình banner thành công!")
        setTimeout(() => setSuccessMsg(""), 4000)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối khi xóa banner")
    } finally {
      setDeleteLoading(false)
      setDeletingId(null)
    }
  }

  // Sort banners by pageKey and order for display in the table
  const sortedBanners = [...banners].sort((a, b) => {
    if (a.pageKey !== b.pageKey) {
      return a.pageKey.localeCompare(b.pageKey)
    }
    return a.order - b.order
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cấu hình Banners</h1>
          <p className="text-muted-foreground text-sm font-semibold">
            Tùy biến hình ảnh, tiêu đề lớn và nội dung giới thiệu của từng route/trang. Thiết lập nhiều banner trên cùng một route để hiển thị dưới dạng slider.
          </p>
        </div>
        <Button 
          onClick={handleCreateClick}
          className="bg-[#1C3F24] hover:bg-[#15301B] text-white gap-1.5 font-bold text-xs"
        >
          <Plus className="h-4 w-4" />
          Thêm Banner mới
        </Button>
      </div>

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Lỗi tải dữ liệu</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {successMsg && (
        <Alert className="bg-emerald-50 text-emerald-800 border-emerald-200">
          <Check className="h-4 w-4 text-emerald-600" />
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-40 font-bold text-slate-600">Trang / Route</TableHead>
              <TableHead className="font-bold text-slate-600">Ảnh Preview</TableHead>
              <TableHead className="font-bold text-slate-600">Tiêu đề Banner</TableHead>
              <TableHead className="font-bold text-slate-600">Mô tả phụ</TableHead>
              <TableHead className="w-20 text-center font-bold text-slate-600">Thứ tự</TableHead>
              <TableHead className="w-28 text-right font-bold text-slate-600">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBanners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400 font-semibold">
                  Chưa có cấu hình banner nào. Nhấn "Thêm Banner mới" để bắt đầu!
                </TableCell>
              </TableRow>
            ) : (
              sortedBanners.map((banner) => (
                <TableRow key={banner.id} className="hover:bg-slate-50/50">
                  <TableCell className="font-bold text-slate-700">
                    <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {pageNameMap[banner.pageKey] || banner.pageKey}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative flex items-center justify-center">
                      {banner.image ? (
                        <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-800 text-xs max-w-[200px] truncate">
                    {banner.title}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs max-w-[300px] line-clamp-2 pt-4 leading-relaxed">
                    {banner.subtitle}
                  </TableCell>
                  <TableCell className="text-center font-mono font-bold text-xs text-slate-700">
                    {banner.order}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        onClick={() => handleEditClick(banner)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-emerald-800 border-slate-200 hover:bg-slate-100"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        onClick={() => setDeletingId(banner.id)}
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-red-600 border-slate-200 hover:bg-red-50"
                        title="Xóa"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit / Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {dialogMode === "create" ? "Tạo Banner mới" : "Chỉnh sửa Banner"}
            </DialogTitle>
            <DialogDescription>
              Tùy chỉnh tiêu đề, phụ đề và ảnh nền để hiển thị trên route/trang tương ứng.
            </DialogDescription>
          </DialogHeader>

          {dialogError && (
            <Alert variant="destructive" className="py-2.5">
              <AlertTitle className="text-xs font-bold">Lỗi</AlertTitle>
              <AlertDescription className="text-xs">{dialogError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSave} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pageKey" className="text-xs font-bold uppercase text-slate-500">Trang hiển thị</Label>
                <Select
                  value={formData.pageKey}
                  onValueChange={(val) => {
                    const count = banners.filter(b => b.pageKey === val).length
                    setFormData({ ...formData, pageKey: val, order: count })
                  }}
                >
                  <SelectTrigger className="text-sm font-semibold">
                    <SelectValue placeholder="Chọn trang" />
                  </SelectTrigger>
                  <SelectContent>
                    {pageOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="text-xs font-semibold">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order" className="text-xs font-bold uppercase text-slate-500">Thứ tự hiển thị (Order)</Label>
                <Input
                  id="order"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  required
                  className="text-sm font-medium font-mono"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs font-bold uppercase text-slate-500">Tiêu đề Banner</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Nhập tiêu đề lớn"
                className="text-sm font-semibold text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle" className="text-xs font-bold uppercase text-slate-500">Mô tả phụ</Label>
              <Textarea
                id="subtitle"
                rows={3}
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                required
                placeholder="Nhập phần mô tả chi tiết hiển thị dưới tiêu đề banner"
                className="text-sm leading-relaxed text-slate-600"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">Hình ảnh Banner</Label>
              <div className="flex gap-4 items-center">
                {/* Image Preview Box */}
                <div className="w-32 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center flex-shrink-0">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Đường dẫn URL ảnh hoặc nhấn Tải lên"
                      className="text-xs font-mono"
                    />
                    <div className="relative flex-shrink-0">
                      <input
                        type="file"
                        id="banner-file-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                      <Label
                        htmlFor="banner-file-upload"
                        className={`flex items-center gap-1.5 h-10 px-3 border border-slate-300 rounded-md cursor-pointer hover:bg-slate-50 transition-colors text-xs font-bold ${
                          uploadingImage ? "opacity-50 pointer-events-none" : ""
                        }`}
                      >
                        {uploadingImage ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Upload className="h-3 w-3" />
                        )}
                        Tải lên
                      </Label>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Độ phân giải rộng khuyến nghị: 1920x400
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={dialogLoading}>
                Hủy bỏ
              </Button>
              <Button type="submit" className="bg-[#1C3F24] hover:bg-[#1C3F24]/90 text-white font-bold" disabled={dialogLoading || uploadingImage}>
                {dialogLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang lưu...
                  </>
                ) : (
                  "Lưu cấu hình"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-red-600">Xác nhận xóa Banner</DialogTitle>
            <DialogDescription className="text-sm">
              Bạn có chắc chắn muốn xóa cấu hình banner này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => setDeletingId(null)} disabled={deleteLoading}>
              Hủy bỏ
            </Button>
            <Button type="button" className="bg-red-600 hover:bg-red-600/90 text-white font-bold" onClick={handleDeleteConfirm} disabled={deleteLoading}>
              {deleteLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xác nhận xóa"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Crop Dialog */}
      <Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Cắt ảnh Banner</DialogTitle>
            <DialogDescription>
              Di chuyển và phóng to/thu nhỏ ảnh để chọn vùng hiển thị banner tỷ lệ 1920x400 (4.8:1).
            </DialogDescription>
          </DialogHeader>
          <div className="relative w-full h-[350px] bg-slate-950 rounded-lg overflow-hidden my-4">
            {cropImageSrc && (
              <Cropper
                image={cropImageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1920 / 400}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
              />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-xs text-slate-500 font-bold uppercase">Phóng to / Thu nhỏ</Label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-label="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          <DialogFooter className="mt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCropDialogOpen(false)
                setCropImageSrc(null)
              }}
            >
              Hủy bỏ
            </Button>
            <Button type="button" onClick={handleCropSave} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Cắt & Tải lên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
