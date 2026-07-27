// Thêm địa chỉ — form chi tiết (bắt buộc) + nhãn/người nhận/điện thoại (tuỳ chọn).
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

import IconField from '../components/IconField';
import PrimaryButton from '../components/PrimaryButton';
import { addAddress } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function AddAddressScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { refreshProfile } = useAuth();
  const alert = useAlert();

  const [detail, setDetail] = useState('');
  const [label, setLabel] = useState('');
  const [recipient, setRecipient] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    const trimmedDetail = detail.trim();
    if (!trimmedDetail) {
      return alert.error('Thiếu thông tin', 'Vui lòng nhập địa chỉ chi tiết.');
    }
    setLoading(true);
    try {
      await addAddress({
        detail: trimmedDetail,
        label: label.trim() || undefined,
        recipient: recipient.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      await refreshProfile();
      alert.success('Thành công', 'Đã thêm địa chỉ.', {
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
        <Text style={styles.headerTitle}>Thêm địa chỉ</Text>
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
            <Text style={styles.label}>Địa chỉ chi tiết</Text>
            <TextInput
              style={styles.detailInput}
              value={detail}
              onChangeText={setDetail}
              placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />

            <Text style={[styles.label, styles.labelSpacer]}>Nhãn</Text>
            <IconField
              icon="pricetag-outline"
              value={label}
              onChangeText={setLabel}
              placeholder="Nhà riêng, Công ty..."
            />

            <Text style={[styles.label, styles.labelSpacer]}>Người nhận</Text>
            <IconField
              icon="person-outline"
              value={recipient}
              onChangeText={setRecipient}
              placeholder="Tên người nhận"
              autoCapitalize="words"
            />

            <Text style={[styles.label, styles.labelSpacer]}>Số điện thoại</Text>
            <IconField
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              placeholder="Số điện thoại người nhận"
              keyboardType="phone-pad"
              maxLength={20}
            />
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
  labelSpacer: { marginTop: spacing.lg },

  detailInput: {
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    minHeight: 88,
  },
});
