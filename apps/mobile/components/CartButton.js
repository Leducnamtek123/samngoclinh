// Icon giỏ hàng + badge số lượng; chạm mở màn Giỏ hàng. Dùng ở header các màn.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useCart } from '../context/CartContext';

export default function CartButton({ color = '#fff', size = 24 }) {
  const navigation = useNavigation();
  const { count } = useCart();
  return (
    <Pressable hitSlop={8} onPress={() => navigation.navigate('Cart')}>
      <Ionicons name="cart-outline" size={size} color={color} />
      {count > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -7,
    right: -9,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: '#2ECC71',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
});
