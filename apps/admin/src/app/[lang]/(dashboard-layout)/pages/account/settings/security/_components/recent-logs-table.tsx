import { formatDateWithTime } from "@/lib/utils"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LogItem {
  id: string
  userAgent: string
  device: string
  location: string
  createdAt: string
}

export function RecentLogsTable({ logs = [] }: { logs?: LogItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trình duyệt / Ứng dụng</TableHead>
          <TableHead>Thiết bị</TableHead>
          <TableHead>Địa điểm</TableHead>
          <TableHead>Thời gian</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.length > 0 ? (
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.userAgent}</TableCell>
              <TableCell>{log.device}</TableCell>
              <TableCell>{log.location}</TableCell>
              <TableCell>{formatDateWithTime(log.createdAt)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
              Phiên đăng nhập hiện tại đang hoạt động an toàn. Chưa có nhật ký cảnh báo bảo mật.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
