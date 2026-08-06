// Giỏ hàng: chọn tất cả / từng món, chỉnh số lượng, xóa; tổng tiền tính theo món đã chọn.
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { toStaticUrl } from '../api/config';
import { useCart } from '../context/CartContext';
import { useAlert } from '../context/AlertContext';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, loading, update, remove, refresh } = useCart();
  const alert = useAlert();
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState(() => new Set());

  const items = cart.items;
  const knownRef = useRef(new Set());

  // Đồng bộ lựa chọn khi giỏ đổi: món mới -> chọn mặc định; món cũ giữ trạng thái; món đã xóa loại bỏ.
  useEffect(() => {
    const ids = items.map((i) => i.productId);
    setSelected((prev) => {
      const next = new Set();
      for (const id of ids) {
        if (knownRef.current.has(id)) {
          if (prev.has(id)) next.add(id);
        } else {
          next.add(id);
        }
      }
      return next;
    });
    knownRef.current = new Set(ids);
  }, [items]);

  const allSelected = items.length > 0 && selected.size === items.length;
  const selectedTotal = items
    .filter((i) => selected.has(i.productId))
    .reduce((acc, i) => acc + i.totalPrice, 0);

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(items.map((i) => i.productId)));
  const toggleItem = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const changeQty = async (productId, qty) => {
    if (qty < 1 || busy) return;
    setBusy(true);
    try {
      await update(productId, qty);
    } catch (e) {
      alert.error('Không cập nhật được', e.message);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = async (productId) => {
    if (busy) return;
    setBusy(true);
    try {
      await remove(productId);
    } catch (e) {
      alert.error('Không xóa được', e.message);
    } finally {
      setBusy(false);
    }
  };

  const onOrder = () => {
    if (!selected.size) return;
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Giỏ Hàng</Text>
        <Pressable hitSlop={8} onPress={refresh}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </Pressable>
      </View>

      {loading && cart.empty ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : cart.empty ? (
        <View style={styles.emptyWrap}>
          <Ionicons name="cart-outline" size={72} color={colors.textMuted} />
          <Text style={styles.emptyText}>Giỏ hàng của bạn đang trống.</Text>
          <Pressable
            onPress={() => navigation.navigate('Home')}
            style={({ pressed }) => [styles.shopBtn, pressed && styles.pressed]}
          >
            <Text style={styles.shopBtnText}>Tiếp tục mua sắm</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.selectBar}>
            <Pressable style={styles.selectAll} hitSlop={6} onPress={toggleAll}>
              <Check on={allSelected} />
              <Text style={styles.selectAllText}>Chọn tất cả</Text>
            </Pressable>
            <Text style={styles.countText}>
              {selected.size}/{items.length} sản phẩm
            </Text>
          </View>

          <FlatList
            data={items}
            keyExtractor={(item) => item.productId}
            contentContainerStyle={[styles.list, { paddingBottom: spacing.xl }]}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={refresh}
            renderItem={({ item }) => (
              <CartCard
                item={item}
                selected={selected.has(item.productId)}
                busy={busy}
                onToggle={() => toggleItem(item.productId)}
                onDec={() => changeQty(item.productId, item.quantity - 1)}
                onInc={() => changeQty(item.productId, item.quantity + 1)}
                onRemove={() => onRemove(item.productId)}
              />
            )}
          />

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel} numberOfLines={1}>
                Tổng tiền sản phẩm
              </Text>
              <Text style={styles.totalValue}>{groupThousands(selectedTotal)} đ</Text>
            </View>
            <Pressable
              onPress={onOrder}
              disabled={!selected.size}
              style={({ pressed }) => [
                styles.orderBtn,
                !selected.size && styles.orderDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.orderText}>Đặt hàng</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

function Check({ on }) {
  return (
    <View style={[styles.check, on && styles.checkOn]}>
      {on ? <Ionicons name="checkmark" size={15} color="#fff" /> : null}
    </View>
  );
}

function ThumbImg({ uri, cell }) {
  const [err, setErr] = useState(false);
  const st = cell ? styles.thumbCell : styles.thumbFull;
  if (err) {
    return (
      <View style={[st, styles.thumbCenter]}>
        <Ionicons name="leaf" size={18} color={colors.primary} />
      </View>
    );
  }
  return <Image source={{ uri }} style={st} resizeMode="cover" onError={() => setErr(true)} />;
}

function Thumb({ images }) {
  const imgs = (images || []).map(toStaticUrl).filter(Boolean).slice(0, 4);
  if (!imgs.length) {
    return (
      <View style={[styles.thumb, styles.thumbCenter]}>
        <Ionicons name="leaf" size={30} color={colors.primary} />
      </View>
    );
  }
  if (imgs.length === 1) {
    return (
      <View style={styles.thumb}>
        <ThumbImg uri={imgs[0]} />
      </View>
    );
  }
  return (
    <View style={[styles.thumb, styles.thumbGrid]}>
      {imgs.map((u, i) => (
        <ThumbImg key={`${u}-${i}`} uri={u} cell />
      ))}
    </View>
  );
}

function CartCard({ item, selected, busy, onToggle, onDec, onInc, onRemove }) {
  const inStock = (item.stock ?? 0) > 0;
  const maxed = item.stock != null && item.quantity >= item.stock;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.badge}>
          <Ionicons name="bag-handle" size={13} color="#fff" />
          <Text style={styles.badgeText}>Sản phẩm chế biến</Text>
        </View>
        <Pressable hitSlop={8} onPress={onToggle}>
          <Check on={selected} />
        </Pressable>
      </View>

      <View style={styles.cardBody}>
        <Thumb images={item.images} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {item.productName}
          </Text>
          <View style={styles.stockRow}>
            <Ionicons
              name={inStock ? 'checkmark-circle' : 'close-circle'}
              size={15}
              color={inStock ? colors.primary : colors.textMuted}
            />
            <Text style={styles.stock}>
              {inStock ? `Còn ${item.stock} sản phẩm` : 'Hết hàng'}
            </Text>
          </View>
          <Text style={styles.price}>{groupThousands(item.price)} VND</Text>
        </View>
        <View style={styles.right}>
          <Pressable onPress={onRemove} disabled={busy} hitSlop={6} style={styles.removeBtn}>
            <Ionicons name="close" size={18} color="#E5484D" />
          </Pressable>
          <View style={styles.stepper}>
            <Pressable onPress={onDec} disabled={busy} style={styles.stepBtn} hitSlop={4}>
              <Ionicons name="remove" size={16} color={colors.primary} />
            </Pressable>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <Pressable
              onPress={onInc}
              disabled={busy || maxed}
              style={styles.stepBtn}
              hitSlop={4}
            >
              <Ionicons name="add" size={16} color={maxed ? colors.border : colors.primary} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const PEACH = '#F7DFD0';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center' },

  loader: { marginTop: spacing.xl },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  emptyText: { fontSize: 16, color: colors.textMuted },
  shopBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  shopBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  selectBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectAll: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  selectAllText: { fontSize: 16, fontWeight: '700', color: colors.text },
  countText: { fontSize: 15, color: colors.textMuted },

  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },

  list: { padding: spacing.lg, gap: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PEACH,
    padding: spacing.md,
    gap: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  cardBody: { flexDirection: 'row', gap: spacing.md },
  thumb: {
    width: 78,
    height: 78,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.greenSoft,
    flexShrink: 0,
  },
  thumbGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  thumbFull: { width: '100%', height: '100%' },
  thumbCell: { width: '50%', height: '50%', backgroundColor: colors.greenSoft },
  thumbCenter: { alignItems: 'center', justifyContent: 'center' },

  info: { flex: 1, gap: spacing.xs },
  name: { fontSize: 15, fontWeight: '800', color: colors.text, textTransform: 'uppercase' },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stock: { fontSize: 13, color: colors.primary },
  price: { fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 2 },

  right: { alignItems: 'flex-end', justifyContent: 'space-between' },
  removeBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FBE9E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.greenSoft,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  stepBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 15, fontWeight: '800', color: colors.text, minWidth: 20, textAlign: 'center' },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.md,
  },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  totalLabel: { flex: 1, fontSize: 16, fontWeight: '700', color: colors.text },
  totalValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  orderBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderDisabled: { backgroundColor: colors.textMuted },
  orderText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
