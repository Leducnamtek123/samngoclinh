"use client"

import { useTranslation } from "@/providers/i18n-provider"
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
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("users.security.browserApp")}</TableHead>
          <TableHead>{t("users.security.device")}</TableHead>
          <TableHead>{t("users.security.location")}</TableHead>
          <TableHead>{t("users.security.time")}</TableHead>
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
              {t("users.security.emptyLogs")}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
