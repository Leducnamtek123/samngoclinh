"use client"

import Image from "next/image"
import {
  AlertCircle,
  Image as ImageIcon,
  RefreshCw,
  Upload,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Editor } from "@/components/ui/editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export interface NewsFormData {
  title: string
  slug: string
  category: string
  summary: string
  body: string
  status: string
  sortOrder: number
  coverImage: string
  authorName: string
}

interface NewsDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "create" | "edit"
  formData: NewsFormData
  onChange: (updater: (prev: NewsFormData) => NewsFormData) => void
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  loading: boolean
  error: string
  uploadingImage: boolean
  categoryOptions: { value: string; label: string }[]
  statusOptions: { value: string; label: string }[]
}

export function NewsDialog({
  isOpen,
  onClose,
  mode,
  formData,
  onChange,
  onTitleChange,
  onImageUpload,
  onSubmit,
  loading,
  error,
  uploadingImage,
  categoryOptions,
  statusOptions,
}: NewsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "create"
                ? "Tạo bài viết tin tức mới"
                : "Chỉnh sửa bài viết"}
            </DialogTitle>
            <DialogDescription>
              Soạn thảo nội dung bài viết, phân loại chuyên mục hiển thị trên
              website khách hàng.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-150 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="text-xs text-slate-400 font-medium animate-pulse">
                Đang tải chi tiết bài viết...
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="news-title">Tiêu đề bài viết</Label>
                    <Input
                      id="news-title"
                      value={formData.title}
                      onChange={onTitleChange}
                      placeholder="Ví dụ: Lễ hội sâm Ngọc Linh Nam Trà My..."
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="news-slug">Đường dẫn tĩnh (Slug)</Label>
                    <Input
                      id="news-slug"
                      value={formData.slug}
                      onChange={(e) =>
                        onChange((prev) => ({ ...prev, slug: e.target.value }))
                      }
                      placeholder="le-hoi-sam-ngoc-linh..."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="news-category">Chuyên mục bài viết</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(val) =>
                        onChange((prev) => ({ ...prev, category: val }))
                      }
                    >
                      <SelectTrigger id="news-category">
                        <SelectValue placeholder="Chọn chuyên mục" />
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
                  <div className="grid gap-2">
                    <Label htmlFor="news-status">Trạng thái xuất bản</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(val) =>
                        onChange((prev) => ({ ...prev, status: val }))
                      }
                    >
                      <SelectTrigger id="news-status">
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="news-sort">Thứ tự hiển thị</Label>
                    <Input
                      id="news-sort"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          sortOrder: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="news-author">Tác giả bài viết</Label>
                    <Input
                      id="news-author"
                      value={formData.authorName}
                      onChange={(e) =>
                        onChange((prev) => ({
                          ...prev,
                          authorName: e.target.value,
                        }))
                      }
                      placeholder="Ví dụ: Sâm Ngọc Linh, Ban biên tập..."
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Ảnh bìa bài viết</Label>
                  <div className="flex items-center gap-4">
                    {formData.coverImage ? (
                      <div className="relative w-28 h-20 rounded-xl overflow-hidden border">
                        <Image
                          src={formData.coverImage}
                          alt="Cover Preview"
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onChange((prev) => ({ ...prev, coverImage: "" }))
                          }
                          className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] font-bold transition-colors"
                        >
                          Gỡ bỏ ảnh
                        </button>
                      </div>
                    ) : (
                      <div className="w-28 h-20 bg-slate-50 dark:bg-slate-900 border border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1">
                        <ImageIcon className="h-5 w-5 opacity-40" />
                        <span className="text-[9px]">Chưa có ảnh bìa</span>
                      </div>
                    )}

                    <div className="flex-1 flex flex-col gap-2">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={onImageUpload}
                          className="hidden"
                          id="news-file-upload"
                          disabled={uploadingImage}
                        />
                        <Label
                          htmlFor="news-file-upload"
                          className="flex items-center justify-center gap-1.5 h-9 px-3 border border-dashed border-emerald-300 hover:border-emerald-500 rounded-lg cursor-pointer bg-emerald-50/10 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold"
                        >
                          {uploadingImage ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              Đang tải lên...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3.5 w-3.5" />
                              Tải file ảnh từ thiết bị
                            </>
                          )}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="news-summary">Tóm tắt ngắn (Summary)</Label>
                  <Textarea
                    id="news-summary"
                    value={formData.summary}
                    onChange={(e) =>
                      onChange((prev) => ({ ...prev, summary: e.target.value }))
                    }
                    placeholder="Nhập tóm tắt ngắn hiển thị trên danh sách tin tức..."
                    rows={2}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="news-body">Nội dung bài viết chi tiết</Label>
                  <Editor
                    value={formData.body}
                    onValueChange={(val) =>
                      onChange((prev) => ({ ...prev, body: val }))
                    }
                    placeholder="Soạn thảo nội dung bài viết chi tiết..."
                    className="min-h-[200px]"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="h-9 font-semibold text-xs"
                  onClick={onClose}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={uploadingImage}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-9 text-xs"
                >
                  {mode === "create" ? "Đăng bài viết" : "Lưu thay đổi"}
                </Button>
              </DialogFooter>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}
