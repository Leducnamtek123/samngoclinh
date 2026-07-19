import type { ConversionFunnelType } from "../types"

export const conversionFunnelData: ConversionFunnelType = {
  period: "Tháng này",
  funnelSteps: [
    {
      name: "Xem sản phẩm sâm",
      value: 15000,
    },
    {
      name: "Thêm vào giỏ hàng",
      value: 5000,
    },
    {
      name: "Đặt cọc / Soạn hợp đồng",
      value: 1000,
    },
    {
      name: "Hoàn tất mua / Ký kết",
      value: 300,
    },
  ],
}
