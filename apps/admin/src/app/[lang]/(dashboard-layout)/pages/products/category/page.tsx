import { Suspense } from "react"

import type { Metadata } from "next"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { CategoriesTable } from "./_components/categories-table"

export const metadata: Metadata = {
  title: "Danh mục sản phẩm | Sâm Ngọc Linh Admin",
  description: "Quản lý danh mục sản phẩm thương mại và phân loại sản phẩm",
}

interface CategoryPageProps {
  params: Promise<{
    lang: string
  }>
}

export default async function CategoryPage({}: CategoryPageProps) {
  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <CategoriesTable />
      </Suspense>
    </div>
  )
}
