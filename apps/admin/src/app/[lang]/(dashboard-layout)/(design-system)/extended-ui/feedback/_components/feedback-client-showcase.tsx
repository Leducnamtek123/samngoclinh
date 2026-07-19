"use client"

import * as React from "react"
import { Play, RotateCcw, AlertTriangle, User, Search, RefreshCw, Layers, Trash2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  InlineAlert,
  ToastCard,
  NotificationCenter,
  NotificationItem,
  EmptyState,
  EmptySearchResult,
  ImagePlaceholder,
  AvatarPlaceholder,
  TableSkeleton,
  CardSkeleton,
  ErrorState,
  OfflineState,
  ConfirmationDialog,
  ProgressIndicator,
  SuccessAnimation,
} from "@/components/ui/feedback-components"

export function FeedbackClientShowcase() {
  // Notification Center State
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: "1",
      title: "Sản phẩm mới đã thêm",
      body: 'Sản phẩm "Sâm Ngọc Linh 5 tuổi" đã được tạo thành công bởi Admin Sâm.',
      type: "success",
      isRead: false,
      createdAt: "5 phút trước",
    },
    {
      id: "2",
      title: "Cảnh báo nhiệt độ vườn",
      body: "Nhiệt độ tại Luống 01 - Trà Linh A vượt mức 28°C. Hệ thống tưới tự động đã được kích hoạt.",
      type: "warning",
      isRead: false,
      createdAt: "15 phút trước",
    },
    {
      id: "3",
      title: "Lỗi đồng bộ cảm biến",
      body: "Cảm biến độ ẩm tại Luống 02 - Trà Linh B bị mất kết nối quá 10 phút.",
      type: "error",
      isRead: true,
      createdAt: "1 giờ trước",
    },
    {
      id: "4",
      title: "Cập nhật ứng dụng",
      body: "Hệ thống quản trị vừa cập nhật lên phiên bản 1.0.5 với cải tiến tốc độ tải biểu đồ.",
      type: "info",
      isRead: true,
      createdAt: "2 giờ trước",
    },
  ])

  // Confirmation Dialog State
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  // Progress State
  const [progressVal, setProgressVal] = React.useState(65)
  const [isSyncing, setIsSyncing] = React.useState(true)

  // Simulated Toast List
  const [showToasts, setShowToasts] = React.useState(true)

  // Success animation reset state key
  const [animationKey, setAnimationKey] = React.useState(0)

  // Active Showcase Toasts State
  const [showcaseToasts, setShowcaseToasts] = React.useState<{ id: string; type: "success" | "info" | "warning" | "error"; title: string; desc: string }[]>([])

  const addShowcaseToast = (type: "success" | "info" | "warning" | "error", title: string, desc: string) => {
    const id = Math.random().toString()
    setShowcaseToasts((prev) => [...prev, { id, type, title, desc }])
    setTimeout(() => {
      setShowcaseToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  // Handlers
  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleNotificationClick = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      setIsDeleting(false)
      setIsDialogOpen(false)
      addShowcaseToast("success", "Đã xóa", "Xóa sản phẩm mẫu thành công!")
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      {/* 1. NOTIFICATIONS & ALERTS */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>1. Alerts & Notification Center</CardTitle>
            <CardDescription>Các biểu ngữ thông báo trực tiếp và trung tâm thông báo.</CardDescription>
          </div>
          <NotificationCenter
            notifications={notifications}
            onMarkAllAsRead={handleMarkAllRead}
            onClearAll={handleClearAll}
            onNotificationClick={handleNotificationClick}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <InlineAlert
            type="success"
            title="Thành công"
            description="Sản phẩm 'Sâm Ngọc Linh 2 tuổi' đã được cập nhật thành công vào danh mục canh tác."
          />
          <InlineAlert
            type="error"
            title="Cảnh báo hệ thống"
            description="Dung lượng bộ nhớ lưu trữ hình ảnh sản phẩm sắp đầy (95%). Vui lòng nâng cấp gói dịch vụ."
            actionLabel="Nâng cấp"
            onAction={() => addShowcaseToast("info", "Nâng cấp dịch vụ", "Yêu cầu nâng cấp gói dịch vụ đã được gửi lên Ban Quản Trị.")}
            onClose={() => addShowcaseToast("info", "Đóng cảnh báo", "Đã đóng biểu ngữ cảnh báo dung lượng lưu trữ.")}
          />
        </CardContent>
      </Card>

      {/* 2. TOAST NOTIFICATIONS */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div>
            <CardTitle>2. Toast Notifications</CardTitle>
            <CardDescription>Thông báo nổi góc màn hình (Slide-in/bounce) báo phản hồi tức thời.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowToasts(!showToasts)}>
            Toggled Display
          </Button>
        </CardHeader>
        <CardContent className="relative min-h-[250px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 p-4 flex flex-col gap-3 items-center justify-center overflow-hidden">
          {showToasts ? (
            <div className="flex flex-col gap-2.5 w-full max-w-xs transition-opacity duration-300">
              <ToastCard
                type="success"
                title="Dữ liệu đã lưu"
                description="Hệ thống đã lưu lại thay đổi thông số cảm biến."
                timeString="Vừa xong"
                onClose={() => addShowcaseToast("info", "Đóng Toast", "Bạn đã nhấn đóng thông báo thành công.")}
              />
              <ToastCard
                type="error"
                title="Lỗi kết nối máy chủ"
                description="Không thể đồng bộ cơ sở dữ liệu."
                timeString="2 phút trước"
                onClose={() => addShowcaseToast("info", "Đóng Toast", "Bạn đã nhấn đóng thông báo lỗi.")}
              />
            </div>
          ) : (
            <p className="text-sm text-slate-400">Bấm nút "Toggled Display" để mở lại danh sách Toast</p>
          )}
        </CardContent>
      </Card>

      {/* 3. EMPTY STATES */}
      <Card className="shadow-sm xl:col-span-2">
        <CardHeader>
          <CardTitle>3. Trạng thái rỗng (Empty States)</CardTitle>
          <CardDescription>Hiển thị khi danh sách trống hoặc bộ lọc không khớp dữ liệu nào.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Empty Inventory (Kho trống)</span>
            <EmptyState
              title="Chưa có sản phẩm nào"
              description="Bạn chưa có sản phẩm nào trong kho. Hãy bắt đầu bằng cách thêm sản phẩm đầu tiên."
              actionLabel="Thêm sản phẩm"
              onAction={() => addShowcaseToast("info", "Hành động", "Mở hộp thoại nhập thông tin sản phẩm mới.")}
            />
          </div>
          
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/30">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-4">Empty Search Result (Không tìm thấy kết quả)</span>
            <EmptySearchResult
              query="Sâm 10 tuổi"
              onClear={() => addShowcaseToast("info", "Hành động", "Đã khôi phục bộ lọc tìm kiếm về mặc định.")}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. LOADING SKELETONS & PLACEHOLDERS */}
      <Card className="shadow-sm xl:col-span-2">
        <CardHeader>
          <CardTitle>4. Loading & Skeletons</CardTitle>
          <CardDescription>Pulsing skeleton loader cho bảng dữ liệu và lưới thẻ sản phẩm.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Table Skeleton Loader</span>
            <TableSkeleton rows={4} cols={4} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 block">Card Skeleton Loader</span>
            <CardSkeleton />
          </div>
        </CardContent>
      </Card>

      {/* 5. IMAGE & AVATAR PLACEHOLDERS */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>5. Image & Avatar Placeholders</CardTitle>
          <CardDescription>Thay thế khi dữ liệu ảnh đại diện hoặc hình sản phẩm bị thiếu.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Avatar Placeholder Stack</span>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                <AvatarPlaceholder name="Nguyễn Linh" className="ring-2 ring-white dark:ring-slate-900" />
                <AvatarPlaceholder name="Thanh Hà" className="ring-2 ring-white dark:ring-slate-900 bg-amber-500" />
                <AvatarPlaceholder name="Anh Tuấn" className="ring-2 ring-white dark:ring-slate-900 bg-blue-500" />
                <AvatarPlaceholder className="ring-2 ring-white dark:ring-slate-900 bg-slate-300 text-slate-600 dark:text-slate-800" />
              </div>
              <span className="text-xs text-slate-500">Hiển thị chữ viết tắt của tên hoặc icon mặc định</span>
            </div>
          </div>
          
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 block">Image Placeholder Card</span>
            <div className="w-full max-w-sm h-32">
              <ImagePlaceholder />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 6. ERROR & OFFLINE STATES */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>6. Error & Offline States</CardTitle>
          <CardDescription>Trạng thái xử lý lỗi kết nối máy chủ và mất kết nối mạng cục bộ.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/20">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Offline Detector (Tự động kích hoạt khi ngắt mạng)</span>
            <div className="bg-amber-50 dark:bg-amber-950/10 border border-amber-200 dark:border-amber-900/30 p-3 rounded-lg flex items-center justify-between text-amber-900 dark:text-amber-400 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs">Trạng thái mạng của bạn: <b>Trực tuyến (Online)</b></span>
              </div>
              <p className="text-[10px] text-slate-400">Thử tắt wifi để banner xuất hiện tự động.</p>
            </div>
            {/* Simulation of OfflineState for demo */}
            <OfflineState onReconnect={() => addShowcaseToast("info", "Đang kết nối lại", "Hệ thống đang kiểm tra lại đường truyền internet...")} className="block shadow-none border-x-0 border-t" />
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-2xl p-4 bg-slate-50/20">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Server Loading Error Card</span>
            <ErrorState onRetry={() => addShowcaseToast("info", "Tải lại dữ liệu", "Đang thử kết nối lại và tải lại dữ liệu...")} />
          </div>
        </CardContent>
      </Card>

      {/* 7. DIALOGS & OVERLAY */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>7. Confirmation Dialog (Hộp thoại xác nhận)</CardTitle>
          <CardDescription>Modal lớp phủ phủ mờ để xác nhận các hành động nguy hiểm.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center min-h-[160px] bg-slate-50/30 rounded-2xl border border-slate-100 dark:border-slate-850">
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            <span>Xóa sản phẩm mẫu</span>
          </Button>

          <ConfirmationDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            title="Xóa sản phẩm này?"
            description='Hành động này sẽ xóa vĩnh viễn sản phẩm "Sâm Ngọc Linh giống Trà Linh" khỏi hệ thống quản lý. Bạn không thể hoàn tác thao tác này.'
            confirmLabel="Xác nhận xóa"
            type="danger"
            isLoading={isDeleting}
          />
        </CardContent>
      </Card>

      {/* 8. PROGRESS & SYNC STATE */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>8. Progress Indicators & Success Animation</CardTitle>
          <CardDescription>Tiến trình tải dữ liệu, trạng thái đồng bộ và hiệu ứng thành công.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <ProgressIndicator progress={progressVal} label="Đang tải dữ liệu vườn sâm..." />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setProgressVal(prev => prev >= 100 ? 0 : prev + 15)}>
                Tăng tiến trình
              </Button>
              <Button variant="outline" size="sm" onClick={() => setIsSyncing(!isSyncing)}>
                {isSyncing ? "Dừng đồng bộ" : "Bắt đầu đồng bộ"}
              </Button>
            </div>
            <ProgressIndicator isSyncing={isSyncing} label="Đang đồng bộ cây trồng với cảm biến IoT..." />
          </div>

          <div className="flex flex-col items-center justify-center p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/20">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Checkmark Draw Animation</span>
            <SuccessAnimation key={animationKey} />
            <Button variant="ghost" size="sm" onClick={() => setAnimationKey(prev => prev + 1)} className="mt-2 text-xs flex items-center gap-1">
              <RotateCcw className="h-3 w-3" />
              <span>Chạy lại hiệu ứng</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Showcase Toasts Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {showcaseToasts.map((toast) => (
          <ToastCard
            key={toast.id}
            type={toast.type}
            title={toast.title}
            description={toast.desc}
            onClose={() => setShowcaseToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </div>
    </div>
  )
}
