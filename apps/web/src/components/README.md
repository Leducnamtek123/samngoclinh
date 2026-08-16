# DESIGN SYSTEM & COMPONENT REGISTRY

Vui lòng tham khảo tài liệu chính thức về Component Architecture & Component Registry tại:
👉 [COMPONENTS.md](./COMPONENTS.md)

## Tóm tắt Quy tắc Tái Sử dụng (Component Reuse Rule)
1. **LUÔN LUÔN** kiểm tra [COMPONENTS.md](./COMPONENTS.md) trước khi tạo UI mới.
2. **LUÔN LUÔN** tái sử dụng các component trong `@/components` (`Button`, `Dialog`, `EmptyState`, `LoadingState`, `FormInput`, v.v.).
3. **TUYỆT ĐỐI KHÔNG** tạo lại raw `<button>`, `<input>`, custom spinner, custom empty state div.
4. **CHỈ TẠO MỚI** khi chưa có component đáp ứng và không thể mở rộng component hiện tại.
