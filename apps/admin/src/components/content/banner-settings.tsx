"use client"

import type { FormEvent } from "react"

import { useTranslation } from "@/providers/i18n-provider"

type BannerSettingsProps = {
  homepageBanner1: string
  setHomepageBanner1: (val: string) => void
  homepageBanner2: string
  setHomepageBanner2: (val: string) => void
  homepageBanner3: string
  setHomepageBanner3: (val: string) => void
  homepageBanner4: string
  setHomepageBanner4: (val: string) => void
  homepageBanner5: string
  setHomepageBanner5: (val: string) => void
  aboutBanner: string
  setAboutBanner: (val: string) => void
  newsBanner: string
  setNewsBanner: (val: string) => void
  campaignsBanner: string
  setCampaignsBanner: (val: string) => void
  bannerLoading: boolean
  bannerError: string
  bannerSuccess: boolean
  handleSaveBanner: (e: FormEvent) => void
}

export function BannerSettings({
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
  handleSaveBanner,
}: BannerSettingsProps) {
  const { t } = useTranslation()

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("content.banners.title")}
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          {t("content.subtitle")}
        </p>
      </div>

      <form onSubmit={handleSaveBanner} className="space-y-6">
        {bannerError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
            {bannerError}
          </div>
        )}

        {bannerSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-semibold">
            {t("common.status.success")}
          </div>
        )}

        <div className="space-y-6">
          <div className="border-b border-gray-150 pb-4">
            <h3 className="text-sm font-bold text-emerald-800 mb-4">
              {t("content.banners.title")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
              <div className="space-y-1.5">
                <label
                  htmlFor="homepage-banner-1"
                  className="uppercase tracking-wider"
                >
                  Banner 1
                </label>
                <input
                  id="homepage-banner-1"
                  type="text"
                  value={homepageBanner1}
                  onChange={(e) => setHomepageBanner1(e.target.value)}
                  placeholder="URL 1..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="homepage-banner-2"
                  className="uppercase tracking-wider"
                >
                  Banner 2
                </label>
                <input
                  id="homepage-banner-2"
                  type="text"
                  value={homepageBanner2}
                  onChange={(e) => setHomepageBanner2(e.target.value)}
                  placeholder="URL 2..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="homepage-banner-3"
                  className="uppercase tracking-wider"
                >
                  Banner 3
                </label>
                <input
                  id="homepage-banner-3"
                  type="text"
                  value={homepageBanner3}
                  onChange={(e) => setHomepageBanner3(e.target.value)}
                  placeholder="URL 3..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="homepage-banner-4"
                  className="uppercase tracking-wider"
                >
                  Banner 4
                </label>
                <input
                  id="homepage-banner-4"
                  type="text"
                  value={homepageBanner4}
                  onChange={(e) => setHomepageBanner4(e.target.value)}
                  placeholder="URL 4..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="homepage-banner-5"
                  className="uppercase tracking-wider"
                >
                  Banner 5
                </label>
                <input
                  id="homepage-banner-5"
                  type="text"
                  value={homepageBanner5}
                  onChange={(e) => setHomepageBanner5(e.target.value)}
                  placeholder="URL 5..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-emerald-800 mb-4">
              {t("navigation.menu.content")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
              <div className="space-y-1.5">
                <label
                  htmlFor="about-banner"
                  className="uppercase tracking-wider"
                >
                  {t("navigation.menu.content")}
                </label>
                <input
                  id="about-banner"
                  type="text"
                  value={aboutBanner}
                  onChange={(e) => setAboutBanner(e.target.value)}
                  placeholder="URL..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="news-banner"
                  className="uppercase tracking-wider"
                >
                  {t("content.articles.title")}
                </label>
                <input
                  id="news-banner"
                  type="text"
                  value={newsBanner}
                  onChange={(e) => setNewsBanner(e.target.value)}
                  placeholder="URL..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="campaigns-banner"
                  className="uppercase tracking-wider"
                >
                  {t("navigation.menu.dashboard")}
                </label>
                <input
                  id="campaigns-banner"
                  type="text"
                  value={campaignsBanner}
                  onChange={(e) => setCampaignsBanner(e.target.value)}
                  placeholder="URL..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex pt-4 border-t border-gray-150 justify-end">
          <button
            type="submit"
            disabled={bannerLoading}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm text-xs"
          >
            {bannerLoading
              ? t("common.table.loading")
              : t("common.actions.save")}
          </button>
        </div>
      </form>
    </div>
  )
}
