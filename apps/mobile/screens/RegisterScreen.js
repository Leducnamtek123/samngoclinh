// Đăng ký — form tạo tài khoản bằng email. Submit hiện dừng ở validation client:
// backend /user/sign-up còn cần countryId, marketing, cookies (xem ghi chú khi nối API thật).
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
import { register } from '../api/auth';
import { resolveDefaultCountryId } from '../api/country';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim()) return alert.error('Thiếu thông tin', 'Vui lòng nhập email.');
    if (password.length < 8) return alert.error('Mật khẩu chưa hợp lệ', 'Mật khẩu tối thiểu 8 ký tự.');
    if (password !== confirm) return alert.error('Mật khẩu không khớp', 'Mật khẩu nhập lại không khớp.');
    setLoading(true);
    try {
      const countryId = await resolveDefaultCountryId();
      await register({
        name: name.trim() || undefined,
        email: email.trim().toLowerCase(),
        password,
        countryId,
      });
      alert.success('Đăng ký thành công', 'Tài khoản đã được tạo. Hãy đăng nhập để bắt đầu.', {
        confirmText: 'Đăng nhập',
        onConfirm: () => navigation.navigate('Login'),
      });
    } catch (e) {
      alert.error('Đăng ký thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.back} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Đăng ký</Text>
        <View style={styles.back} />
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
            <IconField
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Họ tên"
              autoCapitalize="words"
            />
            <IconField
              icon="mail-outline"
              value={email}
              onChangeText={setEmail}
              placeholder="Email *"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <IconField
              icon="lock-closed-outline"
              value={password}
              onChangeText={setPassword}
              placeholder="Mật khẩu (tối thiểu 8 ký tự)"
              secureTextEntry
            />
            <IconField
              icon="lock-closed-outline"
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
            />

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              style={({ pressed }) => [
                styles.submit,
                loading && styles.blocked,
                pressed && !loading && styles.pressed,
              ]}
            >
              <Text style={styles.submitText}>{loading ? 'Đang xử lý...' : 'Đăng ký'}</Text>
            </Pressable>
          </View>

          <Text style={styles.footer}>
            Bạn đã có tài khoản?{' '}
            <Text style={styles.footerLink} onPress={() => navigation.navigate('Login')}>
              Đăng Nhập
            </Text>
          </Text>

          <Pressable hitSlop={8} onPress={() => navigation.navigate('Home', { screen: 'Home' })}>
            <Text style={styles.guest}>Tiếp tục không đăng nhập</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.greenSoft },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  back: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: { fontSize: 22, fontWeight: '800', color: colors.text },

  scroll: { padding: spacing.lg },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
  },
  error: { color: colors.danger, fontSize: 14, marginTop: spacing.md },

  submit: {
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.header,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  submitText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  blocked: { opacity: 0.6 },

  footer: { textAlign: 'center', color: colors.textMuted, fontSize: 15, marginTop: spacing.xl },
  footerLink: { color: colors.primary, fontWeight: '800' },
  guest: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.md,
  },

  pressed: { opacity: 0.85 },
});
