"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { fetchApi } from "@/lib/api"

import { useEvent } from "@/hooks/use-event"

export interface EContract {
  id: string
  code?: string
  userId: string
  treeCode?: string
  title?: string
  content?: string
  status: string
  contractValue: number
  paymentStatus: string
  signedAt?: string
  expiredAt: string
  signatureUrl?: string
  isReminderSent?: boolean
  reminderSentAt?: string
  contractType?: string
  partyA?: string
  partyB?: string
  pdfUrl?: string
  terms?: string
}

export interface User {
  id: string
  name?: string
  username?: string
  email?: string
  isVerified?: boolean
}

export interface Tree {
  id: string
  code: string
  name: string
}

interface UseContractsManagerProps {
  initialContracts: EContract[]
  users: User[]
  trees: Tree[]
  initialError?: string
}

export function useContractsManager({
  initialContracts,
  users,
  trees,
  initialError,
}: UseContractsManagerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [contracts, setContracts] = useState<EContract[]>(initialContracts)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const statusFilter = searchParams.get("status") || "all"
  const [paymentFilter, setPaymentFilter] = useState("all")

  // Sync contracts on props change
  useEffect(() => {
    setContracts(initialContracts)
  }, [initialContracts])

  const createQueryString = useCallback(
    (newParams: Record<string, string | null>) => {
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
    },
    [searchParams]
  )

  const onSearch = useEvent(() => {
    const currentSearch = searchParams.get("search") || ""
    if (searchQuery !== currentSearch) {
      router.push(`${pathname}?${createQueryString({ search: searchQuery })}`)
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchQuery, onSearch])

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({ page: newPage.toString() })}`
    )
  }

  const handleStatusFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ status: val })}`)
  }

  const [errorMsg, setErrorMsg] = useState(initialError || "")
  const [successMsg, setSuccessMsg] = useState("")

  // Consolidated Dialog State
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    loading: boolean
    error: string
    selectedContract: EContract | null
    mode: "create" | "edit"
    formData: {
      userId: string
      treeCode: string
      title: string
      content: string
      contractValue: number
      paymentStatus: string
      status: string
      expiredAt: string
      contractType: string
      partyA: string
      partyB: string
      pdfUrl: string
      terms: string
    }
  }>({
    isOpen: false,
    loading: false,
    error: "",
    selectedContract: null,
    mode: "create",
    formData: {
      userId: "",
      treeCode: "none",
      title: "",
      content: "",
      contractValue: 0,
      paymentStatus: "unpaid",
      status: "pending",
      expiredAt: "",
      contractType: "purchase",
      partyA: "Sâm Ngọc Linh Farm",
      partyB: "",
      pdfUrl: "",
      terms: "",
    },
  })

  const filteredContracts = contracts.filter((contract) => {
    const matchesPayment =
      paymentFilter === "all" || contract.paymentStatus === paymentFilter
    return matchesPayment
  })

  const handleOpenCreate = () => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    setDialogState({
      isOpen: true,
      loading: false,
      error: "",
      selectedContract: null,
      mode: "create",
      formData: {
        userId: users[0]?.id || "",
        treeCode: trees[0]?.code || "none",
        title: "Hợp đồng ký gửi và chăm sóc sâm Ngọc Linh giống",
        content:
          "BÊN A đồng ý ký gửi sâm Ngọc Linh tại nông trại của BÊN B. BÊN B cam kết thực hiện quy trình chăm sóc tiêu chuẩn, bón phân hữu cơ và bảo vệ cây giống...",
        contractValue: 5000000,
        paymentStatus: "unpaid",
        status: "pending",
        expiredAt: nextYear.toISOString().substring(0, 10),
        contractType: "purchase",
        partyA: "Sâm Ngọc Linh Farm",
        partyB: "",
        pdfUrl: "",
        terms: "",
      },
    })
  }

  const handleOpenEdit = (contract: EContract) => {
    setDialogState({
      isOpen: true,
      loading: false,
      error: "",
      selectedContract: contract,
      mode: "edit",
      formData: {
        userId: contract.userId,
        treeCode: contract.treeCode || "none",
        title: contract.title || "",
        content: contract.content || "",
        contractValue: contract.contractValue,
        paymentStatus: contract.paymentStatus,
        status: contract.status,
        expiredAt: new Date(contract.expiredAt).toISOString().substring(0, 10),
        contractType: contract.contractType || "purchase",
        partyA: contract.partyA || "Sâm Ngọc Linh Farm",
        partyB: contract.partyB || "",
        pdfUrl: contract.pdfUrl || "",
        terms: contract.terms || "",
      },
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!dialogState.formData.userId) {
      setDialogState((prev) => ({
        ...prev,
        error: "Vui lòng chọn khách hàng chủ hợp đồng",
      }))
      return
    }
    if (!dialogState.formData.title.trim()) {
      setDialogState((prev) => ({
        ...prev,
        error: "Vui lòng nhập tiêu đề hợp đồng",
      }))
      return
    }

    setDialogState((prev) => ({ ...prev, loading: true, error: "" }))
    setSuccessMsg("")

    try {
      const payload: any = {
        userId: dialogState.formData.userId,
        title: dialogState.formData.title,
        content: dialogState.formData.content,
        contractValue: Number(dialogState.formData.contractValue),
        paymentStatus: dialogState.formData.paymentStatus,
        expiredAt: new Date(dialogState.formData.expiredAt).toISOString(),
        contractType: dialogState.formData.contractType,
        partyA: dialogState.formData.partyA,
        partyB: dialogState.formData.partyB || undefined,
        pdfUrl: dialogState.formData.pdfUrl || undefined,
        terms: dialogState.formData.terms || undefined,
      }
      if (dialogState.formData.treeCode !== "none") {
        payload.treeCode = dialogState.formData.treeCode
      }

      if (dialogState.mode === "create") {
        const res = await fetchApi("/admin/contracts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })
        const payloadData = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payloadData?.message || "Không thể tạo hợp đồng mới",
          }))
        } else {
          setContracts((prev) => [payloadData.data, ...prev])
          setSuccessMsg("Tạo hợp đồng điện tử mới thành công!")
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      } else if (dialogState.mode === "edit" && dialogState.selectedContract) {
        payload.status = dialogState.formData.status
        const res = await fetchApi(
          `/admin/contracts/${dialogState.selectedContract.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        )
        const payloadData = await res.json()
        if (res.status >= 400) {
          setDialogState((prev) => ({
            ...prev,
            error: payloadData?.message || "Không thể cập nhật hợp đồng",
          }))
        } else {
          setContracts((prev) =>
            prev.map((c) =>
              c.id === dialogState.selectedContract!.id ? payloadData.data : c
            )
          )
          setSuccessMsg("Cập nhật thông tin hợp đồng thành công!")
          setDialogState((prev) => ({ ...prev, isOpen: false }))
          router.refresh()
        }
      }
    } catch (err) {
      console.error(err)
      setDialogState((prev) => ({ ...prev, error: "Lỗi kết nối máy chủ API" }))
    } finally {
      setDialogState((prev) => ({ ...prev, loading: false }))
    }
  }

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id)
  }

  const confirmDelete = async () => {
    if (!deleteConfirmId) return
    const id = deleteConfirmId
    setDeleteConfirmId(null)

    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await fetchApi(`/admin/contracts/${id}`, {
        method: "DELETE",
      })
      if (res.status >= 400) {
        const payload = await res.json()
        const msg = payload?.message || "Không thể xóa hợp đồng này."
        setErrorMsg(msg)
        toast.error(msg)
      } else {
        setContracts((prev) => prev.filter((c) => c.id !== id))
        setSuccessMsg("Đã xóa hợp đồng điện tử thành công!")
        toast.success("Đã xóa hợp đồng điện tử thành công!")
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi hệ thống khi thực hiện xóa.")
      toast.error("Lỗi hệ thống khi thực hiện xóa.")
    }
  }

  const handleCheckExpiry = async () => {
    setSuccessMsg("")
    setErrorMsg("")
    try {
      const res = await fetchApi("/admin/contracts/check-expiry", {
        method: "POST",
      })
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể kiểm tra hạn hợp đồng.")
      } else {
        const count = payload.data?.count || 0
        const notifiedList = payload.data?.notified || []

        // Reload list to get updated reminder states
        const listRes = await fetchApi("/admin/contracts")
        const listPayload = await listRes.json()
        if (listRes.status < 400 && Array.isArray(listPayload.data)) {
          setContracts(listPayload.data)
        }

        if (count === 0) {
          setSuccessMsg(
            "Đã quét xong: Không có hợp đồng nào sắp hết hạn trong vòng 7 ngày tới."
          )
        } else {
          setSuccessMsg(
            `Quét & thông báo thành công: Phát hiện ${count} hợp đồng sắp hết hạn. Đã gửi cảnh báo nhắc gia hạn tới các hợp đồng: ${notifiedList.join(", ")}.`
          )
        }
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Lỗi kết nối máy chủ khi quét hạn hợp đồng.")
    }
  }

  return {
    contracts,
    filteredContracts,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    searchQuery,
    setSearchQuery,
    statusFilter,
    paymentFilter,
    setPaymentFilter,
    dialogState,
    setDialogState,
    handleOpenCreate,
    handleOpenEdit,
    handleSave,
    handleDelete,
    deleteConfirmId,
    setDeleteConfirmId,
    confirmDelete,
    handleCheckExpiry,
    handlePageChange,
    handleStatusFilterChange,
  }
}
