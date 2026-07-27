// Chỉnh sửa thông tin cá nhân — hiện chỉ các trường backend hỗ trợ: họ tên + giới tính.
// Backend PUT /shared/user/profile/update yêu cầu countryId (giữ nguyên) và gender bắt buộc.
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import IconField from '../components/IconField';
import PrimaryButton from '../components/PrimaryButton';
import { updateProfile } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

const GENDERS = [
  { value: 'male', label: 'Nam', icon: 'male' },
  { value: 'female', label: 'Nữ', icon: 'female' },
];

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const alert = useAlert();

  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState(user?.gender || null);
  const [birthDate, setBirthDate] = useState((user?.birthDate || '').slice(0, 10));
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    if (!name.trim()) return alert.error('Thiếu thông tin', 'Vui lòng nhập họ tên.');
    if (!gender) return alert.error('Thiếu thông tin', 'Vui lòng chọn giới tính.');
    const trimmedBirth = birthDate.trim();
    if (trimmedBirth && !/^\d{4}-\d{2}-\d{2}$/.test(trimmedBirth)) {
      return alert.error('Ngày sinh không hợp lệ', 'Vui lòng nhập theo định dạng YYYY-MM-DD.');
    }
    setLoading(true);
    try {
      await updateProfile({ name: name.trim(), gender, countryId: user?.countryId, birthDate: trimmedBirth });
      await refreshProfile();
      alert.success('Thành công', 'Đã cập nhật thông tin cá nhân.', {
        confirmText: 'Xong',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e) {
      alert.error('Cập nhật thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Họ tên</Text>
            <IconField
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Họ tên"
              autoCapitalize="words"
            />

            <Text style={[styles.label, styles.labelSpacer]}>Giới tính</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => {
                const active = gender === g.value;
                return (
                  <Pressable
                    key={g.value}
                    onPress={() => setGender(g.value)}
                    style={({ pressed }) => [
                      styles.genderPill,
                      active && styles.genderPillActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name={g.icon} size={18} color={active ? '#fff' : colors.textMuted} />
                    <Text style={[styles.genderText, active && styles.genderTextActive]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, styles.labelSpacer]}>Ngày sinh</Text>
            <IconField
              icon="calendar-outline"
              value={birthDate}
              onChangeText={setBirthDate}
              placeholder="YYYY-MM-DD"
              keyboardType="numbers-and-punctuation"
              autoCapitalize="none"
              maxLength={10}
            />
          </View>

          <View style={styles.readonlyCard}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <View style={styles.flex}>
              <Text style={styles.roLabel}>Email (không thể thay đổi)</Text>
              <Text style={styles.roValue}>{user?.email || '—'}</Text>
            </View>
          </View>

          <PrimaryButton title="Lưu thay đổi" onPress={onSave} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

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
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
  labelSpacer: { marginTop: spacing.lg },

  genderRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  genderPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  genderPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  genderTextActive: { color: '#fff' },

  readonlyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  roLabel: { fontSize: 13, color: colors.textMuted },
  roValue: { fontSize: 15, color: colors.text, fontWeight: '500', marginTop: 2 },

  pressed: { opacity: 0.85 },
});
