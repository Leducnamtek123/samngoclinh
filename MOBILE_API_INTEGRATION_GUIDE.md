# HƯỚNG DẪN TÍCH HỢP API CHO MOBILE APP (`api_integrate`)

> **Dành cho:** Mobile Development Team (iOS / Android / Flutter / React Native)  
> **Cập nhật:** 15/08/2026  
> **Base Commit:** So sánh & nâng cấp từ `2b796d1` (`api_integrate`) lên `HEAD` mới nhất  

---

## 📌 MỤC LỤC
1. [Cấu Hình Chung & Authentication Headers](#1-cấu-hình-chung--authentication-headers)
2. [Module 1: eKYC & Xác Minh Danh Tính (Quan Trọng)](#2-module-1-ekyc--xác-minh-danh-tính-quan-trọng)
3. [Module 2: Chữ Ký Số & Hợp Đồng Điện Tử (E-Contract)](#3-module-2-chữ-ký-số--hợp-đồng-điện-tử-e-contract)
4. [Module 3: Sổ Địa Chỉ Nhận Hàng (User Address)](#4-module-3-sổ-địa-chỉ-nhận-hàng-user-address)
5. [Module 4: Đơn Hàng & Thanh Toán SePay VietQR](#5-module-4-đơn-hàng--thanh-toán-sepay-vietqr)
6. [Tóm Tắt Các Điểm Mới & Lưu Ý Kỹ Thuật](#6-tóm-tắt-các-điểm-mới--lưu-ý-kỹ-thuật)

---

## 1. Cấu Hình Chung & Authentication Headers

Tất cả các API yêu cầu đăng nhập (ngoại trừ các endpoint có nhãn `Public`) đều cần truyền các Header sau:

```http
Authorization: Bearer <access_token>
x-api-key: <api_key>
Content-Type: application/json
```

> ⚡ **Lưu ý về kích thước ảnh:** Server đã nâng giới hạn request body lên **`50MB`**. Mobile có thể upload trực tiếp chuỗi `Base64` ảnh chụp camera độ phân giải cao mà không bị lỗi `400/413 Payload Too Large`.

---

## 2. Module 1: eKYC & Xác Minh Danh Tính (Quan Trọng)

### 2.1 Luồng trạng thái (State Machine):
```text
[CHƯA XÁC THỰC] ──(Nộp ảnh)──► [PENDING (Chờ duyệt)]
                                        │
                    ┌───────────────────┴───────────────────┐
                    ▼                                       ▼
         [REJECTED (Từ chối)]                     [APPROVED (Đã duyệt)]
     (Có reason: lý do từ chối)                  (user.isVerified = true)
                    │
     (Cho phép nộp lại 2 ảnh mới)
                    │
                    ▼
         [PENDING (Chờ duyệt)]
```

---

### 2.2 `GET /v1/shared/user/identity-document` — Lấy trạng thái eKYC hiện tại

* **Headers:** `Authorization: Bearer <token>`, `x-api-key: <key>`
* **Response `200 OK`:**
```json
{
  "statusCode": 200,
  "message": "Thành công",
  "data": {
    "id": "c1f7a0e8-...",
    "userId": "u-123456",
    "idCardNumber": "079201001234",
    "fullName": "NGUYỄN VĂN A",
    "frontImageUrl": "https://res.cloudinary.com/.../front.jpg",
    "backImageUrl": "https://res.cloudinary.com/.../back.jpg",
    "status": "PENDING",        // 👈 Giá trị: "PENDING" | "APPROVED" | "REJECTED"
    "rejectionReason": null,    // 👈 string nếu status === "REJECTED" (Ví dụ: "Ảnh mờ / mất góc thẻ")
    "reviewedAt": null,         // ISO Date string nếu đã được Admin duyệt/từ chối
    "createdAt": "2026-08-15T09:00:00.000Z"
  }
}
```

---

### 2.3 `PUT /v1/shared/user/identity-document` — Nộp / Gửi lại hồ sơ eKYC

* **Method:** `PUT` *(Lưu ý: Dùng `PUT`)*
* **Headers:** `Authorization: Bearer <token>`, `x-api-key: <key>`, `Content-Type: application/json` (hoặc `multipart/form-data`)
* **Request Body (JSON):**
```json
{
  "frontBase64": "data:image/jpeg;base64,...", // hoặc "front": "url"
  "backBase64": "data:image/jpeg;base64,...",  // hoặc "back": "url"
  "idCardNumber": "079201001234",              // Không bắt buộc
  "fullName": "NGUYỄN VĂN A"                  // Không bắt buộc
}
```
* **Logic mới:** Khi tài khoản đang ở trạng thái `REJECTED`, user nộp lại bằng API này sẽ **tự động chuyển trạng thái về `PENDING`** và ghi thêm 1 bản ghi vào lịch sử (không còn bị chặn lỗi 400 như code cũ).

---

### 2.4 `GET /v1/shared/user/identity-document/history` — Lấy lịch sử các lần gửi xác minh

* **Method:** `GET`
* **Headers:** `Authorization: Bearer <token>`, `x-api-key: <key>`
* **Response `200 OK`:**
```json
{
  "statusCode": 200,
  "data": [
    {
      "id": "hist-02",
      "userId": "u-123456",
      "frontImageUrl": "https://res.cloudinary.com/.../front2.jpg",
      "backImageUrl": "https://res.cloudinary.com/.../back2.jpg",
      "status": "PENDING",
      "rejectionReason": null,
      "createdAt": "2026-08-15T12:00:00.000Z"
    },
    {
      "id": "hist-01",
      "userId": "u-123456",
      "frontImageUrl": "https://res.cloudinary.com/.../front1.jpg",
      "backImageUrl": "https://res.cloudinary.com/.../back1.jpg",
      "status": "REJECTED",
      "rejectionReason": "Ảnh chụp bị lóa sáng / mất góc thẻ",
      "createdAt": "2026-08-15T09:00:00.000Z",
      "reviewedAt": "2026-08-15T10:30:00.000Z"
    }
  ]
}
```

---

## 3. Module 2: Chữ Ký Số & Hợp Đồng Điện Tử (E-Contract)

### 3.1 Chữ ký số cá nhân (Vẽ tay trên màn hình Mobile)

* **Lưu chữ ký:** `PUT /v1/shared/user/signature`
  * **Body:**
    ```json
    {
      "signatureData": "data:image/png;base64,..."
    }
    ```
* **Lấy chữ ký hiện tại:** `GET /v1/shared/user/signature`

---

### 3.2 Ký Hợp đồng điện tử

* **Danh sách hợp đồng của tôi:** `GET /user/contracts`
* **Chi tiết hợp đồng:** `GET /user/contracts/:id`
* **Thực hiện ký hợp đồng:** `POST /user/contracts/:id/sign`
  * **Body (Không bắt buộc nếu user đã lưu chữ ký số trên Profile):**
    ```json
    {
      "signatureImage": "data:image/png;base64,..." // hoặc "signatureUrl": "https://..."
    }
    ```

---

### 3.3 Tra cứu & Xem PDF Hợp đồng (Public)

* **Tra cứu hợp đồng qua mã QR:** `GET /public/contracts/verify/:code` *(Public - Không cần Token)*
  * Dùng cho tính năng Camera quét mã QR in trên hợp đồng giấy để kiểm tra tính toàn vẹn và thông tin chứng thực số.
* **Xem / Tải file PDF hợp đồng có dấu mộc điện tử:** `GET /public/contracts/:code/pdf` *(Public)*
  * Trả về Stream PDF chuẩn (`application/pdf`) đã được đóng dấu, chèn chữ ký và mã QR tự động.

---

## 4. Module 3: Sổ Địa Chỉ Nhận Hàng (User Address)

> 📍 **Prefix:** `/v1/shared/user`

* **Thêm địa chỉ mới:** `POST /v1/shared/user/address/add`
  ```json
  {
    "recipient": "Nguyễn Văn A",
    "phone": "0912345678",
    "detail": "Số 123 Nguyễn Huệ, P. Bến Nghé, Q. 1, TP. Hồ Chí Minh",
    "label": "Nhà riêng",
    "isDefault": true
  }
  ```
* **Sửa địa chỉ:** `PUT /v1/shared/user/address/update/:addressId`
* **Xóa địa chỉ:** `DELETE /v1/shared/user/address/delete/:addressId`

---

## 5. Module 4: Đơn Hàng & Thanh Toán SePay VietQR

### 5.1 Đặt hàng (Checkout): `POST /user/orders/checkout`
* **Request Body:**
```json
{
  "addressId": "uuid-dia-chi",
  "paymentMethod": "SEPAY", // "SEPAY" | "BANK_TRANSFER" | "WALLET"
  "items": [
    {
      "productId": "uuid-san-pham",
      "quantity": 2
    }
  ],
  // Nếu đặt mua gói cây hoặc cây sâm lẻ:
  "plantPackageId": "uuid-goi-trong-sam",
  "treeIds": ["tree-uuid-1", "tree-uuid-2"]
}
```

### 5.2 Cơ chế thanh toán tự động:
* Sau khi tạo đơn `paymentMethod: 'SEPAY'`, API `GET /user/orders/:id` sẽ trả về thông tin chuyển khoản VietQR.
* Khi khách hàng quét mã VietQR chuyển khoản thành công, hệ thống SePay Webhook sẽ:
  1. Tự động chuyển trạng thái đơn hàng sang `PAID`.
  2. Tự động gán mã cây sâm cho khách hàng (đối với đơn mua sâm).
  3. Tự động tạo bản thảo Hợp đồng điện tử trong mục Hợp đồng của khách hàng.

---

## 6. Tóm Tắt Các Điểm Mới & Lưu Ý Kỹ Thuật

| Hạng mục | Chi tiết |
| :--- | :--- |
| **Data Model eKYC** | Bổ sung `status` (`PENDING`, `APPROVED`, `REJECTED`) và `rejectionReason`. |
| **Lịch sử eKYC** | Endpoint mới: `GET /v1/shared/user/identity-document/history`. |
| **Resubmit eKYC** | Gọi `PUT /v1/shared/user/identity-document` khi bị từ chối để nộp lại ảnh mới. |
| **Tra cứu Hợp đồng** | Endpoint mới: `GET /public/contracts/verify/:code` và `GET /public/contracts/:code/pdf`. |
| **Marketplace cũ** | ❌ Đã xóa các route cũ `/v1/user/marketplace/*` (thay bằng Orders & E-Contracts). |
| **Payload Size** | Đã nâng giới hạn lên **50MB** trên toàn bộ Server. |

---
*Chúc team Mobile tích hợp thuận lợi và nhanh chóng! 🚀*
