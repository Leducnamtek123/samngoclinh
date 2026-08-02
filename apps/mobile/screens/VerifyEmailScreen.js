// Xác thực email bằng OTP: tự gửi OTP khi vào màn -> nhập mã -> xác nhận -> refresh hồ sơ.
import { useCallback, useEffect, useState } from 'react';
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
import { confirmEmailVerification, requestEmailVerification } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function VerifyEmailScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const { user, refreshProfile } = useAuth();

  const [otp, setOtp] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const sendOtp = useCallback(async () => {
    setSending(true);
    try {
      await requestEmailVerification();
    } catch (e) {
      alert.error('Không gửi được mã', e?.message || 'Vui lòng thử lại.');
    } finally {
      setSending(false);
    }
  }, [alert]);

  useEffect(() => {
    sendOtp();
  }, [sendOtp]);

  const onConfirm = async () => {
    if (!otp.trim()) return alert.error('Thiếu mã', 'Vui lòng nhập mã OTP.');
    setVerifying(true);
    try {
      await confirmEmailVerification({ otp: otp.trim() });
      await refreshProfile();
      alert.success('Thành công', 'Email của bạn đã được xác thực.', {
        confirmText: 'Xong',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e) {
      alert.error('Xác thực thất bại', e?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Xác thực email</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.desc}>
            Chúng tôi đã gửi mã OTP tới email{user?.email ? ` ${user.email}` : ''}. Nhập mã để hoàn
            tất xác thực.
          </Text>

          <View style={styles.card}>
            <IconField
              icon="keypad-outline"
              value={otp}
              onChangeText={setOtp}
              placeholder="Nhập mã OTP"
              keyboardType="number-pad"
            />
          </View>

          <PrimaryButton title="Xác nhận" onPress={onConfirm} loading={verifying} />

          <Text style={styles.resend} onPress={sending ? undefined : sendOtp}>
            {sending ? 'Đang gửi mã...' : 'Gửi lại mã'}
          </Text>
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
  desc: { fontSize: 15, color: colors.textMuted, lineHeight: 22, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  resend: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.lg,
  },
});
