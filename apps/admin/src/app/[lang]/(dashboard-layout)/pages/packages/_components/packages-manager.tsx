"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { fetchApi } from "@/lib/api"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ConfirmationDialog,
  EmptySearchResult,
  EmptyState,
  ErrorState,
  ToastCard,
} from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { PackageDialog } from "./package-dialog"
import { CarePackagesList, ProtectionPackagesList } from "./packages-list"

interface CarePackage {
  id: string
  code: string
  name: string
  price: number
  description?: string
  durationMonths: number
  status: string
}

interface ProtectionPackage {
  id: string
  code: string
  name: string
  price: number
  description?: string
  coverage?: string
  status: string
}

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

interface PackagesHeaderProps {
  onOpenCreate: () => void
}

function PackagesHeader({ onOpenCreate }: PackagesHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý Gói dịch vụ
        </h1>
        <p className="text-muted-foreground">
          Cấu hình các gói chăm sóc định kỳ và bảo hiểm/bảo vệ cây giống sâm.
        </p>
      </div>
      <Button
        onClick={onOpenCreate}
        className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
      >
        <Plus className="h-4 w-4" /> Thêm gói mới
      </Button>
    </div>
  )
}

interface PackagesTabsProps {
  activeTab: "care" | "protection"
  setActiveTab: (tab: "care" | "protection") => void
  setErrorMsg: (msg: string) => void
  setSuccessMsg: (msg: string) => void
  carePackages: CarePackage[]
  protectionPackages: ProtectionPackage[]
  handleOpenEdit: (pkg: any) => void
  handleDelete: (id: string) => void
  handleOpenCreate: () => void
}

function PackagesTabs({
  activeTab,
  setActiveTab,
  setErrorMsg,
  setSuccessMsg,
  carePackages,
  protectionPackages,
  handleOpenEdit,
  handleDelete,
  handleOpenCreate,
}: PackagesTabsProps) {
  return (
    <Tabs
      defaultValue="care"
      onValueChange={(val) => {
        setActiveTab(val as any)
        setErrorMsg("")
        setSuccessMsg("")
      }}
      className="w-full"
    >
      <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-4">
        <TabsTrigger value="care">Gói Chăm Sóc</TabsTrigger>
        <TabsTrigger value="protection">Gói Bảo Vệ</TabsTrigger>
      </TabsList>

      <TabsContent value="care">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>Gói Chăm Sóc Định Kỳ</CardTitle>
            <CardDescription>
              Cung cấp phân bón, tưới nước và chăm sóc sâm theo định kỳ tháng.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CarePackagesList
              packages={carePackages}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onOpenCreate={handleOpenCreate}
              formatVND={formatVND}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="protection">
        <Card className="border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle>Gói Bảo Vệ & Bảo Hiểm Cây</CardTitle>
            <CardDescription>
              Bảo vệ cây giống trước dịch bệnh, rủi ro thiên tai và bồi thường.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProtectionPackagesList
              packages={protectionPackages}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onOpenCreate={handleOpenCreate}
              formatVND={formatVND}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
})

const formatVND = (price: number) => {
  return vndFormatter.format(price)
}
