"use client"

import React, { useState } from "react"
import type { CarePackage, ProtectionPackage } from "@/types"
import type { PackageFormData } from "./package-dialog"

import { packagesService } from "@/services/packages.service"

interface UsePackagesManagerProps {
  initialCarePackages: CarePackage[]
  initialProtectionPackages: ProtectionPackage[]
  initialError?: string
}

export function usePackagesManager({
  initialCarePackages,
  initialProtectionPackages,
  initialError,
}: UsePackagesManagerProps) {
  const [activeTab, setActiveTab] = useState<"care" | "protection">("care")
  const [carePackages, setCarePackages] =
    useState<CarePackage[]>(initialCarePackages)
  const [protectionPackages, setProtectionPackages] = useState<
    ProtectionPackage[]
  >(initialProtectionPackages)

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

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

  // Consolidated Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    loading: boolean
    error: string
    selectedPackage: CarePackage | ProtectionPackage | null
    mode: "create" | "edit"
    formData: PackageFormData
  }>({
    isOpen: false,
    loading: false,
    error: "",
    selectedPackage: null,
    mode: "create",
    formData: {
      code: "",
      name: "",
      price: 0,
      durationMonths: 12,
      coverage: "",
      description: "",
      status: "active",
    },
  })

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      loading: false,
      error: "",
      selectedPackage: null,
      mode: "create",
      formData: {
        code: "",
        name: "",
        price: 100000,
        durationMonths: 12,
        coverage: "",
        description: "",
        status: "active",
      },
    })
  }

  const handleOpenEdit = (pkg: CarePackage | ProtectionPackage) => {
    const isCare = activeTab === "care"
    setDialogState({
      isOpen: true,
      loading: false,
      error: "",
      selectedPackage: pkg,
      mode: "edit",
      formData: {
        code: pkg.code,
        name: pkg.name,
        price: pkg.price,
        durationMonths: pkg.durationMonths || 12,
        coverage: isCare ? "" : (pkg as ProtectionPackage).coveragePercentage ? `${(pkg as ProtectionPackage).coveragePercentage}%` : "",
        description: pkg.description || "",
        status: pkg.status || "active",
      },
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setErrorMsg("")
    setSuccessMsg("")

    const { formData, mode, selectedPackage } = dialogState

    if (!formData.code || !formData.name || !formData.price) {
      setDialogState((prev) => ({
        ...prev,
        loading: false,
        error: "Vui lòng điền đầy đủ các thông tin bắt buộc (*)",
      }))
      return
    }

    try {
      if (activeTab === "care") {
        const bodyPayload: Partial<CarePackage> = {
          code: formData.code,
          name: formData.name,
          price: Number(formData.price),
          durationMonths: Number(formData.durationMonths),
          description: formData.description,
          status: formData.status,
        }

        if (mode === "create") {
          const res = await packagesService.createCarePackage(bodyPayload)
          setCarePackages((prev) => [res.data, ...prev])
          setSuccessMsg("Tạo gói chăm sóc thành công!")
        } else if (selectedPackage) {
          const res = await packagesService.updateCarePackage(selectedPackage.id, bodyPayload)
          setCarePackages((prev) =>
            prev.map((item) =>
              item.id === selectedPackage.id ? res.data : item
            )
          )
          setSuccessMsg("Cập nhật gói chăm sóc thành công!")
        }
      } else {
        const bodyPayload: Partial<ProtectionPackage> = {
          code: formData.code,
          name: formData.name,
          price: Number(formData.price),
          durationMonths: Number(formData.durationMonths),
          description: formData.description,
          status: formData.status,
        }

        if (mode === "create") {
          const res = await packagesService.createProtectionPackage(bodyPayload)
          setProtectionPackages((prev) => [res.data, ...prev])
          setSuccessMsg("Tạo gói bảo hiểm thành công!")
        } else if (selectedPackage) {
          const res = await packagesService.updateProtectionPackage(selectedPackage.id, bodyPayload)
          setProtectionPackages((prev) =>
            prev.map((item) =>
              item.id === selectedPackage.id ? res.data : item
            )
          )
          setSuccessMsg("Cập nhật gói bảo hiểm thành công!")
        }
      }

      setDialogState((prev) => ({ ...prev, isOpen: false }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi khi lưu gói dịch vụ"
      setDialogState((prev) => ({
        ...prev,
        error: message,
      }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const performDelete = async (id: string, type: "care" | "protection") => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      if (type === "care") {
        await packagesService.deleteCarePackage(id)
        setCarePackages((prev) => prev.filter((item) => item.id !== id))
        setSuccessMsg("Đã xóa gói chăm sóc thành công!")
      } else {
        await packagesService.deleteProtectionPackage(id)
        setProtectionPackages((prev) => prev.filter((item) => item.id !== id))
        setSuccessMsg("Đã xóa gói bảo hiểm thành công!")
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Lỗi kết nối máy chủ"
      setErrorMsg(message)
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận xóa gói dịch vụ?",
      description: `Bạn có chắc chắn muốn xóa "${name}"? Các cây sâm đã đăng ký gói này vẫn tiếp tục duy trì quyền lợi cho đến khi hết hạn.`,
      action: () => performDelete(id, activeTab),
      loading: false,
    })
  }

  return {
    activeTab,
    setActiveTab,
    carePackages,
    protectionPackages,
    errorMsg,
    setErrorMsg,
    successMsg,
    setSuccessMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
  }
}
