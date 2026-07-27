// Thêm số điện thoại — form mã vùng + số. Backend PUT/POST cần countryId (lấy từ user) + phoneCode + number.
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import PrimaryButton from '../components/PrimaryButton';
import { addMobileNumber } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function AddPhoneScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const alert = useAlert();

  const defaultCode = user?.country?.phoneCode?.[0] || '84';
  const [phoneCode, setPhoneCode] = useState(defaultCode);
  const [number, setNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    const code = phoneCode.replace(/\D/g, '');
    const digits = number.replace(/\D/g, '');
    if (!code) return alert.error('Thiếu thông tin', 'Vui lòng nhập mã vùng.');
    if (digits.length < 8) {
      return alert.error('Số không hợp lệ', 'Vui lòng nhập số điện thoại hợp lệ (tối thiểu 8 số).');
    }
    setLoading(true);
    try {
      await addMobileNumber({ countryId: user?.countryId, phoneCode: code, number: digits });
      await refreshProfile();
      alert.success('Thành công', 'Đã thêm số điện thoại.', {
        confirmText: 'Xong',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e) {
      alert.error('Thêm thất bại', e?.message || 'Vui lòng thử lại.');
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
        <Text style={styles.headerTitle}>Thêm số điện thoại</Text>
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
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.phoneRow}>
              <View style={styles.codeBox}>
                <Text style={styles.plus}>+</Text>
                <TextInput
                  style={styles.codeInput}
                  value={phoneCode}
                  onChangeText={setPhoneCode}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
              <TextInput
                style={styles.numberInput}
                value={number}
                onChangeText={setNumber}
                placeholder="Nhập số điện thoại"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                maxLength={20}
              />
            </View>
          </View>

          <PrimaryButton title="Lưu" onPress={onSave} loading={loading} />
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
    marginBottom: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },

  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  codeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  plus: { fontSize: 16, color: colors.text },
  codeInput: { fontSize: 16, color: colors.text, minWidth: 36, padding: 0 },
  numberInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    padding: 0,
  },
});
