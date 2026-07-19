"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation"
import { fetchApi } from "@/lib/api"
import type { LocaleType } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Trash2, Pencil, Eye, EyeOff, Plus, LayoutGrid, Search, Filter, 
  ZoomIn, ZoomOut, Maximize2, Move, Droplets, CheckCircle, 
  AlertTriangle, Skull, Leaf, Activity, Info, Calendar, User, 
  FileText, ChevronRight, ChevronLeft, RefreshCw, QrCode, SlidersHorizontal,
  Flame, Sprout, ShieldAlert
} from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ToastCard, ConfirmationDialog } from "@/components/ui/feedback-components"

interface Bed {
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

interface CultivationBedLocation {
  id: string
  code: string
  bedCode: string
  row: number
  col: number
  status: string // 'empty', 'planted', 'inactive'
  treeCode?: string
}

interface Tree {
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

interface Garden {
  id: string
  code: string
  name: string
}

interface BedsTableProps {
  initialBeds: Bed[]
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  gardens: Garden[]
  errorMsg?: string
}

export function BedsTable({ initialBeds, metadata, gardens, errorMsg: initialError }: BedsTableProps) {
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

  const [localMetadata, setLocalMetadata] = useState(metadata)

  // Sync beds and metadata state when initialBeds/metadata changes
  useEffect(() => {
    setBeds(initialBeds)
    setLocalMetadata(metadata)
    if (initialBeds.length > 0) {
      if (!initialBeds.some((b) => b.code === selectedBedCode)) {
        setSelectedBedCode(initialBeds[0].code)
      }
    } else {
      setSelectedBedCode("")
    }
  }, [initialBeds, metadata])

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

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentSearch = searchParams.get("search") || ""
      if (searchVal !== currentSearch) {
        router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
      }
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal])

  const [loadingMore, setLoadingMore] = useState(false)

  const loadMoreBeds = async () => {
    if (loadingMore || !localMetadata || !localMetadata.hasNext) return
    setLoadingMore(true)
    try {
      const nextPage = localMetadata.page + 1
      
      const queryParams = new URLSearchParams()
      queryParams.append("page", nextPage.toString())
      queryParams.append("perPage", (localMetadata.perPage || 10).toString())
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
        setLocalMetadata(payload.metadata || null)
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
  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Confirmation Dialog States
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("")
  const [confirmDialogDesc, setConfirmDialogDesc] = useState("")
  const [confirmDialogAction, setConfirmDialogAction] = useState<() => void>(() => {})
  const [confirmDialogLoading, setConfirmDialogLoading] = useState(false)

  // Dialog state for Bed Create/Edit
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create")
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null)
  const [dialogLoading, setDialogLoading] = useState(false)
  const [dialogError, setDialogError] = useState("")

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

  const handleSingleWatering = async (loc: CultivationBedLocation) => {
    const tree = getCellTree(loc.treeCode)
    if (!tree) return
    
    setLoadingTreeDetails(true)
    try {
      // 1. Create care log
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

      // 2. Update tree health to healthy
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
      // 1. Create care log
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

      // 2. Update tree health to healthy
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

      let successCount = 0
      for (const tree of sickTrees) {
        const res = await fetchApi(`/user/cultivation/trees/${tree.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            healthStatus: "healthy",
          }),
        })
        if (res.status < 400) successCount++
      }

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

  // HTML5 Drag & Drop handlers to move sâm plants inside grid
  const handleDragStart = (e: React.DragEvent, sourceLoc: CultivationBedLocation) => {
    e.dataTransfer.setData("application/json", JSON.stringify(sourceLoc))
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

      // 1. Move to destination cell
      const destRes = await fetchApi(`/user/cultivation/beds/locations/${destLoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "planted",
          treeCode: sourceLoc.treeCode,
        }),
      })

      // 2. Empty the source cell
      const srcRes = await fetchApi(`/user/cultivation/beds/locations/${sourceLoc.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "empty",
          treeCode: null,
        }),
      })

      if (destRes.status < 400 && srcRes.status < 400) {
        setSuccessMsg("Di chuyển gốc sâm sang vị trí mới thành công!")
        loadBedLocations(selectedBedCode)
      } else {
        setErrorMsg("Không thể cập nhật tọa độ gốc sâm.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi khi kéo thả di chuyển vị trí.")
    } finally {
      setLoadingGrid(false)
    }
  }

  // Mouse Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only pan if we click on background or with middle mouse/ctrl
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

  // Zoom helpers
  const zoomIn = () => setZoomScale((prev) => Math.min(prev + 10, 200))
  const zoomOut = () => setZoomScale((prev) => Math.max(prev - 10, 50))
  const zoomReset = () => {
    setZoomScale(100)
    setPanOffset({ x: 0, y: 0 })
  }

  // Formatting helpers
  const formatDaysAgo = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A"
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days <= 0) return "Hôm nay"
    return `${days} ngày trước`
  }

  const getOwnerName = (userId: string | undefined) => {
    if (!userId) return "Chưa có chủ"
    const matched = users.find((u) => u.id === userId)
    return matched ? (matched.name || matched.username) : "Khách hàng"
  }

  const getInitials = (name: string) => {
    if (!name) return "K"
    const parts = name.trim().split(/\s+/)
    return parts[parts.length - 1].charAt(0).toUpperCase()
  }

  // The list of beds is already filtered by the server
  const filteredBeds = beds

  // Filter Grid cells in central view
  const getCellTree = (treeCode?: string) => {
    if (!treeCode) return null
    return trees.find((t) => t.code === treeCode) || null
  }

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

  // Create / Edit Bed saving
  const handleSaveBed = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name) {
      setDialogError("Vui lòng nhập tên luống")
      return
    }

    setDialogLoading(true)
    setDialogError("")
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
      if (dialogMode === "create") {
        const res = await fetchApi("/user/cultivation/beds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi tạo luống sâm")
        } else {
          setBeds((prev) => [payload.data, ...prev])
          setSuccessMsg(`Đã tạo luống sâm "${formData.name}" thành công!`)
          setSelectedBedCode(payload.data.code)
          setIsDialogOpen(false)
          router.refresh()
        }
      } else {
        if (!selectedBed) return
        const res = await fetchApi(`/user/cultivation/beds/${selectedBed.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        })

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogError(payload?.message || "Đã xảy ra lỗi khi cập nhật luống sâm")
        } else {
          setBeds((prev) =>
            prev.map((b) => (b.id === selectedBed.id ? { ...b, ...payload.data } : b))
          )
          setSuccessMsg(`Cập nhật thông tin luống "${formData.name}" thành công!`)
          setIsDialogOpen(false)
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogError("Không thể kết nối đến máy chủ API")
    } finally {
      setDialogLoading(false)
    }
  }

