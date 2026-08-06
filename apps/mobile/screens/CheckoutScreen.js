// Xác nhận đơn hàng: tóm tắt (VAT 8% + phí ship theo phương thức), thông tin khách,
// chọn vận chuyển (nhận tại cửa hàng / giao hàng) + thanh toán (online / COD), ghi chú -> đặt hàng.
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { toStaticUrl } from '../api/config';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { checkout } from '../api/orders';

const SHIP_OPTIONS = [
  { value: 'pickup', label: 'Nhận tại cửa hàng', sub: 'Thời gian: Tất cả các ngày trong tuần', fee: 0 },
  { value: 'shipping', label: 'Phí ship', sub: 'Thời gian: 1-2 ngày', fee: 30000 },
];
const PAY_OPTIONS = [
  { value: 'online', label: 'Thanh toán trực tuyến', icon: 'qr-code-outline' },
  { value: 'cod', label: 'Thanh toán khi nhận hàng', icon: 'cash-outline' },
];

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { cart, update, refresh } = useCart();
  const { user } = useAuth();
  const alert = useAlert();

  const addresses = user?.addresses || [];
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [addressChoice, setAddressChoice] = useState(defaultAddr?.id ?? 'new');
  const [newAddress, setNewAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState('pickup');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const items = cart.items;
  const subtotal = cart.total;
  const vat = Math.round(subtotal * 0.08);
  const shippingFee = deliveryType === 'shipping' ? 30000 : 0;
  const total = subtotal + vat + shippingFee;

  const resolvedAddress =
    addressChoice === 'new'
      ? newAddress.trim()
      : addresses.find((a) => a.id === addressChoice)?.detail || '';

  const addressOptions = [
    ...addresses.map((a) => ({ value: a.id, label: a.detail, sub: a.recipient || '' })),
    { value: 'new', label: 'Nhập địa chỉ mới...' },
  ];

  const changeQty = async (productId, qty) => {
    if (qty < 1 || busy) return;
    try {
      await update(productId, qty);
    } catch (e) {
      alert.error('Không cập nhật được', e.message);
    }
  };

  const onSubmit = async () => {
    const next = {};
    if (!name.trim()) next.name = 'Vui lòng nhập họ tên';
    if (!phone.trim()) next.phone = 'Vui lòng nhập số điện thoại';
    if (deliveryType === 'shipping' && !resolvedAddress) {
      next.address = 'Vui lòng nhập địa chỉ giao hàng';
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const order = await checkout({
        customerName: name.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim() || undefined,
        deliveryType,
        shippingAddress: deliveryType === 'shipping' ? resolvedAddress : undefined,
        paymentMethod,
        note: note.trim() || undefined,
      });
      await refresh();
      navigation.replace('OrderDetail', { order });
    } catch (e) {
      alert.error('Đặt hàng thất bại', e.message);
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
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tóm tắt đơn hàng</Text>
          {items.map((item) => (
            <View key={item.productId} style={styles.sumItem}>
              <Thumb images={item.images} />
              <View style={styles.sumInfo}>
                <Text style={styles.sumName} numberOfLines={2}>
                  {item.productName}
                </Text>
                <View style={styles.sumRow}>
                  <View style={styles.stepper}>
                    <Pressable
                      onPress={() => changeQty(item.productId, item.quantity - 1)}
                      style={styles.stepBtn}
                      hitSlop={4}
                    >
                      <Ionicons name="remove" size={16} color={colors.text} />
                    </Pressable>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <Pressable
                      onPress={() => changeQty(item.productId, item.quantity + 1)}
                      style={styles.stepBtn}
                      hitSlop={4}
                    >
                      <Ionicons name="add" size={16} color={colors.text} />
                    </Pressable>
                  </View>
                  <Text style={styles.sumPrice}>{groupThousands(item.totalPrice)} VND</Text>
                </View>
              </View>
            </View>
          ))}

          <View style={styles.divider} />
          <SummaryLine label="Tổng tiền hàng:" value={`${groupThousands(subtotal)} VND`} />
          <SummaryLine label="VAT sản phẩm (8%):" value={`${groupThousands(vat)} VND`} muted />
          <View style={styles.feeRow}>
            <Text style={styles.sumLabel}>Phí vận chuyển:</Text>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.sumValue}>{shippingFee ? `${groupThousands(shippingFee)} VND` : '0 VND'}</Text>
              <Text style={styles.feeSub}>
                {deliveryType === 'pickup' ? 'Nhận tại cửa hàng' : 'Giao tận nơi'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.feeRow}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{groupThousands(total)} VND</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
        <Field label="Họ tên *" value={name} onChangeText={setName} error={errors.name} />
        <Field
          label="Số điện thoại *"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
        />
        <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Select
          label="Địa chỉ giao hàng *"
          value={addressChoice}
          options={addressOptions}
          onSelect={setAddressChoice}
          error={errors.address}
        />
        {addressChoice === 'new' ? (
          <Field
            label="Nhập địa chỉ mới *"
            value={newAddress}
            onChangeText={setNewAddress}
            error={errors.address}
            multiline
          />
        ) : null}

        <Text style={styles.sectionTitle}>Phương thức vận chuyển</Text>
        <Select
          value={deliveryType}
          options={SHIP_OPTIONS.map((o) => ({
            value: o.value,
            label: o.label,
            sub: o.sub,
            right: o.fee ? `${groupThousands(o.fee)} VND` : '0 VND',
          }))}
          onSelect={setDeliveryType}
        />

        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <Select
          value={paymentMethod}
          options={PAY_OPTIONS.map((o) => ({ value: o.value, label: o.label, icon: o.icon }))}
          onSelect={setPaymentMethod}
        />

        {paymentMethod === 'online' ? (
          <View style={styles.notice}>
            <Ionicons name="time-outline" size={18} color="#E08A1E" />
            <Text style={styles.noticeText}>
              Vui lòng thanh toán trong ngày. Đơn sẽ tự hủy khi qua ngày.
            </Text>
          </View>
        ) : null}

        <Field label="Ghi chú" value={note} onChangeText={setNote} multiline placeholder="Ghi chú" />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
        <Pressable
          onPress={onSubmit}
          disabled={busy || cart.empty}
          style={({ pressed }) => [
            styles.payBtn,
            (busy || cart.empty) && styles.payDisabled,
            pressed && styles.pressed,
          ]}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.payText}>Thanh toán</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

function SummaryLine({ label, value, muted }) {
  return (
    <View style={styles.feeRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={[styles.sumValue, muted && styles.sumValueMuted]}>{value}</Text>
    </View>
  );
}

function Field({ label, error, multiline, ...props }) {
  return (
    <View>
      <View style={[styles.field, multiline && styles.fieldMultiline, error && styles.fieldError]}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={colors.textMuted}
          multiline={multiline}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function Select({ label, value, options, onSelect, error }) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <View>
      {label ? <Text style={styles.selectLabel}>{label}</Text> : null}
      <Pressable
        style={[styles.field, styles.selectBox, error && styles.fieldError]}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.selectValue} numberOfLines={1}>
          {current ? current.label : 'Chọn...'}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setOpen(false)}>
          <View style={styles.modalCard}>
            {options.map((o) => (
              <Pressable
                key={o.value}
                style={[styles.optionRow, o.value === value && styles.optionActive]}
                onPress={() => {
                  onSelect(o.value);
                  setOpen(false);
                }}
              >
                {o.icon ? <Ionicons name={o.icon} size={20} color={colors.primary} /> : null}
                <View style={{ flex: 1 }}>
                  <Text style={styles.optionLabel}>{o.label}</Text>
                  {o.sub ? <Text style={styles.optionSub}>{o.sub}</Text> : null}
                </View>
                {o.right ? <Text style={styles.optionRight}>{o.right}</Text> : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
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
        <Ionicons name="leaf" size={28} color={colors.primary} />
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
  cardTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  sumItem: { flexDirection: 'row', gap: spacing.md },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbImg: { width: '100%', height: '100%' },
  sumInfo: { flex: 1, gap: spacing.sm },
  sumName: { fontSize: 15, fontWeight: '700', color: colors.text, textTransform: 'uppercase' },
  sumRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.xs,
  },
  stepBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 15, fontWeight: '700', color: colors.text, minWidth: 22, textAlign: 'center' },
  sumPrice: { fontSize: 15, fontWeight: '800', color: colors.primary },

  divider: { height: 1, backgroundColor: colors.border },
  feeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sumLabel: { fontSize: 15, color: colors.text },
  sumValue: { fontSize: 15, fontWeight: '600', color: colors.text },
  sumValueMuted: { color: colors.textMuted, fontWeight: '400' },
  feeSub: { fontSize: 12, color: colors.textMuted },
  totalLabel: { fontSize: 17, fontWeight: '800', color: colors.text },
  totalValue: { fontSize: 18, fontWeight: '800', color: colors.primary },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text },

  field: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  fieldMultiline: { minHeight: 80 },
  fieldError: { borderColor: '#E5484D' },
  fieldLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 2 },
  input: { fontSize: 16, color: colors.text, padding: 0 },
  inputMultiline: { minHeight: 48, textAlignVertical: 'top' },
  errorText: { color: '#E5484D', fontSize: 13, marginTop: 4, marginLeft: spacing.xs },

  selectLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4, marginLeft: spacing.xs },
  selectBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  selectValue: { flex: 1, fontSize: 16, color: colors.text },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: spacing.lg },
  modalCard: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionActive: { backgroundColor: colors.greenSoft },
  optionLabel: { fontSize: 16, fontWeight: '600', color: colors.text },
  optionSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  optionRight: { fontSize: 15, fontWeight: '700', color: colors.primary },

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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payDisabled: { backgroundColor: colors.textMuted },
  payText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
