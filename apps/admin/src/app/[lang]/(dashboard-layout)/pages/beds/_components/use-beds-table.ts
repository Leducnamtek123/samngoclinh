"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation"

import type {
  AdminUser,
  Bed,
  Garden,
  LocaleType,
  PaginationMeta,
  Tree,
} from "@/types"

import { fetchApi } from "@/lib/api"

import { useBedDialogs } from "./use-bed-dialogs"
import { useBedTreeInspector } from "./use-bed-tree-inspector"
import { useBedsCanvas } from "./use-beds-canvas"

export interface CultivationBedLocation {
  id: string
  code: string
  bedCode: string
  row: number
  col: number
  status: string // 'empty', 'planted', 'inactive'
  treeCode?: string
}

export function useBedsTable(
  initialBeds: Bed[],
  metadata: PaginationMeta | null,
  gardens: Garden[],
  initialError?: string
) {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [beds, setBeds] = useState<Bed[]>(initialBeds)

  // URL-based search & filter states
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"
  const gardenFilter = searchParams.get("gardenCode") || "all"

  // Ref-based metadata to avoid triggering re-renders
  const localMetadataRef = useRef(metadata)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Selected Bed Code (Dashboard State)
  const [selectedBedCode, setSelectedBedCode] = useState<string>(
    initialBeds[0]?.code || ""
  )
  const [activeTab, setActiveTab] = useState<
    "grid" | "trees" | "overview" | "logs"
  >("grid")
  const [locations, setLocations] = useState<CultivationBedLocation[]>([])
  const [trees, setTrees] = useState<Tree[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loadingGrid, setLoadingGrid] = useState(false)
  const [gridRows, setGridRows] = useState(8)
  const [gridCols, setGridCols] = useState(10)

  // Filters for Grid
  const [searchGridQuery, setSearchGridQuery] = useState("")
  const [gridHealthFilter, setGridHealthFilter] = useState("all")
  const [gridStatusFilter, setGridStatusFilter] = useState("all")
  const [gridCustomerFilter, setGridCustomerFilter] = useState("all")
  const [onlyEmpty, setOnlyEmpty] = useState(false)

  // Sidebar collapsibility
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  // Sync beds state cleanly via useEffect on initialBeds update (Fixes Finding S-02)
  useEffect(() => {
    setBeds(initialBeds)
    if (initialBeds.length > 0) {
      setSelectedBedCode((current) => {
        if (!current || !initialBeds.some((b) => b.code === current)) {
          return initialBeds[0].code
        }
        return current
      })
    } else {
      setSelectedBedCode("")
    }
  }, [initialBeds])

  useEffect(() => {
    localMetadataRef.current = metadata
  }, [metadata])

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

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchVal !== currentSearch) {
        router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal, searchParams, router, pathname, createQueryString])

  const [loadingMore, setLoadingMore] = useState(false)

  const loadMoreBeds = async () => {
    if (
      loadingMore ||
      !localMetadataRef.current ||
      !localMetadataRef.current.hasNext
    )
      return
    setLoadingMore(true)
    try {
      const nextPage = localMetadataRef.current.page + 1

      const queryParams = new URLSearchParams()
      queryParams.append("page", nextPage.toString())
      queryParams.append(
        "perPage",
        (localMetadataRef.current.perPage || 10).toString()
      )
      if (searchVal) queryParams.append("search", searchVal)
      if (statusFilter && statusFilter !== "all")
        queryParams.append("status", statusFilter)
      if (gardenFilter && gardenFilter !== "all")
        queryParams.append("gardenCode", gardenFilter)

      const res = await fetchApi(
        `/user/cultivation/beds?${queryParams.toString()}`
      )
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        const newBeds: Bed[] = Array.isArray(payload.data?.items)
          ? payload.data.items
          : Array.isArray(payload.data)
            ? payload.data
            : []
        setBeds((prev) => {
          const existingIds = new Set(prev.map((b: Bed) => b.id))
          const filteredNew = newBeds.filter((b: Bed) => !existingIds.has(b.id))
          return [...prev, ...filteredNew]
        })
        localMetadataRef.current = payload.metadata || null
      }
    } catch (e) {
      console.error("Error loading more beds:", e)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 80) {
      loadMoreBeds()
    }
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const handleGardenFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ gardenCode: val })}`)
  }

  // Active Bed object helper
  const activeBed = beds.find((b) => b.code === selectedBedCode)

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchApi("/admin/user/list?perPage=100")
        const payload = await res.json()
        if (res.status < 400 && Array.isArray(payload.data)) {
          setUsers(payload.data)
        }
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }
    fetchUsers()
  }, [])

  const loadBedLocations = useCallback(async (bedCode: string) => {
    setLoadingGrid(true)
    inspector.resetSelection()
    try {
      const locRes = await fetchApi(
        `/user/cultivation/beds/${bedCode}/locations`
      )
      const locPayload = await locRes.json()
      if (locRes.status < 400 && Array.isArray(locPayload.data)) {
        setLocations(locPayload.data)
      }

      const treeRes = await fetchApi("/admin/cultivation/trees?perPage=100")
      const treePayload = await treeRes.json()
      if (treeRes.status < 400 && Array.isArray(treePayload.data)) {
        setTrees(treePayload.data)
      }
    } catch (e) {
      console.error("Error loading bed details:", e)
    } finally {
      setLoadingGrid(false)
    }
  }, [])

  // Composed Sub-Hooks
  const canvas = useBedsCanvas({
    selectedBedCode,
    loadBedLocations,
    setSuccessMsg,
    setErrorMsg,
    setLoadingGrid,
  })

  const dialogs = useBedDialogs({
    gardens,
    setBeds,
    setSelectedBedCode,
    setSuccessMsg,
    setErrorMsg,
  })

  const inspector = useBedTreeInspector({
    trees,
    selectedBedCode,
    activeBedAgeYear: activeBed?.ageYear,
    loadBedLocations,
    setSuccessMsg,
    setErrorMsg,
  })

  // Load locations & trees whenever active bed changes
  useEffect(() => {
    if (selectedBedCode) {
      loadBedLocations(selectedBedCode)
    }
  }, [selectedBedCode, loadBedLocations])

  const getOwnerName = (userId: string | undefined) => {
    if (!userId) return "Chưa có chủ"
    const matched = users.find((u) => u.id === userId)
    return matched ? matched.name || matched.username : "Khách hàng"
  }

  const handleBulkWatering = async () => {
    if (!activeBed) return
    setLoadingGrid(true)
    try {
      const sickTrees = trees.filter(
        (t) => t.bedCode === selectedBedCode && t.healthStatus !== "healthy"
      )
      if (sickTrees.length === 0) {
        setSuccessMsg("Tất cả cây sâm trong luống hiện tại đã khỏe mạnh!")
        setLoadingGrid(false)
        return
      }

      await fetchApi("/user/cultivation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedCode: selectedBedCode,
          action: "watering",
          title: "Tưới nước hàng loạt",
          description: `Thực hiện tưới nước hàng loạt giải cứu ${sickTrees.length} gốc sâm cần chăm sóc.`,
          status: "good",
        }),
      })

      const updatePromises = sickTrees.map(async (tree) => {
        try {
          const res = await fetchApi(`/user/cultivation/trees/${tree.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              healthStatus: "healthy",
            }),
          })
          return res.status < 400
        } catch {
          return false
        }
      })
      const results = await Promise.all(updatePromises)
      const successCount = results.filter(Boolean).length

      setSuccessMsg(
        `Đã tưới nước hàng loạt thành công cho ${successCount} gốc sâm!`
      )
      loadBedLocations(selectedBedCode)
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi khi tưới nước hàng loạt.")
    } finally {
      setLoadingGrid(false)
    }
  }

  const handleBulkFertilizing = async () => {
    if (!activeBed) return
    setLoadingGrid(true)
    try {
      await fetchApi("/user/cultivation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedCode: selectedBedCode,
          action: "fertilizing",
          title: "Bón phân hàng loạt",
          description: `Thực hiện bón phân hữu cơ vi sinh định kỳ cho toàn bộ luống.`,
          status: "good",
        }),
      })

      await fetchApi(`/user/cultivation/beds/${activeBed.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastFertilizedAt: new Date().toISOString(),
        }),
      })

      setSuccessMsg(`Đã bón phân vi sinh hàng loạt thành công cho luống!`)

      const bedRes = await fetchApi("/user/cultivation/beds")
      const bedPayload = await bedRes.json()
      if (bedRes.status < 400 && Array.isArray(bedPayload.data?.items)) {
        setBeds(bedPayload.data.items)
      }
      loadBedLocations(selectedBedCode)
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi khi bón phân hàng loạt.")
    } finally {
      setLoadingGrid(false)
    }
  }

  const handleGenerateGrid = async () => {
    if (!activeBed) return
    setLoadingGrid(true)
    try {
      const res = await fetchApi(
        `/user/cultivation/beds/${activeBed.code}/locations/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rows: gridRows,
            cols: gridCols,
          }),
        }
      )
      if (res.status < 400) {
        setSuccessMsg(
          `Đã khởi tạo lưới sơ đồ ${gridRows}x${gridCols} thành công!`
        )
        loadBedLocations(activeBed.code)
      } else {
        setErrorMsg("Không thể khởi tạo lưới vị trí.")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi kết nối máy chủ khi tạo Grid.")
    } finally {
      setLoadingGrid(false)
    }
  }

  const performDeleteBed = async (id: string) => {
    setDeletingId(id)
    dialogs.setConfirmState((prev) => ({ ...prev, loading: true }))
    try {
      const res = await fetchApi(`/user/cultivation/beds/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa luống sâm")
      } else {
        setBeds((prev) => prev.filter((b) => b.id !== id))
        setSuccessMsg("Đã xóa luống sâm thành công")
        if (activeBed?.id === id) {
          const remaining = beds.filter((b) => b.id !== id)
          setSelectedBedCode(remaining[0]?.code || "")
        }
        dialogs.setConfirmState((prev) => ({ ...prev, isOpen: false }))
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setDeletingId(null)
      dialogs.setConfirmState((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleDeleteBed = (bed: Bed) => {
    dialogs.setConfirmState({
      isOpen: true,
      title: "Xóa luống sâm?",
      description: `Hành động này sẽ xóa vĩnh viễn luống "${bed.name}" (${bed.code}). Bạn không thể hoàn tác thao tác này. Luống chỉ xóa được khi không có sâm Ngọc Linh.`,
      action: () => performDeleteBed(bed.id),
      loading: false,
    })
  }

  const handleToggleStatus = async (bed: Bed) => {
    const newStatus = bed.status === "active" ? "inactive" : "active"
    try {
      const res = await fetchApi(`/user/cultivation/beds/${bed.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(
          payload?.message || "Không thể cập nhật trạng thái luống sâm"
        )
      } else {
        setBeds((prev) =>
          prev.map((b) => (b.id === bed.id ? { ...b, status: newStatus } : b))
        )
        setSuccessMsg(
          `Đã chuyển trạng thái luống thành ${newStatus === "active" ? "Đang hoạt động" : "Tạm dừng"}`
        )
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Lỗi khi kết nối tới máy chủ")
    }
  }

  // Filtered beds list
  const filteredBeds = useMemo(() => {
    return beds.filter((bed) => {
      const matchSearch =
        searchVal === "" ||
        bed.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        bed.code.toLowerCase().includes(searchVal.toLowerCase())
      const matchStatus = statusFilter === "all" || bed.status === statusFilter
      const matchGarden =
        gardenFilter === "all" || bed.gardenCode === gardenFilter
      return matchSearch && matchStatus && matchGarden
    })
  }, [beds, searchVal, statusFilter, gardenFilter])

  // Filtered locations inside active bed
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const tree = inspector.getCellTree(loc.treeCode)
      if (onlyEmpty && loc.status !== "empty") return false
      if (gridStatusFilter !== "all" && loc.status !== gridStatusFilter)
        return false
      if (gridHealthFilter !== "all" && tree?.healthStatus !== gridHealthFilter)
        return false
      if (
        gridCustomerFilter !== "all" &&
        tree?.ownerUserId !== gridCustomerFilter
      )
        return false
      if (searchGridQuery) {
        const q = searchGridQuery.toLowerCase()
        const matchTree = tree?.code?.toLowerCase().includes(q)
        const matchOwner = getOwnerName(tree?.ownerUserId)
          .toLowerCase()
          .includes(q)
        const matchLoc = loc.code.toLowerCase().includes(q)
        if (!matchTree && !matchOwner && !matchLoc) return false
      }
      return true
    })
  }, [
    locations,
    onlyEmpty,
    gridStatusFilter,
    gridHealthFilter,
    gridCustomerFilter,
    searchGridQuery,
    inspector,
  ])

  const totalGridCells = locations.length

  const emptyCount = useMemo(() => {
    return locations.filter((l) => l.status === "empty").length
  }, [locations])

  const plantedCount = useMemo(() => {
    return locations.filter((l) => l.status === "planted").length
  }, [locations])

  // Health summary metrics
  const sickCount = useMemo(() => {
    return trees.filter(
      (t) => t.bedCode === selectedBedCode && t.healthStatus === "sick"
    ).length
  }, [trees, selectedBedCode])

  const deadCount = useMemo(() => {
    return trees.filter(
      (t) => t.bedCode === selectedBedCode && t.healthStatus === "dead"
    ).length
  }, [trees, selectedBedCode])

  return {
    locale,
    beds,
    setBeds,
    selectedBedCode,
    setSelectedBedCode,
    activeBed,
    activeTab,
    setActiveTab,
    locations,
    trees,
    users,
    loadingGrid,
    gridRows,
    setGridRows,
    gridCols,
    setGridCols,
    searchGridQuery,
    setSearchGridQuery,
    gridHealthFilter,
    setGridHealthFilter,
    gridStatusFilter,
    setGridStatusFilter,
    gridCustomerFilter,
    setGridCustomerFilter,
    onlyEmpty,
    setOnlyEmpty,
    filteredLocations,
    totalGridCells,
    emptyCount,
    plantedCount,
    sickCount,
    deadCount,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    searchVal,
    setSearchVal,
    statusFilter,
    gardenFilter,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    deletingId,
    filteredBeds,
    handleStatusFilterChange,
    handleGardenFilterChange,
    handleScroll,
    handleToggleStatus,
    handleDeleteBed,
    handleBulkWatering,
    handleBulkFertilizing,
    handleGenerateGrid,
    loadBedLocations,
    getOwnerName,
    // Composed from canvas sub-hook
    zoomScale: canvas.zoomScale,
    panOffset: canvas.panOffset,
    isPanning: canvas.isPanning,
    hoveredCell: canvas.hoveredCell,
    setHoveredCell: canvas.setHoveredCell,
    tooltipPos: canvas.tooltipPos,
    setTooltipPos: canvas.setTooltipPos,
    handleMouseDown: canvas.handleMouseDown,
    handleMouseMove: canvas.handleMouseMove,
    handleMouseUpOrLeave: canvas.handleMouseUpOrLeave,
    zoomIn: canvas.zoomIn,
    zoomOut: canvas.zoomOut,
    zoomReset: canvas.zoomReset,
    handleDrop: canvas.handleDrop,
    // Composed from dialogs sub-hook
    formData: dialogs.formData,
    setFormData: dialogs.setFormData,
    dialogState: dialogs.dialogState,
    setDialogState: dialogs.setDialogState,
    confirmState: dialogs.confirmState,
    setConfirmState: dialogs.setConfirmState,
    isQrDialogOpen: dialogs.isQrDialogOpen,
    setIsQrDialogOpen: dialogs.setIsQrDialogOpen,
    qrCodeData: dialogs.qrCodeData,
    openCreateDialog: dialogs.openCreateDialog,
    openEditDialog: dialogs.openEditDialog,
    handlePrintQR: dialogs.handlePrintQR,
    handleSaveBed: dialogs.handleSaveBed,
    // Composed from inspector sub-hook
    selectedLocationId: inspector.selectedLocationId,
    selectedTreeDetails: inspector.selectedTreeDetails,
    selectedTreeCareLogs: inspector.selectedTreeCareLogs,
    loadingTreeDetails: inspector.loadingTreeDetails,
    getCellTree: inspector.getCellTree,
    handleCellClick: inspector.handleCellClick,
    handleSingleWatering: inspector.handleSingleWatering,
    handleSingleFertilizing: inspector.handleSingleFertilizing,
  }
}
