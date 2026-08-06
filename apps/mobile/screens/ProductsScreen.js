// Cửa hàng — "Tất cả sản phẩm": tìm kiếm server-side + lưới sản phẩm (phân trang, kéo làm mới).
// Dữ liệu từ GET /public/catalog/shop-items; chạm thẻ mở màn chi tiết.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { fetchShopItems } from '../api/catalog';
import { toStaticUrl } from '../api/config';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';
import CartButton from '../components/CartButton';

const PER_PAGE = 12;

export default function ProductsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const { add } = useCart();
  const alert = useAlert();
  const [query, setQuery] = useState('');
  const [showSupport, setShowSupport] = useState(true);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const load = useCallback(async (search, page, mode) => {
    if (mode === 'more') setLoadingMore(true);
    else if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);
    try {
      const rows = await fetchShopItems({ search, page, perPage: PER_PAGE });
      pageRef.current = page;
      hasMoreRef.current = rows.length === PER_PAGE;
      setItems((prev) => (mode === 'more' ? [...prev, ...rows] : rows));
    } catch {
      if (mode !== 'more') setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  // Tải trang đầu; tải lại (debounce 400ms) mỗi khi đổi từ khoá tìm kiếm (search server-side).
  useEffect(() => {
    const t = setTimeout(() => load(query, 1, 'initial'), query ? 400 : 0);
    return () => clearTimeout(t);
  }, [query, load]);

  const onEndReached = () => {
    if (!loading && !loadingMore && hasMoreRef.current) {
      load(query, pageRef.current + 1, 'more');
    }
  };

  const onOpen = (item) => navigation.navigate('ProductDetail', { id: item.id, product: item });

  // Khách -> Login; đã đăng nhập -> thêm vào giỏ. "Mua ngay" thêm rồi mở giỏ.
  const onAddToCart = (item) =>
    requireAuth(async () => {
      try {
        await add(item.id, 1);
        alert.success('Đã thêm vào giỏ', item.name);
      } catch (e) {
        alert.error('Không thêm được', e.message);
      }
    });
  const onBuyNow = (item) =>
    requireAuth(async () => {
      try {
        await add(item.id, 1);
        navigation.navigate('Cart');
      } catch (e) {
        alert.error('Không thêm được', e.message);
      }
    });

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Tất cả sản phẩm</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onEndReachedThreshold={0.4}
        onEndReached={onEndReached}
        refreshing={refreshing}
        onRefresh={() => load(query, 1, 'refresh')}
        ListHeaderComponent={
          <View style={styles.search}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <Text style={styles.empty}>Không tìm thấy sản phẩm phù hợp.</Text>
          )
        }
        ListFooterComponent={
          loadingMore ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null
        }
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onOpen={onOpen}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        )}
      />

      {showSupport ? (
        <View style={[styles.supportWrap, { bottom: insets.bottom + spacing.lg }]}>
          <Pressable style={styles.supportClose} hitSlop={8} onPress={() => setShowSupport(false)}>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.support}>
            <Ionicons name="headset-outline" size={26} color="#fff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function ProductCard({ item, onOpen, onAddToCart, onBuyNow }) {
  const [imgError, setImgError] = useState(false);
  const image = imgError ? null : toStaticUrl(item.images?.[0]);
  return (
    <View style={styles.card}>
      <Pressable onPress={() => onOpen(item)} style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.cardArt}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.cardImg}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <Ionicons name="leaf" size={44} color={colors.primary} />
          )}
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>{groupThousands(item.price)}đ</Text>
          <Text style={styles.cardSold}>
            {item.stock > 0 ? `Còn ${item.stock} ${item.unit || ''}`.trim() : 'Hết hàng'}
          </Text>
        </View>
      </Pressable>
      <View style={styles.cardActions}>
        <Pressable
          onPress={() => onAddToCart(item)}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
        >
          <Ionicons name="cart-outline" size={20} color={colors.textMuted} />
        </Pressable>
        <Pressable
          onPress={() => onBuyNow(item)}
          style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}
        >
          <Text style={styles.buyText}>Mua ngay</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  list: { padding: spacing.lg, gap: spacing.lg },
  row: { gap: spacing.lg },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    height: 52,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, padding: 0 },

  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardArt: {
    height: 140,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: { width: '100%', height: '100%' },
  loader: { marginTop: spacing.xl },
  cardInfo: { paddingHorizontal: spacing.md, paddingTop: spacing.md, gap: spacing.xs },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.text, minHeight: 38 },
  cardPrice: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },
  cardSold: { fontSize: 13, color: colors.textMuted },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  supportWrap: { position: 'absolute', right: spacing.lg, alignItems: 'center' },
  supportClose: {
    position: 'absolute',
    top: -10,
    right: -6,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  support: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  pressed: { opacity: 0.85 },
});
