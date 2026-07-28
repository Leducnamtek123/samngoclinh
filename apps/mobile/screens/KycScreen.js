// Giấy tờ tùy thân (KYC) — màn trạng thái xác minh danh tính.
// Lấy trạng thái từ getKycStatus() khi mount và mỗi lần màn được focus lại (refetch sau khi submit quay về).
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { getKycStatus } from '../api/auth';
import { colors, spacing } from '../utils/theme';

const TONES = {
  amber: { bg: '#FEF3C7', border: '#FCD34D', fg: '#B45309' },
  green: { bg: colors.greenSoft, border: colors.greenSoftBorder, fg: colors.primary },
};

export default function KycScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState(null);
  const [rejectionReason, setRejectionReason] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getKycStatus();
      setStatus(data?.status || 'unsubmitted');
      setRejectionReason(data?.rejectionReason || null);
    } catch {
      // Lỗi mạng -> coi như chưa nộp để người dùng vẫn có thể thêm giấy tờ.
      setStatus('unsubmitted');
      setRejectionReason(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (status === 'pending') {
      return (
        <StatusBox
          tone="amber"
          icon="time-outline"
          title="Hồ sơ đang chờ duyệt"
          desc="Hồ sơ của bạn đã được gửi, đang chờ xét duyệt."
        />
      );
    }

    if (status === 'verified') {
      return (
        <StatusBox
          tone="green"
          icon="checkmark-circle-outline"
          title="Đã xác minh"
          desc="Tài khoản của bạn đã được xác minh danh tính."
        />
      );
    }

    return (
      <View style={styles.empty}>
        {status === 'rejected' && rejectionReason ? (
          <View style={styles.rejectBox}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
            <Text style={styles.rejectText}>{rejectionReason}</Text>
          </View>
        ) : null}
        <View style={styles.emptyBody}>
          <Ionicons name="card-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Chưa có giấy tờ tùy thân</Text>
          <Text style={styles.emptyDesc}>Thêm giấy tờ tùy thân để xác minh tài khoản</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AddKyc')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}>Thêm giấy tờ</Text>
        </Pressable>
      </View>
    );
  };

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

      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.lg }]}>{renderContent()}</View>
    </View>
  );
}

function StatusBox({ tone, icon, title, desc }) {
  const t = TONES[tone];
  return (
    <View style={styles.statusWrap}>
      <View style={[styles.statusBox, { backgroundColor: t.bg, borderColor: t.border }]}>
        <Ionicons name={icon} size={44} color={t.fg} />
        <Text style={[styles.statusTitle, { color: t.fg }]}>{title}</Text>
        <Text style={styles.statusDesc}>{desc}</Text>
      </View>
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

  body: { flex: 1, padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  empty: { flex: 1 },
  emptyBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  emptyDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },

  rejectBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: spacing.md,
  },
  rejectText: { flex: 1, fontSize: 14, color: colors.danger, lineHeight: 20 },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.header,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  statusWrap: { flex: 1, justifyContent: 'center' },
  statusBox: {
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
  },
  statusTitle: { fontSize: 18, fontWeight: '800' },
  statusDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },

  pressed: { opacity: 0.85 },
});
