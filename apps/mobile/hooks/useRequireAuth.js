import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';

// Bọc một hành động cần đăng nhập (mua hàng, giỏ hàng...): khách -> đẩy sang Login;
// đã đăng nhập -> chạy action.
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();
  return (action) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    action?.();
  };
}
