"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2, Plus, Upload, Image as ImageIcon, Search, RefreshCw, Eye, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToastCard, ConfirmationDialog } from "@/components/ui/feedback-components"
import { Editor } from "@/components/ui/editor"

interface Article {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  body?: string
  status: string
  sortOrder?: number
  coverImage?: string
  image?: string
  metadata?: {
    authorName?: string
  }
  createdAt: string
}

interface NewsManagerProps {
  initialArticles: Article[]
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  errorMsg?: string
}

const categoryOptions = [
  { value: "news", label: "Tin tức" },
  { value: "event", label: "Sự kiện" },
  { value: "guide", label: "Hướng dẫn sử dụng" },
  { value: "faq", label: "Kiến thức & FAQ" },
]

const categoryNameMap: Record<string, string> = {
  news: "Tin tức",
  event: "Sự kiện",
  guide: "Hướng dẫn sử dụng",
  faq: "Kiến thức & FAQ",
}

const statusOptions = [
  { value: "published", label: "Đã xuất bản" },
  { value: "draft", label: "Bản nháp" },
  { value: "inactive", label: "Ngưng hiển thị" },
]

const statusNameMap: Record<string, string> = {
  published: "Đã xuất bản",
  draft: "Bản nháp",
  inactive: "Ngưng hiển thị",
}

const slugify = (text: string) => {
  let str = text.toLowerCase()
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i")
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
  str = str.replace(/đ/g, "d")
  str = str.replace(/[^a-z0-9 -]/g, "")
  str = str.replace(/\s+/g, "-")
  str = str.replace(/-+/g, "-")
  return str.trim()
}

