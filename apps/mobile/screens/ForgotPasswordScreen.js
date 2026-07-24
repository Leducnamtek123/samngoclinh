import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { requestPasswordReset } from '../api/auth';
import { colors, spacing } from '../utils/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async () => {
    if (!email.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() });
      setSent(true);
    } catch (e) {
      setError(e?.message || 'Không gửi được yêu cầu, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Quên mật khẩu</Text>
      <Text style={styles.desc}>
        Nhập email hoặc số điện thoại tài khoản. Chúng tôi sẽ gửi mật khẩu tạm qua email.
      </Text>

      {sent ? (
        <View style={styles.sentBox}>
          <Text style={styles.sentText}>
            Nếu tài khoản tồn tại, mật khẩu tạm đã được gửi qua email. Hãy đăng nhập bằng mật khẩu
            tạm, sau đó hệ thống sẽ yêu cầu bạn đặt mật khẩu mới.
          </Text>
          <PrimaryButton title="Về đăng nhập" onPress={() => navigation.navigate('Login')} />
        </View>
      ) : (
        <>
          <FormField
            label="Email hoặc số điện thoại"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton title="Gửi yêu cầu" onPress={onSubmit} loading={loading} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, backgroundColor: colors.surface },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  desc: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.md },
  sentBox: { gap: spacing.md },
  sentText: { fontSize: 15, color: colors.text, marginBottom: spacing.md },
});
