export interface ShippingFeeSetting {
  id?: string
  provinceCode?: string
  provinceName?: string
  standardFee: number
  expressFee: number
  freeShippingThreshold?: number
  isActive: boolean
}

export interface PointsConversionSetting {
  id?: string
  earnRate: number // e.g. 1000 VND = 1 point
  redeemRate: number // e.g. 1 point = 100 VND
  minRedeemPoints: number
  maxRedeemPercent: number // max % discount on order total
  isActive: boolean
}

export interface SystemSetting {
  id?: string
  key: string
  value: any
  description?: string | null
  createdAt?: string | Date
  updatedAt?: string | Date
}
