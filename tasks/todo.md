# Tasks: Triển Khai E-Contract Option C (Hybrid eKYC + Ký Số + PDF Dấu Mộc QR)

- [x] **Task 1: Cài đặt thư viện `pdf-lib`, `@pdf-lib/fontkit` & Service đóng mộc PDF hợp đồng**
  - **Mục tiêu:** Xây dựng `EContractPdfService` trong `apps/api` có khả năng xuất PDF tiếng Việt kèm đầy đủ dấu mộc, chữ ký, QR Code và mã băm SHA-256.
  - **Files:** `apps/api/package.json`, `apps/api/src/modules/e-contract/services/e-contract.pdf.service.ts`, `apps/api/src/modules/e-contract/e-contract.module.ts`.
  - **Verification:** Đã biên dịch sạch, tạo buffer PDF, con dấu đỏ điện tử và mã QR Code trỏ về link tra cứu.

- [x] **Task 2: Nâng cấp luồng ký hợp đồng `signContract` (Ràng buộc eKYC, OTP & Tạo PDF)**
  - **Mục tiêu:** Cập nhật `EContractService.signContract` để liên kết thông tin eKYC của User, tạo file PDF đóng mộc, lưu trữ `pdfUrl` và gửi email đính kèm tệp cho khách hàng.
  - **Files:** `apps/api/src/modules/e-contract/services/e-contract.service.ts`, `apps/api/src/modules/e-contract/repositories/e-contract.repository.ts`.
  - **Verification:** Đã hoàn thiện liên kết eKYC, tạo chữ ký, tính mã băm SHA-256 toàn vẹn và cập nhật trạng thái `signed`.

- [x] **Task 3: Xây dựng Public API Tra cứu & Xác thực Hợp đồng qua QR Code**
  - **Mục tiêu:** Tạo controller `EContractPublicController` cho phép tra cứu công khai thông tin xác thực hợp đồng qua mã QR (`/public/contracts/verify/:code`) và tải file PDF (`/public/contracts/:code/pdf`).
  - **Files:** `apps/api/src/modules/e-contract/controllers/e-contract.public.controller.ts`, `apps/api/src/router/routes/routes.public.module.ts`.
  - **Verification:** Đã đăng ký route và typecheck đạt 0 lỗi.

- [x] **Task 4: Xây dựng Trang Tra Cứu Hợp Đồng Công Khai `/trace/contract/[code]` trên Web**
  - **Mục tiêu:** Xây dựng trang web tra cứu chứng nhận số cho khách hàng quét mã QR trên bản PDF hợp đồng.
  - **Files:** `apps/web/src/app/[locale]/(marketing)/trace/contract/[code]/page.tsx`.
  - **Verification:** Đã hoàn thiện giao diện chứng thực số, huy hiệu eKYC, mã băm SHA-256 toàn vẹn và nút tải tệp PDF chính thức.

- [x] **Task 5: Nâng cấp Modal Ký Hợp Đồng Điện Tử trên Web Client**
  - **Mục tiêu:** Tích hợp quy trình ký số 3 bước trực quan: Đọc điều khoản $\rightarrow$ Ký tên & Đối chiếu eKYC $\rightarrow$ Xác nhận OTP & Tải PDF bản chính thức có dấu mộc và mã QR.
  - **Files:** `apps/web/src/components/contract/EContractModal.tsx`, `apps/web/src/components/profile/ProfileContractsTab.tsx`.
  - **Verification:** Đã bổ sung nút tải file PDF stream có mộc và nút liên kết tra cứu mã QR, typecheck 0 lỗi.

- [x] **Task 6: Nâng cấp Admin Dashboard Quản lý Hợp Đồng & Tra cứu eKYC**
  - **Mục tiêu:** Cho phép Admin xem trước PDF hợp đồng có dấu mộc, xem mã QR, xem trạng thái eKYC của khách hàng và in ấn trực tiếp.
  - **Files:** `apps/admin/src/app/[lang]/(dashboard-layout)/pages/contracts/_components/contracts-list.tsx`, `apps/admin/src/app/[lang]/(dashboard-layout)/pages/contracts/_components/use-contracts-manager.ts`.
  - **Verification:** Đã thêm huy hiệu eKYC, action tải PDF và nút tra cứu QR trực tiếp trên từng dòng hợp đồng.
