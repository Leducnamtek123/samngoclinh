// Trồng sâm — "Tất cả cây trồng": danh sách sâm giống theo tuổi (GET /public/catalog/plants).
// Chạm thẻ mở màn chi tiết cây trồng.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
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
import { groupThousands } from '../utils/format';
import { fetchPlants } from '../api/catalog';
import { toStaticUrl } from '../api/config';
import CartButton from '../components/CartButton';

export default function PlantingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [showSupport, setShowSupport] = useState(true);

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (mode) => {
    if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);
    try {
      const rows = await fetchPlants({ perPage: 50 });
      setPlants(rows);
    } catch {
      setPlants([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const onOpen = (plant) =>
    navigation.navigate('TreeList', {
      ageYear: plant.ageYear,
      title: `Cây trồng ${plant.ageYear} tuổi`,
    });

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Tất cả cây trồng</Text>
        <View style={styles.headerActions}>
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => load('refresh')} />
        }
      >
        <Pressable
          onPress={() => navigation.navigate('GardenPurchase')}
          style={({ pressed }) => [styles.buyByGarden, pressed && styles.pressed]}
        >
          <View style={styles.buyIcon}>
            <Ionicons name="albums-outline" size={22} color="#fff" />
          </View>
          <View style={styles.buyText}>
            <Text style={styles.buyTitle}>Mua theo luống / vườn</Text>
            <Text style={styles.buyDesc}>Mua trọn luống hoặc cả vườn sâm</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </Pressable>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : plants.length ? (
          plants.map((p) => <PlantCard key={p.id} plant={p} onOpen={onOpen} />)
        ) : (
          <Text style={styles.empty}>Chưa có cây trồng nào.</Text>
        )}
      </ScrollView>

      {showSupport ? (
        <View style={[styles.supportWrap, { bottom: insets.bottom + spacing.lg }]}>
          <Pressable style={styles.supportClose} hitSlop={8} onPress={() => setShowSupport(false)}>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.support}>
            <Ionicons name="headset-outline" size={26} color="#fff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function PlantCard({ plant, onOpen }) {
  const [imgError, setImgError] = useState(false);
  const image = imgError ? null : toStaticUrl(plant.images?.[0]);
  const inStock = (plant.stock ?? 0) > 0;
  return (
    <Pressable
      onPress={() => onOpen(plant)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.cardLeft}>
        <Text style={styles.cardLabel}>Cây Sâm Ngọc Linh</Text>
        <Text style={styles.cardAge}>{plant.ageYear} Tuổi</Text>
        <Text style={styles.cardPrice}>{groupThousands(plant.price)}đ</Text>
        <Text style={styles.cardStock}>{inStock ? `Còn ${plant.stock} cây` : 'Hết cây'}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>Xem ngay</Text>
        </View>
      </View>
      <View style={styles.cardArt}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.cardImg}
            resizeMode="cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <>
            <View style={styles.arc} />
            <Ionicons name="leaf" size={52} color={colors.primary} />
          </>
        )}
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

  scroll: { padding: spacing.lg, gap: spacing.lg },
  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  buyByGarden: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  buyIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: { flex: 1 },
  buyTitle: { fontSize: 16, fontWeight: '800', color: colors.text },
  buyDesc: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  cardLabel: { fontSize: 15, fontStyle: 'italic', color: colors.textMuted },
  cardAge: { fontSize: 32, fontWeight: '800', color: colors.text, marginTop: 2 },
  cardPrice: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },
  cardStock: { fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  ctaText: { color: colors.primary, fontSize: 15, fontWeight: '700' },

  cardArt: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImg: { width: '100%', height: '100%' },
  arc: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.greenSoft,
    right: -70,
  },

  supportWrap: { position: 'absolute', right: spacing.lg, alignItems: 'center' },
  supportClose: {
    position: 'absolute',
    top: -10,
    right: -6,
    zIndex: 1,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  support: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },

  pressed: { opacity: 0.85 },
});
