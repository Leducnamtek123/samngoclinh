"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  createArticleAction,
  deleteArticleAction,
  updateArticleAction,
  updateSettingAction,
} from "@/app/actions/content"

import { fetchApi } from "@/lib/api"

import { useTranslation } from "@/providers/i18n-provider"

type Article = {
  id: string
  title: string
  category: string
  publishedAt: string
  image?: string
  summary?: string
}

interface UseContentManagerProps {
  initialArticles: Article[]
  initialBannerSettings: {
    homepage_banner_image_1: string
    homepage_banner_image_2: string
    homepage_banner_image_3: string
    homepage_banner_image_4: string
    homepage_banner_image_5: string
    about_banner_image: string
    news_banner_image: string
    campaigns_banner_image: string
  }
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export function useContentManager({
  initialArticles,
  initialBannerSettings,
}: UseContentManagerProps) {
  const router = useRouter()
  const { t } = useTranslation()

  // Navigation tabs: 'articles' | 'banner'
  const [activeTab, setActiveTab] = useState<"articles" | "banner">("articles")

  // Articles state
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [isOpen, setIsOpen] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)

  // Article form states
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Tin tức")
  const [image, setImage] = useState("")
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Toast & Confirmation Dialog States
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

  // Banner settings states
  const [homepageBanner1, setHomepageBanner1] = useState(
    initialBannerSettings.homepage_banner_image_1
  )
  const [homepageBanner2, setHomepageBanner2] = useState(
    initialBannerSettings.homepage_banner_image_2
  )
  const [homepageBanner3, setHomepageBanner3] = useState(
    initialBannerSettings.homepage_banner_image_3
  )
  const [homepageBanner4, setHomepageBanner4] = useState(
    initialBannerSettings.homepage_banner_image_4
  )
  const [homepageBanner5, setHomepageBanner5] = useState(
    initialBannerSettings.homepage_banner_image_5
  )

  const [aboutBanner, setAboutBanner] = useState(
    initialBannerSettings.about_banner_image
  )
  const [newsBanner, setNewsBanner] = useState(
    initialBannerSettings.news_banner_image
  )
  const [campaignsBanner, setCampaignsBanner] = useState(
    initialBannerSettings.campaigns_banner_image
  )

  const [bannerLoading, setBannerLoading] = useState(false)
  const [bannerError, setBannerError] = useState("")
  const [bannerSuccess, setBannerSuccess] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError("")

    const fd = new FormData()
    fd.append("file", file)

    try {
      const res = await fetchApi("/admin/catalog/upload", {
        method: "POST",
        body: fd,
      })

      const payload = await res.json()
      if (res.status >= 400) {
        setError(payload?.message || t("messages.errorOccurred"))
      } else {
        setImage(payload.data?.url || "")
      }
    } catch (err) {
      console.error(err)
      setError(t("messages.networkError"))
    } finally {
      setUploadingImage(false)
    }
  }

  const openCreateModal = () => {
    setEditingArticle(null)
    setTitle("")
    setCategory("Tin tức")
    setImage("")
    setSummary("")
    setError("")
    setIsOpen(true)
  }

  const openEditModal = (article: Article) => {
    setEditingArticle(article)
    setTitle(article.title)

    const reverseCategoryMap: Record<string, string> = {
      news: "Tin tức",
      faq: "Kiến thức",
      guide: "Hướng dẫn sử dụng app",
      event: "Sự kiện",
    }
    setCategory(reverseCategoryMap[article.category] || article.category)
    setImage(article.image || "")
    setSummary(article.summary || "")
    setError("")
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      setError(t("validation.required"))
      return
    }

    setLoading(true)
    setError("")

    const categoryMap: Record<string, string> = {
      "Tin tức": "news",
      "Kiến thức": "faq",
      "Hướng dẫn sử dụng app": "guide",
      "Sự kiện": "event",
    }

    const dbCategory = categoryMap[category] || "news"
    const generatedSlug = slugify(title)

    const payload = {
      slug: generatedSlug,
      title,
      category: dbCategory,
      coverImage:
        image ||
        "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8",
      summary,
      status: "published",
    }

    let res
    if (editingArticle) {
      res = await updateArticleAction(editingArticle.id, payload)
    } else {
      res = await createArticleAction(payload)
    }

    setLoading(false)

    if (res.success) {
      setIsOpen(false)
      router.refresh()
      const updatedArticle = {
        id: editingArticle?.id || "new-" + Math.random(),
        ...payload,
        image: payload.coverImage,
        publishedAt: new Date().toLocaleDateString("vi-VN"),
      }
      if (editingArticle) {
        setArticles(
          articles.map((a) =>
            a.id === editingArticle.id ? (updatedArticle as any) : a
          )
        )
      } else {
        setArticles([updatedArticle as any, ...articles])
      }
    } else {
      setError(res.error || t("messages.errorOccurred"))
    }
  }

  const performDelete = async (id: string) => {
    setConfirmDialog((prev) => ({ ...prev, loading: true }))
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await deleteArticleAction(id)
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a.id !== id))
        setSuccessMsg(t("messages.deleteSuccess"))
        router.refresh()
      } else {
        setErrorMsg(res.error || t("messages.errorOccurred"))
      }
    } catch (err) {
      console.error(err)
      setErrorMsg(t("messages.networkError"))
    } finally {
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, loading: false }))
    }
  }

  const handleDelete = (id: string) => {
    const article = articles.find((a) => a.id === id)
    setConfirmDialog({
      isOpen: true,
      title: t("common.confirmations.deleteTitle"),
      description: t("common.confirmations.deleteDescription"),
      action: () => performDelete(id),
      loading: false,
    })
  }

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault()
    setBannerLoading(true)
    setBannerError("")
    setBannerSuccess(false)

    try {
      const results = await Promise.all([
        updateSettingAction("homepage_banner_image_1", homepageBanner1),
        updateSettingAction("homepage_banner_image_2", homepageBanner2),
        updateSettingAction("homepage_banner_image_3", homepageBanner3),
        updateSettingAction("homepage_banner_image_4", homepageBanner4),
        updateSettingAction("homepage_banner_image_5", homepageBanner5),
        updateSettingAction("about_banner_image", aboutBanner),
        updateSettingAction("news_banner_image", newsBanner),
        updateSettingAction("campaigns_banner_image", campaignsBanner),
      ])

      const failedResult = results.find((res) => !res.success)

      if (!failedResult) {
        setBannerSuccess(true)
        router.refresh()
      } else {
        setBannerError(failedResult.error || t("messages.errorOccurred"))
      }
    } catch (err: any) {
      setBannerError(err.message || t("messages.networkError"))
    } finally {
      setBannerLoading(false)
    }
  }

  return {
    activeTab,
    setActiveTab,
    articles,
    isOpen,
    setIsOpen,
    editingArticle,
    title,
    setTitle,
    category,
    setCategory,
    image,
    setImage,
    summary,
    setSummary,
    loading,
    error,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    confirmDialog,
    setConfirmDialog,
    homepageBanner1,
    setHomepageBanner1,
    homepageBanner2,
    setHomepageBanner2,
    homepageBanner3,
    setHomepageBanner3,
    homepageBanner4,
    setHomepageBanner4,
    homepageBanner5,
    setHomepageBanner5,
    aboutBanner,
    setAboutBanner,
    newsBanner,
    setNewsBanner,
    campaignsBanner,
    setCampaignsBanner,
    bannerLoading,
    bannerError,
    bannerSuccess,
    uploadingImage,
    handleImageUpload,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleSaveBanner,
  }
}
