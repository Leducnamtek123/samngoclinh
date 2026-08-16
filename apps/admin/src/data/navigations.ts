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
        title: "Ginseng Gardens",
        iconName: "Sprout",
        href: "/pages/gardens",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Ginseng Beds",
        iconName: "Grid3x3",
        href: "/pages/beds",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Manage Plants",
        iconName: "TreePine",
        href: "/pages/trees",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Care Logs",
        iconName: "NotebookPen",
        href: "/pages/care-logs",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "QR Code Traceability",
        iconName: "QrCode",
        href: "/pages/qr-code",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Investor eKYC Approval",
        iconName: "UserCheck",
        href: "/pages/kyc-approvals",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "e-Contracts",
        iconName: "FileText",
        href: "/pages/contracts",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
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
        title: "Service Packages",
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
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Banners",
        iconName: "Image",
        href: "/pages/banners",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Manage News",
        iconName: "Newspaper",
        href: "/pages/news",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Contact Requests",
        iconName: "Mail",
        href: "/pages/contacts",
        allowedRoles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "System Settings",
        iconName: "Settings",
        items: [
          {
            title: "Shipping Fee",
            iconName: "Truck",
            href: "/pages/settings/shipping",
            allowedRoles: ["SUPER_ADMIN", "ADMIN"],
          },
          {
            title: "Points Conversion",
            iconName: "Coins",
            href: "/pages/settings/points",
            allowedRoles: ["SUPER_ADMIN", "ADMIN"],
          },
          {
            title: "General Settings",
            iconName: "Settings",
            href: "/pages/settings/general",
            allowedRoles: ["SUPER_ADMIN", "ADMIN"],
          },
        ],
      },
    ],
  },
]
