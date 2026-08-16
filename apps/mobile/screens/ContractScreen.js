// Hợp đồng mua bán, ký gửi & chăm sóc cây Sâm Ngọc Linh (bản tạm).
// Bên A cố định; Bên B điền tự động từ tài khoản đang đăng nhập. Mở từ màn đặt mua theo luống/vườn.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { useAuth } from '../context/AuthContext';
import CartButton from '../components/CartButton';

const BLANK = '.........................';

const PARTY_A = [
  ['Đơn vị', 'CÔNG TY CỔ PHẦN DƯỢC LIỆU TRÀ LINH'],
  ['Địa chỉ', 'Thôn 2, xã Trà Linh, Đà Nẵng'],
  ['Mã số thuế', '4001248522'],
  ['Đại diện', 'Ông Trương Nguyên Tiến Trà — Giám đốc'],
];

const ARTICLES = [
  ['ĐIỀU 1. Đối tượng hợp đồng', 'Bên A bán cây Sâm Ngọc Linh cho Bên B. Bên B lựa chọn hình thức: mua và nhận cây trực tiếp (kèm vận chuyển), hoặc ký gửi tại vườn để Bên A tiếp tục chăm sóc.'],
  ['ĐIỀU 2. Nền tảng ứng dụng', 'Ứng dụng hiển thị thông tin sở hữu, mã định danh từng cây, tình trạng sức khỏe cây, hình ảnh/camera giám sát (áp dụng với đơn từ 100 cây trở lên) và lịch sử giao dịch.'],
  ['ĐIỀU 3. Xử lý kỹ thuật & thanh toán', 'Có thời gian xử lý kỹ thuật 24 giờ trước khi kích hoạt thanh toán. Mọi giao dịch được thực hiện bằng đồng Việt Nam (VND).'],
  ['ĐIỀU 4. Giá & phương thức thanh toán', 'Giá bao gồm chi phí cây và phí chăm sóc hằng năm. Bên B thanh toán 100% giá trị đơn hàng trước khi kích hoạt dịch vụ.'],
  ['ĐIỀU 5. Miễn trách nhiệm', 'Các bên được miễn trách nhiệm đối với sự kiện bất khả kháng kéo dài trên 90 ngày. Việc bồi thường (nếu có) được thực hiện bằng củ sâm, không trồng thay thế.'],
  ['ĐIỀU 6. Tham quan & xác thực', 'Bên B được tham quan vườn 1 lần/năm hoặc yêu cầu xác thực ADN. Nếu sâm không đúng thật, Bên A bồi thường gấp 3 lần giá trị đã thanh toán.'],
  ['ĐIỀU 7. Thu hoạch', 'Thu hoạch lá/hạt bắt đầu từ năm thứ 3. Bên B nhận phần thu hoạch hằng năm qua hình thức vận chuyển tiêu chuẩn hoặc cao cấp.'],
  ['ĐIỀU 8. Gia hạn hợp đồng', 'Việc gia hạn cần thông báo trước 45 ngày. Nếu không gia hạn và sau 60 ngày không liên lạc được, số cây còn lại được bàn giao cho địa phương theo quy định.'],
  ['ĐIỀU 9. Cam kết của các bên', 'Bên A cam kết cung cấp cây thật và chăm sóc đúng kỹ thuật. Bên B cam kết thanh toán đúng hạn và cập nhật thông tin liên hệ.'],
  ['ĐIỀU 10. Chuyển nhượng', 'Bên B được bán/chuyển nhượng trên ứng dụng. Mức chênh lệch giá tối đa ±10% so với giá thị trường hiện hành.'],
  ['ĐIỀU 11. Luật áp dụng & giải quyết tranh chấp', 'Hợp đồng được điều chỉnh theo pháp luật Việt Nam. Tranh chấp (nếu có) do Tòa án nhân dân TP Đà Nẵng giải quyết.'],
  ['PHỤ LỤC', 'PL01 — Tiêu chuẩn khối lượng củ theo tuổi 4–8 năm. PL02 — Biểu phí vận chuyển cao cấp (theo quy định từng thời điểm).'],
];

export default function ContractScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const phone = user?.mobileNumbers?.[0];
  const defaultAddress =
    (user?.addresses || []).find((a) => a.isDefault) || user?.addresses?.[0] || null;

  const partyB = [
    ['Ông/Bà', user?.name || BLANK],
    ['Số căn cước', user?.identityNumber || BLANK],
    ['Địa chỉ', defaultAddress?.detail || BLANK],
    ['Điện thoại', phone ? `+${phone.phoneCode} ${phone.number}` : BLANK],
    ['Email', user?.email || BLANK],
  ];

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Hợp đồng mua bán cây</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>HỢP ĐỒNG MUA BÁN VÀ KÝ GỬI, CHĂM SÓC CÂY SÂM NGỌC LINH</Text>
        <Text style={styles.draftNote}>
          Bản hợp đồng tạm. Thông tin Bên B được điền tự động từ tài khoản của bạn.
        </Text>

        <PartyBlock title="BÊN A (Bên bán)" rows={PARTY_A} />
        <PartyBlock title="BÊN B (Khách hàng)" rows={partyB} />

        {ARTICLES.map(([title, body]) => (
          <View key={title} style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <Text style={styles.para}>{body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color="#fff" />
          <Text style={styles.backBtnText}>Trở về</Text>
        </Pressable>
      </View>
    </View>
  );
}

function PartyBlock({ title, rows }) {
  return (
    <View style={styles.party}>
      <Text style={styles.partyTitle}>{title}</Text>
      {rows.map(([label, value]) => (
        <View key={label} style={styles.partyRow}>
          <Text style={styles.partyLabel}>{label}:</Text>
          <Text style={styles.partyValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  scroll: { padding: spacing.lg },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 28,
  },
  draftNote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  party: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  partyTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  partyRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xs },
  partyLabel: { width: 96, fontSize: 14, color: colors.textMuted },
  partyValue: { flex: 1, fontSize: 14, color: colors.text, fontWeight: '500' },

  section: { marginBottom: spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  para: { fontSize: 15, lineHeight: 23, color: colors.text },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
  },
  backBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
