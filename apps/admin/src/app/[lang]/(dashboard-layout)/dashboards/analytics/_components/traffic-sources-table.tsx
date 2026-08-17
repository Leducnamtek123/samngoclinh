"use client"

import type { DynamicIconNameType } from "@/types"
import type { TrafficSourcesType } from "../types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PercentageChangeBadge } from "@/components/dashboards/percentage-change-badge"
import { DynamicIcon } from "@/components/dynamic-icon"

export function TrafficSourcesTable({
  data,
}: {
  data: TrafficSourcesType["sources"]
}) {
  return (
    <Table className="rounded-lg overflow-hidden">
      <TableHeader className="sr-only">
        <TableRow>
          <TableHead aria-hidden></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Visitors</TableHead>
          <TableHead>Percentage Change</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(data || []).map((item) => (
          <TableRow key={item.name}>
            <TableCell className="w-6" aria-hidden>
              <DynamicIcon
                name={(item.icon as DynamicIconNameType) || "Globe"}
                style={{ color: item.fill }}
                className="h-3 w-3 stroke-3"
              />
            </TableCell>
            <TableCell className="font-semibold">{item.name}</TableCell>
            <TableCell>
              <span className="text-muted-foreground" aria-hidden>
                Lượt:{" "}
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Number(item.visitors ?? 0).toLocaleString()}
              </span>
            </TableCell>
            <TableCell className="text-end">
              <PercentageChangeBadge value={Number(item.percentageChange ?? 0)} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
