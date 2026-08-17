// Chi tiết hợp đồng — xem thông tin, ký (vẽ chữ ký mới) nếu chưa ký, và mở PDF bản đóng dấu.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SignaturePad from '../components/SignaturePad';
import { fetchContract, signContract } from '../api/auth';
import { API_BASE_NEUTRAL, toStaticUrl } from '../api/config';
import { formatDateVN, groupThousands } from '../utils/format';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';
import { contractStatusMeta } from './ContractsListScreen';

export default function ContractDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const padRef = useRef(null);
  const { id } = route.params ?? {};

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setContract(await fetchContract(id));
    } catch {
      setContract(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const status = String(contract?.status || '').toUpperCase();
  const isSigned = status === 'SIGNED' || !!contract?.signedAt || !!contract?.userSignatureUrl;
  const value = contract?.contractValue ?? contract?.value ?? contract?.totalAmount ?? null;

  const onOK = async (base64) => {
    setSigning(true);
    try {
      await signContract(id, base64);
      alert.success('Thành công', 'Đã ký hợp đồng.');
      await load();
    } catch (e) {
      alert.error('Ký thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setSigning(false);
    }
  };

  const openPdf = () => {
    if (contract?.code) {
      Linking.openURL(`${API_BASE_NEUTRAL}/public/contracts/${contract.code}/pdf`);
    }
  };

  const meta = contractStatusMeta(status);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Chi tiết hợp đồng</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : !contract ? (
        <View style={styles.center}>
          <Text style={styles.muted}>Không tải được hợp đồng.</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>{contract.title || contract.contractNumber || contract.code}</Text>
            <View style={[styles.badge, { backgroundColor: meta.bg }]}>
              <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
            </View>

            <Row label="Mã hợp đồng" value={contract.code} />
            {value != null ? <Row label="Giá trị" value={`${groupThousands(value)} đ`} /> : null}
            <Row label="Ngày tạo" value={formatDateVN(contract.createdAt)} />
            {contract.expiredAt ? <Row label="Hết hạn" value={formatDateVN(contract.expiredAt)} /> : null}
            {contract.signedAt ? <Row label="Đã ký lúc" value={formatDateVN(contract.signedAt)} /> : null}
            {contract.userIdentityNumber ? (
              <Row label="Số CCCD" value={contract.userIdentityNumber} />
            ) : null}
          </View>

          <Pressable style={({ pressed }) => [styles.pdfBtn, pressed && styles.pressed]} onPress={openPdf}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.pdfText}>Xem / tải PDF hợp đồng</Text>
          </Pressable>

          {isSigned ? (
            <View style={styles.card}>
              <Text style={styles.label}>Chữ ký của bạn</Text>
              {contract.userSignatureUrl ? (
                <Image
                  source={{ uri: toStaticUrl(contract.userSignatureUrl) }}
                  style={styles.sigImg}
                  resizeMode="contain"
                />
              ) : (
                <Text style={styles.muted}>Hợp đồng đã được ký.</Text>
              )}
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.label}>Ký hợp đồng</Text>
              <Text style={styles.muted}>Vẽ chữ ký của bạn để hoàn tất.</Text>
              <View style={{ marginTop: spacing.md }}>
                <SignaturePad
                  ref={padRef}
                  onOK={onOK}
                  onEmpty={() => alert.error('Chưa có chữ ký', 'Vui lòng vẽ chữ ký.')}
                />
              </View>
              <Pressable
                disabled={signing}
                style={({ pressed }) => [styles.signBtn, (pressed || signing) && styles.pressed]}
                onPress={() => padRef.current?.read()}
              >
                {signing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.signText}>Ký hợp đồng</Text>
                )}
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  muted: { fontSize: 14, color: colors.textMuted },
  scroll: { padding: spacing.lg, gap: spacing.md },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 18, fontWeight: '800', color: colors.text },
  badge: { alignSelf: 'flex-start', borderRadius: 10, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm, marginBottom: spacing.md },
  badgeText: { fontSize: 12, fontWeight: '700' },

  row: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.xs },
  rowLabel: { fontSize: 14, color: colors.textMuted },
  rowValue: { flex: 1, textAlign: 'right', fontSize: 14, color: colors.text, fontWeight: '600' },

  label: { fontSize: 14, fontWeight: '700', color: colors.text },

  pdfBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  pdfText: { color: colors.primary, fontSize: 15, fontWeight: '700' },

  sigImg: { width: '100%', height: 120, backgroundColor: '#fff', borderRadius: 8, marginTop: spacing.sm },

  signBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  signText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
