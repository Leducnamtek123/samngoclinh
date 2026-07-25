// Mock data tập trung cho toàn app — nguồn duy nhất, thay bằng authFetch khi có endpoint tương ứng.
// Giữ đúng shape mà từng màn đang tiêu thụ; không thêm field UI chưa dùng.

// HomeScreen — lối tắt (key khớp handler điều hướng trong màn).
export const quickActions = [
  { key: 'buy', icon: 'leaf-outline', label: 'Mua cây' },
  { key: 'store', icon: 'storefront-outline', label: 'Cửa hàng' },
  { key: 'promo', icon: 'pricetags-outline', label: 'Khuyến mãi' },
  { key: 'invite', icon: 'share-social-outline', label: 'Mời bạn bè' },
];

// HomeScreen — số liệu nổi bật.
export const farmStats = [
  { key: 'gen', icon: 'grid-outline', value: '500.000+', label: 'Cây Sâm Ngọc Linh chuẩn Gen' },
  { key: 'area', icon: 'leaf-outline', value: '60.000 m2+', label: 'Vườn Sâm Ngọc Linh' },
  { key: 'customer', icon: 'people-outline', value: '10.000+', label: 'Khách hàng hài lòng' },
  { key: 'exp', icon: 'ribbon-outline', value: '7+', label: 'Năm kinh nghiệm trồng Sâm Ngọc Linh' },
];

// HomeScreen — danh sách tin tức.
export const newsArticles = [
  {
    id: '1',
    title: 'BÁO CHÍ NÓI GÌ VỀ iWE FARM – GIẢI PHÁP CÔNG NGHỆ',
    excerpt: 'Sự ra đời của ứng dụng iWE FARM đã thu hút sự quan tâm của báo chí.',
  },
  {
    id: '2',
    title: 'iWE FARM nhận Cúp vàng "Nền tảng nông nghiệp"',
    excerpt: 'Ngày 6/12, ứng dụng iWE FARM do Công ty Cổ phần iWE Homes phát triển.',
  },
  {
    id: '3',
    title: 'iWE FARM được đề cử Giải thưởng: Nền tảng Nông nghiệp số',
    excerpt: 'Công ty Cổ phần iWE HOMES trân trọng thông báo:',
  },
  {
    id: '4',
    title: 'CÂU CHUYỆN VỀ "BÁU VẬT QUỐC GIA" – SÂM NGỌC LINH',
    excerpt: 'Giữa đại ngàn Trường Sơn hùng vĩ, nơi mây phủ quanh năm và khí hậu đặc biệt.',
  },
  {
    id: '5',
    title: 'VẤN NẠN SÂM GIẢ & GIẢI PHÁP CỦA ỨNG DỤNG',
    excerpt: 'Bảo vệ giá trị thật – Gieo mầm niềm tin xanh.',
  },
];

// HomeScreen — thông tin liên hệ.
export const contactInfo = {
  address: '68 Nguyễn Huệ, Phường Sài Gòn, TP Hồ Chí Minh, Việt Nam',
  phone: '0847 234 234',
  email: 'admin@iwefarm.com.vn',
};

// PlantingScreen — nhóm cây theo tuổi.
export const plantingGroups = [1, 2, 3, 4, 5, 6].map((age) => ({ id: String(age), age }));

// PromoScreen — số suất còn lại + danh sách cây ưu đãi.
export const promoSlotsLeft = 23;

export const promoPlants = [1, 2, 3, 4].map((n) => ({
  id: String(n),
  name: 'Cây Sâm Ngọc Linh 2026',
  note: 'Cây sâm 1 năm',
  price: 84758,
}));

// ProductsScreen — danh mục sản phẩm.
export const products = [
  { id: '1', name: 'RƯỢU SÂM NGỌC LINH NGUYÊN CÂY - NGUYÊN CỦ', price: 7000000, sold: 0, icon: 'wine' },
  { id: '2', name: 'TINH CHẤT SÂM NGỌC LINH - HỘP 5 LỌ X 20ML', price: 550000, sold: 4, icon: 'flask' },
  { id: '3', name: 'COLLAGEN SÂM NGỌC LINH', price: 490000, sold: 0, icon: 'sparkles' },
  { id: '4', name: 'MẬT ONG NGÂM SÂM NGỌC LINH 25ML', price: 150000, sold: 0, icon: 'nutrition' },
  { id: '5', name: 'TRÀ TÚI LỌC SÂM NGỌC LINH', price: 200000, sold: 0, icon: 'cafe' },
  { id: '6', name: 'SÂM NGỌC LINH TƯƠI NGÂM MẬT ONG', price: 3500000, sold: 0, icon: 'leaf' },
];
