// Chi tiết đơn hàng (sau khi đặt): trạng thái, thông tin khách, sản phẩm, tổng tiền (VAT 8%),
// hủy đơn hoặc thanh toán (mã QR cho đơn trực tuyến đang chờ).
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  Linking,
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
import { toStaticUrl, API_BASE_NEUTRAL, ORDER_STATUS_POLL_MS } from '../api/config';
import { useAlert } from '../context/AlertContext';
import { cancelOrder, fetchOrder } from '../api/orders';

const STATUS = {
  pending: { label: 'Chờ thanh toán', color: '#E08A1E', bg: '#FDF2E2' },
  paid: { label: 'Đã thanh toán', color: colors.primary, bg: colors.greenSoft },
  completed: { label: 'Hoàn thành', color: colors.primary, bg: colors.greenSoft },
  cancelled: { label: 'Đã hủy', color: '#E5484D', bg: '#FBE9E9' },
};

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export default function OrderDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const [order, setOrder] = useState(route.params?.order || null);
  const [busy, setBusy] = useState(false);
  const pollsRef = useRef(0);

  // Tải lại đơn từ server (dùng để cập nhật trạng thái sau khi thanh toán trên cổng SePay).
  const refresh = useCallback(async () => {
    if (!order?.id) return;
    const data = await fetchOrder(order.id).catch(() => null);
    if (!data) return;
    setOrder((prev) => ({ ...prev, ...data }));
    if (order.status === 'pending' && data.status === 'paid') {
      alert.success('Thanh toán thành công', `Đơn #${data.code} đã được thanh toán.`);
    }
  }, [order?.id, order?.status, alert]);

  // Khách thanh toán trên trình duyệt SePay (không có callback về app) -> poll khi đơn còn chờ.
  useEffect(() => {
    if (order?.status !== 'pending') return undefined;
    pollsRef.current = 0;
    const timer = setInterval(() => {
      pollsRef.current += 1;
      if (pollsRef.current > 180) {
        clearInterval(timer);
        return;
      }
      refresh();
    }, ORDER_STATUS_POLL_MS);
    return () => clearInterval(timer);
  }, [order?.status, refresh]);

  // Kiểm tra lại ngay khi người dùng quay về app (từ trình duyệt/tab SePay).
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  const goHome = () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  if (!order) {
    return (
      <View style={styles.root}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <Pressable hitSlop={8} onPress={goHome}>
            <Ionicons name="chevron-back" size={26} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <View style={{ width: 26 }} />
        </View>
        <Text style={styles.empty}>Không tải được đơn hàng.</Text>
      </View>
    );
  }

  const st = STATUS[order.status] || STATUS.pending;
  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = order.subtotal ?? 0;
  const vat = order.vat ?? Math.round(subtotal * 0.08);
  const qr = order.paymentQr;
  const isPending = order.status === 'pending';
  const isPickup = order.deliveryType === 'pickup';
  const canPay = isPending && !!qr;

  const onPay = () =>
    Linking.openURL(`${API_BASE_NEUTRAL}/public/payment/sepay/pay/${order.code}`).catch(
      () => {}
    );

  const onCancel = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const updated = await cancelOrder(order.id);
      setOrder((prev) => ({ ...prev, ...updated }));
      alert.success('Đã hủy đơn hàng', 'Đơn hàng của bạn đã được hủy.');
    } catch (e) {
      alert.error('Không hủy được', e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, styles.center]}>
          <Ionicons name="checkmark-circle" size={64} color={colors.primary} />
          <Text style={styles.successTitle}>Đặt hàng thành công!</Text>
          <Text style={styles.code}>Mã đơn hàng: #{order.code}</Text>
          <View style={[styles.badge, { backgroundColor: st.bg }]}>
            <Text style={[styles.badgeText, { color: st.color }]}>{st.label}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
          <InfoRow label="Khách hàng" value={order.customerName || '—'} />
          <InfoRow label="Số điện thoại" value={order.customerPhone || '—'} />
          <InfoRow label="Email" value={order.customerEmail || '—'} />
          <InfoRow
            label="Địa chỉ giao hàng"
            value={isPickup ? 'Nhận tại cửa hàng' : order.shippingAddress || '—'}
          />
          <InfoRow
            label="Phí vận chuyển"
            value={order.shippingFee ? `${groupThousands(order.shippingFee)} VND` : '0 VND'}
          />
          <InfoRow label="Ngày đặt" value={formatDateTime(order.createdAt)} />

          <View style={styles.divider} />
          <Text style={styles.cardTitle}>Sản phẩm đặt mua</Text>
          {items.map((item, i) => (
            <View key={item.productId || i} style={styles.item}>
              <Thumb images={item.images} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <Text style={styles.itemUnit}>Đơn giá: {groupThousands(item.price)} VND</Text>
                <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
              </View>
              <Text style={styles.itemTotal}>{groupThousands(item.totalPrice)} VND</Text>
            </View>
          ))}

          <View style={styles.divider} />
          <SummaryLine label="Tạm tính:" value={`${groupThousands(subtotal)} VND`} muted />
          <SummaryLine label="VAT sản phẩm (8%):" value={`${groupThousands(vat)} VND`} muted />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{groupThousands(order.total ?? 0)} VND</Text>
          </View>
        </View>

        {canPay ? (
          <View style={styles.notice}>
            <Ionicons name="time-outline" size={18} color="#E08A1E" />
            <Text style={styles.noticeText}>
              Vui lòng thanh toán trong ngày. Đơn sẽ tự hủy khi qua ngày.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        {isPending ? (
          <>
            <Pressable
              onPress={onCancel}
              disabled={busy}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
            >
              {busy ? (
                <ActivityIndicator color="#E5484D" />
              ) : (
                <Text style={styles.cancelText}>Hủy đơn hàng</Text>
              )}
            </Pressable>
            <Pressable
              onPress={canPay ? onPay : goHome}
              style={({ pressed }) => [styles.payBtn, pressed && styles.pressed]}
            >
              <Text style={styles.payText}>{canPay ? 'Thanh toán' : 'Về trang chủ'}</Text>
            </Pressable>
          </>
        ) : (
          <Pressable
            onPress={goHome}
            style={({ pressed }) => [styles.payBtn, { flex: 1 }, pressed && styles.pressed]}
          >
            <Text style={styles.payText}>Về trang chủ</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function SummaryLine({ label, value, muted }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={[styles.sumValue, muted && styles.sumMuted]}>{value}</Text>
    </View>
  );
}

function Thumb({ images }) {
  const [err, setErr] = useState(false);
  const uri = err ? null : toStaticUrl((images || [])[0]);
  return (
    <View style={styles.thumb}>
      {uri ? (
        <Image source={{ uri }} style={styles.thumbImg} resizeMode="cover" onError={() => setErr(true)} />
      ) : (
        <Ionicons name="leaf" size={26} color={colors.primary} />
      )}
    </View>
  );
}

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
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  center: { alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.primary },
  code: { fontSize: 16, color: colors.text },
  badge: { borderRadius: 999, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  badgeText: { fontSize: 14, fontWeight: '700' },

  cardTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  infoLabel: { fontSize: 15, color: colors.textMuted, flexShrink: 0 },
  infoValue: { fontSize: 15, color: colors.text, flex: 1, textAlign: 'right' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  item: {
    flexDirection: 'row',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { fontSize: 14, fontWeight: '700', color: colors.text, textTransform: 'uppercase' },
  itemUnit: { fontSize: 13, color: colors.textMuted },
  itemQty: { fontSize: 13, color: colors.textMuted },
  itemTotal: { fontSize: 14, fontWeight: '800', color: colors.primary },

  sumLabel: { fontSize: 15, color: colors.textMuted },
  sumValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  sumMuted: { color: colors.textMuted, fontWeight: '400' },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xs },
  totalLabel: { fontSize: 18, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.primary },

  notice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FDF2E2',
    borderRadius: 12,
    padding: spacing.md,
  },
  noticeText: { flex: 1, color: '#B9721A', fontSize: 14, fontWeight: '600', lineHeight: 20 },

  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5484D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { color: '#E5484D', fontSize: 16, fontWeight: '800' },
  payBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: spacing.lg },
  modalCard: { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.lg, gap: spacing.md },
  modalTitle: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
  qr: { width: 220, height: 220, alignSelf: 'center' },
  closeBtn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
  },
  closeText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
