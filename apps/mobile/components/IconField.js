// Ô nhập kiểu gạch chân + icon trái (dùng cho Login/Register).
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';

export default function IconField({ icon, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={22} color={colors.textMuted} />
      <TextInput style={styles.input} placeholderTextColor={colors.textMuted} {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  input: { flex: 1, fontSize: 16, color: colors.text, padding: 0 },
});
