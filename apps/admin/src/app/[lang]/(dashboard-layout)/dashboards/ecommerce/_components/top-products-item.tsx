import { useState } from "react"
import Image from "next/image"
import { Package } from "lucide-react"

import type { TopProductType } from "../types"

import { formatCurrency } from "@/lib/utils"

import { Card } from "@/components/ui/card"

import Link from "next/link"

export function TopProductsItem({
  product,
}: {
  product: TopProductType["products"][0]
}) {
  const [hasError, setHasError] = useState(false)
  const defaultImage = "/images/ginseng_admin.png"
  const imageSrc = !product.image || hasError ? defaultImage : product.image

  return (
    <Card className="grid overflow-hidden hover:border-emerald-300 transition-colors shadow-none cursor-pointer" asChild>
      <li>
        <Link href="/pages/products" className="block">
          <div className="flex items-center gap-4 p-2.5">
            <div className="relative aspect-square h-12 w-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-100 dark:border-emerald-900">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={product.name}
                  width={100}
                  height={100}
                  onError={() => setHasError(true)}
                  className="aspect-square h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <Package className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <div className="flex flex-col truncate">
              <h3 className="break-all truncate text-sm">
                <span className="text-emerald-700 font-bold">#{product.order}</span>{" "}
                <span className="font-semibold text-slate-900 dark:text-slate-100 hover:text-emerald-700 transition-colors">{product.name}</span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Mã SP: #{product.sku || "SNL-PROD"}
              </p>
            </div>
          </div>
          <div className="flex justify-between bg-slate-50 dark:bg-slate-900/60 px-3 py-2 text-xs border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-muted-foreground">Đã bán: </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {product.sales.value.toLocaleString()}
              </span>
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              <span className="text-muted-foreground">Doanh thu: </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(product.revenue.value)}
              </span>
            </p>
          </div>
        </Link>
      </li>
    </Card>
  )
}
