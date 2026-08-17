export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type OrderData = {
  id: string;
  code?: string;
  totalAmount: number;
  total?: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  items?: OrderItem[];
  shippingAddress?: string;
  recipientName?: string;
  recipientPhone?: string;
};

/** @deprecated Use OrderData instead */
export type Order = OrderData;
