// Hợp đồng của tôi — danh sách e-contract (GET /user/contracts). Chạm mở chi tiết để ký/xem.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { fetchContracts } from '../api/auth';
import { formatDateVN } from '../utils/format';
import { colors, spacing } from '../utils/theme';

export const CONTRACT_STATUS = {
  DRAFT: { label: 'Bản nháp', color: colors.textMuted, bg: '#F0F1F0' },
  PENDING_SIGNATURE: { label: 'Chờ ký', color: '#E4A93C', bg: '#FDF6E7' },
  SIGNED: { label: 'Đã ký', color: '#22C55E', bg: '#E9F7EF' },
  EXPIRED: { label: 'Hết hạn', color: colors.danger, bg: '#FDECEC' },
};

export const contractStatusMeta = (s) =>
  CONTRACT_STATUS[String(s || '').toUpperCase()] || CONTRACT_STATUS.DRAFT;

export default function ContractsListScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (mode) => {
    if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);
    try {
      setItems(await fetchContracts());
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
    return navigation.addListener('focus', () => load('refresh'));
  }, [navigation, load]);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Hợp đồng của tôi</Text>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => load('refresh')} />
          }
        >
          {items.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="document-text-outline" size={56} color={colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có hợp đồng nào.</Text>
            </View>
          ) : (
            items.map((c) => {
              const meta = contractStatusMeta(c.status);
              return (
                <Pressable
                  key={c.id}
                  style={({ pressed }) => [styles.card, pressed && styles.pressed]}
                  onPress={() => navigation.navigate('ContractDetail', { id: c.id })}
                >
                  <View style={styles.flex}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {c.title || c.contractNumber || c.code}
                    </Text>
                    <Text style={styles.cardMeta}>
                      {c.code} · {formatDateVN(c.createdAt)}
                    </Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: meta.bg }]}>
                    <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
                </Pressable>
              );
            })
          )}
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
  scroll: { padding: spacing.lg, gap: spacing.md },
  empty: { alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.xl * 2 },
  emptyText: { fontSize: 15, color: colors.textMuted },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.text },
  cardMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  badge: { borderRadius: 10, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
