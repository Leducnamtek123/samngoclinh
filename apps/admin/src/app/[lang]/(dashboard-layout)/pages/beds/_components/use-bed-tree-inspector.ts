"use client"

import { useState } from "react"

import type { CareLog, Tree } from "@/types"
import type { CultivationBedLocation } from "./use-beds-table"

import { fetchApi } from "@/lib/api"

interface UseBedTreeInspectorProps {
  trees: Tree[]
  selectedBedCode: string
  activeBedAgeYear?: number
  loadBedLocations: (bedCode: string) => Promise<void>
  setSuccessMsg: (msg: string) => void
  setErrorMsg: (msg: string) => void
}

export function useBedTreeInspector({
  trees,
  selectedBedCode,
  activeBedAgeYear,
  loadBedLocations,
  setSuccessMsg,
  setErrorMsg,
}: UseBedTreeInspectorProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
    null
  )
  const [selectedTreeDetails, setSelectedTreeDetails] = useState<Tree | null>(
    null
  )
  const [selectedTreeCareLogs, setSelectedTreeCareLogs] = useState<CareLog[]>(
    []
  )
  const [loadingTreeDetails, setLoadingTreeDetails] = useState(false)

  const getCellTree = (treeCode?: string) => {
    if (!treeCode) return null
    return trees.find((t) => t.code === treeCode) || null
  }

  const handleCellClick = async (loc: CultivationBedLocation) => {
    setSelectedLocationId(loc.id)
    setSelectedTreeDetails(null)
    setSelectedTreeCareLogs([])

    if (loc.status === "planted" && loc.treeCode) {
      setLoadingTreeDetails(true)
      const matchedTree = trees.find((t) => t.code === loc.treeCode)
      try {
        const detailRes = await fetchApi(
          `/user/cultivation/care-logs?treeCode=${loc.treeCode}`
        )
        const detailPayload = await detailRes.json()

        setSelectedTreeDetails({
          id: matchedTree?.id || loc.treeCode,
          code: loc.treeCode,
          name: matchedTree?.name || "Sâm Ngọc Linh",
          ageYear: matchedTree?.ageYear || activeBedAgeYear || 3,
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

  const resetSelection = () => {
    setSelectedLocationId(null)
    setSelectedTreeDetails(null)
    setSelectedTreeCareLogs([])
  }

  return {
    selectedLocationId,
    selectedTreeDetails,
    selectedTreeCareLogs,
    loadingTreeDetails,
    getCellTree,
    handleCellClick,
    handleSingleWatering,
    handleSingleFertilizing,
    resetSelection,
  }
}
