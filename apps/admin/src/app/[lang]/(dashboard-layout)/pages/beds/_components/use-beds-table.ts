"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import type { LocaleType } from "@/types"

export interface Bed {
  id: string
  code: string
  gardenCode: string
  name: string
  ageYear: number
  treeCount: number
  status: string
  createdAt: string
  maxTrees?: number
  width?: number
  length?: number
  soilType?: string
  lastFertilizedAt?: string
  lastWateredAt?: string
  description?: string
}

export interface CultivationBedLocation {
  id: string
  code: string
  bedCode: string
  row: number
  col: number
  status: string // 'empty', 'planted', 'inactive'
  treeCode?: string
}

export interface Tree {
  id: string
  code: string
  name: string
  ageYear: number
  quantity: number
  status: string
  healthStatus: string // 'healthy', 'sick', 'dead'
  plantedAt?: string
  lastCareDate?: string
  nextCareDate?: string
  expectedHarvestAt?: string
  priceBought?: number
  ownerUserId?: string
  bedCode?: string
}

export interface Garden {
  id: string
  code: string
  name: string
}

export function useBedsTable(
  initialBeds: Bed[],
  metadata: any,
  gardens: Garden[],
  initialError?: string
) {
  const router = useRouter()
  const params = useParams()
  const locale = params.lang as LocaleType
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [beds, setBeds] = useState<Bed[]>(initialBeds)
  const [prevInitialBeds, setPrevInitialBeds] = useState<Bed[]>(initialBeds)
  const [prevMetadata, setPrevMetadata] = useState<typeof metadata>(metadata)

  // URL-based search & filter states
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"
  const gardenFilter = searchParams.get("gardenCode") || "all"

  // Ref-based metadata to avoid triggering re-renders (rerender-state-only-in-handlers)
  const localMetadataRef = useRef(metadata)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Grouped confirmation dialog states (prefer-useReducer)
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    loading: false,
  })

  // Grouped Bed Create/Edit dialog states (prefer-useReducer)
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    selectedBed: null as Bed | null,
    loading: false,
    error: "",
  })

  // Form state for Bed Create/Edit
  const [formData, setFormData] = useState({
    name: "",
    gardenCode: gardens[0]?.code || "",
    ageYear: 1,
    treeCount: 0,
    maxTrees: 100,
    width: "",
    length: "",
    soilType: "",
    lastFertilizedAt: "",
    lastWateredAt: "",
    description: "",
  })

  // Selected Bed Code (Dashboard State)
  const [selectedBedCode, setSelectedBedCode] = useState<string>(initialBeds[0]?.code || "")
  const [activeTab, setActiveTab] = useState<"grid" | "trees" | "overview" | "logs">("grid")
  const [locations, setLocations] = useState<CultivationBedLocation[]>([])
  const [trees, setTrees] = useState<Tree[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loadingGrid, setLoadingGrid] = useState(false)
  const [gridRows, setGridRows] = useState(8)
  const [gridCols, setGridCols] = useState(10)

  // Filters for Grid
  const [searchGridQuery, setSearchGridQuery] = useState("")
  const [gridHealthFilter, setGridHealthFilter] = useState("all")
  const [gridStatusFilter, setGridStatusFilter] = useState("all")
  const [gridCustomerFilter, setGridCustomerFilter] = useState("all")
  const [onlyEmpty, setOnlyEmpty] = useState(false)

  // Selected cell & right sidebar details
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null)
  const [selectedTreeDetails, setSelectedTreeDetails] = useState<any | null>(null)
  const [selectedTreeCareLogs, setSelectedTreeCareLogs] = useState<any[]>([])
  const [loadingTreeDetails, setLoadingTreeDetails] = useState(false)

  // Zoom & Pan states
  const [zoomScale, setZoomScale] = useState(100) // percent
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })

  // Sidebar collapsibility
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  // QR Dialog state
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const [qrCodeData, setQrCodeData] = useState("")

  // Tooltip details on hover
  const [hoveredCell, setHoveredCell] = useState<CultivationBedLocation | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Sync beds and metadata state when initialBeds/metadata changes during rendering
  if (initialBeds !== prevInitialBeds) {
    setPrevInitialBeds(initialBeds)
    setBeds(initialBeds)
    if (initialBeds.length > 0) {
      if (!initialBeds.some((b) => b.code === selectedBedCode)) {
        setSelectedBedCode(initialBeds[0].code)
      }
    } else {
      setSelectedBedCode("")
    }
  }

  if (metadata !== prevMetadata) {
    setPrevMetadata(metadata)
  }

  useEffect(() => {
    localMetadataRef.current = metadata
  }, [metadata])

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
    if (loadingMore || !localMetadataRef.current || !localMetadataRef.current.hasNext) return
    setLoadingMore(true)
    try {
      const nextPage = localMetadataRef.current.page + 1

      const queryParams = new URLSearchParams()
      queryParams.append("page", nextPage.toString())
      queryParams.append("perPage", (localMetadataRef.current.perPage || 10).toString())
      if (searchVal) queryParams.append("search", searchVal)
      if (statusFilter && statusFilter !== "all") queryParams.append("status", statusFilter)
      if (gardenFilter && gardenFilter !== "all") queryParams.append("gardenCode", gardenFilter)

      const res = await fetchApi(`/user/cultivation/beds?${queryParams.toString()}`)
      const payload = await res.json()
      if (res.status < 400 && payload.data) {
        const newBeds = Array.isArray(payload.data) ? payload.data : []
        setBeds((prev) => {
          const existingIds = new Set(prev.map((b) => b.id))
          const filteredNew = newBeds.filter((b) => !existingIds.has(b.id))
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

  // Fetch users & initial trees on mount
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

  // Load locations & trees whenever active bed changes
  useEffect(() => {
    if (selectedBedCode) {
      loadBedLocations(selectedBedCode)
    }
  }, [selectedBedCode])

  const loadBedLocations = async (bedCode: string) => {
    setLoadingGrid(true)
    setSelectedLocationId(null)
    setSelectedTreeDetails(null)
    setSelectedTreeCareLogs([])
    try {
      // 1. Fetch grid cells
      const locRes = await fetchApi(`/user/cultivation/beds/${bedCode}/locations`)
      const locPayload = await locRes.json()
      if (locRes.status < 400 && Array.isArray(locPayload.data)) {
        setLocations(locPayload.data)
      }

      // 2. Fetch all trees
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
  }

  const getCellTree = (treeCode?: string) => {
    if (!treeCode) return null
    return trees.find((t) => t.code === treeCode) || null
  }

  const getOwnerName = (userId: string | undefined) => {
    if (!userId) return "Chưa có chủ"
    const matched = users.find((u) => u.id === userId)
    return matched ? (matched.name || matched.username) : "Khách hàng"
  }

  const handleCellClick = async (loc: CultivationBedLocation) => {
    setSelectedLocationId(loc.id)
    setSelectedTreeDetails(null)
    setSelectedTreeCareLogs([])

    if (loc.status === "planted" && loc.treeCode) {
      setLoadingTreeDetails(true)
      const matchedTree = trees.find((t) => t.code === loc.treeCode)
      try {
        const detailRes = await fetchApi(`/user/cultivation/care-logs?treeCode=${loc.treeCode}`)
        const detailPayload = await detailRes.json()

        setSelectedTreeDetails({
          code: loc.treeCode,
          name: matchedTree?.name || "Sâm Ngọc Linh",
          ageYear: matchedTree?.ageYear || activeBed?.ageYear || 3,
          healthStatus: matchedTree?.healthStatus || "healthy",
          plantedAt: matchedTree?.plantedAt || "",
          ownerUserId: matchedTree?.ownerUserId || "",
          priceBought: matchedTree?.priceBought || 0,
          quantity: matchedTree?.quantity || 1,
          lastCareDate: matchedTree?.lastCareDate || "",
          nextCareDate: matchedTree?.nextCareDate || "",
          expectedHarvestAt: matchedTree?.expectedHarvestAt || "",
        })

        if (detailRes.status < 400 && Array.isArray(detailPayload.data)) {
          setSelectedTreeCareLogs(detailPayload.data)
        }
      } catch (e) {
        console.error("Error fetching cell details:", e)
      } finally {
        setLoadingTreeDetails(false)
      }
    }
  }

  const handleSingleWatering = async (loc: CultivationBedLocation) => {
    const tree = getCellTree(loc.treeCode)
    if (!tree) return

    setLoadingTreeDetails(true)
    try {
      await fetchApi("/user/cultivation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedCode: selectedBedCode,
          treeCode: tree.code,
          action: "watering",
          title: "Tưới nước định kỳ",
          description: `Thực hiện tưới nước cho gốc sâm ${tree.code} tại vị trí H${loc.row + 1} - C${loc.col + 1}.`,
          status: "good",
        }),
      })

      const treeRes = await fetchApi(`/user/cultivation/trees/${tree.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          healthStatus: "healthy",
        }),
      })

      if (treeRes.status < 400) {
        setSuccessMsg(`Đã tưới nước thành công cho gốc sâm ${tree.code}!`)
        loadBedLocations(selectedBedCode)
        handleCellClick(loc)
      } else {
        setErrorMsg("Không thể cập nhật trạng thái sức khỏe cây.")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Có lỗi xảy ra khi thực hiện tưới nước.")
    } finally {
      setLoadingTreeDetails(false)
    }
  }

  const handleSingleFertilizing = async (loc: CultivationBedLocation) => {
    const tree = getCellTree(loc.treeCode)
    if (!tree) return

    setLoadingTreeDetails(true)
    try {
      await fetchApi("/user/cultivation/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bedCode: selectedBedCode,
          treeCode: tree.code,
          action: "fertilizing",
          title: "Bón phân hữu cơ",
          description: `Thực hiện bón phân vi sinh cho gốc sâm ${tree.code} tại vị trí H${loc.row + 1} - C${loc.col + 1}.`,
          status: "good",
        }),
      })

      const treeRes = await fetchApi(`/user/cultivation/trees/${tree.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          healthStatus: "healthy",
        }),
      })

      if (treeRes.status < 400) {
        setSuccessMsg(`Đã bón phân thành công cho gốc sâm ${tree.code}!`)
        loadBedLocations(selectedBedCode)
        handleCellClick(loc)
      } else {
        setErrorMsg("Không thể cập nhật trạng thái cây.")
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Có lỗi xảy ra khi thực hiện bón phân.")
    } finally {
      setLoadingTreeDetails(false)
    }
  }

  const handleBulkWatering = async () => {
    if (!activeBed) return
    setLoadingGrid(true)
    try {
      const sickTrees = trees.filter(t => t.bedCode === selectedBedCode && t.healthStatus !== "healthy")
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

      setSuccessMsg(`Đã tưới nước hàng loạt thành công cho ${successCount} gốc sâm!`)
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

  const handlePrintQR = (code: string) => {
    setQrCodeData(code)
    setIsQrDialogOpen(true)
  }

  const handleGenerateGrid = async () => {
    if (!activeBed) return
    setLoadingGrid(true)
    try {
      const res = await fetchApi(`/user/cultivation/beds/${activeBed.code}/locations/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows: gridRows,
          cols: gridCols,
        }),
      })
      if (res.status < 400) {
        setSuccessMsg(`Đã khởi tạo lưới sơ đồ ${gridRows}x${gridCols} thành công!`)
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

  const handleDrop = async (e: React.DragEvent, destLoc: CultivationBedLocation) => {
    e.preventDefault()
    if (destLoc.status !== "empty") return

    try {
      const rawData = e.dataTransfer.getData("application/json")
      if (!rawData) return
      const sourceLoc = JSON.parse(rawData) as CultivationBedLocation

      if (sourceLoc.id === destLoc.id) return

      setLoadingGrid(true)
      const res = await fetchApi(`/user/cultivation/locations/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceLocationId: sourceLoc.id,
          destLocationId: destLoc.id,
        }),
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể di chuyển vị trí cây.")
      } else {
        setSuccessMsg(`Đã di chuyển cây sâm ${sourceLoc.treeCode} thành công!`)
        loadBedLocations(selectedBedCode)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi khi kéo thả di chuyển vị trí.")
    } finally {
      setLoadingGrid(false)
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest(".grid-cell-btn")) return
    setIsPanning(true)
    panStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPanOffset({
      x: e.clientX - panStartRef.current.x,
      y: e.clientY - panStartRef.current.y,
    })
  }

  const handleMouseUpOrLeave = () => {
    setIsPanning(false)
  }

  const zoomIn = () => setZoomScale((prev) => Math.min(prev + 10, 200))
  const zoomOut = () => setZoomScale((prev) => Math.max(prev - 10, 50))
  const zoomReset = () => {
    setZoomScale(100)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleSaveBed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setDialogState((prev) => ({ ...prev, error: "Vui lòng nhập tên luống" }))
      return
    }

    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setErrorMsg("")
    setSuccessMsg("")

    const payloadBody = {
      name: formData.name,
      gardenCode: formData.gardenCode,
      ageYear: Number(formData.ageYear),
      treeCount: Number(formData.treeCount),
      maxTrees: Number(formData.maxTrees),
      width: formData.width ? parseFloat(String(formData.width)) : undefined,
      length: formData.length ? parseFloat(String(formData.length)) : undefined,
      soilType: formData.soilType || undefined,
      lastFertilizedAt: formData.lastFertilizedAt ? new Date(formData.lastFertilizedAt).toISOString() : undefined,
      lastWateredAt: formData.lastWateredAt ? new Date(formData.lastWateredAt).toISOString() : undefined,
      description: formData.description || undefined,
    }

    try {
      if (dialogState.mode === "create") {
        const res = await fetchApi("/user/cultivation/beds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({ ...prev, error: payload?.message || "Đã xảy ra lỗi khi tạo luống sâm" }))
        } else {
          setBeds((prev) => [payload.data, ...prev])
          setSuccessMsg(`Đã tạo luống sâm "${formData.name}" thành công!`)
          setSelectedBedCode(payload.data.code)
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      } else {
        if (!dialogState.selectedBed) return
        const res = await fetchApi(`/user/cultivation/beds/${dialogState.selectedBed.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({ ...prev, error: payload?.message || "Đã xảy ra lỗi khi cập nhật luống sâm" }))
        } else {
          setBeds((prev) =>
            prev.map((b) => (b.id === dialogState.selectedBed!.id ? { ...b, ...payload.data } : b))
          )
          setSuccessMsg(`Cập nhật thông tin luống "${formData.name}" thành công!`)
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: "Không thể kết nối đến máy chủ API" }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const handleDeleteBed = (bed: Bed) => {
    setConfirmState({
      isOpen: true,
      title: "Xóa luống sâm?",
      description: `Hành động này sẽ xóa vĩnh viễn luống "${bed.name}" (${bed.code}). Bạn không thể hoàn tác thao tác này. Luống chỉ xóa được khi không có sâm Ngọc Linh.`,
      action: () => performDeleteBed(bed.id),
      loading: false,
    })
  }

  const performDeleteBed = async (id: string) => {
    setConfirmState((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/beds/${id}`, {
        method: "DELETE",
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa luống trồng. Hãy kiểm tra xem luống có chứa cây sâm nào không.")
      } else {
        const remaining = beds.filter((b) => b.id !== id)
        setBeds(remaining)
        setSuccessMsg("Xóa luống trồng thành công!")
        if (remaining.length > 0) {
          setSelectedBedCode(remaining[0].code)
        } else {
          setSelectedBedCode("")
        }
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setConfirmState({
        isOpen: false,
        title: "",
        description: "",
        action: () => {},
        loading: false,
      })
    }
  }

  const handleToggleStatus = async (bed: Bed) => {
    const newStatus = bed.status === "active" ? "inactive" : "active"
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/user/cultivation/beds/${bed.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể cập nhật trạng thái luống.")
      } else {
        setBeds((prev) =>
          prev.map((b) => (b.id === bed.id ? { ...b, status: newStatus } : b))
        )
        setSuccessMsg(`Đã ${newStatus === "active" ? "mở lại" : "tạm ẩn"} luống ${bed.name}!`)
        router.refresh()
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    }
  }

  const openCreateDialog = () => {
    setFormData({
      name: "",
      gardenCode: gardens[0]?.code || "",
      ageYear: 3,
      treeCount: 0,
      maxTrees: 100,
      width: "2",
      length: "10",
      soilType: "Đất mùn rừng",
      lastFertilizedAt: "",
      lastWateredAt: "",
      description: "",
    })
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedBed: null,
      loading: false,
      error: "",
    })
  }

  const openEditDialog = (bed: Bed) => {
    setFormData({
      name: bed.name,
      gardenCode: bed.gardenCode,
      ageYear: bed.ageYear,
      treeCount: bed.treeCount,
      maxTrees: bed.maxTrees || 100,
      width: bed.width !== undefined && bed.width !== null ? String(bed.width) : "",
      length: bed.length !== undefined && bed.length !== null ? String(bed.length) : "",
      soilType: bed.soilType || "",
      lastFertilizedAt: bed.lastFertilizedAt ? bed.lastFertilizedAt.substring(0, 10) : "",
      lastWateredAt: bed.lastWateredAt ? bed.lastWateredAt.substring(0, 10) : "",
      description: bed.description || "",
    })
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedBed: bed,
      loading: false,
      error: "",
    })
  }

  // Filter Grid cells in central view
  const filteredLocations = locations.filter((loc) => {
    const tree = getCellTree(loc.treeCode)

    if (onlyEmpty && loc.status !== "empty") return false

    if (searchGridQuery) {
      const q = searchGridQuery.toLowerCase()
      const treeName = tree?.name.toLowerCase() || ""
      const treeCode = tree?.code.toLowerCase() || ""
      const owner = getOwnerName(tree?.ownerUserId).toLowerCase()
      if (!treeName.includes(q) && !treeCode.includes(q) && !owner.includes(q)) {
        return false
      }
    }

    if (gridHealthFilter !== "all") {
      if (!tree || tree.healthStatus !== gridHealthFilter) return false
    }

    if (gridStatusFilter !== "all" && loc.status !== gridStatusFilter) {
      return false
    }

    if (gridCustomerFilter !== "all") {
      if (!tree || tree.ownerUserId !== gridCustomerFilter) return false
    }

    return true
  })

  // Stats calculation
  const totalGridCells = locations.length
  const healthyCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "healthy").length
  const sickCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "sick").length
  const deadCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "dead").length
  const emptyCount = locations.filter((loc) => loc.status === "empty").length
  const plantedCount = locations.filter((loc) => loc.status === "planted").length

  const filteredBeds = beds

  return {
    beds,
    filteredBeds,
    setBeds,
    searchVal,
    setSearchVal,
    statusFilter,
    gardenFilter,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    deletingId,
    setDeletingId,
    confirmState,
    setConfirmState,
    dialogState,
    setDialogState,
    formData,
    setFormData,
    selectedBedCode,
    setSelectedBedCode,
    activeTab,
    setActiveTab,
    locations,
    setLocations,
    trees,
    setTrees,
    users,
    setUsers,
    loadingGrid,
    setLoadingGrid,
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
    selectedLocationId,
    setSelectedLocationId,
    selectedTreeDetails,
    setSelectedTreeDetails,
    selectedTreeCareLogs,
    setSelectedTreeCareLogs,
    loadingTreeDetails,
    setLoadingTreeDetails,
    zoomScale,
    setZoomScale,
    panOffset,
    setPanOffset,
    isPanning,
    setIsPanning,
    leftSidebarOpen,
    setLeftSidebarOpen,
    rightSidebarOpen,
    setRightSidebarOpen,
    isQrDialogOpen,
    setIsQrDialogOpen,
    qrCodeData,
    setQrCodeData,
    hoveredCell,
    setHoveredCell,
    tooltipPos,
    setTooltipPos,
    activeBed,
    handleScroll,
    handleStatusFilterChange,
    handleGardenFilterChange,
    handleCellClick,
    handleSingleWatering,
    handleSingleFertilizing,
    handleBulkWatering,
    handleBulkFertilizing,
    handlePrintQR,
    handleGenerateGrid,
    handleDrop,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    zoomIn,
    zoomOut,
    zoomReset,
    handleSaveBed,
    handleDeleteBed,
    performDeleteBed,
    handleToggleStatus,
    openCreateDialog,
    openEditDialog,
    filteredLocations,
    totalGridCells,
    healthyCount,
    sickCount,
    deadCount,
    emptyCount,
    plantedCount,
    getCellTree,
    getOwnerName,
    locale,
  }
}
