import { Suspense } from "react"

import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { TableSkeleton } from "@/components/ui/loading-skeletons"
import { NewsManager } from "./_components/news-manager"

export const metadata: Metadata = {
  title: "Quản lý Tin tức | Sâm Ngọc Linh Admin",
  description:
    "Quản lý các bài viết tin tức, hướng dẫn và kiến thức cho dự án sâm Ngọc Linh",
}

interface Article {
  id: string
  slug: string
  title: string
  category: string
  summary: string
  body?: string
  status: string
  sortOrder?: number
  coverImage?: string
  createdAt: string
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
  const status = resolvedSearchParams.status || "" // This maps to category filter on frontend, status on backend

  let articles: Article[] = []
  let metadata: any = null
  let errorMsg = ""

  try {
    const queryParams = new URLSearchParams()
    queryParams.append("page", page)
    queryParams.append("perPage", perPage)
    if (search) queryParams.append("search", search)
    if (status && status !== "all") queryParams.append("category", status) // Use category filtering on the backend

    const res = await fetchApi(
      `/public/content/articles?${queryParams.toString()}`
    )
    const payload = await res.json()
    if (res.status >= 400) {
      errorMsg = payload?.message || "Failed to load articles"
    } else {
      articles = Array.isArray(payload.data)
        ? payload.data
        : payload.data?.items || []
      metadata = payload.metadata || null
    }
  } catch (e) {
    console.error("Error fetching articles on server:", e)
    errorMsg = "Không thể kết nối đến máy chủ API"
  }

  return (
    <div className="container p-4 md:p-6 mx-auto space-y-6">
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
