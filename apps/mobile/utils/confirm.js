// Hộp thoại xác nhận chạy được cả native (Alert) lẫn web (window.confirm).
import { Alert, Platform } from 'react-native';

export function confirm({ title, message, confirmText = 'Đồng ý', cancelText = 'Huỷ' }) {
  if (Platform.OS === 'web') {
    return Promise.resolve(window.confirm(message ? `${title}\n\n${message}` : title));
  }
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
      { text: confirmText, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
