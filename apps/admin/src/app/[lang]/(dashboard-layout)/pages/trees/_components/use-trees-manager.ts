"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { TreeFormValues } from "@/schemas/tree-schema"
import type { AdminUser, Bed, PaginationMeta, Tree } from "@/types"

import { fetchApi } from "@/lib/api"

import { useEvent } from "@/hooks/use-event"
import { useTranslation } from "@/providers/i18n-provider"

export type { Bed, Tree }

const safeIsoDate = (val?: string) => {
  if (!val || typeof val !== "string" || val.trim() === "") return undefined
  const d = new Date(val)
  return isNaN(d.getTime()) ? undefined : d.toISOString()
}

interface UseTreesManagerProps {
  initialTrees: Tree[]
  beds: Bed[]
  initialError?: string
}

export function useTreesManager({
  initialTrees,
  beds,
  initialError,
}: UseTreesManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { t } = useTranslation()

  const [trees, setTrees] = useState<Tree[]>(initialTrees)
  const [users, setUsers] = useState<AdminUser[]>([])

  // URL search query param state
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Fetch users for owner assignment
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await fetchApi("/admin/user/list?perPage=100")
        if (res.ok) {
          const payload = await res.json()
          const list = Array.isArray(payload.data)
            ? payload.data
            : payload.data?.items || []
          setUsers(list)
        }
      } catch (e: unknown) {
        console.error("Failed to load users for trees dropdown:", e)
      }
    }
    loadUsers()
  }, [])

  // Sync state with props
  useEffect(() => {
    setTrees(initialTrees)
  }, [initialTrees])

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
    router.push(
      `${pathname}?${createQueryString({ page: newPage.toString() })}`
    )
  }

  // Filter handlers
  const handleFilterStatus = (status: string) => {
    router.push(`${pathname}?${createQueryString({ status })}`)
  }

  const handleFilterBed = (bedCode: string) => {
    router.push(`${pathname}?${createQueryString({ bedCode })}`)
  }

  // Selection state
  const [selectedTreeIds, setSelectedTreeIds] = useState<string[]>([])

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
    selectedTree: Tree | null
    loading: boolean
    error: string
    formData: TreeFormValues
  }>({
    isOpen: false,
    mode: "create",
    selectedTree: null,
    loading: false,
    error: "",
    formData: {
      name: "",
      bedCode: "none",
      ownerUserId: "",
      ageYear: 1,
      quantity: 1,
      healthStatus: "Tốt",
      plantedAt: new Date().toISOString().substring(0, 10),
      lastCareDate: "",
      nextCareDate: "",
      expectedHarvestAt: "",
      priceBought: "",
      status: "active",
    },
  })

  const filteredTrees = trees

  const handleToggleSelect = (id: string) => {
    setSelectedTreeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleToggleAll = () => {
    const allFilteredIds = filteredTrees.map((t) => t.id)
    const isAllSelected = allFilteredIds.every((id) =>
      new Set(selectedTreeIds).has(id)
    )

    if (isAllSelected) {
      setSelectedTreeIds((prev) => {
        const set = new Set(allFilteredIds)
        return prev.filter((id) => !set.has(id))
      })
    } else {
      setSelectedTreeIds((prev) =>
        Array.from(new Set([...prev, ...allFilteredIds]))
      )
    }
  }

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedTree: null,
      loading: false,
      error: "",
      formData: {
        name: "",
        bedCode: "none",
        ownerUserId: "",
        ageYear: 1,
        quantity: 1,
        healthStatus: "Tốt",
        plantedAt: new Date().toISOString().substring(0, 10),
        lastCareDate: "",
        nextCareDate: "",
        expectedHarvestAt: "",
        priceBought: "",
        status: "active",
      },
    })
  }

  const handleOpenEdit = (tree: Tree) => {
    const treeRecord = tree as unknown as Record<string, unknown>
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedTree: tree,
      loading: false,
      error: "",
      formData: {
        name: tree.name || "",
        bedCode: tree.bedCode || tree.bed?.code || "none",
        ownerUserId: tree.userId || (treeRecord.ownerUserId as string) || "",
        ageYear: tree.ageYears !== undefined ? tree.ageYears : (treeRecord.ageYear as number) ?? 1,
        quantity: (treeRecord.quantity as number) ?? 1,
        healthStatus: tree.healthStatus || "Tốt",
        plantedAt: tree.plantedDate
          ? tree.plantedDate.substring(0, 10)
          : (treeRecord.plantedAt as string)?.substring(0, 10) || "",
        lastCareDate: (treeRecord.lastCareDate as string)
          ? (treeRecord.lastCareDate as string).substring(0, 10)
          : "",
        nextCareDate: (treeRecord.nextCareDate as string)
          ? (treeRecord.nextCareDate as string).substring(0, 10)
          : "",
        expectedHarvestAt: tree.estimatedHarvestDate
          ? tree.estimatedHarvestDate.substring(0, 10)
          : (treeRecord.expectedHarvestAt as string)?.substring(0, 10) || "",
        priceBought:
          treeRecord.priceBought !== undefined && treeRecord.priceBought !== null
            ? String(treeRecord.priceBought)
            : "",
        status: tree.status || "active",
      },
    })
  }

  const handleSave = async (values: TreeFormValues) => {
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setSuccessMsg("")

    try {
      const payload: Record<string, unknown> = {
        name: values.name,
        ageYear: Number(values.ageYear),
        quantity: Number(values.quantity),
        healthStatus: values.healthStatus,
        plantedAt: safeIsoDate(values.plantedAt),
        lastCareDate: safeIsoDate(values.lastCareDate),
        nextCareDate: safeIsoDate(values.nextCareDate),
        expectedHarvestAt: safeIsoDate(values.expectedHarvestAt),
        priceBought:
          values.priceBought !== undefined &&
          values.priceBought !== null &&
          values.priceBought.trim() !== "" &&
          !isNaN(Number(values.priceBought))
            ? Number(values.priceBought)
            : undefined,
        ownerUserId: values.ownerUserId || undefined,
        status: values.status,
      }
      if (values.bedCode && values.bedCode !== "none") {
        payload.bedCode = values.bedCode
      }

      if (dialogState.mode === "create") {
        const res = await fetchApi("/user/cultivation/trees", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const dataPayload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: dataPayload?.message || t("messages.errorOccurred"),
          }))
        } else {
          setTrees((prev) => [dataPayload.data, ...prev])
          setSuccessMsg(t("trees.notifications.createSuccess"))
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      } else if (dialogState.mode === "edit" && dialogState.selectedTree) {
        const res = await fetchApi(
          `/user/cultivation/trees/${dialogState.selectedTree.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )
        const dataPayload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: dataPayload?.message || t("messages.errorOccurred"),
          }))
        } else {
          setTrees((prev) =>
            prev.map((item) =>
              item.id === dialogState.selectedTree!.id ? dataPayload.data : item
            )
          )
          setSuccessMsg(t("trees.notifications.updateSuccess"))
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      }
    } catch (err: unknown) {
      console.error(err)
      setDialogState((prev) => ({
        ...prev,
        error: t("messages.errorOccurred"),
      }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/trees/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const dataPayload = await res.json()
        setErrorMsg(
          dataPayload?.message || t("trees.notifications.deleteError")
        )
      } else {
        setTrees((prev) => prev.filter((item) => item.id !== id))
        setSuccessMsg(t("trees.notifications.deleteSuccess"))
      }
    } catch (err: unknown) {
      console.error(err)
      setErrorMsg(t("trees.notifications.deleteError"))
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    const tree = trees.find((item) => item.id === id)
    setConfirmDialog({
      isOpen: true,
      title: t("trees.confirm.deleteTitle"),
      description: `${t("trees.confirm.deleteDesc")} "${tree?.name || ""}" (${tree?.code || ""}).`,
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
      selectedTreeIds.map(async (id) => {
        try {
          const res = await fetchApi(`/user/cultivation/trees/${id}`, {
            method: "DELETE",
          })
          if (res.status < 400) {
            successCount++
          } else {
            failCount++
          }
        } catch {
          failCount++
        }
      })
    )

    if (successCount > 0) {
      setTrees((prev) => {
        const set = new Set(selectedTreeIds)
        return prev.filter((item) => !set.has(item.id))
      })
      setSelectedTreeIds([])
      setSuccessMsg(`Đã xóa thành công ${successCount} cây sâm!`)
      if (failCount > 0) {
        setErrorMsg(`Không thể xóa ${failCount} cây sâm.`)
      }
    } else {
      setErrorMsg(t("trees.notifications.deleteError"))
    }

    setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
  }

  const handleBulkDelete = () => {
    if (selectedTreeIds.length === 0) return
    setConfirmDialog({
      isOpen: true,
      title: t("trees.confirm.deleteTitle"),
      description: `${t("trees.confirm.deleteDesc")} ${selectedTreeIds.length} cây sâm đã chọn.`,
      action: () => performBulkDelete(),
      loading: false,
    })
  }

  return {
    trees,
    filteredTrees,
    beds,
    users,
    searchVal,
    setSearchVal,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    selectedTreeIds,
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
    handleFilterStatus,
    handleFilterBed,
  }
}
