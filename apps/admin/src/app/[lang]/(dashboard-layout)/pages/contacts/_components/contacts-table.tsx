"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Calendar,
  Eye,
  Mail,
  Phone,
  Search,
  User,
} from "lucide-react"

import { fetchApi } from "@/lib/api"

import { useEvent } from "@/hooks/use-event"
import { Pagination } from "@/components/ui/app-pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ToastCard } from "@/components/ui/feedback-components"
import { Input } from "@/components/ui/input"
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

interface ContactRequest {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

interface ContactsTableProps {
  initialContacts: ContactRequest[]
  metadata: {
    page: number
    perPage: number
    totalPage: number
    count: number
    hasNext: boolean
    hasPrevious: boolean
  } | null
  errorMsg?: string
}

export function ContactsTable({
  initialContacts,
  metadata,
  errorMsg,
}: ContactsTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [localError, setLocalError] = useState(errorMsg || "")

  useEffect(() => {
    if (errorMsg) {
      setLocalError(errorMsg)
    }
  }, [errorMsg])

  const [contacts, setContacts] = useState<ContactRequest[]>(initialContacts)

  // URL query params states
  const initialSearch = searchParams.get("search") || ""
  const [searchVal, setSearchVal] = useState(initialSearch)

  const isReadFilter = searchParams.get("isRead") || "all"

  // Dialog state
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(
    null
  )
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  // Sync contacts on props change
  useEffect(() => {
    setContacts(initialContacts)
  }, [initialContacts])

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
    if (searchVal !== currentSearch) {
      router.push(`${pathname}?${createQueryString({ search: searchVal })}`)
    }
  })

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch()
    }, 400)
    return () => clearTimeout(handler)
  }, [searchVal, onSearch])

  const handlePageChange = (newPage: number) => {
    router.push(
      `${pathname}?${createQueryString({ page: newPage.toString() })}`
    )
  }

  const handleReadFilterChange = (val: string) => {
    router.push(`${pathname}?${createQueryString({ isRead: val })}`)
  }

  const handleViewDetail = async (contact: ContactRequest) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
    setDetailLoading(true)

    try {
      const res = await fetchApi(`/admin/contacts/${contact.id}`)
      const payload = await res.json()
      if (res.ok && payload.data) {
        setContacts((prev) =>
          prev.map((c) => (c.id === contact.id ? { ...c, isRead: true } : c))
        )
        setSelectedContact(payload.data)
        router.refresh() // Refresh page to keep unread counts synced
      }
    } catch (e) {
      console.error("Error loading contact detail:", e)
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm tên, email, tiêu đề..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-10 text-sm pl-9 bg-background border border-input"
          />
        </div>

        <div className="w-full sm:w-48">
          <Select value={isReadFilter} onValueChange={handleReadFilterChange}>
            <SelectTrigger className="h-10 text-sm bg-background border border-input">
              <SelectValue placeholder="Đọc / Chưa đọc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="false">Chưa đọc</SelectItem>
              <SelectItem value="true">Đã đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed rounded-xl bg-muted/10">
          Chưa có yêu cầu liên hệ nào được gửi đến.
        </div>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden shadow-xs bg-card">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Liên hệ</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Ngày gửi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow
                  key={contact.id}
                  className={!contact.isRead ? "bg-muted/40 font-medium" : ""}
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        contact.isRead
                          ? "bg-slate-500/10 text-slate-600 border-transparent font-semibold"
                          : "bg-blue-500/10 text-blue-600 border-transparent font-semibold"
                      }
                    >
                      {contact.isRead ? "Đã đọc" : "Chưa đọc"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">{contact.fullName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-xs text-muted-foreground">
                      <span>{contact.email}</span>
                      <span>{contact.phoneNumber}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {contact.subject}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {formatDate(contact.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(contact)}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      <Eye className="size-4 mr-1" />
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <Pagination metadata={metadata} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-emerald-600" />
              Chi tiết tin nhắn liên hệ
            </DialogTitle>
            <DialogDescription>
              Xem nội dung đầy đủ của yêu cầu liên hệ.
            </DialogDescription>
          </DialogHeader>

          {selectedContact && (
            <div className="space-y-4 my-2">
              <div className="grid grid-cols-2 gap-4 border-b pb-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="size-3" /> Họ tên
                  </span>
                  <p className="text-sm font-semibold">
                    {selectedContact.fullName}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" /> Ngày gửi
                  </span>
                  <p className="text-sm font-semibold">
                    {formatDate(selectedContact.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" /> Email
                  </span>
                  <p className="text-sm font-semibold break-all">
                    {selectedContact.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3" /> Số điện thoại
                  </span>
                  <p className="text-sm font-semibold">
                    {selectedContact.phoneNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  Tiêu đề:
                </span>
                <p className="text-sm font-medium bg-muted p-2 rounded-md">
                  {selectedContact.subject}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-semibold">
                  Nội dung tin nhắn:
                </span>
                <div className="text-sm bg-muted/60 p-3 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {detailLoading
                    ? "Đang tải chi tiết..."
                    : selectedContact.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {localError && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={localError}
            onClose={() => setLocalError("")}
          />
        )}
      </div>
    </div>
  )
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  })
}
