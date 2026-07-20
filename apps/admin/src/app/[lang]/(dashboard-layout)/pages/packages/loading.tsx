import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Care Packages Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Protection Packages Column */}
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-border">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-28" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                  <div className="pt-2 flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