  const handleDeleteBed = async (bed: Bed) => {
    setConfirmDialogTitle("Xóa luống sâm?")
    setConfirmDialogDesc(`Hành động này sẽ xóa vĩnh viễn luống "${bed.name}" (${bed.code}). Bạn không thể hoàn tác thao tác này. Luống chỉ xóa được khi không có sâm Ngọc Linh.`)
    setConfirmDialogAction(() => () => performDeleteBed(bed.id))
    setConfirmDialogOpen(true)
  }

  const performDeleteBed = async (id: string) => {
    setConfirmDialogLoading(true)
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
      setConfirmDialogOpen(false)
      setConfirmDialogLoading(false)
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
    setDialogMode("create")
    setSelectedBed(null)
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
    setDialogError("")
    setIsDialogOpen(true)
  }

  const openEditDialog = (bed: Bed) => {
    setDialogMode("edit")
    setSelectedBed(bed)
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
    setDialogError("")
    setIsDialogOpen(true)
  }

  // Stats calculation
  const totalGridCells = locations.length
  const healthyCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "healthy").length
  const sickCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "sick").length
  const deadCount = locations.filter((loc) => getCellTree(loc.treeCode)?.healthStatus === "dead").length
  const emptyCount = locations.filter((loc) => loc.status === "empty").length
  const plantedCount = locations.filter((loc) => loc.status === "planted").length

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] min-h-[700px] overflow-hidden bg-slate-50/50 dark:bg-slate-950 p-2 rounded-2xl relative">
      
      {/* 1. LEFT SIDEBAR: Beds list cards */}
      <div className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${
        leftSidebarOpen ? "w-full lg:w-72" : "w-0 lg:w-0 opacity-0 pointer-events-none hidden"
      }`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={() => setLeftSidebarOpen(false)} 
              className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
              title="Thu gọn danh sách"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-slate-800 dark:text-slate-100">Tất cả luống ({beds.length})</h2>
            </div>
          </div>
          <Button 
            onClick={openCreateDialog}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-1 text-[10px] px-2 h-7"
          >
            <Plus className="w-3 h-3" /> Thêm
          </Button>
        </div>

        <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Tìm kiếm luống..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-9 text-xs pl-8 bg-white dark:bg-slate-900 border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {/* Status Filter */}
            <Select 
              value={statusFilter} 
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm ngưng</SelectItem>
              </SelectContent>
            </Select>

            {/* Garden Filter */}
            <Select 
              value={gardenFilter} 
              onValueChange={handleGardenFilterChange}
            >
              <SelectTrigger className="h-8 text-[10px] bg-white dark:bg-slate-900 border-slate-200">
                <SelectValue placeholder="Vườn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vườn</SelectItem>
                {gardens.map((garden) => (
                  <SelectItem key={garden.id} value={garden.code}>
                    {garden.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div 
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50/30 dark:bg-slate-900/30"
        >
          {filteredBeds.length === 0 ? (
            <div className="text-center py-12 text-xs text-muted-foreground">Không tìm thấy luống nào.</div>
          ) : (
            filteredBeds.map((bed) => {
              const isSelected = bed.code === selectedBedCode
              const percentOccupied = bed.maxTrees ? Math.min(100, Math.round((bed.treeCount / bed.maxTrees) * 100)) : 0
              
              // Mock crop segments for visual beauty (Green/Orange/Gray blocks matching picture)
              const blocks = Array.from({ length: 12 }).map((_, i) => {
                if (i < Math.round((bed.treeCount / (bed.maxTrees || 100)) * 12 * 0.8)) return "bg-emerald-500" // healthy
                if (i < Math.round((bed.treeCount / (bed.maxTrees || 100)) * 12)) return "bg-amber-500" // need water
                return "bg-slate-100 dark:bg-slate-800" // empty
              })

              return (
                <div 
                  key={bed.id}
                  onClick={() => setSelectedBedCode(bed.code)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer select-none space-y-3 relative group ${
                    isSelected 
                      ? "border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500/20" 
                      : "border-slate-200/60 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-900 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Sprout className={`h-4 w-4 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">{bed.name}</h3>
                    </div>
                    <Badge variant={bed.status === "active" ? "default" : "secondary"} className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                      bed.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-transparent" : ""
                    }`}>
                      {bed.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  {/* Visual Status Blocks from mockup */}
                  <div className="flex gap-0.5 h-1.5 rounded-full overflow-hidden w-full">
                    {blocks.map((bg, idx) => (
                      <div key={idx} className={`flex-1 ${bg}`}></div>
                    ))}
                  </div>

                  {/* Sức chứa Details */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="font-semibold">{bed.treeCount} / {bed.maxTrees || 100} cây</span>
                    <span>{percentOccupied}%</span>
                  </div>

                  {/* Meta grid layout */}
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px] text-slate-500 dark:text-slate-400 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="truncate">Thổ nhưỡng: <span className="font-semibold text-slate-700 dark:text-slate-300">{bed.soilType || "Đất mùn rừng"}</span></div>
                    <div>Quy hoạch: <span className="font-semibold text-slate-700 dark:text-slate-300">{bed.ageYear} năm</span></div>
                    <div className="truncate text-emerald-600 dark:text-emerald-400">Tưới: <span className="font-semibold">{formatDaysAgo(bed.lastWateredAt)}</span></div>
                    <div className="truncate text-amber-600 dark:text-amber-500">Bón: <span className="font-semibold">{formatDaysAgo(bed.lastFertilizedAt)}</span></div>
                  </div>

                  {/* Card quick hover actions */}
                  <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleToggleStatus(bed)} className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors" title={bed.status === "active" ? "Tạm ẩn luống" : "Mở luống"}>
                      {bed.status === "active" ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5 text-red-500" />}
                    </button>
                    <button onClick={() => openEditDialog(bed)} className="p-1 text-slate-400 hover:text-emerald-600 rounded-md transition-colors" title="Chỉnh sửa">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDeleteBed(bed)} className="p-1 text-slate-400 hover:text-red-650 rounded-md transition-colors" title="Xóa">
                      <Trash2 className="h-3.5 w-3.5 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
          {loadingMore && (
            <div className="text-center py-4 text-xs text-slate-500 animate-pulse font-semibold">
              Đang tải thêm luống...
            </div>
          )}
        </div>
      </div>

      {/* 2. CENTER AREA: Interactive Grid View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {activeBed ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            
            {/* Top header Breadcrumb & KPI Cards */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Breadcrumb & Title */}
              <div>
                <div className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
                  <span>Vườn {activeBed.gardenCode}</span>
                  <ChevronRight className="h-2.5 w-2.5" />
                  <span className="text-emerald-600">{activeBed.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">{activeBed.name}</h1>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20 text-[9px] font-bold py-0.5 rounded-md">
                    Active
                  </Badge>
                </div>
              </div>

              {/* Horizontal KPI Blocks inside header */}
              <div className="flex flex-wrap gap-2 text-xs md:mr-auto md:ml-6">
                <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Khu Vườn</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.gardenCode}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[90px]">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Sức chứa</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.treeCount}/{activeBed.maxTrees || 100}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[70px]">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Độ Tuổi</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{activeBed.ageYear} năm</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[85px]">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Thổ Nhưỡng</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[80px]">{activeBed.soilType || "Đất rừng"}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/60 border rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[80px]">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold">Tưới Nước</span>
                  <span className="font-bold text-emerald-600">{formatDaysAgo(activeBed.lastWateredAt)}</span>
                </div>
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900 rounded-lg px-2.5 py-1 flex flex-col items-center justify-center min-w-[75px]">
                  <span className="text-[9px] text-red-400 uppercase tracking-wider font-semibold">Cần Chăm</span>
                  <span className="font-bold text-red-600 dark:text-red-400">{sickCount} cây</span>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1.5 self-end md:self-auto">
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold px-2.5 border-slate-200" onClick={() => openEditDialog(activeBed)}>
                  <Pencil className="h-3 w-3 mr-1" /> Chỉnh sửa
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs font-semibold px-2.5 border-slate-200" onClick={() => setActiveTab("logs")}>
                  <FileText className="h-3 w-3 mr-1" /> Lịch sử
                </Button>
              </div>
            </div>

            {/* Grid Tabs panel */}
            <div className="border-b border-slate-100 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900">
              <div className="flex gap-6">
                <button 
                  onClick={() => setActiveTab("grid")}
                  className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "grid" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
                >
                  Sơ đồ (Grid)
                </button>
                <button 
                  onClick={() => setActiveTab("trees")}
                  className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "trees" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
                >
                  Danh sách cây
                </button>
                <button 
                  onClick={() => setActiveTab("overview")}
                  className={`py-3 text-xs font-bold border-b-2 transition-all ${activeTab === "overview" ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}
                >
                  Tổng quan luống
                </button>
              </div>
            </div>

            {/* TAB VIEWS CONTAINER */}
            <div className="flex-1 overflow-hidden flex flex-col p-4 bg-slate-50/50 dark:bg-slate-950/20 relative">
              
              {activeTab === "grid" && (
                <div className="flex-1 flex flex-col overflow-hidden space-y-4">
                  
                  {/* Visual Filter Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-2 px-3 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-xxs">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative w-36">
                        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <Input
                          placeholder="Tìm mã sâm..."
                          value={searchGridQuery}
                          onChange={(e) => setSearchGridQuery(e.target.value)}
                          className="h-8 pl-8 text-[11px] w-full bg-slate-50 border-slate-200"
                        />
                      </div>
                      <Select value={gridHealthFilter} onValueChange={setGridHealthFilter}>
                        <SelectTrigger className="h-8 text-[11px] w-24 bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Sức khỏe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Sức khỏe</SelectItem>
                          <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                          <SelectItem value="sick">Cần tưới nước</SelectItem>
                          <SelectItem value="dead">Sâu bệnh</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={gridStatusFilter} onValueChange={setGridStatusFilter}>
                        <SelectTrigger className="h-8 text-[11px] w-24 bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Trạng thái</SelectItem>
                          <SelectItem value="empty">Ô trống</SelectItem>
                          <SelectItem value="planted">Có sâm</SelectItem>
                          <SelectItem value="inactive">Đã khóa</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={gridCustomerFilter} onValueChange={setGridCustomerFilter}>
                        <SelectTrigger className="h-8 text-[11px] w-32 bg-slate-50 border-slate-200">
                          <SelectValue placeholder="Khách hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Khách hàng</SelectItem>
                          {users.map(u => (
                            <SelectItem key={u.id} value={u.id}>{u.name || u.username}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <label className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 cursor-pointer pl-1 font-semibold">
                        <Checkbox checked={onlyEmpty} onCheckedChange={(val) => setOnlyEmpty(!!val)} />
                        <span>Chỉ ô trống</span>
                      </label>
                    </div>

                    {/* Zoom / Pan panel */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200">
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={zoomOut} title="Thu nhỏ">
                        <ZoomOut className="h-3.5 w-3.5" />
                      </Button>
                      <span className="text-[10px] font-mono px-1 font-semibold text-slate-500 w-8 text-center">{zoomScale}%</span>
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={zoomIn} title="Phóng to">
                        <ZoomIn className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 rounded-md" onClick={zoomReset} title="Khôi phục">
                        <Maximize2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Grid Canvas */}
                  {loadingGrid ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs gap-3">
                      <RefreshCw className="h-6 w-6 animate-spin text-emerald-600" />
                      <span>Đang tải lưới sơ đồ luống sâm...</span>
                    </div>
                  ) : locations.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white border border-dashed rounded-2xl">
                      <LayoutGrid className="h-10 w-10 text-slate-400 mb-3" />
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Sơ đồ Grid chưa khởi tạo</h3>
                      <p className="text-xs text-muted-foreground max-w-sm my-2">Luống sâm này chưa được cấu hình lưới ô để định vị từng gốc sâm. Hãy chia lưới để gieo trồng.</p>
                      <div className="flex items-center gap-3 mt-4 bg-slate-50 p-3 rounded-xl border">
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="rows-inp" className="text-xs">Số hàng (R):</Label>
                          <Input id="rows-inp" type="number" min={1} value={gridRows} onChange={(e) => setGridRows(Number(e.target.value))} className="w-14 h-8 text-xs" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="cols-inp" className="text-xs">Số cột (C):</Label>
                          <Input id="cols-inp" type="number" min={1} value={gridCols} onChange={(e) => setGridCols(Number(e.target.value))} className="w-14 h-8 text-xs" />
                        </div>
                        <Button size="sm" onClick={handleGenerateGrid} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-8 text-xs">
                          Khởi tạo Grid
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col overflow-hidden relative bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xxs">
                      
                      {/* Grid background with grid paper lines */}
                      <div 
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUpOrLeave}
                        onMouseLeave={handleMouseUpOrLeave}
                        className={`flex-1 overflow-auto p-4 relative select-none bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:24px_24px] bg-slate-50/50 dark:bg-slate-950/20 ${isPanning ? "cursor-grabbing" : "cursor-grab"}`}
                      >
                        <div 
                          style={{
                            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale / 100})`,
                            transformOrigin: "center center",
                            transition: isPanning ? "none" : "transform 0.15s ease-out",
                            width: "max-content",
                            margin: "auto",
                          }}
                          className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 shadow-sm relative"
                        >
                          {/* Column headers row */}
                          <div className="flex gap-1.5 mb-1.5 pl-8">
                            {Array.from({ length: Math.max(...locations.map(l => l.col)) + 1 }).map((_, cIdx) => (
                              <div key={cIdx} className="w-[56px] h-6 flex items-center justify-center text-[10px] font-bold text-slate-400">
                                C{cIdx + 1}
                              </div>
                            ))}
                          </div>

                          {/* Grid Rows */}
                          {Array.from({ length: Math.max(...locations.map(l => l.row)) + 1 }).map((_, rIdx) => (
                            <div key={rIdx} className="flex gap-1.5 items-center">
                              {/* Row header label */}
                              <div className="w-8 h-14 flex items-center justify-center text-[10px] font-bold text-slate-400 mr-1">
                                H{rIdx + 1}
                              </div>

                              {/* Row Cells */}
                              {locations
                                .filter((l) => l.row === rIdx)
                                .sort((a, b) => a.col - b.col)
                                .map((loc) => {
                                  const tree = getCellTree(loc.treeCode)
                                  const isSelected = loc.id === selectedLocationId
                                  const isFiltered = filteredLocations.some(fl => fl.id === loc.id)

                                  // Beautiful layout styling according to mockup
                                  let cellBg = "bg-white dark:bg-slate-900 border-slate-200 text-slate-350"
                                  let cellBorder = "border-dashed border-2 hover:border-slate-400 hover:bg-slate-50"
                                  let iconElement = <span className="text-[14px] opacity-40">•</span>
                                  let textLabel = ""
                                  let ageLabel = ""

                                  if (loc.status === "planted") {
                                    cellBorder = "border-solid border"
                                    textLabel = loc.treeCode ? loc.treeCode.substring(0, 5) : ""
                                    ageLabel = tree ? `${tree.ageYear || 3}Y` : "3Y"
                                    
                                    const health = tree?.healthStatus || "healthy"

                                    if (health === "healthy") {
                                      // Rich green matching image
                                      cellBg = "bg-[#e2f5e9] dark:bg-emerald-950/20 border-[#c2ebd0] text-[#10b981] hover:bg-[#d1f0dc]"
                                    } else if (health === "sick") {
                                      // Rich orange/yellow
                                      cellBg = "bg-[#fef3c7] dark:bg-amber-950/20 border-[#fde68a] text-[#d97706] hover:bg-[#fef08a]"
                                    } else {
                                      // Rich disease red
                                      cellBg = "bg-[#fee2e2] dark:bg-red-950/20 border-[#fca5a5] text-[#ef4444] hover:bg-[#fecaca]"
                                    }

                                    if (tree?.ownerUserId) {
                                      const matchedUser = users.find((u) => u.id === tree.ownerUserId)
                                      const avatarBorder = health === "healthy" ? "border-[#10b981]" : health === "sick" ? "border-amber-500" : "border-red-500"
                                      const avatarBg = health === "healthy" ? "bg-emerald-600" : health === "sick" ? "bg-amber-500" : "bg-red-500"

                                      if (matchedUser && matchedUser.avatar) {
                                        iconElement = (
                                          <img 
                                            src={matchedUser.avatar} 
                                            className={`h-6 w-6 rounded-full object-cover border ${avatarBorder} shadow-xs`} 
                                            alt={matchedUser.name || "avatar"} 
                                          />
                                        )
                                      } else {
                                        const initials = matchedUser ? getInitials(matchedUser.name || matchedUser.username || "K") : "K"
                                        iconElement = (
                                          <div className={`h-6 w-6 rounded-full ${avatarBg} text-white font-bold text-[10px] flex items-center justify-center border border-white shadow-xs`}>
                                            {initials}
                                          </div>
                                        )
                                      }
                                    } else {
                                      if (health === "healthy") {
                                        iconElement = <Leaf className="h-5 w-5 fill-[#10b981] drop-shadow-xs" />
                                      } else if (health === "sick") {
                                        iconElement = <Droplets className="h-5 w-5 fill-current animate-bounce text-amber-500" />
                                      } else {
                                        iconElement = <Skull className="h-5 w-5" />
                                      }
                                    }
                                  } else if (loc.status === "inactive") {
                                    cellBg = "bg-slate-100 border-slate-300 text-slate-300 dark:bg-slate-800 dark:border-slate-700"
                                    iconElement = <EyeOff className="h-4 w-4" />
                                  }

                                  return (
                                    <div
                                      key={loc.id}
                                      onClick={() => handleCellClick(loc)}
                                      onDragOver={(e) => {
                                        if (loc.status === "empty") e.preventDefault()
                                      }}
                                      onDrop={(e) => handleDrop(e, loc)}
                                      draggable={loc.status === "planted"}
                                      onDragStart={(e) => handleDragStart(e, loc)}
                                      onMouseEnter={(e) => {
                                        if (loc.status === "planted") {
                                          setHoveredCell(loc)
                                          setTooltipPos({ 
                                            x: e.currentTarget.offsetLeft - 60, 
                                            y: e.currentTarget.offsetTop - 130 
                                          })
                                        }
                                      }}
                                      onMouseLeave={() => setHoveredCell(null)}
                                      className={`w-[56px] h-[56px] rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer relative grid-cell-btn ${cellBg} ${cellBorder} ${
                                        isSelected ? "ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900" : ""
                                      } ${!isFiltered ? "opacity-20 scale-95" : "hover:scale-105 hover:shadow-sm"}`}
                                    >
                                      {/* Age Label top right */}
                                      {ageLabel && (
                                        <span className="absolute top-1 right-1 text-[8px] font-bold text-slate-500 dark:text-slate-400">
                                          {ageLabel}
                                        </span>
                                      )}

                                      {/* Icon Sprout/Leaf */}
                                      <div className="mt-1">{iconElement}</div>

                                      {/* Text Code bottom */}
                                      {textLabel && (
                                        <span className="text-[9px] font-bold font-mono tracking-tight mt-0.5 leading-none">
                                          {textLabel}
                                        </span>
                                      )}
                                    </div>
                                  )
                                })}
                            </div>
                          ))}

                          {/* Hover Tooltip Div */}
                          {hoveredCell && hoveredCell.treeCode && (
                            <div 
                              style={{ 
                                left: `${tooltipPos.x}px`, 
                                top: `${tooltipPos.y}px`,
                              }}
                              className="absolute bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xl z-30 w-48 text-[11px] space-y-1.5 transition-all text-slate-700 dark:text-slate-350 pointer-events-none"
                            >
                              <div className="font-bold border-b pb-1 text-slate-800 dark:text-slate-100 flex items-center justify-between">
                                <span>Gốc sâm {hoveredCell.treeCode}</span>
                                <Badge variant={getCellTree(hoveredCell.treeCode)?.healthStatus === "healthy" ? "default" : "destructive"} className="text-[9px] px-1 py-0 rounded">
                                  {getCellTree(hoveredCell.treeCode)?.healthStatus === "healthy" ? "Khỏe" : "Cần nước"}
                                </Badge>
                              </div>
                              <div>Khách: <span className="font-semibold text-slate-800 dark:text-slate-200">{getOwnerName(getCellTree(hoveredCell.treeCode)?.ownerUserId)}</span></div>
                              <div>Tuổi sâm: <span className="font-semibold">{getCellTree(hoveredCell.treeCode)?.ageYear || 3} năm</span></div>
                              <div>Ngày bón: <span className="font-semibold">{formatDaysAgo(getCellTree(hoveredCell.treeCode)?.lastCareDate)}</span></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mini Map rendering in bottom-left corner */}
                      <div className="absolute bottom-14 left-4 bg-white/95 dark:bg-slate-900/95 border p-2 rounded-xl shadow-lg w-28 z-10 pointer-events-none hidden md:block">
                        <div className="text-[9px] font-bold text-slate-400 mb-1">Bản đồ thu nhỏ</div>
                        <div className="grid grid-cols-10 gap-0.5 bg-slate-50 p-1 rounded-md border">
                          {locations.map((loc) => {
                            const tree = getCellTree(loc.treeCode)
                            let cellColor = "bg-slate-100"
                            if (loc.status === "planted" && tree) {
                              cellColor = tree.healthStatus === "healthy" ? "bg-emerald-400" : "bg-amber-400"
                            } else if (loc.status === "inactive") {
                              cellColor = "bg-slate-300"
                            }
                            return <div key={loc.id} className={`w-1.5 h-1.5 rounded-2xs ${cellColor}`}></div>
                          })}
                        </div>
                      </div>

                      {/* Legend / Status dots */}
                      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-[#e2f5e9] border border-[#c2ebd0]"></div>
                          <span>Khỏe mạnh ({healthyCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-[#fef3c7] border border-[#fde68a]"></div>
                          <span>Cần tưới ({sickCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-[#fee2e2] border border-[#fca5a5]"></div>
                          <span>Sâu bệnh ({deadCount})</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded border border-dashed border-slate-300 bg-white"></div>
                          <span>Ô trống ({emptyCount})</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Statistics counters & Care timeline matching bottom mockup */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Visual indicators counter */}
                    <Card className="border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-3.5">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Phân bố sức khỏe</div>
                      <div className="grid grid-cols-5 text-center divide-x divide-slate-100 dark:divide-slate-800">
                        <div>
                          <div className="text-base font-bold text-slate-850 dark:text-slate-100">{totalGridCells}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Tổng ô</div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-emerald-600">{healthyCount}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Khỏe</div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-amber-600">{sickCount}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Cần nước</div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-red-500">{deadCount}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Cây bệnh</div>
                        </div>
                        <div>
                          <div className="text-base font-bold text-slate-400">{emptyCount}</div>
                          <div className="text-[9px] text-slate-400 uppercase font-semibold">Trống</div>
                        </div>
                      </div>
                    </Card>

                    {/* Care Activity timeline (Hôm nay) */}
                    <Card className="border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-3.5">
                      <div className="text-xs font-bold text-slate-755 mb-2 flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-emerald-650" />
                        Lịch trình chăm sóc hôm nay
                      </div>
                      <div className="space-y-2 text-[10px] max-h-20 overflow-y-auto pr-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none scale-90">08:20</Badge>
                          <span className="text-slate-600">Tưới nước khu luống sâm con</span>
                          <span className="text-slate-400 ml-auto">(Nam)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none scale-90">10:15</Badge>
                          <span className="text-slate-600">Bón phân hữu cơ vi sinh</span>
                          <span className="text-slate-400 ml-auto">(Minh)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none scale-90">15:00</Badge>
                          <span className="text-slate-600">Kiểm tra sương muối gieo trồng</span>
                          <span className="text-slate-400 ml-auto">(Hoa)</span>
                        </div>
                      </div>
                    </Card>

                    {/* Bulk Action panel */}
                    <Card className="border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-3.5 flex flex-col justify-center">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-355 mb-2">Thao tác nhanh trên Grid</div>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="outline" className="flex-1 text-[10px] font-semibold text-emerald-600 border-emerald-100 bg-emerald-50/20 hover:bg-emerald-50 h-8" onClick={handleBulkWatering}>
                          <Droplets className="h-3 w-3 mr-1" /> Tưới nước
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-[10px] font-semibold text-amber-600 border-amber-100 bg-amber-50/20 hover:bg-amber-50 h-8" onClick={handleBulkFertilizing}>
                          <Plus className="h-3 w-3 mr-1" /> Bón phân
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-[10px] font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 h-8" onClick={() => handlePrintQR(selectedBedCode)}>
                          <QrCode className="h-3 w-3 mr-1" /> In mã QR
                        </Button>
                      </div>
                    </Card>
                  </div>

                </div>
              )}

              {/* Tab: Danh sách cây */}
              {activeTab === "trees" && (
                <Card className="border-0 shadow-none bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex-1 flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">Danh sách gốc sâm trong luống</h3>
                      <p className="text-xs text-muted-foreground">Có {locations.filter(l => l.status === "planted").length} vị trí đã được gieo trồng.</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium">
                          <th className="py-2.5">Tọa độ</th>
                          <th className="py-2.5">Mã sâm</th>
                          <th className="py-2.5">Chủ sở hữu</th>
                          <th className="py-2.5">Sức khỏe</th>
                          <th className="py-2.5">Tuổi</th>
                          <th className="py-2.5 text-right">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {locations.filter(l => l.status === "planted").map(loc => {
                          const tree = getCellTree(loc.treeCode)
                          return (
                            <tr key={loc.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                              <td className="py-3 font-semibold text-slate-700">Hàng {loc.row + 1} - Cột {loc.col + 1}</td>
                              <td className="py-3 font-mono">{loc.treeCode}</td>
                              <td className="py-3 font-medium">{getOwnerName(tree?.ownerUserId)}</td>
                              <td className="py-3">
                                <Badge variant={tree?.healthStatus === "healthy" ? "default" : "destructive"} className="text-[10px] px-1.5 py-0.5">
                                  {tree?.healthStatus === "healthy" ? "Khỏe mạnh" : "Bị bệnh"}
                                </Badge>
                              </td>
                              <td className="py-3">{tree?.ageYear || 3} năm</td>
                              <td className="py-3 text-right">
                                <Button size="sm" variant="ghost" className="h-7 text-emerald-600 hover:text-emerald-700" onClick={() => { setActiveTab("grid"); handleCellClick(loc); }}>
                                  Xem vị trí
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}

              {/* Tab: Tổng quan */}
              {activeTab === "overview" && (
                <div className="space-y-4 max-w-xl mx-auto py-6">
                  <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 rounded-2xl shadow-xs">
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Info className="h-5 w-5 text-emerald-600" />
                      Thông tin tổng quan luống gieo trồng
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-slate-400">Mã luống sâm:</span>
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-bold">{activeBed.code}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Khu vườn liên kết:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBed.gardenCode}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Diện tích mặt đất:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBed.width || 2}m × {activeBed.length || 10}m</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Loại thổ nhưỡng:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBed.soilType || "Đất đỏ Bazan"}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Thời gian tưới gần nhất:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBed.lastWateredAt ? new Date(activeBed.lastWateredAt).toLocaleDateString("vi-VN") : "Chưa thực hiện"}</div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-slate-400">Độ bồi bổ phân bón:</span>
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{activeBed.lastFertilizedAt ? new Date(activeBed.lastFertilizedAt).toLocaleDateString("vi-VN") : "Chưa thực hiện"}</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t text-xs space-y-2">
                      <div className="text-slate-400">Mô tả điều kiện đất:</div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border">
                        {activeBed.description || "Luống trồng được cải tạo định kỳ, kiểm soát tốt sâu bệnh, thích hợp nuôi trồng sâm ngọc linh sinh học."}
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Tab: Lịch sử và Care Logs */}
              {activeTab === "logs" && (
                <Card className="border-0 shadow-none bg-white dark:bg-slate-900 rounded-xl overflow-hidden flex-1 flex flex-col">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm">Nhật ký hoạt động của luống</h3>
                      <p className="text-xs text-slate-500">Lịch sử tưới tiêu, bón phân và cập nhật sâu hại sâm.</p>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 text-center text-xs text-muted-foreground py-12">
                    Lịch sử chăm sóc tự động đồng bộ theo từng gốc sâm trong sơ đồ lưới.
                  </div>
                </Card>
              )}

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <LayoutGrid className="w-12 h-12 text-slate-350 mb-3" />
            <p className="text-sm">Vui lòng chọn một luống sâm từ danh sách bên trái để quản lý sơ đồ gieo trồng.</p>
          </div>
        )}
      </div>

      {/* 3. RIGHT SIDEBAR: Selected plant cell details */}
      <div className={`flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition-all duration-300 ${
        rightSidebarOpen ? "w-full lg:w-72" : "w-0 lg:w-0 opacity-0 pointer-events-none hidden"
      }`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Chi tiết ô gieo trồng</h2>
          <button 
            type="button"
            onClick={() => setRightSidebarOpen(false)} 
            className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-800 hidden lg:block"
            title="Thu gọn chi tiết"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {selectedLocationId ? (
            (() => {
              const loc = locations.find((l) => l.id === selectedLocationId)
              if (!loc) return null
              const tree = getCellTree(loc.treeCode)

              return (
                <div className="space-y-5">
                  {/* Visual card header matching mockup */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/20 text-center space-y-2 relative shadow-xxs">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200/80 shadow-xs shadow-emerald-100/50">
                      {loc.status === "planted" ? <Leaf className="h-7 w-7 fill-current text-emerald-600" /> : <span className="text-lg opacity-40">•</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        Vị trí: H{loc.row + 1} - C{loc.col + 1}
                      </h3>
                      <p className="text-[10px] font-mono text-slate-400">Mã định danh ô: {loc.code}</p>
                    </div>
                    {loc.status === "planted" && (
                      <Badge variant={tree?.healthStatus === "healthy" ? "default" : "destructive"} className="text-[9px] font-bold px-2 py-0.5">
                        {tree?.healthStatus === "healthy" ? "Healthy (Khỏe mạnh)" : "Sick (Cần chăm sóc)"}
                      </Badge>
                    )}
                  </div>

                  {/* Details metadata */}
                  {loc.status === "planted" && tree ? (
                    <div className="space-y-4">
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Chủ sở hữu:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{getOwnerName(tree.ownerUserId)}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Mã gốc sâm:</span>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{tree.code}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Độ tuổi sâm:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{tree.ageYear} năm tuổi</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Ngày trồng:</span>
                          <span className="font-bold text-slate-800 dark:text-slate-100">{tree.plantedAt ? new Date(tree.plantedAt).toLocaleDateString("vi-VN") : "Chưa rõ"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Chỉ số sức khỏe:</span>
                          <span className="font-bold text-emerald-600">98%</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Cần tưới nước:</span>
                          <span className="font-bold text-slate-600">Không cần</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                          <span className="text-slate-400 font-semibold">Cần bón phân:</span>
                          <span className="font-bold text-amber-600">Ngày mai</span>
                        </div>
                      </div>

                      {/* Care Activity logs list stepper */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-bold text-slate-750 flex items-center gap-1.5 border-b pb-2">
                          <Activity className="h-4 w-4 text-emerald-600" />
                          Nhật ký chăm sóc ô sâm
                        </h4>
                        
                        {loadingTreeDetails ? (
                          <div className="text-[10px] text-center text-slate-400 py-3">Đang tải nhật ký chăm sóc...</div>
                        ) : selectedTreeCareLogs.length === 0 ? (
                          <div className="text-[10px] text-center text-slate-400 py-3 border border-dashed rounded-lg bg-slate-50/50">Không có lịch sử chăm sóc gần đây.</div>
                        ) : (
                          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                            {selectedTreeCareLogs.map((log) => (
                              <div key={log.id} className="p-2 border border-slate-100 dark:border-slate-800 rounded-lg text-[10px] bg-slate-50/20 space-y-1">
                                <div className="flex justify-between font-bold text-slate-700 dark:text-slate-350">
                                  <span>{log.title}</span>
                                  <span className="text-slate-400">{new Date(log.loggedAt).toLocaleDateString("vi-VN")}</span>
                                </div>
                                <p className="text-slate-500 leading-normal">{log.description || "Thao tác tưới tiêu định kỳ"}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Side panel quick actions */}
                      <div className="space-y-2 pt-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 gap-1.5 h-8 font-bold" onClick={() => handleSingleWatering(loc)}>
                            <Droplets className="h-3.5 w-3.5 fill-current" /> Tưới nước
                          </Button>
                          <Button size="sm" variant="outline" className="text-amber-600 border-amber-200 gap-1.5 h-8 font-bold" onClick={() => handleSingleFertilizing(loc)}>
                            <Plus className="h-3.5 w-3.5" /> Bón phân
                          </Button>
                        </div>
                        <Button size="sm" variant="outline" className="w-full text-slate-600 border-slate-200 gap-1.5 h-8 font-bold" onClick={() => handlePrintQR(tree.code)}>
                          <QrCode className="h-3.5 w-3.5" /> In mã QR
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs text-slate-500 leading-relaxed border border-dashed rounded-xl p-4 bg-slate-50/30 text-center">
                        Ô đất trống chưa được gieo trồng cây sâm Ngọc Linh thực tế nào. Bạn có thể kéo thả cây trồng từ ô khác vào ô này.
                      </p>
                    </div>
                  )}
                </div>
              )
            })()
          ) : (
            <div className="text-center py-16 text-xs text-muted-foreground space-y-2">
              <Info className="w-8 h-8 text-slate-300 mx-auto" />
              <p>Vui lòng click vào một ô trong lưới Grid sơ đồ để xem chi tiết cây sâm ở vị trí đó.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bed Create / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSaveBed}>
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "create" ? "Thêm luống sâm mới" : "Chỉnh sửa luống sâm"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "create"
                  ? "Khởi tạo một luống trồng mới trong vườn. Quản trị viên có thể định dạng kích thước, loại đất canh tác."
                  : "Chỉnh sửa thông số, loại đất và thông tin cải tạo của luống sâm Ngọc Linh."}
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="my-3 p-3 bg-destructive/15 text-destructive rounded-md text-xs font-medium">
                {dialogError}
              </div>
            )}

            <div className="grid gap-4 py-4 grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="dialog-name">Tên luống sâm</Label>
                <Input
                  id="dialog-name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Luống 01, Luống Đông Nam"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-gardenCode">Khu vườn</Label>
                <Select
                  value={formData.gardenCode}
                  onValueChange={(val) => setFormData((prev) => ({ ...prev, gardenCode: val }))}
                  disabled={dialogMode === "edit"}
                >
                  <SelectTrigger id="dialog-gardenCode">
                    <SelectValue placeholder="Chọn khu vườn" />
                  </SelectTrigger>
                  <SelectContent>
                    {gardens.map((g) => (
                      <SelectItem key={g.id} value={g.code}>
                        {g.name} ({g.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-ageYear">Độ tuổi sâm quy hoạch (năm tuổi)</Label>
                <Input
                  id="dialog-ageYear"
                  name="ageYear"
                  type="number"
                  min={1}
                  value={formData.ageYear}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ageYear: Number(e.target.value) }))}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-maxTrees">Sức chứa tối đa (gốc sâm)</Label>
                <Input
                  id="dialog-maxTrees"
                  name="maxTrees"
                  type="number"
                  min={0}
                  value={formData.maxTrees}
                  onChange={(e) => setFormData((prev) => ({ ...prev, maxTrees: Number(e.target.value) }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-soilType">Loại đất</Label>
                <Input
                  id="dialog-soilType"
                  name="soilType"
                  value={formData.soilType}
                  onChange={(e) => setFormData((prev) => ({ ...prev, soilType: e.target.value }))}
                  placeholder="Ví dụ: Đất mùn rừng"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-width">Chiều rộng (m)</Label>
                <Input
                  id="dialog-width"
                  name="width"
                  type="number"
                  step="any"
                  value={formData.width}
                  onChange={(e) => setFormData((prev) => ({ ...prev, width: e.target.value }))}
                  placeholder="Ví dụ: 2"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-length">Chiều dài (m)</Label>
                <Input
                  id="dialog-length"
                  name="length"
                  type="number"
                  step="any"
                  value={formData.length}
                  onChange={(e) => setFormData((prev) => ({ ...prev, length: e.target.value }))}
                  placeholder="Ví dụ: 10"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="dialog-lastWatered">Lần tưới gần nhất</Label>
                <Input
                  id="dialog-lastWatered"
                  type="date"
                  value={formData.lastWateredAt}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastWateredAt: e.target.value }))}
                />
              </div>

              <div className="grid gap-2 col-span-2">
                <Label htmlFor="dialog-description">Mô tả luống</Label>
                <Input
                  id="dialog-description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả luống..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={dialogLoading || (dialogMode === "create" && gardens.length === 0)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {dialogLoading ? "Đang lưu..." : dialogMode === "create" ? "Thêm mới" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDialogAction}
        title={confirmDialogTitle}
        description={confirmDialogDesc}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialogLoading}
      />

      {/* Floating left sidebar toggle */}
      {!leftSidebarOpen && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setLeftSidebarOpen(true)}
          className="absolute left-4 top-4 z-40 bg-white dark:bg-slate-900 shadow-md border-slate-200 dark:border-slate-800 h-9 w-9 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
          title="Mở rộng danh sách luống"
        >
          <ChevronRight className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        </Button>
      )}

      {/* Floating right sidebar toggle */}
      {!rightSidebarOpen && (
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setRightSidebarOpen(true)}
          className="absolute right-4 top-4 z-40 bg-white dark:bg-slate-900 shadow-md border-slate-200 dark:border-slate-800 h-9 w-9 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
          title="Mở rộng chi tiết ô gieo trồng"
        >
          <ChevronLeft className="h-4 w-4 text-slate-700 dark:text-slate-300" />
        </Button>
      )}

      {/* QR Code Dialog */}
      <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
        <DialogContent className="sm:max-w-[400px] text-center p-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800 dark:text-slate-100 mx-auto">
              Mã QR Code định vị gốc sâm
            </DialogTitle>
            <DialogDescription className="text-xs text-center mx-auto">
              Sử dụng mã QR này để quét kiểm tra nguồn gốc và nhật ký chăm sóc trên thiết bị di động.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850">
            <div className="w-48 h-48 bg-white p-3 rounded-xl shadow-xs border border-slate-200 flex items-center justify-center relative group">
              <QrCode className="w-40 h-40 text-slate-800" />
              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-all">
                <span className="text-[10px] bg-slate-800 text-white font-semibold px-2 py-1 rounded shadow-md">Nhãn QR Bảo Chứng</span>
              </div>
            </div>
            <div className="mt-3 text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full uppercase tracking-wider">
              {qrCodeData || "N/A"}
            </div>
          </div>
          <DialogFooter className="flex sm:justify-center gap-2">
            <Button variant="outline" className="flex-1 font-semibold text-xs h-9" onClick={() => setIsQrDialogOpen(false)}>
              Đóng
            </Button>
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9" onClick={() => {
              setSuccessMsg("Đã tải xuống file ảnh nhãn QR Code in ấn thành công!");
              setIsQrDialogOpen(false);
            }}>
              Tải xuống nhãn in
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
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
