"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import type { TreeFormValues } from "@/schemas/tree-schema"

import { fetchApi } from "@/lib/api"

import { useEvent } from "@/hooks/use-event"
import { useTranslation } from "@/providers/i18n-provider"

interface Tree {
  id: string
  code: string
  name: string
  ageYear: number
  quantity: number
  status: string
  bedCode?: string
  ownerUserId?: string
  carePackageCode?: string
  carePackageExpiredAt?: string
  protectionPackageCode?: string
  protectionPackageExpiredAt?: string
  plantedAt?: string
  healthStatus?: string
  lastCareDate?: string
  nextCareDate?: string
  expectedHarvestAt?: string
  images?: string[]
  priceBought?: number
  metadata?: any
}

interface Bed {
  id: string
  code: string
  name: string
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
  const [users, setUsers] = useState<any[]>([])

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const statusFilter = searchParams.get("status") || "all"

  // Sync trees on props change
  useEffect(() => {
    setTrees(initialTrees)
  }, [initialTrees])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchApi("/admin/user/list?page=1&perPage=100")
        const payload = await res.json()
        if (res.status < 400) {
          const list = Array.isArray(payload.data)
            ? payload.data
            : payload.data?.data || []
          setUsers(list)
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    fetchUsers()
  }, [])

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

  const getOwnerName = (userId: string | undefined) => {
    if (!userId) return "System"
    const matched = users.find((u) => u.id === userId)
    return matched
      ? `${matched.firstName || ""} ${matched.lastName || ""} (${matched.username || matched.email})`.trim()
      : userId
  }

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

  // Dialog & Form state
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedTree: Tree | null
    loading: boolean
    error: string
    formData: {
      name: string
      ageYear: number
      quantity: number
      bedCode: string
      status: string
      healthStatus: string
      plantedAt: string
      lastCareDate: string
      nextCareDate: string
      expectedHarvestAt: string
      priceBought: string
      ownerUserId: string
    }
  }>({
    isOpen: false,
    mode: "create",
    selectedTree: null,
    loading: false,
    error: "",
    formData: {
      name: "",
      ageYear: 1,
      quantity: 1,
      bedCode: "none",
      status: "active",
      healthStatus: "healthy",
      plantedAt: "",
      lastCareDate: "",
      nextCareDate: "",
      expectedHarvestAt: "",
      priceBought: "",
      ownerUserId: "",
    },
  })

  const filteredTrees = trees

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedTree: null,
      loading: false,
      error: "",
      formData: {
        name: "Sâm Ngọc Linh",
        ageYear: 3,
        quantity: 10,
        bedCode: beds[0]?.code || "none",
        status: "active",
        healthStatus: "healthy",
        plantedAt: new Date().toISOString().substring(0, 10),
        lastCareDate: "",
        nextCareDate: "",
        expectedHarvestAt: "",
        priceBought: "0",
        ownerUserId: "",
      },
    })
  }

  const handleOpenEdit = (tree: Tree) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedTree: tree,
      loading: false,
      error: "",
      formData: {
        name: tree.name,
        ageYear: tree.ageYear,
        quantity: tree.quantity,
        bedCode: tree.bedCode || "none",
        status: tree.status,
        healthStatus: tree.healthStatus || "healthy",
        plantedAt: tree.plantedAt ? tree.plantedAt.substring(0, 10) : "",
        lastCareDate: tree.lastCareDate
          ? tree.lastCareDate.substring(0, 10)
          : "",
        nextCareDate: tree.nextCareDate
          ? tree.nextCareDate.substring(0, 10)
          : "",
        expectedHarvestAt: tree.expectedHarvestAt
          ? tree.expectedHarvestAt.substring(0, 10)
          : "",
        priceBought:
          tree.priceBought !== undefined && tree.priceBought !== null
            ? String(tree.priceBought)
            : "",
        ownerUserId: tree.ownerUserId || "",
      },
    })
  }

  const handleSave = async (values: TreeFormValues) => {
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setSuccessMsg("")

    try {
      const payload: any = {
        name: values.name,
        ageYear: Number(values.ageYear),
        quantity: Number(values.quantity),
        healthStatus: values.healthStatus,
        plantedAt: values.plantedAt
          ? new Date(values.plantedAt).toISOString()
          : undefined,
        lastCareDate: values.lastCareDate
          ? new Date(values.lastCareDate).toISOString()
          : undefined,
        nextCareDate: values.nextCareDate
          ? new Date(values.nextCareDate).toISOString()
          : undefined,
        expectedHarvestAt: values.expectedHarvestAt
          ? new Date(values.expectedHarvestAt).toISOString()
          : undefined,
        priceBought: values.priceBought
          ? parseInt(values.priceBought)
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
          setSuccessMsg(t("messages.createSuccess"))
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
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
            prev.map((t) =>
              t.id === dialogState.selectedTree!.id ? dataPayload.data : t
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

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/trees/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || t("messages.errorOccurred"))
      } else {
        setTrees((prev) => prev.filter((t) => t.id !== id))
        setSuccessMsg(t("messages.deleteSuccess"))
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(t("messages.networkError"))
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("common.confirmations.deleteTitle"),
      description: t("common.confirmations.deleteDescription"),
      action: () => performDelete(id),
      loading: false,
    })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setDialogState((prev) => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: type === "number" ? parseInt(value) || 0 : value,
      },
    }))
  }

  return {
    trees,
    filteredTrees,
    searchQuery,
    setSearchQuery,
    statusFilter,
    users,
    getOwnerName,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    handlePageChange,
    handleStatusFilterChange,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    handleFormChange,
  }
}
