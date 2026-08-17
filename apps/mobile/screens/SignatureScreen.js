// Chữ ký số cá nhân — vẽ tay & lưu (PUT /shared/user/signature); hiển thị chữ ký đã lưu.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import SignaturePad from '../components/SignaturePad';
import { getSignature, saveSignature } from '../api/auth';
import { toStaticUrl } from '../api/config';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function SignatureScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();
  const padRef = useRef(null);

  const [saved, setSaved] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getSignature();
      setSaved(res?.signatureUrl || null);
    } catch {
      setSaved(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onOK = async (base64) => {
    setSaving(true);
    try {
      const res = await saveSignature(base64);
      setSaved(res?.signatureUrl || null);
      padRef.current?.clear();
      alert.success('Thành công', 'Đã lưu chữ ký của bạn.');
    } catch (e) {
      alert.error('Lưu thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const onEmpty = () => alert.error('Chưa có chữ ký', 'Vui lòng vẽ chữ ký trước khi lưu.');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Chữ ký số</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {saved ? (
            <View style={styles.savedCard}>
              <Text style={styles.label}>Chữ ký hiện tại</Text>
              <Image source={{ uri: toStaticUrl(saved) }} style={styles.savedImg} resizeMode="contain" />
            </View>
          ) : null}

          <Text style={[styles.label, styles.labelSpacer]}>
            {saved ? 'Vẽ lại chữ ký mới' : 'Vẽ chữ ký của bạn'}
          </Text>
          <SignaturePad ref={padRef} onOK={onOK} onEmpty={onEmpty} />

          <Pressable
            disabled={saving}
            style={({ pressed }) => [styles.saveBtn, (pressed || saving) && styles.pressed]}
            onPress={() => padRef.current?.read()}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>Lưu chữ ký</Text>
            )}
          </Pressable>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { flex: 1, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '700' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: spacing.lg },

  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  labelSpacer: { marginTop: spacing.lg },

  savedCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  savedImg: { width: '100%', height: 120, backgroundColor: '#fff', borderRadius: 8 },

  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
