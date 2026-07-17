// Nút hỗ trợ nổi (headset) có thể đóng, neo góc phải dưới.
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';

export default function SupportButton({ onPress }) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={[styles.wrap, { bottom: insets.bottom + spacing.lg }]}>
      <Pressable style={styles.close} hitSlop={8} onPress={() => setVisible(false)}>
        <Ionicons name="close" size={16} color={colors.textMuted} />
      </Pressable>
      <Pressable style={styles.button} onPress={onPress}>
        <Ionicons name="headset-outline" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', right: spacing.lg, alignItems: 'center' },
  close: {
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
  button: {
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
});
