// Cửa hàng — "Tất cả sản phẩm": tìm kiếm + lưới sản phẩm.
// Dữ liệu tĩnh & ảnh placeholder (icon) — thay bằng authFetch danh mục + <Image source> khi có endpoint/asset.
import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands } from '../utils/format';
import { products } from '../data/mock';

export default function ProductsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [showSupport, setShowSupport] = useState(true);

  const data = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name.toLowerCase().includes(q)) : products;
  }, [query]);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Tất cả sản phẩm</Text>
        <View style={styles.headerActions}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={styles.search}>
            <Ionicons name="search" size={20} color={colors.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              returnKeyType="search"
            />
          </View>
        }
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy sản phẩm phù hợp.</Text>}
        renderItem={({ item }) => <ProductCard item={item} />}
      />

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

function ProductCard({ item }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardArt}>
        <Ionicons name={item.icon} size={44} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.cardPrice}>{groupThousands(item.price)}đ</Text>
        <Text style={styles.cardSold}>Đã bán {item.sold}</Text>
        <View style={styles.actions}>
          <Pressable style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}>
            <Ionicons name="cart-outline" size={20} color={colors.textMuted} />
          </Pressable>
          <Pressable style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}>
            <Text style={styles.buyText}>Mua ngay</Text>
          </Pressable>
        </View>
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

  list: { padding: spacing.lg, gap: spacing.lg },
  row: { gap: spacing.lg },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    height: 52,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: { flex: 1, fontSize: 16, color: colors.text, padding: 0 },

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
    height: 140,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: { padding: spacing.md, gap: spacing.xs },
  cardName: { fontSize: 14, fontWeight: '700', color: colors.text, minHeight: 38 },
  cardPrice: { fontSize: 18, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },
  cardSold: { fontSize: 13, color: colors.textMuted },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buyText: { color: '#fff', fontSize: 14, fontWeight: '700' },

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
