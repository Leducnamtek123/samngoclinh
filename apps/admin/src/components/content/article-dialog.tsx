"use client"

import Image from "next/image"
import type { ChangeEvent, FormEvent } from "react"
import { useTranslation } from "@/providers/i18n-provider"

type Article = {
  id: string
  title: string
  category: string
  publishedAt: string
  image?: string
  summary?: string
}

type ArticleDialogProps = {
  editingArticle: Article | null
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  title: string
  setTitle: (val: string) => void
  category: string
  setCategory: (val: string) => void
  image: string
  setImage: (val: string) => void
  summary: string
  setSummary: (val: string) => void
  loading: boolean
  error: string
  uploadingImage: boolean
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent) => void
}

export function ArticleDialog({
  editingArticle,
  isOpen,
  setIsOpen,
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
  uploadingImage,
  handleImageUpload,
  handleSubmit,
}: ArticleDialogProps) {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-xl">
        <h3 className="text-base font-bold text-gray-900 border-b border-gray-150 pb-3">
          {editingArticle ? t("common.actions.edit") : t("content.articles.addArticle")}
        </h3>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="article-title"
              className="uppercase tracking-wider font-bold text-gray-500 text-[10px]"
            >
              {t("content.contacts.subject")}
            </label>
            <input
              id="article-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("content.contacts.subject")}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="article-category"
                className="uppercase tracking-wider font-bold text-gray-500 text-[10px]"
              >
                {t("products.categoryForm.parent")}
              </label>
              <select
                id="article-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium bg-white"
              >
                <option value="news">{t("content.articles.categories.news")}</option>
                <option value="guide">{t("content.articles.categories.guide")}</option>
                <option value="faq">{t("content.articles.categories.faq")}</option>
                <option value="event">{t("content.articles.categories.event")}</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="article-image"
                className="uppercase tracking-wider font-bold text-gray-500 text-[10px]"
              >
                {t("products.fields.image")}
              </label>
              <div className="flex gap-2">
                <input
                  id="article-image"
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="URL..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
                <label
                  htmlFor="article-image-file"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center cursor-pointer min-w-[100px] text-center"
                >
                  {uploadingImage ? t("common.table.loading") : t("common.actions.upload")}
                  <input
                    id="article-image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {image && (
                <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={image}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, 384px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImage("")}
                    aria-label="Remove"
                    className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={3}
                      stroke="currentColor"
                      className="w-3.5 h-3.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5 col-span-2">
              <label
                htmlFor="article-summary"
                className="uppercase tracking-wider font-bold text-gray-500 text-[10px]"
              >
                {t("products.categoryForm.description")}
              </label>
              <textarea
                id="article-summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={t("products.categoryForm.description")}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-150 justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-lg transition-colors text-xs"
            >
              {t("common.actions.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm text-xs"
            >
              {loading ? t("common.table.loading") : t("common.actions.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
