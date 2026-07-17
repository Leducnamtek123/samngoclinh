import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../utils/theme';

// Dữ liệu mẫu tĩnh — thay bằng gọi API danh mục (authFetch) khi có endpoint.
const SAMPLE = [
  { id: '1', name: 'Sâm Ngọc Linh củ tươi', note: 'Loại 10 củ/kg' },
  { id: '2', name: 'Rượu Sâm Ngọc Linh', note: 'Ngâm 5 năm' },
  { id: '3', name: 'Mật ong Sâm Ngọc Linh', note: 'Hũ 500ml' },
];

export default function ProductsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.header}>Sản phẩm</Text>
      <FlatList
        data={SAMPLE}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.note}>{item.note}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: { fontSize: 24, fontWeight: '800', color: colors.text, padding: spacing.lg, paddingBottom: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  note: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs },
});
