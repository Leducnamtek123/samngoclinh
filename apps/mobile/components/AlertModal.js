// Popup thông báo kiểu SweetAlert (icon tròn + tiêu đề + mô tả + 1 nút). Chạy cả web lẫn native.
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';

const TYPES = {
  success: { icon: 'checkmark', color: colors.primary },
  error: { icon: 'close', color: colors.danger },
  info: { icon: 'information', color: colors.header },
};

export default function AlertModal({
  visible,
  type = 'success',
  title,
  message,
  confirmText = 'OK',
  onConfirm,
}) {
  const t = TYPES[type] ?? TYPES.success;
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onConfirm}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: t.color }]}>
            <Ionicons name={t.icon} size={42} color="#fff" />
          </View>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [styles.btn, { backgroundColor: t.color }, pressed && styles.pressed]}
          >
            <Text style={styles.btnText}>{confirmText}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: { fontSize: 20, fontWeight: '800', color: colors.text, textAlign: 'center' },
  message: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  btn: {
    marginTop: spacing.lg,
    alignSelf: 'stretch',
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  pressed: { opacity: 0.85 },
});
