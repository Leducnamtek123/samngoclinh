// Nhóm hàng nghìn kiểu Việt Nam: 7000000 -> "7.000.000". Màn tự thêm hậu tố "đ".
export const groupThousands = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
