"use client"

import { Suspense } from "react"
import { LayoutGrid } from "lucide-react"
import { useBedsTable } from "./use-beds-table"
import { BedsLeftSidebar } from "./beds-left-sidebar"
import { BedFormDialog, BedsOtherDialogs } from "./beds-dialogs"
import { BedsRightSidebar } from "./beds-right-sidebar"
import { BedsInteractiveGrid } from "./beds-interactive-grid"
import type { Bed, Garden } from "./use-beds-table"

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

function BedsTableContent({ initialBeds, metadata, gardens, errorMsg: initialError }: BedsTableProps) {
  const tableData = useBedsTable(initialBeds, metadata, gardens, initialError)

  const {
    leftSidebarOpen,
    setLeftSidebarOpen,
    beds,
    selectedBedCode,
    setSelectedBedCode,
    openCreateDialog,
    searchVal,
    setSearchVal,
    statusFilter,
    handleStatusFilterChange,
    gardenFilter,
    handleGardenFilterChange,
    handleToggleStatus,
    openEditDialog,
    handleDeleteBed,
    handleScroll,
    filteredBeds,
    dialogState,
    setDialogState,
    formData,
    setFormData,
    handleSaveBed,
    confirmState,
    setConfirmState,
    isQrDialogOpen,
    setIsQrDialogOpen,
    qrCodeData,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    activeBed,
    rightSidebarOpen,
    setRightSidebarOpen,
    selectedLocationId,
    locations,
    loadingTreeDetails,
    selectedTreeDetails,
    selectedTreeCareLogs,
    handleSingleWatering,
    handleSingleFertilizing,
    getOwnerName,
  } = tableData

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-120px)] min-h-[700px] overflow-hidden bg-slate-50/50 dark:bg-slate-950 p-2 rounded-2xl relative">
      <BedsLeftSidebar
        leftSidebarOpen={leftSidebarOpen}
        setLeftSidebarOpen={setLeftSidebarOpen}
        beds={beds}
        selectedBedCode={selectedBedCode}
        setSelectedBedCode={setSelectedBedCode}
        openCreateDialog={openCreateDialog}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        statusFilter={statusFilter}
        handleStatusFilterChange={handleStatusFilterChange}
        gardenFilter={gardenFilter}
        handleGardenFilterChange={handleGardenFilterChange}
        gardens={gardens}
        handleToggleStatus={handleToggleStatus}
        openEditDialog={openEditDialog}
        handleDeleteBed={handleDeleteBed}
        handleScroll={handleScroll}
        filteredBeds={filteredBeds}
      />

      {/* 2. CENTER AREA: Interactive Grid View */}
      <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {activeBed ? (
          <BedsInteractiveGrid tableData={tableData} gardens={gardens} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 font-semibold bg-white dark:bg-slate-900">
            <LayoutGrid className="h-10 w-10 text-slate-350 mb-2.5 animate-pulse" />
            Vui lòng chọn hoặc tạo một luống sâm để bắt đầu quản lý.
          </div>
        )}
      </div>

      {activeBed && (
        <BedsRightSidebar
          rightSidebarOpen={rightSidebarOpen}
          setRightSidebarOpen={setRightSidebarOpen}
          selectedLocationId={selectedLocationId}
          locations={locations}
          loadingTreeDetails={loadingTreeDetails}
          selectedTreeDetails={selectedTreeDetails}
          selectedTreeCareLogs={selectedTreeCareLogs}
          handleSingleWatering={handleSingleWatering}
          handleSingleFertilizing={handleSingleFertilizing}
          getOwnerName={getOwnerName}
        />
      )}

      <BedFormDialog
        dialogState={dialogState}
        setDialogState={setDialogState}
        formData={formData}
        setFormData={setFormData}
        gardens={gardens}
        handleSaveBed={handleSaveBed}
      />

      <BedsOtherDialogs
        confirmState={confirmState}
        setConfirmState={setConfirmState}
        isQrDialogOpen={isQrDialogOpen}
        setIsQrDialogOpen={setIsQrDialogOpen}
        qrCodeData={qrCodeData}
        successMsg={successMsg}
        setSuccessMsg={setSuccessMsg}
        errorMsg={errorMsg}
        setErrorMsg={setErrorMsg}
      />
    </div>
  )
}

export function BedsTable(props: BedsTableProps) {
  return (
    <Suspense fallback={<div className="text-center py-12">Đang tải quản lý luống sâm...</div>}>
      <BedsTableContent {...props} />
    </Suspense>
  )
}
export type { Bed, Garden }
