# 📌 Danh Sách Tổng Hợp Toàn Bộ API Endpoints

Tài liệu này tổng hợp toàn bộ các API endpoints hiện có trong hệ thống backend phục vụ việc tích hợp Frontend và Mobile.

---

## 🚀 Địa chỉ tài liệu Swagger UI (Local)
Khi chạy dự án cục bộ, bạn có thể truy cập các tài liệu chi tiết (có giao diện thử nghiệm trực tiếp) tại:
*   **Tổng hợp tất cả các API (All):** [http://localhost:3000/docs](http://localhost:3000/docs)
*   **API Công khai (Public):** [http://localhost:3000/docs/public](http://localhost:3000/docs/public)
*   **API Người dùng (User):** [http://localhost:3000/docs/user](http://localhost:3000/docs/user)
*   **API Quản trị (Admin):** [http://localhost:3000/docs/admin](http://localhost:3000/docs/admin)

---

## 🌐 1. PHÂN HỆ CÔNG KHAI (Public APIs)

### Danh mục giống sâm & sản phẩm (Catalog)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/public/catalog/plants` | Lấy danh sách sâm giống công khai |
| **GET** | `/api/public/catalog/plants/{id}` | Chi tiết một giống sâm cụ thể |
| **GET** | `/api/public/catalog/shop-items` | Lấy danh sách sản phẩm chế phẩm công khai |
| **GET** | `/api/public/catalog/shop-items/{id}` | Chi tiết sản phẩm chế phẩm |

### Tin tức & Bài viết (Content)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/public/content/articles` | Lấy danh sách bài viết / tin tức |
| **GET** | `/api/public/content/articles/{idOrSlug}` | Xem chi tiết bài viết theo ID hoặc đường dẫn rút gọn (Slug) |

### Liên hệ hỗ trợ (Contact)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/v1/contact` | Khách hàng vãng lai gửi form liên hệ hỗ trợ |

### Chợ sâm Ngọc Linh (Marketplace Listings)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/public/marketplace/listings` | Xem danh sách tin đăng bán sâm trên chợ |

### Đăng ký & Đăng nhập (Auth & Verification)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/v1/public/user/login/credential` | Đăng nhập bằng Email & Mật khẩu |
| **POST** | `/api/v1/public/user/login/social/google` | Đăng nhập qua tài khoản Google |
| **POST** | `/api/v1/public/user/login/social/apple` | Đăng nhập qua tài khoản Apple |
| **POST** | `/api/v1/public/user/sign-up` | Đăng ký tài khoản người dùng mới |
| **PATCH** | `/api/v1/public/user/verify/email` | Xác thực Email qua mã OTP/Link |
| **POST** | `/api/v1/public/user/send/email` | Gửi lại Email xác nhận |
| **POST** | `/api/v1/public/user/password/forgot` | Yêu cầu quên mật khẩu |
| **PATCH** | `/api/v1/public/user/password/reset` | Đặt lại mật khẩu mới |

---

## 🧑‍💻 2. PHÂN HỆ NGƯỜI DÙNG (User & Customer APIs)

### Hồ sơ & Tài khoản (Profile)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/profile/me` | Xem thông tin hồ sơ cá nhân hiện tại |
| **GET** | `/api/v1/user/profile/business` | Xem hồ sơ đại lý / doanh nghiệp (nếu có) |
| **DELETE** | `/api/v1/user/user/delete/self` | Người dùng tự xóa tài khoản của mình |

### Giỏ hàng & Mua sắm (Cart)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/cart` | Lấy chi tiết các sản phẩm trong giỏ hàng |
| **POST** | `/api/user/cart/items` | Thêm sản phẩm (cây giống hoặc chế phẩm) vào giỏ hàng |
| **PUT** | `/api/user/cart/items/{productId}` | Thay đổi số lượng sản phẩm trong giỏ hàng |
| **DELETE** | `/api/user/cart/items/{productId}` | Xóa một sản phẩm khỏi giỏ hàng |
| **DELETE** | `/api/user/cart` | Xóa sạch giỏ hàng |

### Đơn hàng (Orders)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/user/orders/checkout` | Đặt hàng & thanh toán (tự động cộng phí ship động) |
| **GET** | `/api/user/orders` | Danh sách đơn hàng đã mua của tôi |
| **GET** | `/api/user/orders/{id}` | Chi tiết một đơn hàng cụ thể |

### Ví tiền & Điểm thưởng (Wallet)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/wallet/summary` | Xem số dư ví, số điểm thưởng, số sâm sở hữu |
| **GET** | `/api/user/wallet/transactions` | Lịch sử giao dịch ví |

### Nhật ký Canh tác & Hộ Trồng (Cultivation)
| Method   | Path                             | Mô tả / Chức năng                                 |
| :---------| :---------------------------------| :--------------------------------------------------|
| **GET**  | `/api/user/cultivation/trees`    | Xem danh sách cây sâm tôi sở hữu                  |
| **GET**  | `/api/user/cultivation/gardens`  | Xem danh sách vườn liên kết                       |
| **GET**  | `/api/user/cultivation/beds`     | Xem danh sách luống đất trồng sâm                 |
| **GET**  | `/api/user/cultivation/logs`     | Lịch sử nhật ký chăm sóc (tưới nước, bón phân...) |
| **POST** | `/api/user/cultivation/bookings` | Đăng ký lịch tham quan vườn thực tế               |
| **GET**  | `/api/user/cultivation/bookings` | Danh sách các lịch hẹn tham quan vườn             |

### Gói dịch vụ chăm sóc & bảo hiểm (Care Packages)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/packages/care` | Danh sách các gói chăm sóc sâm giống |
| **GET** | `/api/user/packages/protection` | Danh sách các gói bảo hiểm / bảo vệ cây sâm |
| **POST** | `/api/user/packages/subscribe` | Đăng ký gói chăm sóc / bảo hiểm cho một cây sâm cụ thể |

### Hợp đồng điện tử (E-Contract)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/contracts` | Lấy danh sách hợp đồng thuê đất/mua sâm của tôi |
| **GET** | `/api/user/contracts/{id}` | Xem chi tiết nội dung hợp đồng |
| **POST** | `/api/user/contracts/{id}/sign` | Ký hợp đồng trực tuyến (xác nhận) |
| **POST** | `/api/user/contracts/{id}/renew` | Gia hạn hợp đồng |

### Đăng tin bán sâm (Marketplace)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **POST** | `/api/user/marketplace` | Tạo tin đăng bán sâm thu hoạch lên chợ |
| **PUT** | `/api/user/marketplace/{id}` | Cập nhật thông tin tin đăng |
| **DELETE** | `/api/user/marketplace/{id}` | Gỡ bỏ / Ẩn tin đăng |

### Xác thực danh tính (KYC)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/user/identity-verification/status` | Kiểm tra trạng thái duyệt hồ sơ định danh |
| **POST** | `/api/user/identity-verification/submit` | Nộp hồ sơ KYC (CCCD, chân dung) |

---

## 🛡️ 3. PHÂN HỆ QUẢN TRỊ (Admin APIs)

### Quản lý Liên hệ (Contact Admin)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/contacts` | Xem danh sách tin nhắn liên hệ từ khách hàng |
| **GET** | `/api/v1/admin/contacts/{id}` | Xem chi tiết liên hệ (Tự động chuyển trạng thái thành Đã đọc) |

### Quản lý Cấu hình Hệ thống (System Settings)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/settings` | Xem tất cả tham số cấu hình động |
| **GET** | `/api/v1/admin/settings/{key}` | Chi tiết cấu hình theo Key |
| **PUT** | `/api/v1/admin/settings/{key}` | Cập nhật giá trị cấu hình (ví dụ: phí ship) |

### Duyệt Xác thực KYC (KYC Approval)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/admin/identity-verification` | Xem danh sách yêu cầu KYC đang chờ duyệt |
| **PATCH** | `/api/admin/identity-verification/{id}/approve` | Duyệt thông qua hồ sơ KYC của người dùng |
| **PATCH** | `/api/admin/identity-verification/{id}/reject` | Từ chối hồ sơ KYC |

### Quản lý Hợp đồng & Xử lý (Contracts Admin)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/admin/contracts` | Danh sách tất cả hợp đồng của hệ thống |
| **POST** | `/api/admin/contracts` | Tạo một hợp đồng mới cho người dùng |
| **PUT** | `/api/admin/contracts/{id}` | Cập nhật thông tin hợp đồng |
| **DELETE** | `/api/admin/contracts/{id}` | Hủy/Xóa hợp đồng |

### Quản lý Người dùng & Quyền (Users & Roles)
| Method    | Path                                        | Mô tả / Chức năng                               |
| :----------| :--------------------------------------------| :------------------------------------------------|
| **GET**   | `/api/v1/admin/user/list`                   | Xem danh sách thành viên                        |
| **POST**  | `/api/v1/admin/user/create`                 | Tạo mới tài khoản người dùng                    |
| **PATCH** | `/api/v1/admin/user/update/{userId}/status` | Khóa/Mở khóa tài khoản thành viên               |
| **GET**   | `/api/v1/admin/role/list`                   | Xem danh sách các vai trò (Role) trong hệ thống |

---

## 🔄 4. PHÂN HỆ CHIA SẺ & THIẾT BỊ (Shared & Devices)

### Cập nhật bảo mật & 2FA
| Method    | Path                                  | Mô tả / Chức năng                            |
| :----------| :--------------------------------------| :---------------------------------------------|
| **POST**  | `/api/v1/shared/user/refresh`         | Làm mới phiên đăng nhập (Refresh Token)      |
| **PATCH** | `/api/v1/shared/user/change-password` | Thay đổi mật khẩu tài khoản                  |
| **POST**  | `/api/v1/shared/user/2fa/setup`       | Bắt đầu thiết lập bảo mật 2 lớp (2FA)        |
| **POST**  | `/api/v1/shared/user/logout`          | Đăng xuất khỏi hệ thống và vô hiệu hóa phiên |

### Quản lý Thông báo (Notifications)
| Method | Path | Mô tả / Chức năng |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/notification/list` | Lấy toàn bộ thông báo gửi đến tôi |
| **PATCH** | `/api/v1/shared/notification/update/read/{notificationId}` | Đánh dấu thông báo cụ thể là đã đọc |
| **POST** | `/api/v1/shared/notification/update/read-all` | Đánh dấu đọc tất cả thông báo |
