import { TableSkeleton } from "@/components/ui/loading-skeletons"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <TableSkeleton cols={5} rows={5} />
    </div>
  )
}
