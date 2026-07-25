import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { requestPasswordReset } from '../api/auth';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const alert = useAlert();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email.trim()) {
      return alert.error('Thiếu thông tin', 'Vui lòng nhập email hoặc số điện thoại.');
    }
    setLoading(true);
    try {
      await requestPasswordReset({ email: email.trim().toLowerCase() });
      alert.success(
        'Đã gửi yêu cầu',
        'Nếu tài khoản tồn tại, mật khẩu tạm đã được gửi qua email. Đăng nhập bằng mật khẩu tạm rồi đặt lại mật khẩu mới.',
        { confirmText: 'Về đăng nhập', onConfirm: () => navigation.navigate('Login') }
      );
    } catch (e) {
      alert.error('Lỗi', e?.message || 'Không gửi được yêu cầu, vui lòng thử lại.');
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
      <FormField
        label="Email hoặc số điện thoại"
        value={email}
        onChangeText={setEmail}
        placeholder="you@example.com"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <PrimaryButton title="Gửi yêu cầu" onPress={onSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, backgroundColor: colors.surface },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.sm },
  desc: { fontSize: 15, color: colors.textMuted, marginBottom: spacing.lg },
});
