// Danh sách luống trồng theo tuổi (GET /public/cultivation/beds?ageYear=N).
// Mỗi thẻ = 1 luống; chạm mở chi tiết cây/luống.
import { useCallback, useEffect, useState } from 'react';
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
import { fetchBedsByAge } from '../api/cultivation';
import { toStaticUrl } from '../api/config';
import CartButton from '../components/CartButton';

export default function TreeListScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { ageYear, title } = route.params || {};

  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(
    async (mode) => {
      if (mode === 'refresh') setRefreshing(true);
      else setLoading(true);
      try {
        const rows = await fetchBedsByAge(ageYear);
        setBeds(rows);
      } catch {
        setBeds([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [ageYear]
  );

  useEffect(() => {
    load('initial');
  }, [load]);

  const onOpen = (bed) => navigation.navigate('PlantDetail', { code: bed.code, bed });

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title || `Cây trồng ${ageYear} tuổi`}
        </Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <FlatList
        data={beds}
        keyExtractor={(item) => item.code}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => load('refresh')}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <Text style={styles.empty}>Chưa có luống trồng nào cho độ tuổi này.</Text>
          )
        }
        renderItem={({ item }) => <BedCard bed={item} onOpen={onOpen} />}
      />
    </View>
  );
}

function BedCard({ bed, onOpen }) {
  const [imgError, setImgError] = useState(false);
  const image = imgError ? null : toStaticUrl(bed.images?.[0]);
  return (
    <Pressable
      onPress={() => onOpen(bed)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardArt}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.cardImg}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <Ionicons name="leaf" size={44} color={colors.primary} />
        )}
        <View style={styles.badge}>
          <Ionicons name="leaf-outline" size={12} color="#fff" />
          <Text style={styles.badgeText}>CÂY GIỐNG</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <Text style={styles.cardName} numberOfLines={2}>
            Cây Sâm Ngọc Linh
          </Text>
          <View style={styles.pricePill}>
            <Text style={styles.priceText}>{groupThousands(bed.price)}đ</Text>
          </View>
        </View>
        <Text style={styles.cardSub} numberOfLines={1}>
          {bed.name}
          {bed.gardenName ? ` · ${bed.gardenName}` : ''}
        </Text>
        <View style={styles.ageRow}>
          <Ionicons name="calendar-outline" size={14} color="#E08A1E" />
          <Text style={styles.ageText}>{bed.ageYear} tuổi</Text>
        </View>
      </View>
    </Pressable>
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
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  list: { padding: spacing.lg, gap: spacing.lg },
  row: { gap: spacing.lg },
  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardArt: {
    height: 130,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: { width: '100%', height: '100%' },
  badge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  cardBody: { padding: spacing.md, gap: spacing.xs },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  cardName: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  pricePill: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  priceText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  cardSub: { fontSize: 12, color: colors.textMuted },
  ageRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  ageText: { fontSize: 13, color: '#E08A1E', fontWeight: '600' },

  pressed: { opacity: 0.85 },
});
