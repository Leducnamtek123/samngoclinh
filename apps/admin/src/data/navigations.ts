import type { NavigationType } from "@/types"

export const navigationsData: NavigationType[] = [
  {
    title: "Dashboards",
    items: [
      {
        title: "Analytics",
        href: "/dashboards/analytics",
        iconName: "ChartPie",
      },
    ],
  },
  {
    title: "Pages",
    items: [
      {
        title: "Products",
        iconName: "Package",
        items: [
          {
            title: "List",
            iconName: "List",
            href: "/pages/products",
          },
          {
            title: "Category",
            iconName: "Layers",
            href: "/pages/products/category",
          },
        ],
      },
      {
        title: "Orders",
        iconName: "ShoppingBasket",
        href: "/pages/orders",
      },
      {
        title: "Users",
        iconName: "Users",
        href: "/pages/users",
      },
      {
        title: "Vườn của tôi",
        iconName: "Sprout",
        href: "/pages/gardens",
      },
      {
        title: "Luống của tôi",
        iconName: "Grid3x3",
        href: "/pages/beds",
      },
      {
        title: "Banners",
        iconName: "Image",
        href: "/pages/banners",
      },
      {
        title: "Liên hệ",
        iconName: "Mail",
        href: "/pages/contacts",
      },
    ],
  },
]
