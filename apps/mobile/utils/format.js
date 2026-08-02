// Nhóm hàng nghìn kiểu Việt Nam: 7000000 -> "7.000.000". Màn tự thêm hậu tố "đ".
export const groupThousands = (value) => String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

// ISO -> "DD/MM/YYYY". Trả '' nếu rỗng/không hợp lệ.
export const formatDateVN = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};
