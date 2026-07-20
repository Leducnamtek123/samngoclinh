"use client"

import { useState, useEffect, useCallback } from "react"
import { useEvent } from "@/hooks/use-event"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"

interface Garden {
  id: string
  code: string
  name: string
  status: string
  totalBeds: number
  activeBeds: number
  totalTrees: number
  createdAt: string
  location?: string
  description?: string
  area?: number
  images?: string[]
  latitude?: number
  longitude?: number
  managerName?: string
  managerPhone?: string
  establishedAt?: string
  maxBeds?: number
  metadata?: any
}

interface UseGardensManagerProps {
  initialGardens: Garden[]
  initialError?: string
}

export function useGardensManager({ initialGardens, initialError }: UseGardensManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [gardens, setGardens] = useState<Garden[]>(initialGardens)

  // URL search query param state
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Sync state with props
  useEffect(() => {
    setGardens(initialGardens)
  }, [initialGardens])

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
    if (searchVal !== currentSearch) {
      router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal, onSearch])

  const handlePageChange = (newPage: number) => {
    router.push(`${pathname}?${createQueryString({ page: newPage.toString() })}`)
  }
  
  // Selection state
  const [selectedGardenIds, setSelectedGardenIds] = useState<string[]>([])

  // Consolidated Confirmation Dialog State
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

  // Consolidated Dialog & Form State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedGarden: Garden | null
    loading: boolean
    error: string
    formData: {
      name: string
      location: string
      description: string
      area: string
      latitude: string
      longitude: string
      managerName: string
      managerPhone: string
      establishedAt: string
      maxBeds: string
    }
  }>({
    isOpen: false,
    mode: "create",
    selectedGarden: null,
    loading: false,
    error: "",
    formData: {
      name: "",
      location: "",
      description: "",
      area: "",
      latitude: "",
      longitude: "",
      managerName: "",
      managerPhone: "",
      establishedAt: "",
      maxBeds: "",
    }
  })

  const filteredGardens = gardens

  const handleToggleSelect = (id: string) => {
    setSelectedGardenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredGardens.map((g) => g.id)
    const isAllSelected = allFilteredIds.every((id) => new Set(selectedGardenIds).has(id))

    if (isAllSelected) {
      setSelectedGardenIds((prev) => { const set = new Set(allFilteredIds); return prev.filter((id) => !set.has(id)) })
    } else {
      setSelectedGardenIds((prev) => Array.from(new Set([...prev, ...allFilteredIds])))
    }
  }

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedGarden: null,
      loading: false,
      error: "",
      formData: {
        name: "",
        location: "Kon Tum",
        description: "",
        area: "",
        latitude: "",
        longitude: "",
        managerName: "",
        managerPhone: "",
        establishedAt: "",
        maxBeds: "",
      }
    })
  }

  const handleOpenEdit = (garden: Garden) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedGarden: garden,
      loading: false,
      error: "",
      formData: {
        name: garden.name,
        location: garden.location || "",
        description: garden.description || "",
        area: garden.area !== undefined && garden.area !== null ? String(garden.area) : "",
        latitude: garden.latitude !== undefined && garden.latitude !== null ? String(garden.latitude) : "",
        longitude: garden.longitude !== undefined && garden.longitude !== null ? String(garden.longitude) : "",
        managerName: garden.managerName || "",
        managerPhone: garden.managerPhone || "",
        establishedAt: garden.establishedAt ? garden.establishedAt.substring(0, 10) : "",
        maxBeds: garden.maxBeds !== undefined && garden.maxBeds !== null ? String(garden.maxBeds) : "",
      }
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dialogState.formData.name.trim()) {
      setDialogState((prev) => ({ ...prev, error: "Tên khu vườn không được để trống" }))
      return
    }

    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setSuccessMsg("")

    try {
      const payloadBody = {
        name: dialogState.formData.name,
        location: dialogState.formData.location || undefined,
        description: dialogState.formData.description || undefined,
        area: dialogState.formData.area ? parseFloat(dialogState.formData.area) : undefined,
        latitude: dialogState.formData.latitude ? parseFloat(dialogState.formData.latitude) : undefined,
        longitude: dialogState.formData.longitude ? parseFloat(dialogState.formData.longitude) : undefined,
        managerName: dialogState.formData.managerName || undefined,
        managerPhone: dialogState.formData.managerPhone || undefined,
        establishedAt: dialogState.formData.establishedAt ? new Date(dialogState.formData.establishedAt).toISOString() : undefined,
        maxBeds: dialogState.formData.maxBeds ? parseInt(dialogState.formData.maxBeds) : undefined,
      }

      if (dialogState.mode === "create") {
        const res = await fetchApi("/user/cultivation/gardens", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadBody),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({ ...prev, error: payload?.message || "Không thể tạo khu vườn" }))
        } else {
          setGardens((prev) => [payload.data, ...prev])
          setSuccessMsg("Đã tạo khu vườn thành công!")
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      } else if (dialogState.mode === "edit" && dialogState.selectedGarden) {
        const res = await fetchApi(`/user/cultivation/gardens/${dialogState.selectedGarden.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payloadBody),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({ ...prev, error: payload?.message || "Không thể cập nhật khu vườn" }))
        } else {
          setGardens((prev) =>
            prev.map((g) => (g.id === dialogState.selectedGarden!.id ? payload.data : g))
          )
          setSuccessMsg("Đã cập nhật khu vườn thành công!")
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: "Lỗi kết nối máy chủ" }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/gardens/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa khu vườn. Vui lòng kiểm tra xem vườn còn luống không.")
      } else {
        setGardens((prev) => prev.filter((g) => g.id !== id))
        setSuccessMsg("Xóa khu vườn thành công!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi xóa")
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    const garden = gardens.find((g) => g.id === id)
    setConfirmDialog({
      isOpen: true,
      title: "Xóa khu vườn này?",
      description: `Hành động này sẽ xóa vĩnh viễn khu vườn "${garden?.name || ""}" (${garden?.code || ""}) khỏi hệ thống. Bạn không thể hoàn tác thao tác này.`,
      action: () => performDelete(id),
      loading: false,
    })
  }

  const performBulkDelete = async () => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    let successCount = 0
    let failCount = 0

    await Promise.all(
      selectedGardenIds.map(async (id) => {
        try {
          const res = await fetchApi(`/user/cultivation/gardens/${id}`, {
            method: "DELETE",
          })
          if (res.status < 400) {
            successCount++
          } else {
            failCount++
          }
        } catch (e) {
          failCount++
        }
      })
    )

    if (successCount > 0) {
      setGardens((prev) => { const set = new Set(selectedGardenIds); return prev.filter((g) => !set.has(g.id)) })
      setSelectedGardenIds([])
      setSuccessMsg(`Đã xóa thành công ${successCount} khu vườn!`)
      if (failCount > 0) {
        setErrorMsg(`Không thể xóa ${failCount} khu vườn vì chúng vẫn còn chứa luống sâm.`)
      }
    } else {
      setErrorMsg("Không thể xóa các khu vườn đã chọn vì chúng vẫn còn chứa luống sâm.")
    }

    setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
  }

  const handleBulkDelete = () => {
    if (selectedGardenIds.length === 0) return
    setConfirmDialog({
      isOpen: true,
      title: "Xóa các khu vườn đã chọn?",
      description: `Hành động này sẽ xóa vĩnh viễn ${selectedGardenIds.length} khu vườn được chọn khỏi hệ thống. Các khu vườn chứa luống sâm sẽ không bị xóa.`,
      action: () => performBulkDelete(),
      loading: false,
    })
  }

  return {
    gardens,
    filteredGardens,
    searchVal,
    setSearchVal,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedGardenIds,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    handleToggleSelect,
    handleToggleAll,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    handleBulkDelete,
    handlePageChange,
  }
}
