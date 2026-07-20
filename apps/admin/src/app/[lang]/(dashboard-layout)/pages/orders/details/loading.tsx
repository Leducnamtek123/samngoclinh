import { DetailsSkeleton } from "@/components/ui/loading-skeletons"

export default function Loading() {
  return (
    <div className="container p-4 md:p-6 mx-auto">
      <DetailsSkeleton />
    </div>
  )
}
