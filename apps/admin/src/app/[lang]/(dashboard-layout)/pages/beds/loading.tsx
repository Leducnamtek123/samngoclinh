import { BedsSkeleton } from "@/components/ui/loading-skeletons"

export default function Loading() {
  return (
    <div className="w-full p-4 md:p-6">
      <BedsSkeleton />
    </div>
  )
}
