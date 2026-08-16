"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { useTranslation } from "@/providers/i18n-provider"

export interface ProductCategory {
  id: string
  code: string
  name: string
  slug: string
  description?: string
  productCount: number
  status: "active" | "inactive"
  createdAt?: string
}

export const INITIAL_CATEGORIES: ProductCategory[] = [
  {
    id: "cat-processed",
    code: "processed",
    name: "Sản phẩm chế biến",
    slug: "san-pham-che-bien",
    description:
      "Rượu sâm, trà sâm, mật ong sâm, cao sâm và các chế phẩm cao cấp",
    productCount: 6,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "cat-supplies",
    code: "supplies",
    name: "Vật tư & Giống nông nghiệp",
    slug: "vat-tu-giong-nong-nghiep",
    description: "Phân bón sinh học, đất trồng sâm, chậu và dụng cụ chăm sóc",
    productCount: 4,
    status: "active",
    createdAt: "2024-01-20",
  },
  {
    id: "cat-organic",
    code: "organic",
    name: "Sản phẩm Hữu cơ & Sâm tươi",
    slug: "san-pham-huu-co-sam-tuoi",
    description: "Sâm tươi nguyên củ Ngọc Linh, sâm thái lát sấy dẻo tự nhiên",
    productCount: 3,
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: "cat-beverage",
    code: "beverage",
    name: "Nước uống & Đồ uống Sâm",
    slug: "nuoc-uong-do-uong-sam",
    description: "Nước sâm hòa tan, nước giải khát dinh dưỡng Ngọc Linh",
    productCount: 2,
    status: "active",
    createdAt: "2024-02-10",
  },
  {
    id: "cat-cosmetics",
    code: "cosmetics",
    name: "Mỹ phẩm & Chăm sóc sắc đẹp",
    slug: "my-pham-cham-soc-sac-dep",
    description: "Kem dưỡng da tinh chất sâm, serum trẻ hóa Sâm Ngọc Linh",
    productCount: 1,
    status: "active",
    createdAt: "2024-03-05",
  },
]

export function useCategoriesManager() {
  const router = useRouter()
  const { t } = useTranslation()

  const [categories, setCategories] =
    useState<ProductCategory[]>(INITIAL_CATEGORIES)
  const [searchQuery, setSearchQuery] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    title: string
    description: string
    action: () => void
    loading: boolean
  }>({
    isOpen: false,
    title: "",
    description: "",
    action: () => {},
    loading: false,
  })

  const [dialogState, setDialogState] = useState<{
    isOpen: boolean
    mode: "create" | "edit"
    selectedCategory: ProductCategory | null
  }>({
    isOpen: false,
    mode: "create",
    selectedCategory: null,
  })

  const openCreateDialog = () => {
    setDialogState({
      isOpen: true,
      mode: "create",
      selectedCategory: null,
    })
  }

  const openEditDialog = (category: ProductCategory) => {
    setDialogState({
      isOpen: true,
      mode: "edit",
      selectedCategory: category,
    })
  }

  const handleSaveCategory = (data: {
    code: string
    name: string
    slug: string
    description?: string
    status: "active" | "inactive"
  }) => {
    if (dialogState.mode === "create") {
      const newCategory: ProductCategory = {
        id: `cat-${Date.now()}`,
        code: data.code || `CAT-${Math.floor(Math.random() * 1000)}`,
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-"),
        description: data.description,
        productCount: 0,
        status: data.status,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCategories((prev) => [newCategory, ...prev])
      setSuccessMsg("Tạo danh mục sản phẩm mới thành công")
    } else if (dialogState.selectedCategory) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === dialogState.selectedCategory?.id
            ? {
                ...item,
                code: data.code,
                name: data.name,
                slug: data.slug,
                description: data.description,
                status: data.status,
              }
            : item
        )
      )
      setSuccessMsg("Cập nhật danh mục sản phẩm thành công")
    }
    setDialogState((prev) => ({ ...prev, isOpen: false }))
    router.refresh()
  }

  const handleDelete = (id: string) => {
    const item = categories.find((c) => c.id === id)
    setConfirmDialog({
      isOpen: true,
      title: "Xác nhận xóa danh mục",
      description: `Bạn có chắc chắn muốn xóa danh mục "${item?.name}" không? Thao tác này không thể hoàn tác.`,
      action: () => {
        setCategories((prev) => prev.filter((c) => c.id !== id))
        setSuccessMsg("Đã xóa danh mục sản phẩm")
        setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
      },
      loading: false,
    })
  }

  const filteredCategories = categories.filter((cat) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.code.toLowerCase().includes(q) ||
      cat.slug.toLowerCase().includes(q)
    )
  })

  return {
    categories: filteredCategories,
    searchQuery,
    setSearchQuery,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    confirmDialog,
    setConfirmDialog,
    dialogState,
    setDialogState,
    openCreateDialog,
    openEditDialog,
    handleSaveCategory,
    handleDelete,
  }
}
