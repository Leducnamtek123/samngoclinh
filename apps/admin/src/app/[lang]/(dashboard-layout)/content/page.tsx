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

async function getBannerSettings() {
  const keys = [
    "homepage_banner_image_1",
    "homepage_banner_image_2",
    "homepage_banner_image_3",
    "homepage_banner_image_4",
    "homepage_banner_image_5",
    "about_banner_image",
    "news_banner_image",
    "campaigns_banner_image",
  ]

  const defaultImages: Record<string, string> = {
    homepage_banner_image_1: "/images/banners/homepage_banner_1.png",
    homepage_banner_image_2: "/images/banners/homepage_banner_2.png",
    homepage_banner_image_3: "/images/banners/homepage_banner_3.png",
    homepage_banner_image_4: "/images/banners/homepage_banner_4.png",
    homepage_banner_image_5: "/images/banners/homepage_banner_5.png",
    about_banner_image: "/images/banners/about_banner.png",
    news_banner_image: "/images/banners/news_banner.png",
    campaigns_banner_image: "/images/banners/campaigns_banner.png",
  }

  const results: Record<string, string> = {}

  try {
    await Promise.all(
      keys.map(async (key) => {
        try {
          const res = await fetchApi(`/public/settings/${key}`, {
            cache: "no-store",
          })
          if (res.ok) {
            const json = await res.json()
            results[key] = json.data?.value || defaultImages[key]
          } else {
            results[key] = defaultImages[key]
          }
        } catch (err) {
          results[key] = defaultImages[key]
        }
      })
    )
    return results
  } catch (error) {
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
        initialBannerSettings={bannerSettings as any}
      />
    </div>
  )
}
