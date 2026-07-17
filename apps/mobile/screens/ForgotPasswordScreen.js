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
      setError('Vui lòng nhập email.');
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
        Nhập email tài khoản, chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
      </Text>

      {sent ? (
        <View style={styles.sentBox}>
          <Text style={styles.sentText}>
            Nếu email tồn tại, bạn sẽ nhận được liên kết đặt lại mật khẩu trong ít phút.
          </Text>
          <PrimaryButton title="Nhập mã đặt lại" onPress={() => navigation.navigate('ResetPassword')} />
        </View>
      ) : (
        <>
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
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
