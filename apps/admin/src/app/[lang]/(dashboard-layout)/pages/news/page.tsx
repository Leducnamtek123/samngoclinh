import { Suspense } from "react"

import type { Metadata } from "next"
import type { Article, PaginationMeta } from "@/types"

import { contentService } from "@/services/content.service"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { NewsManager } from "./_components/news-manager"

export const metadata: Metadata = {
  title: "Quản lý Tin tức | Sâm Ngọc Linh Admin",
  description: "Quản trị các bài viết, tin tức và hoạt động cộng đồng",
}

interface NewsPageProps {
  params: Promise<{
    lang: string
  }>
  searchParams: Promise<{
    page?: string
    perPage?: string
    search?: string
    status?: string
  }>
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page || "1"
  const perPage = resolvedSearchParams.perPage || "10"
  const search = resolvedSearchParams.search || ""
  const status = resolvedSearchParams.status || ""

  let articles: Article[] = []
  let metadata: PaginationMeta | null = null
  let errorMsg = ""

  try {
    const payload = await contentService.getArticles({
      page,
      perPage,
      search,
      status,
    })

    articles = Array.isArray(payload.data)
      ? payload.data
      : Array.isArray((payload.data as any)?.items)
      ? (payload.data as any).items
      : []
    metadata = payload.metadata || null
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Không thể kết nối đến máy chủ API"
    console.error("Error fetching articles:", e)
    errorMsg = message
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <Suspense fallback={<TableSkeleton cols={5} rows={5} />}>
        <NewsManager
          initialArticles={articles}
          metadata={metadata}
          errorMsg={errorMsg}
        />
      </Suspense>
    </div>
  )
}
