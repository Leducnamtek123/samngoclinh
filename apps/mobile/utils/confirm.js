// Hộp thoại xác nhận dùng chung. Native: Alert.alert; Web: window.confirm
// (React Native Web bỏ qua mảng buttons của Alert.alert nên callback không chạy).
import { Alert, Platform } from 'react-native';

export function confirm({ title, message, confirmText = 'Đồng ý', cancelText = 'Huỷ' }) {
  if (Platform.OS === 'web') {
    const text = message ? `${title}\n\n${message}` : title;
    const ok =
      typeof window !== 'undefined' && typeof window.confirm === 'function'
        ? window.confirm(text)
        : true;
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
      { text: confirmText, style: 'destructive', onPress: () => resolve(true) },
    ]);
  });
}
