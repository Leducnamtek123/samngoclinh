"use client"

import React, { useState } from "react"
import { useTranslation } from "@/providers/i18n-provider"
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
  const { t } = useTranslation()
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
    mode: "create" | "edit"
    selectedPackage: CarePackage | ProtectionPackage | null
    formData: PackageFormData
    loading: boolean
    error: string
  }>({
    isOpen: false,
    mode: "create",
    selectedPackage: null,
    formData: {
      code: "",
      name: "",
      price: 0,
      durationMonths: 12,
      coverage: "",
      description: "",
      status: "active",
    },
    loading: false,
    error: "",
  })

  const handleOpenCreate = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedPackage: null,
      formData: {
        code: "",
        name: "",
        price: 0,
        durationMonths: 12,
        coverage: "",
        description: "",
        status: "active",
      },
      loading: false,
      error: "",
    })
  }

  const handleOpenEdit = (pkg: CarePackage | ProtectionPackage) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedPackage: pkg,
      formData: {
        code: pkg.code || "",
        name: pkg.name || "",
        price: pkg.price || 0,
        durationMonths: pkg.durationMonths || 12,
        coverage: (pkg as any).coverage || String((pkg as ProtectionPackage).coveragePercentage || ""),
        description: pkg.description || "",
        status: pkg.status || "active",
      },
      loading: false,
      error: "",
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setErrorMsg("")
    setSuccessMsg("")

    const { mode, selectedPackage, formData } = dialogState

    if (!formData.code || !formData.name || !formData.price) {
      setDialogState((prev) => ({
        ...prev,
        loading: false,
        error: t("packages.errors.requiredFields"),
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
          setSuccessMsg(t("packages.toasts.createCareSuccess"))
        } else if (selectedPackage) {
          const res = await packagesService.updateCarePackage(selectedPackage.id, bodyPayload)
          setCarePackages((prev) =>
            prev.map((item) =>
              item.id === selectedPackage.id ? res.data : item
            )
          )
          setSuccessMsg(t("packages.toasts.updateCareSuccess"))
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
          setSuccessMsg(t("packages.toasts.createProtectionSuccess"))
        } else if (selectedPackage) {
          const res = await packagesService.updateProtectionPackage(selectedPackage.id, bodyPayload)
          setProtectionPackages((prev) =>
            prev.map((item) =>
              item.id === selectedPackage.id ? res.data : item
            )
          )
          setSuccessMsg(t("packages.toasts.updateProtectionSuccess"))
        }
      }

      setDialogState((prev) => ({ ...prev, isOpen: false }))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("packages.toasts.operationFailed")
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
        setSuccessMsg(t("packages.toasts.deleteCareSuccess"))
      } else {
        await packagesService.deleteProtectionPackage(id)
        setProtectionPackages((prev) => prev.filter((item) => item.id !== id))
        setSuccessMsg(t("packages.toasts.deleteProtectionSuccess"))
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("packages.toasts.operationFailed")
      setErrorMsg(message)
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string, name: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("packages.confirmDeleteTitle"),
      description: t("packages.confirmDeleteDesc", { name }),
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
