"use client"

import { useEffect, useState } from "react"
import { fetchApi } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Eye, Mail, Phone, User, Calendar } from "lucide-react"

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

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState("")
  
  // Dialog state
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const loadContacts = async () => {
    setLoading(true)
    setErrorMsg("")
    try {
      const res = await fetchApi("/admin/contacts")
      const payload = await res.json()
      if (res.status >= 400) {
        setErrorMsg(payload?.message || "Không thể tải danh sách liên hệ.")
      } else {
        setContacts(payload.data?.items || [])
      }
    } catch (e) {
      console.error(e)
      setErrorMsg("Không thể kết nối đến máy chủ API")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  const handleViewDetail = async (contact: ContactRequest) => {
    setSelectedContact(contact)
    setIsDialogOpen(true)
    setDetailLoading(true)

    try {
      // Mark as read in the backend by calling the detail endpoint
      const res = await fetchApi(`/admin/contacts/${contact.id}`)
      const payload = await res.json()
      if (res.ok && payload.data) {
        // Update local status of contact to read
        setContacts(prev =>
          prev.map(c => (c.id === contact.id ? { ...c, isRead: true } : c))
        )
        setSelectedContact(payload.data)
      }
    } catch (e) {
      console.error("Error loading contact detail:", e)
    } finally {
      setDetailLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("vi-VN", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Liên hệ</h1>
        <p className="text-muted-foreground">
          Duyệt danh sách và chi tiết các yêu cầu liên hệ, tin nhắn từ khách hàng gửi về hệ thống.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu liên hệ</CardTitle>
          <CardDescription>
            Hiển thị các thông tin tên, email, số điện thoại, tiêu đề và nội dung tin nhắn gửi về.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {errorMsg && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Lỗi</AlertTitle>
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Đang tải danh sách liên hệ...
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có yêu cầu liên hệ nào được gửi đến.
            </div>
          ) : (
            <Table>
              <TableHeader>
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
                  <TableRow key={contact.id} className={!contact.isRead ? "bg-muted/40 font-medium" : ""}>
                    <TableCell>
                      <Badge variant={contact.isRead ? "secondary" : "default"} className={!contact.isRead ? "bg-blue-600 text-white" : ""}>
                        {contact.isRead ? "Đã đọc" : "Chưa đọc"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">{contact.fullName}</span>
                      </div>
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
                      >
                        <Eye className="size-4 mr-1" />
                        Chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="size-5 text-primary" />
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
                  <p className="text-sm font-semibold">{selectedContact.fullName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" /> Ngày gửi
                  </span>
                  <p className="text-sm font-semibold">{formatDate(selectedContact.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="size-3" /> Email
                  </span>
                  <p className="text-sm font-semibold break-all">{selectedContact.email}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="size-3" /> Số điện thoại
                  </span>
                  <p className="text-sm font-semibold">{selectedContact.phoneNumber}</p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-semibold">Tiêu đề:</span>
                <p className="text-sm font-medium bg-muted p-2 rounded-md">{selectedContact.subject}</p>
              </div>

              <div className="space-y-2">
                <span className="text-xs text-muted-foreground font-semibold">Nội dung tin nhắn:</span>
                <div className="text-sm bg-muted/60 p-3 rounded-md min-h-[100px] whitespace-pre-wrap">
                  {detailLoading ? "Đang tải chi tiết..." : selectedContact.message}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
