import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { fetchApi } from "@/lib/api"

import { ContentManager } from "@/components/ContentManager"

export const metadata: Metadata = {
  title: "Quản lý bài viết | Admin",
}

async function getArticles() {
  try {
    const res = await fetchApi("/public/content/articles", {
      cache: "no-store",
    })
    if (!res.ok) {
      return []
    }
    const json = await res.json()
    return json.data?.items || []
  } catch (error) {
    console.error("Error fetching articles for admin content page:", error)
    return []
  }
}

type BannerSettingsMap = {
  homepage_banner_image_1: string
  homepage_banner_image_2: string
  homepage_banner_image_3: string
  homepage_banner_image_4: string
  homepage_banner_image_5: string
  about_banner_image: string
  news_banner_image: string
  campaigns_banner_image: string
}

async function getBannerSettings(): Promise<BannerSettingsMap> {
  const defaultImages: BannerSettingsMap = {
    homepage_banner_image_1: "/images/banners/homepage_banner_1.png",
    homepage_banner_image_2: "/images/banners/homepage_banner_2.png",
    homepage_banner_image_3: "/images/banners/homepage_banner_3.png",
    homepage_banner_image_4: "/images/banners/homepage_banner_4.png",
    homepage_banner_image_5: "/images/banners/homepage_banner_5.png",
    about_banner_image: "/images/banners/about_banner.png",
    news_banner_image: "/images/banners/news_banner.png",
    campaigns_banner_image: "/images/banners/campaigns_banner.png",
  }

  const results = { ...defaultImages }
  const keys = Object.keys(defaultImages) as (keyof BannerSettingsMap)[]

  try {
    await Promise.all(
      keys.map(async (key) => {
        try {
          const res = await fetchApi(`/public/settings/${key}`, {
            cache: "no-store",
          })
          if (res.ok) {
            const json = await res.json()
            if (json.data?.value) {
              results[key] = json.data.value
            }
          }
        } catch {
          // Keep default
        }
      })
    )
    return results
  } catch (error: unknown) {
    console.error("Error fetching banner settings for admin:", error)
    return defaultImages
  }
}

export default async function ContentPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const [articles, bannerSettings] = await Promise.all([
    getArticles(),
    getBannerSettings(),
  ])

  return (
    <div className="container py-6 space-y-6">
      <ContentManager
        initialArticles={articles}
        initialBannerSettings={bannerSettings}
      />
    </div>
  )
}
