// Mock data tập trung cho toàn app — nguồn duy nhất, thay bằng authFetch khi có endpoint tương ứng.
// Giữ đúng shape mà từng màn đang tiêu thụ; không thêm field UI chưa dùng.

// HomeScreen — lối tắt (key khớp handler điều hướng trong màn).
export const quickActions = [
  { key: 'buy', icon: 'leaf-outline', label: 'Mua cây' },
  { key: 'store', icon: 'storefront-outline', label: 'Cửa hàng' },
  { key: 'promo', icon: 'pricetags-outline', label: 'Khuyến mãi' },
];

// ProductsScreen — danh mục sản phẩm.
export const products = [
  { id: '1', name: 'RƯỢU SÂM NGỌC LINH NGUYÊN CÂY - NGUYÊN CỦ', price: 7000000, sold: 0, icon: 'wine' },
  { id: '2', name: 'TINH CHẤT SÂM NGỌC LINH - HỘP 5 LỌ X 20ML', price: 550000, sold: 4, icon: 'flask' },
  { id: '3', name: 'COLLAGEN SÂM NGỌC LINH', price: 490000, sold: 0, icon: 'sparkles' },
  { id: '4', name: 'MẬT ONG NGÂM SÂM NGỌC LINH 25ML', price: 150000, sold: 0, icon: 'nutrition' },
  { id: '5', name: 'TRÀ TÚI LỌC SÂM NGỌC LINH', price: 200000, sold: 0, icon: 'cafe' },
  { id: '6', name: 'SÂM NGỌC LINH TƯƠI NGÂM MẬT ONG', price: 3500000, sold: 0, icon: 'leaf' },
];
