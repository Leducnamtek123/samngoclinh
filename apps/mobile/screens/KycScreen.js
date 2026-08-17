// Giấy tờ tùy thân (eKYC) — hiển thị trạng thái duyệt (PENDING/APPROVED/REJECTED),
// lý do từ chối, ảnh CCCD, cho nộp lại và xem lịch sử các lần gửi.
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
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { fetchIdentityHistory, getIdentityDocument } from '../api/auth';
import { toStaticUrl } from '../api/config';
import { formatDateVN } from '../utils/format';
import { colors, spacing } from '../utils/theme';

const STATUS = {
  APPROVED: { label: 'Đã xác minh', icon: 'checkmark-circle', color: '#22C55E', bg: '#E9F7EF' },
  PENDING: { label: 'Đang chờ duyệt', icon: 'time', color: '#E4A93C', bg: '#FDF6E7' },
  REJECTED: { label: 'Bị từ chối', icon: 'close-circle', color: colors.danger, bg: '#FDECEC' },
  UNVERIFIED: { label: 'Chưa xác minh', icon: 'alert-circle', color: colors.textMuted, bg: '#F0F1F0' },
};

const normalizeStatus = (s) => {
  const v = String(s || '').toUpperCase();
  if (v === 'VERIFIED' || v === 'APPROVED') return 'APPROVED';
  if (v === 'PENDING') return 'PENDING';
  if (v === 'REJECTED') return 'REJECTED';
  return 'UNVERIFIED';
};

export default function KycScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [doc, setDoc] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [data, hist] = await Promise.all([
        getIdentityDocument().catch(() => null),
        fetchIdentityHistory().catch(() => []),
      ]);
      setDoc(data || null);
      setHistory(hist || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return navigation.addListener('focus', load);
  }, [navigation, load]);

  const status = normalizeStatus(doc?.status);
  const meta = STATUS[status];
  const hasImages = !!(doc?.frontImageUrl && doc?.backImageUrl);
  const canResubmit = status === 'REJECTED' || status === 'UNVERIFIED' || status === 'PENDING';
  const resubmitLabel =
    status === 'REJECTED'
      ? 'Nộp lại giấy tờ'
      : status === 'PENDING'
        ? 'Gửi lại ảnh khác'
        : hasImages
          ? 'Cập nhật giấy tờ'
          : 'Thêm giấy tờ';

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Giấy tờ tùy thân</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.statusCard, { backgroundColor: meta.bg }]}>
            <Ionicons name={meta.icon} size={24} color={meta.color} />
            <View style={styles.flex}>
              <Text style={[styles.statusLabel, { color: meta.color }]}>{meta.label}</Text>
              {status === 'REJECTED' && doc?.rejectionReason ? (
                <Text style={styles.statusReason}>Lý do: {doc.rejectionReason}</Text>
              ) : null}
              {status === 'PENDING' ? (
                <Text style={styles.statusSub}>Hồ sơ đang được xét duyệt, vui lòng chờ.</Text>
              ) : null}
              {doc?.reviewedAt ? (
                <Text style={styles.statusSub}>Duyệt lúc: {formatDateVN(doc.reviewedAt)}</Text>
              ) : null}
            </View>
          </View>

          {hasImages ? (
            <>
              <Text style={styles.label}>Ảnh mặt trước</Text>
              <Image
                source={{ uri: toStaticUrl(doc.frontImageUrl) }}
                style={styles.preview}
                resizeMode="cover"
              />
              <Text style={[styles.label, styles.labelSpacer]}>Ảnh mặt sau</Text>
              <Image
                source={{ uri: toStaticUrl(doc.backImageUrl) }}
                style={styles.preview}
                resizeMode="cover"
              />
            </>
          ) : (
            <View style={styles.emptyBody}>
              <Ionicons name="card-outline" size={56} color={colors.textMuted} />
              <Text style={styles.emptyDesc}>Thêm ảnh mặt trước và mặt sau căn cước của bạn</Text>
            </View>
          )}

          {canResubmit ? (
            <Pressable
              style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
              onPress={() => navigation.navigate('AddKyc')}
            >
              <Ionicons name={hasImages ? 'create-outline' : 'add'} size={20} color="#fff" />
              <Text style={styles.addText}>{resubmitLabel}</Text>
            </Pressable>
          ) : null}

          {history.length > 0 ? (
            <View style={styles.historyBlock}>
              <Text style={styles.historyTitle}>Lịch sử gửi xác minh</Text>
              {history.map((h, i) => {
                const hm = STATUS[normalizeStatus(h.status)];
                return (
                  <View key={h.id || i} style={styles.historyRow}>
                    <View style={[styles.dot, { backgroundColor: hm.color }]} />
                    <View style={styles.flex}>
                      <View style={styles.historyHead}>
                        <Text style={[styles.historyStatus, { color: hm.color }]}>{hm.label}</Text>
                        <Text style={styles.historyDate}>{formatDateVN(h.createdAt)}</Text>
                      </View>
                      {h.rejectionReason ? (
                        <Text style={styles.historyReason}>{h.rejectionReason}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

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
  scroll: { padding: spacing.lg },

  statusCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    borderRadius: 14,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  statusLabel: { fontSize: 16, fontWeight: '800' },
  statusReason: { fontSize: 14, color: colors.text, marginTop: 4, lineHeight: 20 },
  statusSub: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  labelSpacer: { marginTop: spacing.lg },
  preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: colors.surface },

  emptyBody: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  emptyDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.header,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  historyBlock: { marginTop: spacing.xl },
  historyTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  historyRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  dot: { width: 10, height: 10, borderRadius: 5, marginTop: 5 },
  historyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyStatus: { fontSize: 14, fontWeight: '700' },
  historyDate: { fontSize: 12, color: colors.textMuted },
  historyReason: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 19 },

  pressed: { opacity: 0.85 },
});
