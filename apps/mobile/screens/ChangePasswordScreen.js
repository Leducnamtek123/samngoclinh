import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword, signOut } = useAuth();
  const alert = useAlert();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!oldPassword) return alert.error('Thiếu thông tin', 'Vui lòng nhập mật khẩu hiện tại.');
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
      return alert.error(
        'Mật khẩu chưa hợp lệ',
        'Mật khẩu mới tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số.'
      );
    }
    if (newPassword === oldPassword) {
      return alert.error('Mật khẩu chưa hợp lệ', 'Mật khẩu mới phải khác mật khẩu hiện tại.');
    }
    if (newPassword !== confirmPassword) {
      return alert.error('Mật khẩu không khớp', 'Mật khẩu xác nhận không khớp.');
    }
    setLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      // Backend xoá toàn bộ session khi đổi mật khẩu -> đăng xuất & yêu cầu đăng nhập lại.
      alert.success(
        'Đổi mật khẩu thành công',
        'Vì lý do bảo mật, vui lòng đăng nhập lại bằng mật khẩu mới.',
        {
          confirmText: 'Đăng nhập',
          onConfirm: async () => {
            await signOut();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        }
      );
    } catch (e) {
      alert.error('Đổi mật khẩu thất bại', e?.message || 'Vui lòng thử lại.');
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
        placeholder="≥ 8 ký tự, có chữ hoa, thường và số"
        secureTextEntry
      />
      <FormField
        label="Xác nhận mật khẩu mới"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
        secureTextEntry
      />
      <PrimaryButton title="Đổi mật khẩu" onPress={onSubmit} loading={loading} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: spacing.lg, backgroundColor: colors.surface },
});
