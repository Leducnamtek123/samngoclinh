export type ArticleStatus = "draft" | "published" | "archived"

export interface Banner {
  id: string
  title: string
  description?: string
  imageUrl: string
  linkUrl?: string
  position?: string
  isActive: boolean
  sortOrder?: number
  startAt?: string | null
  endAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export interface Article {
  id: string
  title: string
  slug: string
  summary?: string
  content?: string
  body?: string
  coverImageUrl?: string
  coverImage?: string
  image?: string
  authorName?: string
  category?: string
  tags?: string[]
  status: ArticleStatus | string
  views?: number
  isFeatured?: boolean
  sortOrder?: number
  metadata?: {
    authorName?: string
    [key: string]: unknown
  }
  publishedAt?: string | null
  createdAt: string
  updatedAt?: string
}
