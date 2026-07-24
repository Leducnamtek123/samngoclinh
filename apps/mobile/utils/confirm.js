// Hộp thoại xác nhận hỗ trợ React Native Alert
import { Alert } from 'react-native';

export function confirm({ title, message, confirmText = 'Đồng ý', cancelText = 'Huỷ' }) {
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
      { text: confirmText, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
