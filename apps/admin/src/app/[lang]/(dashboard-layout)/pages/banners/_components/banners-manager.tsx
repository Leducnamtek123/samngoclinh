"use client"

import { useState } from "react"
import Image from "next/image"
import Cropper from "react-easy-crop"
import {
  Check,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from "lucide-react"

import { useTranslation } from "@/providers/i18n-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Pagination } from "@/components/ui/app-pagination"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ToastCard } from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useBannersManager } from "./use-banners-manager"

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

export function BannersManager({
  initialBanners,
  errorMsg: initialError,
}: BannersManagerProps) {
  const { t } = useTranslation()

  const pageOptions = [
    { value: "home", label: t("content.banners.title") },
    { value: "products", label: t("products.title") },
    { value: "ginseng", label: t("products.categories") },
    { value: "campaigns", label: t("navigation.menu.dashboard") },
    { value: "about", label: t("navigation.menu.content") },
    { value: "news", label: t("content.articles.title") },
  ]

  const pageNameMap: Record<string, string> = {
    home: t("content.banners.title"),
    products: t("products.title"),
    ginseng: t("products.categories"),
    campaigns: t("navigation.menu.dashboard"),
    about: t("navigation.menu.content"),
    news: t("content.articles.title"),
  }

  const {
    banners,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    isDialogOpen,
    setIsDialogOpen,
    dialogMode,
    dialogLoading,
    dialogError,
    uploadingImage,
    deletingId,
    setDeletingId,
    deleteLoading,
    formData,
    setFormData,
    cropImageSrc,
    setCropImageSrc,
    crop,
    setCrop,
    zoom,
    setZoom,
    isCropDialogOpen,
    setIsCropDialogOpen,
    handleCreateClick,
    handleEditClick,
    handleImageUpload,
    handleCropSave,
    handleSave,
    handleDeleteConfirm,
    sortedBanners,
    handleCropComplete,
  } = useBannersManager(initialBanners, initialError)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {t("content.banners.title")}
          </h1>
          <p className="text-muted-foreground">{t("content.subtitle")}</p>
        </div>
        <Button
          onClick={handleCreateClick}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
        >
          <Plus className="size-4 mr-2" />
          {t("content.banners.addBanner")}
        </Button>
      </div>

      <BannersTable
        sortedBanners={sortedBanners}
        pageNameMap={pageNameMap}
        handleEditClick={handleEditClick}
        setDeletingId={setDeletingId}
      />

      <BannerDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        dialogMode={dialogMode}
        dialogError={dialogError}
        handleSave={handleSave}
        formData={formData}
        setFormData={setFormData}
        banners={banners}
        handleImageUpload={handleImageUpload}
        uploadingImage={uploadingImage}
        dialogLoading={dialogLoading}
        pageOptions={pageOptions}
      />

      <DeleteConfirmDialog
        isOpen={deletingId !== null}
        onOpenChange={(open) => !open && setDeletingId(null)}
        handleDeleteConfirm={handleDeleteConfirm}
        deleteLoading={deleteLoading}
      />

      <CropDialog
        isOpen={isCropDialogOpen}
        onOpenChange={(open) => {
          setIsCropDialogOpen(open)
          if (!open) setCropImageSrc(null)
        }}
        cropImageSrc={cropImageSrc}
        crop={crop}
        setCrop={setCrop}
        zoom={zoom}
        setZoom={setZoom}
        onCropComplete={handleCropComplete}
        handleCropSave={handleCropSave}
      />
      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title={t("common.status.success")}
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title={t("common.status.error")}
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </div>
  )
}

interface BannersTableProps {
  sortedBanners: Banner[]
  pageNameMap: Record<string, string>
  handleEditClick: (banner: Banner) => void
  setDeletingId: (id: string | null) => void
}

