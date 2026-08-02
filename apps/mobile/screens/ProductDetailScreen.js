// Chi tiết sản phẩm: ảnh, giá, tồn kho, mô tả + hành động mua (khách -> Login).
// Nhận { id, product } từ danh sách để vẽ ngay, rồi fetch bản đầy đủ (mô tả/ảnh) theo id.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { fetchShopItem } from '../api/catalog';
import { toStaticUrl } from '../api/config';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ImageCarousel from '../components/ImageCarousel';

const CATEGORY_LABELS = {
  beverage: 'Đồ uống',
  tea: 'Trà & Thảo mộc',
  food: 'Thực phẩm',
  supplement: 'Thực phẩm bổ sung',
  personal_care: 'Chăm sóc cá nhân',
};

export default function ProductDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const { width } = useWindowDimensions();

  const { id, product: initial } = route.params || {};
  const [product, setProduct] = useState(initial || null);
  const [loading, setLoading] = useState(!initial);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchShopItem(id);
      if (data) setProduct((prev) => ({ ...prev, ...data }));
    } catch {
      // giữ dữ liệu đã truyền từ danh sách nếu fetch lỗi
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onAddToCart = () =>
    requireAuth(() => navigation.navigate('ComingSoon', { title: 'Giỏ hàng' }));
  const onBuyNow = () =>
    requireAuth(() => navigation.navigate('ComingSoon', { title: 'Thanh toán' }));

  const images = (product?.images || []).map(toStaticUrl).filter(Boolean);
  const inStock = (product?.stock ?? 0) > 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết sản phẩm
        </Text>
        <Pressable hitSlop={8} onPress={onAddToCart}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
        </Pressable>
      </View>

      {loading && !product ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : product ? (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <ImageCarousel images={images} width={width} />
            <View style={styles.body}>
              {product.category ? (
                <Text style={styles.category}>
                  {CATEGORY_LABELS[product.category] || product.category}
                </Text>
              ) : null}
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>
                {groupThousands(product.price)}đ
                {product.unit ? <Text style={styles.unit}> / {product.unit}</Text> : null}
              </Text>
              <View style={styles.stockRow}>
                <Ionicons
                  name={inStock ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={inStock ? colors.primary : colors.textMuted}
                />
                <Text style={styles.stock}>
                  {inStock ? `Còn ${product.stock} ${product.unit || ''}`.trim() : 'Hết hàng'}
                </Text>
              </View>
              {product.description ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Mô tả</Text>
                  <Text style={styles.desc}>{product.description}</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <Pressable
              onPress={onAddToCart}
              style={({ pressed }) => [styles.cartBtn, pressed && styles.pressed]}
            >
              <Ionicons name="cart-outline" size={22} color={colors.primary} />
              <Text style={styles.cartText}>Thêm vào giỏ</Text>
            </Pressable>
            <Pressable
              onPress={onBuyNow}
              disabled={!inStock}
              style={({ pressed }) => [
                styles.buyBtn,
                !inStock && styles.buyDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.buyText}>{inStock ? 'Mua ngay' : 'Hết hàng'}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.empty}>Không tải được sản phẩm.</Text>
      )}
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

  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  body: { padding: spacing.lg, gap: spacing.sm },
  category: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: 'hidden',
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  price: { fontSize: 26, fontWeight: '800', color: colors.primary },
  unit: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stock: { fontSize: 14, color: colors.textMuted },

  section: { marginTop: spacing.md, gap: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  desc: { fontSize: 15, lineHeight: 22, color: colors.text },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  cartText: { color: colors.primary, fontSize: 15, fontWeight: '700' },
  buyBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyDisabled: { backgroundColor: colors.textMuted },
  buyText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
