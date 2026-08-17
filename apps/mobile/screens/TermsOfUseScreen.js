// Điều khoản sử dụng — Sâm Ngọc Linh. Trang tĩnh, mở từ màn đặt mua theo luống/vườn.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import CartButton from '../components/CartButton';

const SECTIONS = [
  {
    n: '1',
    title: 'Giới thiệu',
    paras: [
      'Chào mừng bạn đến với Sâm Ngọc Linh ("Website/App"). Khi sử dụng dịch vụ, bạn đồng ý tuân thủ các điều khoản dưới đây. Vui lòng đọc kỹ trước khi tham gia.',
    ],
  },
  {
    n: '2',
    title: 'Chấp nhận Điều khoản',
    bullets: [
      'Việc đăng ký tài khoản hoặc sử dụng dịch vụ đồng nghĩa với việc bạn đã đọc, hiểu và đồng ý với các Điều khoản này.',
      'Nếu bạn không đồng ý, vui lòng ngừng sử dụng Sâm Ngọc Linh.',
    ],
  },
  {
    n: '3',
    title: 'Đăng ký & Tài khoản',
    bullets: [
      'Người dùng phải cung cấp thông tin chính xác, đầy đủ khi đăng ký.',
      'Mỗi tài khoản là cá nhân, không được cho mượn, bán hoặc chuyển nhượng trái phép.',
      'Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.',
    ],
  },
  {
    n: '4',
    title: 'Dịch vụ mua, ký gửi & chăm sóc cây',
    bullets: [
      'Sâm Ngọc Linh cung cấp dịch vụ mua cây Sâm Ngọc Linh theo cây, theo luống hoặc cả vườn, kèm ký gửi và chăm sóc tại vườn.',
      'Giá cây được chốt theo thời điểm đặt mua; số cây và tổng tiền thực tế có thể thay đổi nhẹ nếu cây vừa được người khác mua.',
    ],
  },
  {
    n: '5',
    title: 'Đặt hàng & Thanh toán',
    bullets: [
      'Đơn hàng chưa thanh toán sẽ tự hủy sau thời gian quy định để nhả cây cho khách khác.',
      'Đơn có giá trị lớn có thể được tách thành nhiều đơn thanh toán, mỗi đơn một mã QR.',
      'Khách hàng cần kiểm tra kỹ địa chỉ nhận hàng, phí dịch vụ và chịu trách nhiệm với thông tin đã cung cấp trước khi thanh toán.',
    ],
  },
  {
    n: '6',
    title: 'Trách nhiệm của khách hàng',
    bullets: [
      'Cung cấp thông tin chính xác về địa chỉ nhận hàng và thông tin liên hệ.',
      'Thanh toán đầy đủ, đúng hạn theo đơn hàng.',
      'Chịu trách nhiệm với các thông tin đã cung cấp và các giao dịch thực hiện trên tài khoản.',
    ],
  },
  {
    n: '7',
    title: 'Bảo mật thông tin',
    paras: [
      'Sâm Ngọc Linh cam kết bảo mật thông tin cá nhân của khách hàng và chỉ sử dụng cho mục đích cung cấp dịch vụ theo quy định của pháp luật.',
    ],
  },
  {
    n: '8',
    title: 'Thay đổi điều khoản',
    paras: [
      'Sâm Ngọc Linh có thể cập nhật các Điều khoản này theo từng thời điểm. Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc bạn chấp nhận các thay đổi.',
    ],
  },
  {
    n: '9',
    title: 'Liên hệ',
    paras: [
      'Mọi thắc mắc về Điều khoản sử dụng, vui lòng liên hệ bộ phận hỗ trợ của Sâm Ngọc Linh.',
    ],
  },
];

export default function TermsOfUseScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Điều khoản sử dụng</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Điều Khoản Sử Dụng – Sâm Ngọc Linh</Text>

        {SECTIONS.map((s) => (
          <View key={s.n} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {s.n}. {s.title}
            </Text>
            {s.paras?.map((p, i) => (
              <Text key={i} style={styles.para}>
                {p}
              </Text>
            ))}
            {s.bullets?.map((b, i) => (
              <View key={i} style={styles.bulletRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{b}</Text>
              </View>
            ))}
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
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  para: { fontSize: 15, lineHeight: 24, color: colors.text, marginBottom: spacing.sm },
  bulletRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, paddingLeft: spacing.sm },
  bullet: { fontSize: 15, lineHeight: 24, color: colors.text },
  bulletText: { flex: 1, fontSize: 15, lineHeight: 24, color: colors.text },

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
