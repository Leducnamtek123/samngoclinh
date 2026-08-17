"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { Bed, Garden } from "@/types"
import type { BedFormData } from "./beds-dialogs"

import { fetchApi } from "@/lib/api"

interface UseBedDialogsProps {
  gardens: Garden[]
  setBeds: React.Dispatch<React.SetStateAction<Bed[]>>
  setSelectedBedCode: (code: string) => void
  setSuccessMsg: (msg: string) => void
  setErrorMsg: (msg: string) => void
}

export function useBedDialogs({
  gardens,
  setBeds,
  setSelectedBedCode,
  setSuccessMsg,
  setErrorMsg,
}: UseBedDialogsProps) {
  const router = useRouter()

  // Form state for Bed Create/Edit
  const [formData, setFormData] = useState<BedFormData>({
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

  // Grouped Bed Create/Edit dialog states
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    mode: "create" as "create" | "edit",
    selectedBed: null as Bed | null,
    loading: false,
    error: "",
  })

  // Confirmation dialog states
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    loading: false,
  })

  // QR Dialog state
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  const [qrCodeData, setQrCodeData] = useState("")

  const openCreateDialog = () => {
    setFormData({
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
      name: bed.name || "",
      gardenCode: bed.gardenCode || gardens[0]?.code || "",
      ageYear: bed.ageYear || 1,
      treeCount: bed.treeCount || 0,
      maxTrees: bed.maxTrees || 100,
      width: bed.width?.toString() || "",
      length: bed.length?.toString() || "",
      soilType: bed.soilType || "",
      lastFertilizedAt: bed.lastFertilizedAt
        ? new Date(bed.lastFertilizedAt).toISOString().split("T")[0]
        : "",
      lastWateredAt: bed.lastWateredAt
        ? new Date(bed.lastWateredAt).toISOString().split("T")[0]
        : "",
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

  const handlePrintQR = (code: string) => {
    setQrCodeData(code)
    setIsQrDialogOpen(true)
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
      lastFertilizedAt: formData.lastFertilizedAt
        ? new Date(formData.lastFertilizedAt).toISOString()
        : undefined,
      lastWateredAt: formData.lastWateredAt
        ? new Date(formData.lastWateredAt).toISOString()
        : undefined,
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
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || "Đã xảy ra lỗi khi tạo luống sâm",
          }))
        } else {
          setBeds((prev) => [payload.data, ...prev])
          setSuccessMsg(`Đã tạo luống sâm "${formData.name}" thành công!`)
          setSelectedBedCode(payload.data.code)
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      } else {
        if (!dialogState.selectedBed) return
        const res = await fetchApi(
          `/user/cultivation/beds/${dialogState.selectedBed.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadBody),
          }
        )

        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || "Đã xảy ra lỗi khi cập nhật luống sâm",
          }))
        } else {
          setBeds((prev) =>
            prev.map((b) =>
              b.id === dialogState.selectedBed!.id
                ? { ...b, ...payload.data }
                : b
            )
          )
          setSuccessMsg(
            `Cập nhật thông tin luống "${formData.name}" thành công!`
          )
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({
        ...prev,
        error: "Không thể kết nối đến máy chủ API",
      }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  return {
    formData,
    setFormData,
    dialogState,
    setDialogState,
    confirmState,
    setConfirmState,
    isQrDialogOpen,
    setIsQrDialogOpen,
    qrCodeData,
    openCreateDialog,
    openEditDialog,
    handlePrintQR,
    handleSaveBed,
  }
}
