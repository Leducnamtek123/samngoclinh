"use client"

import { useState, useEffect, useCallback } from "react"
import { useEvent } from "@/hooks/use-event"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"

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

interface UseNewsManagerProps {
  initialArticles: Article[]
  initialError?: string
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

export function useNewsManager({ initialArticles, initialError }: UseNewsManagerProps) {
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

  // Consolidated Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedArticle: Article | null
    loading: boolean
    error: string
    uploadingImage: boolean
    formData: {
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
  }>({
    isOpen: false,
    mode: "create",
    selectedArticle: null,
    loading: false,
    error: "",
    uploadingImage: false,
    formData: {
      title: "",
      slug: "",
      category: "news",
      summary: "",
      body: "",
      status: "published",
      sortOrder: 0,
      coverImage: "",
      authorName: "iWE FARM",
    }
  })

  // Confirmation Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    deletingId: string | null
    loading: boolean
  }>({
    isOpen: false,
    deletingId: null,
    loading: false,
  })

  const createQueryString = useCallback((newParams: Record<string, string | null>) => {
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
  }, [searchParams])

  const onSearch = useEvent(() => {
    const currentSearch = searchParams.get("search") || ""
    if (searchQuery !== currentSearch) {
      router.push(`${pathname}?${createQueryString({ search: searchQuery })}`)
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery, onSearch])

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`)
  }

  const handleCategoryFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titleVal = e.target.value
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        title: titleVal,
        slug: prev.mode === "create" ? slugify(titleVal) : prev.formData.slug,
      }
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setDialogState((prev) => ({ ...prev, uploadingImage: true, error: "" }))

    try {
      const fd = new FormData()
      fd.append("file", file)

      const res = await fetchApi("/admin/catalog/upload", {
        method: "POST",
        body: fd,
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogState((prev) => ({ ...prev, error: payload?.message || "Tải ảnh lên thất bại" }))
      } else {
        setDialogState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            coverImage: payload.data?.url || "",
          }
        }))
        setSuccessMsg("Tải ảnh bìa bài viết lên thành công!")
      }
    } catch (err: any) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: err?.message || "Lỗi kết nối khi tải ảnh lên" }))
    } finally {
      setDialogState((prev) => ({ ...prev, uploadingImage: false }))
    }
  }

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedArticle: null,
      loading: false,
      error: "",
      uploadingImage: false,
      formData: {
        title: "",
        slug: "",
        category: "news",
        summary: "",
        body: "",
        status: "published",
        sortOrder: 0,
        coverImage: "",
        authorName: "iWE FARM",
      }
    })
  }

  const handleOpenEdit = async (article: Article) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedArticle: article,
      loading: true,
      error: "",
      uploadingImage: false,
      formData: {
        title: article.title,
        slug: article.slug,
        category: article.category,
        summary: article.summary,
        body: "",
        status: "published",
        sortOrder: 0,
        coverImage: article.coverImage || article.image || "",
        authorName: article.metadata?.authorName || "iWE FARM",
      }
    })

    try {
      const res = await fetchApi(`/public/content/articles/${article.id}`)
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        const fullDetail = payload.data
        setDialogState((prev) => ({
          ...prev,
          formData: {
            title: fullDetail.title || article.title,
            slug: fullDetail.slug || article.slug,
            category: fullDetail.category || article.category,
            summary: fullDetail.summary || article.summary,
            body: fullDetail.body || "",
            status: fullDetail.status || "published",
            sortOrder: fullDetail.sortOrder || 0,
            coverImage: fullDetail.coverImage || "",
            authorName: fullDetail.metadata?.authorName || "iWE FARM",
          }
        }))
      }
    } catch (e) {
      console.error("Error loading article detail:", e)
      setDialogState((prev) => ({ ...prev, error: "Không thể tải chi tiết bài viết từ máy chủ" }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))

    try {
      const isEdit = dialogState.mode === "edit"
      const url = isEdit ? `/admin/content/articles/${dialogState.selectedArticle?.id}` : "/admin/content/articles"
      const method = isEdit ? "PUT" : "POST"

      const res = await fetchApi(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: dialogState.formData.title,
          slug: dialogState.formData.slug,
          category: dialogState.formData.category,
          summary: dialogState.formData.summary,
          body: dialogState.formData.body,
          status: dialogState.formData.status,
          sortOrder: dialogState.formData.sortOrder,
          coverImage: dialogState.formData.coverImage,
          metadata: {
            ...(dialogState.selectedArticle?.metadata || {}),
            authorName: dialogState.formData.authorName,
          }
        }),
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogState((prev) => ({ ...prev, error: payload?.message || "Không thể lưu bài viết" }))
      } else {
        setSuccessMsg(isEdit ? "Đã cập nhật bài viết thành công!" : "Đã tạo bài viết mới thành công!")
        setDialogState((prev) => ({ ...prev, isOpen: false }))
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: err?.message || "Lỗi máy chủ khi lưu tin tức" }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleOpenDelete = (id: string) => {
    setConfirmState({
      isOpen: true,
      deletingId: id,
      loading: false,
    })
  }

  const handleDeleteConfirm = async () => {
    const deletingId = confirmState.deletingId
    if (!deletingId) return
    setConfirmState((prev) => ({ ...prev, loading: true }))
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
      setConfirmState({
        isOpen: false,
        deletingId: null,
        loading: false,
      })
    }
  }

  const filteredArticles = articles

  return {
    articles,
    filteredArticles,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    dialogState,
    setDialogState,
    confirmState,
    setConfirmState,
    handlePageChange,
    handleCategoryFilterChange,
    handleTitleChange,
    handleImageUpload,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleOpenDelete,
    handleDeleteConfirm,
  }
}
