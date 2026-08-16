export type ShopItemStatus = "active" | "draft" | "out_of_stock" | "archived"

export interface ShopItemAttribute {
  name: string
  value: string
  unit?: string
}

export interface ShopItem {
  id: string
  code: string
  name: string
  slug?: string
  description?: string
  shortDescription?: string
  price: number
  originalPrice?: number
  unit: string
  categoryId?: string
  category?: string
  stock?: number
  status?: ShopItemStatus | string
  images?: string[]
  tags?: string[]
  attributes?: Record<string, string | number> | ShopItemAttribute[]
  isFeatured?: boolean
  rating?: number
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface ShopCategory {
  id: string
  code: string
  name: string
  slug?: string
  description?: string
  imageUrl?: string
  parentId?: string | null
  isActive: boolean
  sortOrder?: number
  itemCount?: number
  createdAt?: string
  updatedAt?: string
}
