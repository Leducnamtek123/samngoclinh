import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../utils/theme';

export default function HomeScreen() {
  const { user } = useAuth();
  const name = user?.name || user?.email || 'bạn';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Xin chào, {name}</Text>
        <Text style={styles.subtitle}>Chào mừng đến với Sâm Ngọc Linh</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Truy xuất nguồn gốc</Text>
          <Text style={styles.cardText}>Quét mã QR để xem hành trình sản phẩm.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Đơn hàng của tôi</Text>
          <Text style={styles.cardText}>Theo dõi tình trạng các đơn hàng gần đây.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg },
  greeting: { fontSize: 24, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.primary, marginBottom: spacing.xs },
  cardText: { fontSize: 14, color: colors.textMuted },
});
