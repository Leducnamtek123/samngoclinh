export type OrderStatus =
  | "pending"
  | "processing"
  | "shipping"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded"

export type ProductType =
  | "ginseng"
  | "package"
  | "merchandise"
  | "mixed"
  | string

export interface OrderItem {
  id: string
  orderId?: string
  shopItemId?: string
  packageId?: string
  treeId?: string
  code: string
  name: string
  price: number
  quantity: number
  total: number
  imageUrl?: string
  unit?: string
}

export interface ShippingAddress {
  recipientName?: string
  recipientPhone?: string
  detail?: string
  ward?: string
  district?: string
  province?: string
  fullAddress?: string
}

export interface Order {
  id: string
  code: string
  status: OrderStatus | string
  total: number
  subtotal?: number
  shippingFee?: number
  discount?: number
  productType?: ProductType
  paymentMethod?: string | null
  paymentStatus?: PaymentStatus | string
  userId?: string
  customerName?: string | null
  customerEmail?: string | null
  customerPhone?: string | null
  customerNote?: string | null
  shippingAddress?: ShippingAddress | string | null
  items?: OrderItem[]
  createdAt: string
  updatedAt?: string
  completedAt?: string | null
}
