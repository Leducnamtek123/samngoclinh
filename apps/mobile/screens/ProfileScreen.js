// Hồ sơ — thông tin tài khoản + menu các mục (tài sản, tài khoản, cộng đồng, bảo mật, chính sách).
// Đa số mục chưa có màn đích -> điều hướng ComingSoon; Đổi mật khẩu -> ChangePassword; Đăng xuất/Xóa tài khoản xử lý riêng.
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import SupportButton from '../components/SupportButton';
import CartButton from '../components/CartButton';
import { useAuth } from '../context/AuthContext';
import { confirm } from '../utils/confirm';
import { colors, spacing } from '../utils/theme';

const NOTIFICATION_COUNT = 2;

const SECTIONS = [
  {
    title: 'Tài sản',
    items: [
      { icon: 'wallet-outline', label: 'Ví Điểm', desc: 'Số dư ví và các giao dịch của bạn' },
      { icon: 'leaf-outline', label: 'Cây Trồng', desc: 'Danh sách các cây trồng của bạn' },
    ],
  },
  {
    title: 'Tài khoản',
    items: [
      { icon: 'person-outline', label: 'Thông tin cá nhân', desc: 'Xem và cập nhật thông tin cá nhân', screen: 'PersonalInfo' },
      { icon: 'lock-closed-outline', label: 'Đổi mật khẩu', desc: 'Thay đổi mật khẩu tài khoản', screen: 'ChangePassword' },
      { icon: 'card-outline', label: 'Giấy tờ tùy thân', desc: 'Quản lý giấy tờ tùy thân của bạn', screen: 'Kyc' },
      { icon: 'create-outline', label: 'Chữ ký số', desc: 'Tạo và quản lý chữ ký của bạn', screen: 'Signature' },
      { icon: 'document-text-outline', label: 'Hợp đồng của tôi', desc: 'Xem và ký hợp đồng điện tử', screen: 'ContractsList' },
      { icon: 'receipt-outline', label: 'Đơn Hàng', desc: 'Quản lý đơn hàng của bạn' },
    ],
  },
  {
    title: 'Bảo mật',
    items: [
      { icon: 'lock-closed-outline', label: 'Thiết lập mã PIN', desc: 'Thiết lập mã PIN cho tài khoản' },
    ],
  },
  {
    title: 'Chính sách và hỗ trợ',
    items: [
      { icon: 'options-outline', label: 'Điều khoản sử dụng', desc: 'Điều khoản sử dụng dịch vụ' },
      { icon: 'shield-checkmark-outline', label: 'Chính sách bảo mật', desc: 'Chính sách bảo mật thông tin' },
      { icon: 'globe-outline', label: 'Ngôn ngữ', desc: 'Tiếng Việt' },
    ],
  },
];

export default function ProfileScreen({ navigation }) {
  const { user, signOut, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();

  const name = isAuthenticated ? user?.name || 'Người dùng' : 'Khách';
  const email = user?.email || '';
  const verified = user?.isVerified === true;

  const openItem = (item) => {
    if (item.screen) return navigation.navigate(item.screen);
    navigation.navigate('ComingSoon', { title: item.label });
  };

  const onSignOut = async () => {
    const ok = await confirm({ title: 'Đăng xuất', message: 'Bạn có chắc muốn đăng xuất?' });
    if (ok) await signOut();
  };

  const onDelete = async () => {
    const ok = await confirm({
      title: 'Xóa tài khoản',
      message: 'Hành động này xóa vĩnh viễn tài khoản của bạn. Bạn có chắc chắn?',
    });
    if (ok) navigation.navigate('ComingSoon', { title: 'Xóa tài khoản' });
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <View>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {NOTIFICATION_COUNT > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{NOTIFICATION_COUNT}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={54} color="#fff" />
          </View>
          <Text style={styles.name}>{name}</Text>
          {isAuthenticated && email ? (
            <View style={styles.emailRow}>
              <Text style={styles.email}>{email}</Text>
              {verified ? (
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
              ) : (
                <Pressable
                  style={({ pressed }) => [styles.verifyPill, pressed && styles.pressed]}
                  hitSlop={6}
                  onPress={() => navigation.navigate('VerifyEmail')}
                >
                  <Ionicons name="alert-circle" size={14} color="#fff" />
                  <Text style={styles.verifyText}>Chưa xác thực</Text>
                </Pressable>
              )}
            </View>
          ) : null}
          {isAuthenticated ? (
            <View style={styles.badges}>
              <View style={styles.tierBadge}>
                <Text style={styles.tierText}>{user?.tier || 'Đồng'}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>Cấp {user?.level ?? 1}</Text>
              </View>
            </View>
          ) : null}
        </View>

        {isAuthenticated ? (
          <>
            {SECTIONS.map((section) => (
              <View key={section.title}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item) => (
                  <Row key={item.label} item={item} onPress={() => openItem(item)} />
                ))}
              </View>
            ))}

            <Pressable
              style={({ pressed }) => [styles.card, styles.rowSolo, pressed && styles.pressed]}
              onPress={onSignOut}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.primary} />
              <Text style={styles.soloLabel}>Đăng Xuất</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </Pressable>

            <Text style={[styles.sectionTitle, styles.dangerTitle]}>Vùng nguy hiểm</Text>
            <Pressable
              style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]}
              onPress={onDelete}
            >
              <Ionicons name="lock-closed-outline" size={22} color={colors.danger} />
              <View style={styles.rowText}>
                <Text style={[styles.rowLabel, { color: colors.danger }]}>Xóa tài khoản</Text>
                <Text style={styles.rowDesc}>Xóa vĩnh viễn tài khoản của bạn</Text>
              </View>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </Pressable>
          </>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.card, styles.rowSolo, pressed && styles.pressed]}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={24} color={colors.primary} />
            <Text style={styles.soloLabel}>Đăng nhập / Đăng ký</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </Pressable>
        )}
      </ScrollView>

      <SupportButton />
    </View>
  );
}

function Row({ item, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.card, styles.row, pressed && styles.pressed]} onPress={onPress}>
      <View style={styles.iconBox}>
        <Ionicons name={item.icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowDesc}>{item.desc}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },

  scroll: { padding: spacing.lg },

  profile: { alignItems: 'center', marginBottom: spacing.lg },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.surface,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center', marginTop: spacing.md },
  emailRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs },
  email: { fontSize: 14, color: colors.textMuted },
  verifyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  verifyText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  badges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  tierBadge: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  tierText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  levelBadge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  levelText: { color: colors.text, fontSize: 14, fontWeight: '600' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.lg, marginBottom: spacing.md },
  dangerTitle: { color: colors.danger },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F0F1F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1 },
  rowLabel: { fontSize: 16, fontWeight: '700', color: colors.text },
  rowDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  rowSolo: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.lg },
  soloLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },

  pressed: { opacity: 0.7 },
});
