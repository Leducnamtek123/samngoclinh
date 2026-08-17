// Đăng nhập bằng email/mật khẩu, kèm đăng nhập Google/Apple.
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
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();
  const alert = useAlert();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Sau khi đăng nhập xong: đóng màn Login, quay lại chỗ đang thao tác (vd giỏ hàng); nếu không có thì về Home.
  const closeAfterAuth = () => {
    if (navigation.canGoBack()) navigation.goBack();
    else navigation.navigate('Home');
  };

  const onLogin = async () => {
    if (!email.trim() || !password)
      return alert.error('Thiếu thông tin', 'Vui lòng nhập email và mật khẩu.');
    setLoading(true);
    try {
      const res = await signIn({ email: email.trim().toLowerCase(), password });
      if (res?.mustChangePassword) navigation.navigate('ChangePassword');
      else closeAfterAuth();
    } catch (e) {
      alert.error('Lỗi', e?.message || 'Đã có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Pressable
        style={[styles.back, { top: insets.top + spacing.sm }]}
        hitSlop={8}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color={colors.primary} />
      </Pressable>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.hero, { paddingTop: insets.top + spacing.xl * 2 }]}>
            <View style={styles.logo}>
              <Ionicons name="leaf" size={44} color={colors.primary} />
            </View>
            <Text style={styles.brand}>Sâm Ngọc Linh</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.title}>Xin chào, chào mừng bạn trở lại!</Text>
            <Text style={styles.subtitle}>Đăng nhập để tiếp tục</Text>

            <View style={styles.form}>
              <IconField
                icon="mail-outline"
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <IconField
                icon="lock-closed-outline"
                value={password}
                onChangeText={setPassword}
                placeholder="Mật khẩu"
                secureTextEntry
              />
              <PrimaryBtn label="Đăng nhập" onPress={onLogin} loading={loading} />
              <Text style={styles.forgot} onPress={() => navigation.navigate('ForgotPassword')}>
                Quên mật khẩu?
              </Text>
            </View>

            <View style={styles.divider}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Hoặc</Text>
              <View style={styles.line} />
            </View>

            <SocialBtn
              icon="logo-google"
              label="Tiếp tục với Google"
              onPress={() => navigation.navigate('ComingSoon', { title: 'Đăng nhập với Google' })}
            />
            <SocialBtn
              icon="logo-apple"
              label="Tiếp tục với Apple"
              onPress={() => navigation.navigate('ComingSoon', { title: 'Đăng nhập với Apple' })}
            />

            <Text style={styles.footer}>
              Chưa có tài khoản?{' '}
              <Text style={styles.footerLink} onPress={() => navigation.navigate('Register')}>
                Đăng ký
              </Text>
            </Text>

            <Pressable hitSlop={8} onPress={() => navigation.navigate('Home', { screen: 'Home' })}>
              <Text style={styles.guest}>Tiếp tục không đăng nhập</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function PrimaryBtn({ label, onPress, loading }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.primary,
        loading && styles.blocked,
        pressed && !loading && styles.pressed,
      ]}
    >
      <Text style={styles.primaryText}>{loading ? 'Đang xử lý...' : label}</Text>
    </Pressable>
  );
}

function SocialBtn({ icon, label, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.social, pressed && styles.pressed]}>
      <Ionicons name={icon} size={20} color={colors.text} />
      <Text style={styles.socialText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  back: {
    position: 'absolute',
    left: spacing.lg,
    zIndex: 2,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: { flexGrow: 1 },

  hero: {
    alignItems: 'center',
    paddingBottom: spacing.xl * 2,
    backgroundColor: '#8FA08C',
    borderBottomLeftRadius: 120,
    borderBottomRightRadius: 120,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: spacing.md, letterSpacing: 0.5 },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center', marginTop: spacing.xs },

  form: { marginTop: spacing.xl },

  primary: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.header,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  blocked: { opacity: 0.6 },
  forgot: { color: colors.primary, textAlign: 'center', fontSize: 15, fontWeight: '600', marginTop: spacing.md },

  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginVertical: spacing.lg },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 15 },

  social: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  socialText: { color: colors.text, fontSize: 16, fontWeight: '600' },

  footer: { textAlign: 'center', color: colors.textMuted, fontSize: 15, marginTop: spacing.md },
  footerLink: { color: colors.primary, fontWeight: '800' },
  guest: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.lg,
  },

  pressed: { opacity: 0.85 },
});
