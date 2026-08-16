// Mua theo luống / vườn (màn 2) — chọn phạm vi (cả vườn hoặc từng luống), xem giá + tách đơn >500tr.
// GET /public/cultivation/gardens/:code/purchase. Đặt mua thật để bước sau.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
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
import { fetchGardenPurchase } from '../api/cultivation';
import CartButton from '../components/CartButton';

const BG = '#12333B';
const CARD = '#0C2A33';
const BORDER = 'rgba(255,255,255,0.10)';
const GREEN = '#4ADE80';
const AMBER = '#E4A93C';

const money = (v) => `${groupThousands(Math.round(v || 0))} đ`;
const currentYear = new Date().getFullYear();

export default function GardenPurchaseScopeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { gardenCode, gardenName } = route.params ?? {};

  const [scopes, setScopes] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchGardenPurchase(gardenCode);
      const list = Array.isArray(data?.scopes) ? data.scopes : [];
      setScopes(list);
      setSelectedKey(list[0]?.key ?? null);
    } catch {
      setScopes([]);
      setSelectedKey(null);
    } finally {
      setLoading(false);
    }
  }, [gardenCode]);

  useEffect(() => {
    load();
  }, [load]);

  const selected = scopes.find((s) => s.key === selectedKey) ?? null;
  const scopeLabel = (s) => (s.key === 'all' ? 'Cả vườn' : s.bedName);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Mua theo luống / vườn</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      ) : !selected ? (
        <Text style={styles.empty}>Vườn này chưa có luống nào để mua.</Text>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.scroll, { paddingBottom: spacing.xl }]}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionTitle}>Phạm vi mua</Text>
            <Pressable style={styles.picker} onPress={() => setPickerOpen(true)}>
              <Text style={styles.pickerText}>{scopeLabel(selected)}</Text>
              <Ionicons name="chevron-down" size={20} color="rgba(255,255,255,0.6)" />
            </Pressable>

            <View style={styles.card}>
              <View style={styles.cardHead}>
                <Ionicons name="location" size={18} color={GREEN} />
                <Text style={styles.cardHeadText}>
                  {scopeLabel(selected)} — {selected.gardenName || gardenName}
                </Text>
              </View>

              <Row label="Số cây" value={String(selected.treeCount)} strong />

              {selected.lines.map((l) => (
                <View key={l.ageYear} style={styles.lineRow}>
                  <Text style={styles.lineText}>
                    {l.ageYear} tuổi (năm {currentYear - l.ageYear}) · {l.treeCount} cây
                  </Text>
                  <Text style={styles.linePrice}>~{money(l.pricePerTree)}/cây</Text>
                </View>
              ))}

              <View style={styles.divider} />
              <Row label="Tạm tính" value={money(selected.subtotal)} />
              <Row label="VAT" value={money(selected.vat)} />
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalValue}>{money(selected.total)}</Text>
              </View>
            </View>

            {selected.split.length > 1 ? (
              <View style={styles.splitBox}>
                <Text style={styles.splitTitle}>
                  Tổng vượt 500 triệu — sẽ chia thành {selected.split.length} đơn thanh toán, mỗi đơn
                  1 mã QR.
                </Text>
                {selected.split.map((o) => (
                  <View key={o.index} style={styles.splitRow}>
                    <Text style={styles.splitRowLabel}>
                      Đơn {o.index}/{selected.split.length} · {o.treeCount} cây
                    </Text>
                    <Text style={styles.splitRowValue}>{money(o.amount)}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={styles.noteRow}>
              <Ionicons name="time-outline" size={16} color="rgba(255,255,255,0.6)" />
              <Text style={styles.noteText}>Đơn chưa thanh toán tự hủy sau 15 phút để nhả cây.</Text>
            </View>
            <Text style={styles.noteMuted}>
              Giá chốt theo thời điểm đặt mua — nếu có cây vừa được người khác mua, số cây và tổng
              tiền thực tế có thể thay đổi nhẹ.
            </Text>

            <View style={styles.termsCard}>
              <Pressable style={styles.agreeRow} onPress={() => setAgreed((v) => !v)}>
                <View style={[styles.checkbox, agreed && styles.checkboxOn]}>
                  {agreed ? <Ionicons name="checkmark" size={16} color="#fff" /> : null}
                </View>
                <Text style={styles.agreeText}>
                  Tôi đã đọc và đồng ý với điều khoản sử dụng và hợp đồng mua bán, ký gửi, chăm sóc
                  cây Sâm Ngọc Linh.
                </Text>
              </Pressable>

              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Điều khoản sử dụng</Text>
                <Text style={styles.termBody}>
                  Khách hàng cần kiểm tra các thông tin: địa chỉ nhận hàng, phí dịch vụ, và chịu
                  trách nhiệm với thông tin đã cung cấp.{' '}
                  <Text style={styles.termLink} onPress={() => navigation.navigate('TermsOfUse')}>
                    Nhấn vào đây để mở điều khoản sử dụng
                  </Text>
                </Text>
              </View>

              <View style={styles.termItem}>
                <Text style={styles.termTitle}>Hợp đồng mua bán cây</Text>
                <Text style={styles.termBody}>
                  Hợp đồng mua bán, ký gửi và chăm sóc cây Sâm Ngọc Linh áp dụng cho đơn hàng cây
                  trồng và các dịch vụ đi kèm.{' '}
                  <Text style={styles.termLink} onPress={() => navigation.navigate('Contract')}>
                    Xem hợp đồng tạm tại đây
                  </Text>
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <Pressable
              disabled={!agreed}
              onPress={() => navigation.navigate('ComingSoon', { title: 'Đặt mua theo luống/vườn' })}
              style={[styles.buyBtn, !agreed && styles.buyBtnDisabled]}
            >
              <Text style={[styles.buyBtnText, !agreed && styles.buyBtnTextDisabled]}>
                Đặt mua — {money(selected.total)}
              </Text>
            </Pressable>
          </View>
        </>
      )}

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.modalBg} onPress={() => setPickerOpen(false)}>
          <View style={styles.modalCard}>
            {scopes.map((s) => (
              <Pressable
                key={s.key}
                style={[styles.optionRow, s.key === selectedKey && styles.optionActive]}
                onPress={() => {
                  setSelectedKey(s.key);
                  setPickerOpen(false);
                }}
              >
                <Text style={styles.optionText}>{scopeLabel(s)}</Text>
                {s.key === selectedKey ? (
                  <Ionicons name="checkmark" size={18} color={colors.primary} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

function Row({ label, value, strong }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.rowValueStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: BG },

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

  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginTop: spacing.xl },

  scroll: { padding: spacing.lg, gap: spacing.md },
  sectionTitle: { color: '#fff', fontSize: 17, fontWeight: '800' },

  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  pickerText: { color: '#fff', fontSize: 16 },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  cardHeadText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: '700' },

  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 15 },
  rowValue: { color: '#fff', fontSize: 15, fontWeight: '600' },
  rowValueStrong: { fontSize: 18, fontWeight: '800' },

  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  lineText: { flex: 1, color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  linePrice: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },

  divider: { height: 1, backgroundColor: BORDER, marginVertical: spacing.xs },
  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  totalLabel: { color: '#fff', fontSize: 16, fontWeight: '700' },
  totalValue: { color: GREEN, fontSize: 20, fontWeight: '800' },

  splitBox: {
    borderWidth: 1,
    borderColor: AMBER,
    borderRadius: 12,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: 'rgba(228,169,60,0.06)',
  },
  splitTitle: { color: AMBER, fontSize: 14, fontWeight: '700', lineHeight: 20 },
  splitRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  splitRowLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  splitRowValue: { color: '#fff', fontSize: 14, fontWeight: '700' },

  noteRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  noteText: { flex: 1, color: 'rgba(255,255,255,0.65)', fontSize: 13 },
  noteMuted: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 19 },

  termsCard: {
    backgroundColor: '#E9F1E6',
    borderRadius: 14,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  agreeRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxOn: { backgroundColor: colors.primary },
  agreeText: { flex: 1, color: colors.text, fontSize: 15, lineHeight: 22, fontWeight: '600' },

  termItem: { borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.08)', marginTop: spacing.md, paddingTop: spacing.md },
  termHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  termTitle: { color: colors.text, fontSize: 16, fontWeight: '700' },
  termBody: { color: colors.textMuted, fontSize: 14, lineHeight: 21, marginTop: spacing.sm },
  termLink: { color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    backgroundColor: BG,
  },
  buyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  buyBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.10)' },
  buyBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  buyBtnTextDisabled: { color: 'rgba(255,255,255,0.4)' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: spacing.xl },
  modalCard: { backgroundColor: '#0E2A31', borderRadius: 14, overflow: 'hidden' },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  optionActive: { backgroundColor: 'rgba(255,255,255,0.06)' },
  optionText: { color: '#fff', fontSize: 16 },
});
