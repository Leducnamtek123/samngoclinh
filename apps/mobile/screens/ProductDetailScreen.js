// Chi tiết sản phẩm (vào từ Cửa hàng): ảnh collage, giá, còn hàng, mô tả (Thành phần/Công dụng)
// + mã sản phẩm/tồn kho, số lượng và Mua ngay (khách -> Login).
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { fetchShopItem } from '../api/catalog';
import { toStaticUrl } from '../api/config';
import { useRequireAuth } from '../hooks/useRequireAuth';

const CART_ORANGE = '#F5A623';

export default function ProductDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();

  const { id, product: initial } = route.params || {};
  const [product, setProduct] = useState(initial || null);
  const [loading, setLoading] = useState(!initial);
  const [expanded, setExpanded] = useState(false);
  const [qty, setQty] = useState(1);

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
  const descLines = (product?.description || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const collapsed = !expanded && descLines.length > 2;
  const shownLines = collapsed ? descLines.slice(0, 2) : descLines;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.headerActions}>
          <Pressable hitSlop={8} onPress={onAddToCart}>
            <Ionicons name="cart-outline" size={24} color="#fff" />
          </Pressable>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      {loading && !product ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : product ? (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <ProductGallery images={images} />

            <View style={styles.body}>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.price}>{groupThousands(product.price)} VND</Text>

              <View style={[styles.stockPill, !inStock && styles.stockPillOut]}>
                <Ionicons
                  name={inStock ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={inStock ? colors.primary : '#C0392B'}
                />
                <Text style={[styles.stockPillText, !inStock && styles.stockPillTextOut]}>
                  {inStock ? `Còn hàng: ${product.stock} sản phẩm` : 'Hết hàng'}
                </Text>
              </View>

              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              {descLines.length ? (
                <>
                  {shownLines.map((line) => (
                    <DescLine key={line} line={line} />
                  ))}
                  {descLines.length > 2 ? (
                    <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
                      <Text style={styles.link}>{expanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : (
                <Text style={styles.desc}>Đang cập nhật mô tả sản phẩm.</Text>
              )}

              <View style={styles.infoBox}>
                {product.code ? <InfoRow label="Mã sản phẩm" value={product.code} /> : null}
                <InfoRow label="Tình trạng kho" value={`${product.stock ?? 0} sản phẩm có sẵn`} />
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => q + 1)} style={styles.stepBtn} hitSlop={6}>
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>
            <Pressable
              onPress={onAddToCart}
              style={({ pressed }) => [styles.cartBtn, pressed && styles.pressed]}
            >
              <Ionicons name="cart" size={24} color="#fff" />
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

function DescLine({ line }) {
  const idx = line.indexOf(':');
  if (idx > 0 && idx < 24) {
    return (
      <Text style={styles.desc}>
        <Text style={styles.descLabel}>{line.slice(0, idx + 1)}</Text>
        {line.slice(idx + 1)}
      </Text>
    );
  }
  return <Text style={styles.desc}>{line}</Text>;
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Img({ uri, style }) {
  const [err, setErr] = useState(false);
  if (!uri || err) {
    return (
      <View style={[style, styles.imgFallback]}>
        <Ionicons name="leaf" size={40} color={colors.primary} />
      </View>
    );
  }
  return <Image source={{ uri }} style={style} resizeMode="cover" onError={() => setErr(true)} />;
}

function ProductGallery({ images }) {
  if (!images.length) {
    return (
      <View style={[styles.galleryFull, styles.imgFallback]}>
        <Ionicons name="leaf" size={64} color={colors.primary} />
      </View>
    );
  }
  if (images.length === 1) {
    return <Img uri={images[0]} style={styles.galleryFull} />;
  }
  return (
    <View style={styles.galleryRow}>
      <Img uri={images[0]} style={styles.galleryLeft} />
      <View style={styles.galleryRight}>
        <Img uri={images[1]} style={styles.gallerySmall} />
        {images[2] ? <Img uri={images[2]} style={styles.gallerySmall} /> : null}
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  galleryFull: { width: '100%', height: 300, backgroundColor: colors.greenSoft },
  galleryRow: { flexDirection: 'row', height: 300, gap: 3 },
  galleryLeft: { flex: 1.3, height: '100%', backgroundColor: colors.greenSoft },
  galleryRight: { flex: 1, gap: 3 },
  gallerySmall: { flex: 1, width: '100%', backgroundColor: colors.greenSoft },
  imgFallback: { alignItems: 'center', justifyContent: 'center' },

  body: { padding: spacing.lg, gap: spacing.sm },
  name: { fontSize: 24, fontWeight: '800', color: colors.text, textTransform: 'uppercase' },
  price: { fontSize: 24, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },

  stockPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  stockPillOut: { backgroundColor: '#FBEAE8', borderColor: '#C0392B' },
  stockPillText: { fontSize: 15, fontWeight: '700', color: colors.primary },
  stockPillTextOut: { color: '#C0392B' },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  desc: { fontSize: 15, lineHeight: 23, color: colors.text },
  descLabel: { fontWeight: '800', color: colors.text },
  link: { color: '#2F80ED', fontSize: 15, fontWeight: '600', marginTop: 2 },

  infoBox: { marginTop: spacing.md, gap: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  infoLabel: { fontSize: 15, fontWeight: '700', color: colors.text, minWidth: 118 },
  infoValue: { flex: 1, fontSize: 15, color: colors.textMuted },

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
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stepBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    minWidth: 28,
    textAlign: 'center',
  },
  cartBtn: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: CART_ORANGE,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