function BannersTable({
  sortedBanners,
  pageNameMap,
  handleEditClick,
  setDeletingId,
}: BannersTableProps) {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const perPage = 10
  const totalPages = Math.ceil(sortedBanners.length / perPage) || 1
  const paginatedBanners = sortedBanners.slice(
    (page - 1) * perPage,
    page * perPage
  )
  const metadata = {
    page,
    perPage,
    totalPage: totalPages,
    count: sortedBanners.length,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-4">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-40 font-bold text-slate-600">
              Trang / Route
            </TableHead>
            <TableHead className="font-bold text-slate-600">
              Ảnh Preview
            </TableHead>
            <TableHead className="font-bold text-slate-600">
              Tiêu đề Banner
            </TableHead>
            <TableHead className="font-bold text-slate-600">
              Mô tả phụ
            </TableHead>
            <TableHead className="w-20 text-center font-bold text-slate-600">
              Thứ tự
            </TableHead>
            <TableHead className="w-28 text-right font-bold text-slate-600">
              Hành động
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBanners.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-slate-400 font-semibold"
              >
                Chưa có cấu hình banner nào. Nhấn &quot;Thêm Banner mới&quot; để bắt đầu!
              </TableCell>
            </TableRow>
          ) : (
            paginatedBanners.map((banner) => (
              <TableRow key={banner.id} className="hover:bg-slate-50/50">
                <TableCell className="font-bold text-slate-700">
                  <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                    {pageNameMap[banner.pageKey] || banner.pageKey}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="w-24 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 relative flex items-center justify-center">
                    {banner.image ? (
                      <Image
                        src={banner.image}
                        alt="Preview"
                        fill
                        sizes="96px"
                        unoptimized
                        className="object-cover"
                      />
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
      <Pagination metadata={metadata} onPageChange={(p) => setPage(p)} />
    </div>
  )
}

export interface BannerFormData {
  pageKey: string
  page?: string
  title: string
  subtitle: string
  image: string
  order: number
}

interface BannerDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  dialogMode: "create" | "edit"
  dialogError: string
  handleSave: (e: React.FormEvent) => void
  formData: BannerFormData
  setFormData: React.Dispatch<React.SetStateAction<BannerFormData>>
  banners: Banner[]
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadingImage: boolean
  dialogLoading: boolean
  pageOptions?: { value: string; label: string }[]
}

function BannerDialog({
  isOpen,
  onOpenChange,
  dialogMode,
  dialogError,
  handleSave,
  formData,
  setFormData,
  banners,
  handleImageUpload,
  uploadingImage,
  dialogLoading,
  pageOptions = [],
}: BannerDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {dialogMode === "create"
              ? t("content.banners.addBanner")
              : t("common.actions.edit")}
          </DialogTitle>
          <DialogDescription>{t("content.banners.title")}</DialogDescription>
        </DialogHeader>

        {dialogError && (
          <Alert variant="destructive" className="py-2.5">
            <AlertTitle className="text-xs font-bold">
              {t("common.status.error")}
            </AlertTitle>
            <AlertDescription className="text-xs">
              {dialogError}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="pageKey"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Route / Page
              </Label>
              <Select
                value={formData.pageKey}
                onValueChange={(val) => {
                  const count = banners.filter((b) => b.pageKey === val).length
                  setFormData({ ...formData, pageKey: val, order: count })
                }}
              >
                <SelectTrigger className="text-sm font-semibold">
                  <SelectValue placeholder="Page" />
                </SelectTrigger>
                <SelectContent>
                  {pageOptions.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-xs font-semibold"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="order"
                className="text-xs font-bold uppercase text-slate-500"
              >
                Order
              </Label>
              <Input
                id="order"
                type="number"
                min="0"
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: Number(e.target.value) })
                }
                required
                className="text-sm font-medium font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-bold uppercase text-slate-500"
            >
              {t("content.banners.bannerTitle")}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder={t("content.banners.bannerTitle")}
              className="text-sm font-semibold text-slate-800"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="subtitle"
              className="text-xs font-bold uppercase text-slate-500"
            >
              {t("products.fields.description")}
            </Label>
            <Textarea
              id="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={(e) =>
                setFormData({ ...formData, subtitle: e.target.value })
              }
              required
              placeholder={t("products.fields.description")}
              className="text-sm leading-relaxed text-slate-600"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-slate-500">
              {t("products.fields.image")}
            </Label>
            <div className="flex gap-4 items-center">
              <div className="w-32 h-20 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center flex-shrink-0">
                {formData.image ? (
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    sizes="128px"
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="URL"
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
                      {t("common.actions.import")}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={dialogLoading}
            >
              {t("common.actions.cancel")}
            </Button>
            <Button
              type="submit"
              className="bg-[#1C3F24] hover:bg-[#1C3F24]/90 text-white font-bold"
              disabled={dialogLoading || uploadingImage}
            >
              {dialogLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.status.processing")}
                </>
              ) : (
                t("common.actions.save")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteConfirmDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  handleDeleteConfirm: () => void
  deleteLoading: boolean
}

function DeleteConfirmDialog({
  isOpen,
  onOpenChange,
  handleDeleteConfirm,
  deleteLoading,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-red-600">
            {t("common.confirmations.deleteTitle")}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {t("common.confirmations.deleteDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={deleteLoading}
          >
            {t("common.confirmations.cancelText")}
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-600/90 text-white font-bold"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.status.processing")}
              </>
            ) : (
              t("common.confirmations.confirmText")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CropDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  cropImageSrc: string | null
  crop: { x: number; y: number }
  setCrop: (crop: { x: number; y: number }) => void
  zoom: number
  setZoom: (zoom: number) => void
  onCropComplete: (
    croppedArea: { x: number; y: number; width: number; height: number },
    croppedAreaPixels: { x: number; y: number; width: number; height: number }
  ) => void
  handleCropSave: () => void
}

function CropDialog({
  isOpen,
  onOpenChange,
  cropImageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  handleCropSave,
}: CropDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Cắt ảnh Banner</DialogTitle>
          <DialogDescription>
            Di chuyển và phóng to/thu nhỏ ảnh để chọn vùng hiển thị banner tỷ lệ
            1920x400 (4.8:1).
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
              onCropComplete={onCropComplete}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Label className="text-xs text-slate-500 font-bold uppercase">
            Phóng to / Thu nhỏ
          </Label>
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
              onOpenChange(false)
            }}
          >
            Hủy bỏ
          </Button>
          <Button
            type="button"
            onClick={handleCropSave}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Cắt & Tải lên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
