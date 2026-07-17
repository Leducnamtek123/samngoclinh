import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';

import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../utils/theme';

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
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
      await changePassword({ oldPassword, newPassword });
      Alert.alert('Thành công', 'Mật khẩu đã được đổi.');
      navigation.goBack();
    } catch (e) {
      setError(e?.message || 'Đổi mật khẩu thất bại, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <FormField
        label="Mật khẩu hiện tại"
        value={oldPassword}
        onChangeText={setOldPassword}
        placeholder="Nhập mật khẩu hiện tại"
        secureTextEntry
      />
      <FormField
        label="Mật khẩu mới"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="Tối thiểu 8 ký tự"
        secureTextEntry
      />
      <FormField
        label="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <PrimaryButton title="Đổi mật khẩu" onPress={onSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, backgroundColor: colors.surface },
  error: { color: colors.danger, marginBottom: spacing.md },
});
