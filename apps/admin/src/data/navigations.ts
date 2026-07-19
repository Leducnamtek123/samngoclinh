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
    title: "Cultivation",
    items: [
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
        title: "Quản lý cây trồng",
        iconName: "TreePine",
        href: "/pages/trees",
      },
      {
        title: "Quản lý hợp đồng",
        iconName: "FileText",
        href: "/pages/contracts",
      },
    ],
  },
  {
    title: "Business",
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
        title: "Gói dịch vụ",
        iconName: "HeartHandshake",
        href: "/pages/packages",
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Users",
        iconName: "Users",
        href: "/pages/users",
      },
      {
        title: "Banners",
        iconName: "Image",
        href: "/pages/banners",
      },
      {
        title: "Tin tức",
        iconName: "Newspaper",
        href: "/pages/news",
      },
      {
        title: "Liên hệ",
        iconName: "Mail",
        href: "/pages/contacts",
      },
    ],
  },
]
