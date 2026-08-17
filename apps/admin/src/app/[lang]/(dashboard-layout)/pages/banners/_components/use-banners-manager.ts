"use client"

import { useRef, useState } from "react"

import { fetchApi } from "@/lib/api"

interface Banner {
  id: string
  pageKey: string
  title: string
  subtitle: string
  image: string
  order: number
}

// Helper to crop image
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = new window.Image()
  image.src = imageSrc
  await new Promise((resolve) => {
    image.onload = resolve
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
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      "image/jpeg",
      0.9
    )
  })
}

const pageNameMap: Record<string, string> = {
  home: "Trang chủ",
  products: "Trang Trồng sâm",
  ginseng: "Trang Cửa hàng",
  campaigns: "Trang Khuyến mãi",
  about: "Trang Giới thiệu",
  news: "Trang Tin tức",
}

export function useBannersManager(
  initialBanners: Banner[],
  initialError?: string
) {
  const [banners, setBanners] = useState<Banner[]>(initialBanners)
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Dialog State
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    selectedBanner: null as Banner | null,
    loading: false,
    error: "",
    uploadingImage: false,
  })

  const {
    isOpen: isDialogOpen,
    mode: dialogMode,
    selectedBanner,
    loading: dialogLoading,
    error: dialogError,
    uploadingImage,
  } = dialogState

  const setIsDialogOpen = (isOpen: boolean) =>
    setDialogState((prev) => ({ ...prev, isOpen }))
  const setDialogMode = (mode: "create" | "edit") =>
    setDialogState((prev) => ({ ...prev, mode }))
  const setSelectedBanner = (selectedBanner: Banner | null) =>
    setDialogState((prev) => ({ ...prev, selectedBanner }))
  const setDialogLoading = (loading: boolean) =>
    setDialogState((prev) => ({ ...prev, loading }))
  const setDialogError = (error: string) =>
    setDialogState((prev) => ({ ...prev, error }))
  const setUploadingImage = (uploadingImage: boolean) =>
    setDialogState((prev) => ({ ...prev, uploadingImage }))

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
  const cropFileNameRef = useRef<string>("")
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const croppedAreaPixelsRef = useRef<{
    x: number
    y: number
    width: number
    height: number
  } | null>(null)
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false)

  const handleCreateClick = () => {
    setFormData({
      pageKey: "home",
      title: "",
      subtitle: "",
      image: "",
      order: banners.filter((b) => b.pageKey === "home").length,
    })
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedBanner: null,
      loading: false,
      error: "",
      uploadingImage: false,
    })
  }

  const handleEditClick = (banner: Banner) => {
    setFormData({
      pageKey: banner.pageKey,
      title: banner.title,
      subtitle: banner.subtitle,
      image: banner.image,
      order: banner.order,
    })
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedBanner: banner,
      loading: false,
      error: "",
      uploadingImage: false,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    cropFileNameRef.current = file.name
    const reader = new FileReader()
    reader.onload = () => {
      setCropImageSrc(reader.result as string)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setIsCropDialogOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = "" // clear value
  }

  const handleCropSave = async () => {
    if (!cropImageSrc || !croppedAreaPixelsRef.current) return

    setUploadingImage(true)
    setIsCropDialogOpen(false)
    setDialogError("")

    try {
      const croppedBlob = await getCroppedImg(
        cropImageSrc,
        croppedAreaPixelsRef.current
      )
      if (!croppedBlob) {
        throw new Error("Không thể cắt hình ảnh")
      }

      const file = new File([croppedBlob], cropFileNameRef.current, {
        type: "image/jpeg",
      })
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
    } catch (err: unknown) {
      console.error(err)
      const message =
        err instanceof Error ? err.message : "Lỗi kết nối khi tải ảnh lên"
      setDialogError(message)
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
      const url = isEdit
        ? `/admin/banners/${selectedBanner?.id}`
        : "/admin/banners"
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
          setSuccessMsg(
            `Cập nhật banner cho "${pageNameMap[savedItem.pageKey] || savedItem.pageKey}" thành công!`
          )
        } else {
          setBanners((prev) => [...prev, savedItem])
          setSuccessMsg(
            `Tạo mới banner cho "${pageNameMap[savedItem.pageKey] || savedItem.pageKey}" thành công!`
          )
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

  const sortedBanners = [...banners].sort((a, b) => {
    if (a.pageKey !== b.pageKey) {
      return a.pageKey.localeCompare(b.pageKey)
    }
    return a.order - b.order
  })

  return {
    banners,
    setBanners,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    isDialogOpen,
    setIsDialogOpen,
    dialogMode,
    setDialogMode,
    selectedBanner,
    setSelectedBanner,
    dialogLoading,
    setDialogLoading,
    dialogError,
    setDialogError,
    uploadingImage,
    setUploadingImage,
    deletingId,
    setDeletingId,
    deleteLoading,
    setDeleteLoading,
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
    pageNameMap,
    handleCropComplete: (
      _croppedArea: { x: number; y: number; width: number; height: number },
      croppedAreaPixels: { x: number; y: number; width: number; height: number }
    ) => {
      croppedAreaPixelsRef.current = croppedAreaPixels
    },
  }
}