export function NewsManager({ initialArticles, metadata, errorMsg: initialError }: NewsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const categoryFilter = searchParams.get("status") || "all"

  // Sync articles on props change
  useEffect(() => {
    setArticles(initialArticles)
  }, [initialArticles])

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)

  // Confirmation Dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)

  const createQueryString = (newParams: Record<string, string | null>) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(newParams)) {
      if (value === null || value === "all" || value === "") {
        updatedSearchParams.delete(key)
      } else {
        updatedSearchParams.set(key, value)
      }
    }
    if (!newParams.hasOwnProperty("page")) {
      updatedSearchParams.set("page", "1")
    }
    return updatedSearchParams.toString()
  }

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchQuery !== currentSearch) {
        router.push(`${pathname}?${createQueryString({ search: searchQuery })}`)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery])

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`)
  }

  const handleCategoryFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  // Sync articles on props change

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "news",
    summary: "",
    body: "",
    status: "published",
    sortOrder: 0,
    coverImage: "",
    authorName: "iWE FARM",
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    setFormData((prev) => ({
      ...prev,
      title: titleVal,
      slug: dialogMode === "create" ? slugify(titleVal) : prev.slug,
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setDialogError("")

    try {
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
          coverImage: payload.data?.url || "",
        }))
        setSuccessMsg("Tải ảnh bìa bài viết lên thành công!")
      }
    } catch (err: any) {
      console.error(err)
      setDialogError(err?.message || "Lỗi kết nối khi tải ảnh lên")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleOpenCreate = () => {
    setDialogMode("create")
    setSelectedArticle(null)
    setFormData({
      title: "",
      slug: "",
      category: "news",
      summary: "",
      body: "",
      status: "published",
      sortOrder: 0,
      coverImage: "",
      authorName: "iWE FARM",
    })
    setDialogError("")
    setIsDialogOpen(true)
  }

  const handleOpenEdit = async (article: Article) => {
    setDialogError("")
    setDialogLoading(true)
    setIsDialogOpen(true)
    setDialogMode("edit")
    setSelectedArticle(article)
    
    // Set default fields first
    setFormData({
      title: article.title,
      slug: article.slug,
      category: article.category,
      summary: article.summary,
      body: "",
      status: "published",
      sortOrder: 0,
      coverImage: article.coverImage || article.image || "",
      authorName: article.metadata?.authorName || "iWE FARM",
    })

    try {
      const res = await fetchApi(`/public/content/articles/${article.id}`)
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        const fullDetail = payload.data
        setFormData({
          title: fullDetail.title || article.title,
          slug: fullDetail.slug || article.slug,
          category: fullDetail.category || article.category,
          summary: fullDetail.summary || article.summary,
          body: fullDetail.body || "",
          status: fullDetail.status || "published",
          sortOrder: fullDetail.sortOrder || 0,
          coverImage: fullDetail.coverImage || "",
          authorName: fullDetail.metadata?.authorName || "iWE FARM",
        })
      }
    } catch (e) {
      console.error("Error loading article detail:", e)
      setDialogError("Không thể tải chi tiết bài viết từ máy chủ")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogLoading(true)
    setDialogError("")

    try {
      const isEdit = dialogMode === "edit"
      const url = isEdit ? `/admin/content/articles/${selectedArticle?.id}` : "/admin/content/articles"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetchApi(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          category: formData.category,
          summary: formData.summary,
          body: formData.body,
          status: formData.status,
          sortOrder: formData.sortOrder,
          coverImage: formData.coverImage,
          metadata: {
            ...(selectedArticle?.metadata || {}),
            authorName: formData.authorName,
          }
        }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogError(payload?.message || "Không thể lưu bài viết")
      } else {
        setSuccessMsg(isEdit ? "Đã cập nhật bài viết thành công!" : "Đã tạo bài viết mới thành công!")
        setIsDialogOpen(false)
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      setDialogError(err?.message || "Lỗi máy chủ khi lưu tin tức")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleOpenDelete = (id: string) => {
    setDeletingId(id)
    setConfirmDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!deletingId) return
    setConfirmLoading(true)
    try {
      const res = await fetchApi(`/admin/content/articles/${deletingId}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa bài viết")
      } else {
        setSuccessMsg("Đã xóa bài viết tin tức thành công!")
        setArticles((prev) => prev.filter((item) => item.id !== deletingId))
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Có lỗi xảy ra khi xóa tin tức.")
    } finally {
      setConfirmLoading(false)
      setConfirmDialogOpen(false)
      setDeletingId(null)
    }
  }

  const filteredArticles = articles

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Quản lý Tin tức</h1>
          <p className="text-xs text-slate-400">Danh sách bài viết tin tức, sự kiện nông trại, cẩm nang kiến thức và FAQ sâm Ngọc Linh</p>
        </div>
        <Button onClick={handleOpenCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2 self-start md:self-auto shadow-sm">
          <Plus className="h-4 w-4" /> Thêm bài viết mới
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 border border-slate-200/80 dark:border-slate-800 shadow-xxs bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm tiêu đề, tóm tắt bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>
          <Select value={categoryFilter} onValueChange={handleCategoryFilterChange}>
            <SelectTrigger className="w-full sm:w-48 h-9 text-xs">
              <SelectValue placeholder="Tất cả chuyên mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chuyên mục</SelectItem>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Main Table */}
      <Card className="border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden bg-white dark:bg-slate-900">
        <Table>
          <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
            <TableRow>
              <TableHead className="w-16">Ảnh bìa</TableHead>
              <TableHead>Bài viết</TableHead>
              <TableHead className="w-32">Chuyên mục</TableHead>
              <TableHead className="w-32">Trạng thái</TableHead>
              <TableHead className="w-32">Ngày tạo</TableHead>
              <TableHead className="w-24 text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredArticles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-16 text-slate-400 text-xs">
                  Không tìm thấy bài viết tin tức nào.
                </TableCell>
              </TableRow>
            ) : (
              filteredArticles.map((art) => (
                <TableRow key={art.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    {(art.coverImage || art.image) ? (
                      <img
                        src={art.coverImage || art.image}
                        alt={art.title}
                        className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border text-slate-350">
                        <ImageIcon className="h-5 w-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 text-xs line-clamp-1">
                        {art.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 line-clamp-1">
                        /{art.slug}
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-1 max-w-lg">
                        {art.summary}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-slate-200">
                      {categoryNameMap[art.category] || art.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        art.status === "published"
                          ? "default"
                          : art.status === "draft"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] font-bold px-2 py-0.5"
                    >
                      {statusNameMap[art.status] || art.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400 text-[10px] font-medium">
                    {art.createdAt ? new Date(art.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                        onClick={() => handleOpenEdit(art)}
                        title="Chỉnh sửa bài viết"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-slate-500 hover:text-red-650"
                        onClick={() => handleOpenDelete(art.id)}
                        title="Xóa bài viết"
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

        {/* Pagination Controls */}
        {metadata && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/30 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Hiển thị trang {metadata.page} / {metadata.totalPage} (Tổng số {metadata.count} bài viết)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={!metadata.hasPrevious}
                onClick={() => handlePageChange(metadata.page - 1)}
                className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Trước</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!metadata.hasNext}
                onClick={() => handlePageChange(metadata.page + 1)}
                className="h-8 text-xs flex items-center gap-1 text-slate-600 dark:text-slate-400"
              >
                <span>Kế tiếp</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSave}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Tạo bài viết tin tức mới" : "Chỉnh sửa bài viết"}
              </DialogTitle>
              <DialogDescription>
                Soạn thảo nội dung bài viết, phân loại chuyên mục hiển thị trên website khách hàng.
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="mt-3 p-3 bg-red-50 border border-red-150 rounded-xl text-red-600 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{dialogError}</span>
              </div>
            )}

            {dialogLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
                <p className="text-xs text-slate-400 font-medium animate-pulse">Đang tải chi tiết bài viết...</p>
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
                        onChange={handleTitleChange}
                        placeholder="Ví dụ: Lễ hội sâm Ngọc Linh Nam Trà My..."
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="news-slug">Đường dẫn tĩnh (Slug)</Label>
                      <Input
                        id="news-slug"
                        value={formData.slug}
                        onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
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
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, category: val }))}
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
                        onValueChange={(val) => setFormData((prev) => ({ ...prev, status: val }))}
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
                        onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="news-author">Tác giả bài viết</Label>
                      <Input
                        id="news-author"
                        value={formData.authorName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, authorName: e.target.value }))}
                        placeholder="Ví dụ: iWE FARM, Admin..."
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Ảnh bìa bài viết</Label>
                    <div className="flex items-center gap-4">
                      {formData.coverImage ? (
                        <div className="relative w-28 h-20 rounded-xl overflow-hidden border">
                          <img src={formData.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, coverImage: "" }))}
                            className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-[10px] font-bold transition-all"
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
                            onChange={handleImageUpload}
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
                      onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
                      placeholder="Nhập tóm tắt ngắn hiển thị trên danh sách tin tức..."
                      rows={2}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="news-body">Nội dung bài viết chi tiết</Label>
                    <Editor
                      value={formData.body}
                      onValueChange={(val) => setFormData((prev) => ({ ...prev, body: val }))}
                      placeholder="Soạn thảo nội dung bài viết chi tiết..."
                      className="min-h-[200px]"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" className="h-9 font-semibold text-xs" onClick={() => setIsDialogOpen(false)}>
                    Hủy bỏ
                  </Button>
                  <Button type="submit" disabled={uploadingImage} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-9 text-xs">
                    {dialogMode === "create" ? "Đăng bài viết" : "Lưu thay đổi"}
                  </Button>
                </DialogFooter>
              </>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa bài viết tin tức"
        description="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
        confirmLabel="Xác nhận xóa"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmLoading}
      />

      {/* Success/Error Toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title="Thành công"
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </div>
  )
}
