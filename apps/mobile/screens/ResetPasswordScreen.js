import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { resetPassword } from '../api/auth';
import { colors, spacing } from '../utils/theme';

// route.params.token đến từ deep link (samngoclinh://reset-password?token=...).
export default function ResetPasswordScreen({ route, navigation }) {
  const [token, setToken] = useState(route?.params?.token || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!token.trim()) {
      setError('Thiếu mã đặt lại mật khẩu.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Mật khẩu mới tối thiểu 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPassword({ token: token.trim(), newPassword });
      navigation.navigate('Login');
    } catch (e) {
      setError(e?.message || 'Đặt lại mật khẩu thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Đặt lại mật khẩu</Text>

      <FormField
        label="Mã đặt lại"
        value={token}
        onChangeText={setToken}
        placeholder="Dán mã từ email"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <FormField
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Tối thiểu 8 ký tự"
        secureTextEntry
      />
      <FormField
        label="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Xác nhận" onPress={onSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, backgroundColor: colors.surface },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: spacing.lg },
  error: { color: colors.danger, marginBottom: spacing.md },
});
