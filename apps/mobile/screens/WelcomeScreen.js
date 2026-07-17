// Welcome — màn mở đầu trước đăng nhập: đăng nhập / đăng ký / tiếp tục không đăng nhập.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, spacing } from '../utils/theme';

export default function WelcomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#D6EBC7', '#EFF7E9', '#FFFFFF']} style={styles.root}>
      <StatusBar style="dark" />
      <View
        style={[
          styles.content,
          { paddingTop: insets.top + spacing.xl * 2, paddingBottom: insets.bottom + spacing.xl },
        ]}
      >
        <View style={styles.hero}>
          <Text style={styles.title}>Chào mừng đến với iWE FARM!</Text>
          <Text style={styles.subtitle}>Trải nghiệm nông nghiệp hiện đại trong tầm tay.</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => navigation.navigate('Login')}
            style={({ pressed }) => [styles.btn, styles.btnSolid, pressed && styles.pressed]}
          >
            <Text style={styles.btnSolidText}>Đăng nhập</Text>
          </Pressable>

          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={({ pressed }) => [styles.btn, styles.btnOutline, pressed && styles.pressed]}
          >
            <Text style={styles.btnOutlineText}>Đăng ký</Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            onPress={() => navigation.navigate('ComingSoon', { title: 'Chế độ khách' })}
          >
            <Text style={styles.guest}>Tiếp tục không đăng nhập</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: { alignItems: 'center' },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    textAlign: 'center',
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: spacing.md,
  },

  actions: { gap: spacing.md },
  btn: {
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolid: { backgroundColor: colors.primary },
  btnSolidText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnOutline: { backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary },
  btnOutlineText: { color: colors.primary, fontSize: 17, fontWeight: '700' },
  guest: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: spacing.sm,
  },
  pressed: { opacity: 0.85 },
});
