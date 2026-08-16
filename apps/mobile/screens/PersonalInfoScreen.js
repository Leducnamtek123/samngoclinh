// Thông tin cá nhân — màn xem chi tiết hồ sơ (điều hướng từ menu Hồ sơ).
// Dữ liệu lấy từ useAuth().user (đã fetch khi đăng nhập); field backend chưa có
// (ngày sinh, mã giới thiệu, địa chỉ, hạng/cấp) hiển thị fallback/empty.
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { deleteAddress } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { confirm } from '../utils/confirm';
import { colors, spacing } from '../utils/theme';

const GENDER_LABELS = { male: 'Nam', female: 'Nữ' };

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${d.getFullYear()}`;
}

export default function PersonalInfoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const alert = useAlert();

  const name = user?.name || 'Người dùng';
  const gender = GENDER_LABELS[user?.gender] || 'Chưa cập nhật';
  const birthDate = formatDate(user?.birthDate) || 'Chưa cập nhật';
  const addresses = user?.addresses || [];
  const phone = user?.mobileNumbers?.[0] || null;
  const phoneDisplay = phone ? `+${phone.phoneCode} ${phone.number}` : 'Chưa cập nhật';

  const onDeleteAddress = async (item) => {
    const ok = await confirm({
      title: 'Xoá địa chỉ',
      message: item.detail ? `Xoá địa chỉ "${item.detail}"?` : 'Xoá địa chỉ này?',
    });
    if (!ok) return;
    try {
      await deleteAddress(item.id);
      await refreshProfile();
    } catch (e) {
      alert.error('Xoá thất bại', e?.message || 'Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        <Pressable
          style={styles.headerBtn}
          hitSlop={8}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Ionicons name="create-outline" size={22} color="#fff" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.avatar}>
            {user?.photo ? (
              <Image source={{ uri: user.photo }} style={styles.avatarImg} />
            ) : (
              <Ionicons name="person" size={54} color="#fff" />
            )}
          </View>
          <Text style={styles.name}>{name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
          <InfoRow icon="mail-outline" label="Email" value={user?.email || 'Chưa cập nhật'} />
          <InfoRow icon="person-outline" label="Giới tính" value={gender} />
          <InfoRow icon="calendar-outline" label="Ngày sinh" value={birthDate} />
          <InfoRow
            icon="card-outline"
            label="Số CCCD"
            value={user?.identityNumber || 'Chưa cập nhật'}
          />
          <InfoRow icon="call-outline" label="Số điện thoại" value={phoneDisplay} last />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Địa chỉ</Text>
          {addresses.length > 0 ? (
            addresses.map((item) => {
              const sub = [item.recipient, item.phone].filter(Boolean).join(' · ');
              return (
                <View key={item.id} style={styles.addressRow}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                    style={styles.infoIcon}
                  />
                  <View style={styles.addressText}>
                    <Text style={styles.addressDetail}>{item.detail}</Text>
                    {sub ? <Text style={styles.addressSub}>{sub}</Text> : null}
                  </View>
                  <Pressable hitSlop={8} onPress={() => onDeleteAddress(item)}>
                    <Ionicons name="trash-outline" size={20} color={colors.danger} />
                  </Pressable>
                </View>
              );
            })
          ) : (
            <View style={styles.empty}>
              <Ionicons name="location-outline" size={40} color={colors.border} />
              <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
            </View>
          )}
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
            onPress={() => navigation.navigate('AddAddress')}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addText}>Thêm địa chỉ</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <View style={[styles.infoRow, last && styles.infoRowLast]}>
      <Ionicons name={icon} size={20} color={colors.primary} style={styles.infoIcon} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '700' },

  scroll: { padding: spacing.lg },

  hero: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: colors.header,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarImg: { width: '100%', height: '100%' },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoRowLast: { paddingBottom: 0 },
  infoIcon: { width: 24, textAlign: 'center' },
  infoText: { flex: 1 },
  infoLabel: { fontSize: 13, color: colors.textMuted },
  infoValue: { fontSize: 16, color: colors.text, fontWeight: '500', marginTop: 2 },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  addressText: { flex: 1 },
  addressDetail: { fontSize: 16, color: colors.text, fontWeight: '500' },
  addressSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  empty: { alignItems: 'center', paddingVertical: spacing.md, gap: spacing.sm },
  emptyText: { fontSize: 14, color: colors.textMuted },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.header,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  pressed: { opacity: 0.85 },
});
