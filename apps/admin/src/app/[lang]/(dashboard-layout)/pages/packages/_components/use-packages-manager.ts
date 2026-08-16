"use client"

import React, { useState } from "react"
import { fetchApi } from "@/lib/api"
import type { CarePackage, ProtectionPackage } from "./packages-manager"

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
    selectedPackage: any | null
    mode: "create" | "edit"
    formData: {
      code: string
      name: string
      price: number
      durationMonths: number
      coverage: string
      description: string
      status: string
    }
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

  const handleOpenEdit = (pkg: any) => {
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
        coverage: pkg.coverage || "",
        description: pkg.description || "",
        status: pkg.status,
      },
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !dialogState.formData.code.trim() ||
      !dialogState.formData.name.trim()
    ) {
      setDialogState((prev) => ({
        ...prev,
        error: "Mã và tên gói không được để trống",
      }))
      return
    }

    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setSuccessMsg("")

    try {
      const endpoint =
        activeTab === "care"
          ? "/admin/packages/care"
          : "/admin/packages/protection"
      const bodyPayload: any = {
        code: dialogState.formData.code,
        name: dialogState.formData.name,
        price: Number(dialogState.formData.price),
        description: dialogState.formData.description || undefined,
        status: dialogState.formData.status,
      }

      if (activeTab === "care") {
        bodyPayload.durationMonths = Number(dialogState.formData.durationMonths)
      } else {
        bodyPayload.coverage = dialogState.formData.coverage || undefined
      }

      if (dialogState.mode === "create") {
        const res = await fetchApi(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bodyPayload),
        })
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || "Không thể tạo gói dịch vụ",
          }))
        } else {
          if (activeTab === "care") {
            setCarePackages((prev) => [payload.data, ...prev])
          } else {
            setProtectionPackages((prev) => [payload.data, ...prev])
          }
          setSuccessMsg("Tạo gói dịch vụ thành công!")
          setDialogState((prev) => ({ ...prev, isOpen: false }))
        }
      } else if (dialogState.mode === "edit" && dialogState.selectedPackage) {
        const res = await fetchApi(
          `${endpoint}/${dialogState.selectedPackage.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyPayload),
          }
        )
        const payload = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payload?.message || "Không thể cập nhật gói dịch vụ",
          }))
        } else {
          if (activeTab === "care") {
            setCarePackages((prev) =>
              prev.map((item) =>
                item.id === dialogState.selectedPackage!.id
                  ? payload.data
                  : item
              )
            )
          } else {
            setProtectionPackages((prev) =>
              prev.map((item) =>
                item.id === dialogState.selectedPackage!.id
                  ? payload.data
                  : item
              )
            )
          }
          setSuccessMsg("Cập nhật gói dịch vụ thành công!")
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

  const handleDelete = (id: string) => {
    const pkg =
      activeTab === "care"
        ? carePackages.find((p) => p.id === id)
        : protectionPackages.find((p) => p.id === id)
    setConfirmDialog({
      isOpen: true,
      title: "Xóa gói dịch vụ?",
      description: `Hành động này sẽ xóa vĩnh viễn gói dịch vụ "${pkg?.name || ""}" khỏi hệ thống. Bạn không thể hoàn tác thao tác này.`,
      action: () => performDelete(id),
      loading: false,
    })
  }

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const endpoint =
        activeTab === "care"
          ? `/admin/packages/care/${id}`
          : `/admin/packages/protection/${id}`
      const res = await fetchApi(endpoint, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        setErrorMsg(payload?.message || "Không thể xóa gói dịch vụ này.")
      } else {
        if (activeTab === "care") {
          setCarePackages((prev) => prev.filter((item) => item.id !== id))
        } else {
          setProtectionPackages((prev) => prev.filter((item) => item.id !== id))
        }
        setSuccessMsg("Đã xóa gói dịch vụ thành công!")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi hệ thống khi thực hiện xóa.")
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
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
