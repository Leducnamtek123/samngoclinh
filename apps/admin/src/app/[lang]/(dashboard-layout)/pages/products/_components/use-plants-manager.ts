"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { fetchApi } from "@/lib/api"
import { useEvent } from "@/hooks/use-event"
import { useTranslation } from "@/providers/i18n-provider"
import type { PlantFormValues } from "@/schemas/plant-schema"

export interface Plant {
  id: string
  code: string
  name: string
  ageYear: number
  price: number
  stock?: number
  status: string
  createdAt?: string
  description?: string
  images?: string[]
}

interface UsePlantsManagerProps {
  initialPlants: Plant[]
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
    canvas.toBlob(
      (blob) => {
        resolve(blob)
      },
      "image/jpeg",
      0.9
    )
  })
}

export function usePlantsManager({
  initialPlants,
  initialError,
}: UsePlantsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [plants, setPlants] = useState<Plant[]>(initialPlants)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"
  const ageTab = searchParams.get("ageYear") || "all"

  const setAgeTab = (val: string) => {
    router.push(`${pathname}?${createQueryString({ ageYear: val })}`)
  }

  // Sync plants on props change
  useEffect(() => {
    setPlants(initialPlants)
  }, [initialPlants])

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Selection state
  const [selectedPlantIds, setSelectedPlantIds] = useState<string[]>([])

  // Consolidated Confirmation Dialog State
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean
    title: string
    desc: string
    loading: boolean
    action: () => void
  }>({
    isOpen: false,
    title: "",
    desc: "",
    loading: false,
    action: () => {},
  })

  // Consolidated Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedPlant: Plant | null
    loading: boolean
    error: string
    uploadingImage: boolean
    formData: {
      code: string
      name: string
      ageYear: number
      price: number
      stock: number
      status: string
      description: string
      imageUrl: string
      images: string[]
    }
  }>({
    isOpen: false,
    mode: "create",
    selectedPlant: null,
    loading: false,
    error: "",
    uploadingImage: false,
    formData: {
      code: "",
      name: "",
      ageYear: 1,
      price: 0,
      stock: 0,
      status: "available",
      description: "",
      imageUrl: "",
      images: [],
    },
  })

  // Consolidated Image Cropping State
  const [cropState, setCropState] = useState<{
    imageSrc: string | null
    crop: { x: number; y: number }
    zoom: number
    croppedAreaPixels: any
    isOpen: boolean
  }>({
    imageSrc: null,
    crop: { x: 0, y: 0 },
    zoom: 1,
    croppedAreaPixels: null,
    isOpen: false,
  })

  const createQueryString = useCallback(
    (newParams: Record<string, string | null>) => {
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
    },
    [searchParams]
  )

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
    router.push(
      `${pathname}?${createQueryString({ page: newPage.toString() })}`
    )
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const filteredPlants = plants

  const handleToggleSelect = (id: string) => {
    setSelectedPlantIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredPlants.map((p) => p.id)
    const selectedPlantIdsSet = new Set(selectedPlantIds)
    const isAllSelected = allFilteredIds.every((id) =>
      selectedPlantIdsSet.has(id)
    )

    if (isAllSelected) {
      setSelectedPlantIds((prev) => {
        const set = new Set(allFilteredIds)
        return prev.filter((id) => !set.has(id))
      })
    } else {
      setSelectedPlantIds((prev) =>
        Array.from(new Set([...prev, ...allFilteredIds]))
      )
    }
  }

  const performBulkDelete = async () => {
    setConfirmState((prev) => ({ ...prev, loading: true }))
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
      setPlants((prev) => {
        const set = new Set(selectedPlantIds)
        return prev.filter((p) => !set.has(p.id))
      })
      setSuccessMsg(t("messages.deleteSuccess"))
      router.refresh()
    }

    if (failCount > 0) {
      setErrorMsg(t("messages.errorOccurred"))
    }

    setSelectedPlantIds([])
    setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }))
  }

  const handleBulkDelete = () => {
    if (selectedPlantIds.length === 0) return
    setConfirmState({
      isOpen: true,
      title: t("common.confirmations.deleteTitle"),
      desc: t("common.confirmations.deleteDescription"),
      loading: false,
      action: performBulkDelete,
    })
  }

  const performDelete = async (id: string) => {
    setConfirmState((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/catalog/plants/${id}`, {
        method: "DELETE",
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || t("messages.errorOccurred"))
      } else {
        setPlants(plants.filter((p) => p.id !== id))
        setSuccessMsg(t("messages.deleteSuccess"))
        setSelectedPlantIds((prev) => prev.filter((item) => item !== id))
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg(t("messages.networkError"))
    } finally {
      setConfirmState((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    const plant = plants.find((p) => p.id === id)
    setConfirmState({
      isOpen: true,
      title: t("common.confirmations.deleteTitle"),
      desc: t("common.confirmations.deleteDescription"),
      loading: false,
      action: () => performDelete(id),
    })
  }

  const openCreateDialog = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedPlant: null,
      loading: false,
      error: "",
      uploadingImage: false,
      formData: {
        code: "plant-sam-" + Math.floor(Math.random() * 1000),
        name: "",
        ageYear: 1,
        price: 100000,
        stock: 50,
        status: "available",
        description: "",
        imageUrl: "",
        images: [],
      },
    })
  }

  const openEditDialog = (plant: Plant) => {
    const plantImages =
      plant.images && plant.images.length > 0 ? plant.images : []
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedPlant: plant,
      loading: false,
      error: "",
      uploadingImage: false,
      formData: {
        code: plant.code,
        name: plant.name,
        ageYear: plant.ageYear,
        price: plant.price,
        stock: plant.stock ?? 0,
        status: plant.status,
        description: plant.description || "",
        imageUrl: plantImages[0] || "",
        images: plantImages,
      },
    })
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCropState((prev) => ({ ...prev, croppedAreaPixels }))
  }

  const handleCropSubmit = async () => {
    if (!cropState.imageSrc || !cropState.croppedAreaPixels) return
    setDialogState((prev) => ({ ...prev, uploadingImage: true, error: "" }))
    setCropState((prev) => ({ ...prev, isOpen: false }))

    try {
      const croppedBlob = await getCroppedImg(
        cropState.imageSrc,
        cropState.croppedAreaPixels
      )
      if (!croppedBlob) {
        setDialogState((prev) => ({
          ...prev,
          error: t("messages.errorOccurred"),
        }))
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
        setDialogState((prev) => ({
          ...prev,
          error: payload?.message || t("messages.errorOccurred"),
        }))
      } else {
        const newUrl = payload.data?.url || ""
        setDialogState((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            imageUrl: newUrl || prev.formData.imageUrl,
            images: newUrl
              ? [...(prev.formData.images || []), newUrl]
              : prev.formData.images,
          },
        }))
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: t("messages.networkError") }))
    } finally {
      setDialogState((prev) => ({ ...prev, uploadingImage: false }))
      setCropState((prev) => ({ ...prev, imageSrc: null }))
    }
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      },
    }))
  }

  const handleSelectStatus = (val: string) => {
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        status: val,
      },
    }))
  }

  const handleSavePlant = async (values: PlantFormValues) => {
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setErrorMsg("")
    setSuccessMsg("")

    const payloadBody = {
      code: dialogState.formData.code,
      name: dialogState.formData.name,
      ageYear: dialogState.formData.ageYear,
      price: dialogState.formData.price,
      stock: dialogState.formData.stock,
      status: dialogState.formData.status,
      description: dialogState.formData.description,
      images: dialogState.formData.images?.length
        ? dialogState.formData.images
        : dialogState.formData.imageUrl
          ? [dialogState.formData.imageUrl]
          : [],
    }

    try {
      if (dialogState.mode === "create") {
        const res = await fetchApi("/admin/catalog/plants", {
          method: "POST",
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || t("messages.errorOccurred"),
          }))
        } else {
          setPlants((prev) => [payload.data, ...prev])
          setSuccessMsg(t("messages.createSuccess"))
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      } else {
        if (!dialogState.selectedPlant) return
        const res = await fetchApi(
          `/admin/catalog/plants/${dialogState.selectedPlant.id}`,
          {
            method: "PUT",
            body: JSON.stringify({
              name: dialogState.formData.name,
              ageYear: dialogState.formData.ageYear,
              price: dialogState.formData.price,
              stock: dialogState.formData.stock,
              status: dialogState.formData.status,
              description: dialogState.formData.description,
              images: dialogState.formData.images?.length
                ? dialogState.formData.images
                : dialogState.formData.imageUrl
                  ? [dialogState.formData.imageUrl]
                  : [],
            }),
          }
        )

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || t("messages.errorOccurred"),
          }))
        } else {
          setPlants((prev) =>
            prev.map((p) =>
              p.id === dialogState.selectedPlant!.id
                ? { ...p, ...payload.data }
                : p
            )
          )
          setSuccessMsg(t("messages.updateSuccess"))
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: t("messages.networkError") }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  return {
    plants,
    filteredPlants,
    searchQuery,
    setSearchQuery,
    statusFilter,
    ageTab,
    setAgeTab,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedPlantIds,
    confirmState,
    setConfirmState,
    dialogState,
    setDialogState,
    cropState,
    setCropState,
    handlePageChange,
    handleStatusFilterChange,
    handleToggleSelect,
    handleToggleAll,
    handleBulkDelete,
    handleDelete,
    openCreateDialog,
    openEditDialog,
    handleImageFileChange,
    handleCropComplete,
    handleCropSubmit,
    handleFormChange,
    handleSelectStatus,
    handleSavePlant,
  }
}
