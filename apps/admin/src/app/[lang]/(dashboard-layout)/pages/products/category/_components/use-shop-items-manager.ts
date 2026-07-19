"use client"

import { useState, useEffect, useCallback, experimental_useEffectEvent as useEffectEvent } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"

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

interface UseShopItemsManagerProps {
  initialItems: ShopItem[]
  initialError?: string
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

export function useShopItemsManager({ initialItems, initialError }: UseShopItemsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [items, setItems] = useState<ShopItem[]>(initialItems)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const categoryFilter = searchParams.get("status") || "all"

  // Sync items on props change
  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])
  
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Confirmation Dialog States
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    action: () => void
    loading: boolean
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    loading: false,
  })

  // Dialog state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedItem: ShopItem | null
    loading: boolean
    error: string
    uploadingImage: boolean
    formData: {
      code: string
      name: string
      category: string
      unit: string
      price: number
      stock: number
      status: string
      description: string
      imageUrl: string
    }
  }>({
    isOpen: false,
    mode: "create",
    selectedItem: null,
    loading: false,
    error: "",
    uploadingImage: false,
    formData: {
      code: "",
      name: "",
      category: "processed",
      unit: "cái",
      price: 50000,
      stock: 100,
      status: "active",
      description: "",
      imageUrl: "",
    }
  })

  // Image Cropping States
  const [cropState, setCropState] = useState<{
    isOpen: boolean
    imageSrc: string | null
    crop: { x: number; y: number }
    zoom: number
    croppedAreaPixels: any
  }>({
    isOpen: false,
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
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

  const onSearch = useEffectEvent(() => {
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

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
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
        setItems((prev) => prev.filter((item) => item.id !== id))
        setSuccessMsg("Xóa sản phẩm thành công!")
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    const item = items.find((x) => x.id === id)
    setConfirmDialog({
      isOpen: true,
      title: "Xóa sản phẩm thương mại?",
      description: `Hành động này sẽ xóa vĩnh viễn sản phẩm "${item?.name || ""}" (${item?.code || ""}) khỏi hệ thống. Bạn không thể hoàn tác thao tác này.`,
      action: () => performDelete(id),
      loading: false,
    })
  }

  const openCreateDialog = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedItem: null,
      loading: false,
      error: "",
      uploadingImage: false,
      formData: {
        code: "prod-" + Math.floor(Math.random() * 10000),
        name: "",
        category: "processed",
        unit: "cái",
        price: 50000,
        stock: 100,
        status: "active",
        description: "",
        imageUrl: "",
      }
    })
  }

  const openEditDialog = (item: ShopItem) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedItem: item,
      loading: false,
      error: "",
      uploadingImage: false,
      formData: {
        code: item.code,
        name: item.name,
        category: item.category || "processed",
        unit: item.unit || "cái",
        price: item.price || 0,
        stock: item.stock || 0,
        status: item.status || "active",
        description: item.description || "",
        imageUrl: item.images?.[0] || "",
      }
    })
  }

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setCropState((prev) => ({
        ...prev,
        imageSrc: reader.result as string,
        isOpen: true,
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCropState((prev) => ({ ...prev, croppedAreaPixels }))
  }

  const handleCropSave = async () => {
    if (!cropState.imageSrc || !cropState.croppedAreaPixels) return
    setDialogState((prev) => ({ ...prev, uploadingImage: true, error: "" }))

    try {
      const croppedImageBlob = await getCroppedImg(cropState.imageSrc, cropState.croppedAreaPixels)
      if (!croppedImageBlob) {
        setDialogState((prev) => ({ ...prev, uploadingImage: false, error: "Không thể cắt hình ảnh." }))
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
        setDialogState((prev) => ({ ...prev, error: payload?.message || "Tải ảnh lên thất bại" }))
      } else {
        setDialogState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            imageUrl: payload.data?.url || "",
          }
        }))
        setCropState((prev) => ({ ...prev, isOpen: false, imageSrc: null }))
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: "Lỗi kết nối khi tải ảnh lên" }))
    } finally {
      setDialogState((prev) => ({ ...prev, uploadingImage: false }))
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      }
    }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))

    const bodyData = {
      code: dialogState.formData.code,
      name: dialogState.formData.name,
      category: dialogState.formData.category,
      unit: dialogState.formData.unit,
      price: dialogState.formData.price,
      stock: dialogState.formData.stock,
      status: dialogState.formData.status,
      description: dialogState.formData.description || undefined,
      images: dialogState.formData.imageUrl ? [dialogState.formData.imageUrl] : [],
    }

    try {
      let res
      if (dialogState.mode === "create") {
        res = await fetchApi("/admin/catalog/shop-items", {
          method: "POST",
          body: JSON.stringify(bodyData),
        })
      } else {
        res = await fetchApi(`/admin/catalog/shop-items/${dialogState.selectedItem?.id}`, {
          method: "PUT",
          body: JSON.stringify(bodyData),
        })
      }

      const payload = await res.json()
      if (res.status >= 400) {
        setDialogState((prev) => ({ ...prev, error: payload?.message || "Lưu thông tin sản phẩm thất bại." }))
      } else {
        const savedItem = payload.data
        if (dialogState.mode === "create") {
          setItems((prev) => [savedItem, ...prev])
          setSuccessMsg("Tạo mới sản phẩm thành công!")
        } else {
          setItems((prev) => prev.map((item) => (item.id === savedItem.id ? savedItem : item)))
          setSuccessMsg("Cập nhật thông tin sản phẩm thành công!")
        }
        setDialogState((prev) => ({ ...prev, isOpen: false }))
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: "Lỗi kết nối khi lưu thông tin sản phẩm." }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const filteredItems = items

  return {
    items,
    filteredItems,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    cropState,
    setCropState,
    handlePageChange,
    handleCategoryFilterChange,
    handleDelete,
    openCreateDialog,
    openEditDialog,
    handleImageFileChange,
    handleCropComplete,
    handleCropSave,
    handleFormChange,
    handleFormSubmit,
  }
}
