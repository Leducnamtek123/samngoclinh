// Mua theo luống / vườn — chọn vườn để mua trọn luống hoặc cả vườn (GET /public/cultivation/gardens).
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
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { fetchGardens } from '../api/cultivation';
import CartButton from '../components/CartButton';

const BG = '#12333B';
const DIVIDER = 'rgba(255,255,255,0.08)';

export default function GardenPurchaseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [gardens, setGardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (mode) => {
    if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);
    try {
      const rows = await fetchGardens();
      setGardens(rows);
    } catch {
      setGardens([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const onSelect = (garden) =>
    navigation.navigate('GardenPurchaseScope', {
      gardenCode: garden.code,
      gardenName: garden.name,
    });

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

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load('refresh')}
            tintColor="#fff"
          />
        }
      >
        <Text style={styles.intro}>
          Mua toàn bộ cây còn bán được trong một luống hoặc cả vườn. Giá bằng tổng giá lẻ từng cây
          (theo ngày tuổi + phí chăm sóc & bảo vệ).
        </Text>

        <Text style={styles.sectionTitle}>Chọn vườn</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={styles.loader} />
        ) : gardens.length ? (
          gardens.map((g) => (
            <Pressable
              key={g.code}
              onPress={() => onSelect(g)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <Text style={styles.rowText}>{g.name}</Text>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.4)" />
            </Pressable>
          ))
        ) : (
          <Text style={styles.empty}>Chưa có vườn nào.</Text>
        )}
      </ScrollView>
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

  scroll: { paddingBottom: spacing.xl },
  intro: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: 'rgba(255,255,255,0.7)', marginTop: spacing.xl },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: DIVIDER,
  },
  rowPressed: { backgroundColor: 'rgba(255,255,255,0.06)' },
  rowText: { flex: 1, color: '#fff', fontSize: 17 },
});
