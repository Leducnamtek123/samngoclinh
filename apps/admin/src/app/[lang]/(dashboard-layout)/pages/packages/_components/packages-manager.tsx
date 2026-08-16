"use client"

import React from "react"
import type { CarePackage, ProtectionPackage } from "@/types"

import {
  ConfirmationDialog,
  ToastCard,
} from "@/components/ui/feedback-components"
import { PackageDialog } from "./package-dialog"
import { PackagesHeader } from "./packages-header"
import { PackagesTabs } from "./packages-tabs"
import { usePackagesManager } from "./use-packages-manager"

export type { CarePackage, ProtectionPackage }

interface PackagesManagerProps {
  initialCarePackages: CarePackage[]
  initialProtectionPackages: ProtectionPackage[]
  errorMsg?: string
}

export function PackagesManager({
  initialCarePackages,
  initialProtectionPackages,
  errorMsg: initialError,
}: PackagesManagerProps) {
  const {
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
  } = usePackagesManager({
    initialCarePackages,
    initialProtectionPackages,
    initialError,
  })

  return (
    <div className="space-y-6">
      <PackagesHeader onOpenCreate={handleOpenCreate} />

      <PackagesTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setErrorMsg={setErrorMsg}
        setSuccessMsg={setSuccessMsg}
        carePackages={carePackages}
        protectionPackages={protectionPackages}
        handleOpenEdit={handleOpenEdit}
        handleDelete={handleDelete}
        handleOpenCreate={handleOpenCreate}
      />

      {/* Create / Edit Modal Dialog */}
      <PackageDialog
        isOpen={dialogState.isOpen}
        onClose={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        mode={dialogState.mode}
        formData={dialogState.formData}
        onChange={(updater) =>
          setDialogState((prev) => ({
            ...prev,
            formData: updater(prev.formData),
          }))
        }
        onSubmit={handleSave}
        loading={dialogState.loading}
        error={dialogState.error}
        activeTab={activeTab}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialog.loading}
      />

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
