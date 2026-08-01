// Chi tiết cây trồng: ảnh, tuổi, giá, tồn kho, mô tả + đăng ký trồng (khách -> Login).
// Nhận { id, plant } từ danh sách để vẽ ngay, rồi fetch bản đầy đủ theo id.
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { fetchPlant } from '../api/catalog';
import { toStaticUrl } from '../api/config';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ImageCarousel from '../components/ImageCarousel';

export default function PlantDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const { width } = useWindowDimensions();

  const { id, plant: initial } = route.params || {};
  const [plant, setPlant] = useState(initial || null);
  const [loading, setLoading] = useState(!initial);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchPlant(id);
      if (data) setPlant((prev) => ({ ...prev, ...data }));
    } catch {
      // giữ dữ liệu đã truyền từ danh sách nếu fetch lỗi
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const onRegister = () =>
    requireAuth(() => navigation.navigate('ComingSoon', { title: 'Đăng ký trồng' }));

  const images = (plant?.images || []).map(toStaticUrl).filter(Boolean);
  const inStock = (plant?.stock ?? 0) > 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Chi tiết cây trồng
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading && !plant ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : plant ? (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <ImageCarousel images={images} width={width} />
            <View style={styles.body}>
              <Text style={styles.age}>{plant.ageYear} năm tuổi</Text>
              <Text style={styles.name}>{plant.name}</Text>
              <Text style={styles.price}>
                {groupThousands(plant.price)}đ
                <Text style={styles.unit}> / cây</Text>
              </Text>
              <View style={styles.stockRow}>
                <Ionicons
                  name={inStock ? 'checkmark-circle' : 'close-circle'}
                  size={18}
                  color={inStock ? colors.primary : colors.textMuted}
                />
                <Text style={styles.stock}>{inStock ? `Còn ${plant.stock} cây` : 'Hết cây'}</Text>
              </View>
              {plant.description ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Mô tả</Text>
                  <Text style={styles.desc}>{plant.description}</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <Pressable
              onPress={onRegister}
              disabled={!inStock}
              style={({ pressed }) => [
                styles.registerBtn,
                !inStock && styles.registerDisabled,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="leaf" size={20} color="#fff" />
              <Text style={styles.registerText}>{inStock ? 'Đăng ký trồng' : 'Hết cây'}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.empty}>Không tải được cây trồng.</Text>
      )}
    </View>
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
  headerSpacer: { width: 24 },

  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  body: { padding: spacing.lg, gap: spacing.sm },
  age: {
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: colors.greenSoft,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 999,
    overflow: 'hidden',
  },
  name: { fontSize: 22, fontWeight: '800', color: colors.text },
  price: { fontSize: 26, fontWeight: '800', color: colors.primary },
  unit: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  stock: { fontSize: 14, color: colors.textMuted },

  section: { marginTop: spacing.md, gap: spacing.sm },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  desc: { fontSize: 15, lineHeight: 22, color: colors.text },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  registerDisabled: { backgroundColor: colors.textMuted },
  registerText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
