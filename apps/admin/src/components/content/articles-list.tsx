"use client"

import Image from "next/image"

import { useTranslation } from "@/providers/i18n-provider"

type Article = {
  id: string
  title: string
  category: string
  publishedAt: string
  image?: string
  summary?: string
}

type ArticlesListProps = {
  articles: Article[]
  openCreateModal: () => void
  openEditModal: (article: Article) => void
  handleDelete: (id: string) => void
}

export function ArticlesList({
  articles,
  openCreateModal,
  openEditModal,
  handleDelete,
}: ArticlesListProps) {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {t("content.articles.title")}
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            {t("content.subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          {t("content.articles.addArticle")}
        </button>
      </div>

      {/* Articles list table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">
                  {t("products.fields.image", "Image")}
                </th>
                <th className="px-6 py-4">
                  {t("content.articles.articleTitle")}
                </th>
                <th className="px-6 py-4">{t("content.articles.category")}</th>
                <th className="px-6 py-4">
                  {t("content.articles.publishedDate")}
                </th>
                <th className="px-6 py-4 text-right">
                  {t("common.actions.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
              {articles.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-gray-400"
                  >
                    {t("common.table.noResults")}
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr
                    key={article.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                        <Image
                          src={
                            article.image ||
                            "https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8"
                          }
                          alt={article.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-bold text-gray-900 line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-gray-400 text-[10px] line-clamp-1 mt-0.5">
                        {article.summary || "-"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {article.publishedAt}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(article)}
                        className="text-emerald-700 hover:text-emerald-950 font-bold"
                      >
                        {t("common.actions.edit")}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        {t("common.actions.delete")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
