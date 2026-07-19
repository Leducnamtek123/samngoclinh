// Placeholder cho các mục chưa có màn hình (vd Khuyến mãi).
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';

export default function ComingSoonScreen({ route }) {
  const title = route?.params?.title || 'Sắp ra mắt';
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.center}>
        <Ionicons name="construct-outline" size={48} color={colors.textMuted} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>Tính năng đang được phát triển.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  desc: { fontSize: 14, color: colors.textMuted },
});
