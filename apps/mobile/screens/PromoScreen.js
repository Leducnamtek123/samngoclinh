// Khuyến mãi — "Nhận cây sâm 1 năm": ưu đãi tặng cây (GET /public/promotion/free-tree).
// Nhận cây cần đăng nhập; campaign có thể yêu cầu xác thực danh tính & đặt cọc (item.eligible).
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
import { groupThousands } from '../utils/format';
import { fetchFreeTreeCampaign } from '../api/promotion';
import { useAuth } from '../context/AuthContext';
import { useRequireAuth } from '../hooks/useRequireAuth';
import CartButton from '../components/CartButton';

export default function PromoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const requireAuth = useRequireAuth();
  const [showSupport, setShowSupport] = useState(true);

  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (mode) => {
    if (mode === 'refresh') setRefreshing(true);
    else setLoading(true);
    try {
      const data = await fetchFreeTreeCampaign();
      setItems(data.items);
      setNote(data.note);
    } catch {
      setItems([]);
      setNote('');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load('initial');
  }, [load]);

  const onClaim = () =>
    requireAuth(() => navigation.navigate('ComingSoon', { title: 'Nhận cây sâm 1 năm' }));

  const slots = items[0]?.remainingSlots ?? 0;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Nhận cây sâm 1 năm</Text>
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
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Tặng cây sâm 1 năm</Text>
          <Text style={styles.bannerDesc}>
            Chọn cây sâm 1 năm phù hợp, hoàn tất gói chăm sóc và bảo vệ cây để nhận ưu đãi dành riêng
            cho tài khoản đủ điều kiện.
          </Text>
          {!isAuthenticated ? (
            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Bạn cần đăng nhập bằng tài khoản đã xác nhận ID để nhận ưu đãi.
              </Text>
            </View>
          ) : null}
          {items.length ? <Text style={styles.slots}>Còn {slots} suất nhận cây</Text> : null}
          {note ? <Text style={styles.bannerNote}>Lưu ý: {note}</Text> : null}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : items.length ? (
          <View style={styles.list}>
            {items.map((item) => (
              <PromoCard
                key={item.id}
                item={item}
                isAuthenticated={isAuthenticated}
                onClaim={onClaim}
              />
            ))}
          </View>
        ) : (
          <Text style={styles.empty}>Hiện chưa có ưu đãi nào đang mở.</Text>
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

function PromoCard({ item, isAuthenticated, onClaim }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardArt}>
        <Ionicons name="leaf" size={44} color={colors.primary} />
        <View style={styles.badge}>
          <Ionicons name="leaf-outline" size={12} color="#fff" />
          <Text style={styles.badgeText}>CÂY GIỐNG</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.plantName}
        </Text>
        <Text style={styles.cardNote}>Còn {item.remainingSlots} suất</Text>
        <Text style={styles.cardPrice}>{groupThousands(item.price)} đ</Text>
        {item.eligible ? null : (
          <View style={styles.hintRow}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={styles.hintText}>Cần xác thực danh tính & đặt cọc</Text>
          </View>
        )}
        <Pressable onPress={onClaim} style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>{isAuthenticated ? 'Nhận cây' : 'Đăng nhập để nhận'}</Text>
        </Pressable>
      </View>
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  scroll: { paddingBottom: spacing.xl },
  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  banner: {
    backgroundColor: '#3E8E52',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  bannerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  bannerDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 22 },
  notice: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: spacing.md,
  },
  noticeText: { color: '#fff', fontSize: 15, fontWeight: '600', lineHeight: 22 },
  slots: { color: '#fff', fontSize: 17, fontWeight: '800', marginTop: spacing.xs },
  bannerNote: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontStyle: 'italic' },

  list: { padding: spacing.lg, gap: spacing.lg },
  card: {
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
    height: 140,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  cardName: { fontSize: 16, fontWeight: '700', color: colors.text },
  cardNote: { fontSize: 13, color: colors.textMuted },
  cardPrice: { fontSize: 18, fontWeight: '800', color: colors.primary, marginVertical: spacing.xs },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  hintText: { fontSize: 13, color: colors.textMuted },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: 22,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  ctaText: { color: '#fff', fontSize: 14, fontWeight: '700' },

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
