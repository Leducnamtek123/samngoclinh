"use client"

import { useRef, useState } from "react"

import type { CultivationBedLocation } from "./use-beds-table"

import { fetchApi } from "@/lib/api"

interface UseBedsCanvasProps {
  selectedBedCode: string
  loadBedLocations: (bedCode: string) => Promise<void>
  setSuccessMsg: (msg: string) => void
  setErrorMsg: (msg: string) => void
  setLoadingGrid: (loading: boolean) => void
}

export function useBedsCanvas({
  selectedBedCode,
  loadBedLocations,
  setSuccessMsg,
  setErrorMsg,
  setLoadingGrid,
}: UseBedsCanvasProps) {
  // Zoom & Pan states
  const [zoomScale, setZoomScale] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const panStartRef = useRef({ x: 0, y: 0 })

  // Tooltip details on hover
  const [hoveredCell, setHoveredCell] = useState<CultivationBedLocation | null>(
    null
  )
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest("button") || target.closest(".grid-cell-btn")) return
    setIsPanning(true)
    panStartRef.current = {
      x: e.clientX - panOffset.x,
      y: e.clientY - panOffset.y,
    }
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

  const handleDrop = async (
    e: React.DragEvent,
    destLoc: CultivationBedLocation
  ) => {
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

  return {
    zoomScale,
    panOffset,
    isPanning,
    hoveredCell,
    setHoveredCell,
    tooltipPos,
    setTooltipPos,
    handleMouseDown,
    handleMouseMove,
    handleMouseUpOrLeave,
    zoomIn,
    zoomOut,
    zoomReset,
    handleDrop,
  }
}
