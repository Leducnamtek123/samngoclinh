// MainTabs — thanh tab dưới cùng: mục đang chọn hiển thị dạng "pill" (icon + nhãn),
// các mục còn lại chỉ hiện icon.
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import PlantingScreen from '../screens/PlantingScreen';
import ProductsScreen from '../screens/ProductsScreen';
import PromoScreen from '../screens/PromoScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { colors, spacing } from '../utils/theme';

const Tab = createBottomTabNavigator();

const TABS = {
  Home: { icon: 'home-outline', activeIcon: 'home', label: 'Trang chủ' },
  Planting: { icon: 'leaf-outline', activeIcon: 'leaf', label: 'Trồng sâm' },
  Products: { icon: 'storefront-outline', activeIcon: 'storefront', label: 'Cửa hàng' },
  Promo: { icon: 'gift-outline', activeIcon: 'gift', label: 'Khuyến mãi' },
  Profile: { icon: 'person-outline', activeIcon: 'person', label: 'Tài khoản' },
};

function TabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom || spacing.sm }]}>
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const meta = TABS[route.name];

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={[styles.item, focused && styles.itemActive]}
          >
            <Ionicons
              name={focused ? meta.activeIcon : meta.icon}
              size={22}
              color={focused ? '#fff' : '#8e8e93'}
            />
            {focused ? <Text style={styles.itemLabel}>{meta.label}</Text> : null}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Planting" component={PlantingScreen} />
      <Tab.Screen name="Products" component={ProductsScreen} />
      <Tab.Screen name="Promo" component={PromoScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: 24,
  },
  itemActive: { backgroundColor: colors.header },
  itemLabel: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
