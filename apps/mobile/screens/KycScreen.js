// Giấy tờ tùy thân — hiển thị ảnh CCCD đã lưu (mặt trước/sau) và cho thêm/cập nhật. Không xác minh.
import { useCallback, useEffect, useState } from 'react';
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

import { getIdentityDocument } from '../api/auth';
import { API_ORIGIN } from '../api/config';
import { colors, spacing } from '../utils/theme';

// Ảnh backend trả về dạng URL tương đối (/uploads/...) -> ghép origin để hiển thị.
const toImageUri = (url) =>
  !url || url.startsWith('http') || url.startsWith('data:') ? url : `${API_ORIGIN}${url}`;

export default function KycScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getIdentityDocument();
      setDoc(data || null);
    } catch {
      setDoc(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = navigation.addListener('focus', load);
    return unsubscribe;
  }, [navigation, load]);

  const hasDoc = !!(doc?.frontImageUrl && doc?.backImageUrl);

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (hasDoc) {
      return (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Ảnh mặt trước</Text>
          <Image source={{ uri: toImageUri(doc.frontImageUrl) }} style={styles.preview} resizeMode="cover" />
          <Text style={[styles.label, styles.labelSpacer]}>Ảnh mặt sau</Text>
          <Image source={{ uri: toImageUri(doc.backImageUrl) }} style={styles.preview} resizeMode="cover" />
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
            onPress={() => navigation.navigate('AddKyc')}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.addText}>Cập nhật giấy tờ</Text>
          </Pressable>
        </ScrollView>
      );
    }

    return (
      <View style={styles.empty}>
        <View style={styles.emptyBody}>
          <Ionicons name="card-outline" size={64} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Chưa có giấy tờ tùy thân</Text>
          <Text style={styles.emptyDesc}>Thêm ảnh mặt trước và mặt sau căn cước của bạn</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && styles.pressed]}
          onPress={() => navigation.navigate('AddKyc')}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.addText}>Thêm giấy tờ</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Giấy tờ tùy thân</Text>
        <View style={styles.headerBtn} />
      </View>

      <View style={[styles.body, { paddingBottom: insets.bottom + spacing.lg }]}>
        {renderContent()}
      </View>
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

  body: { flex: 1, padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingBottom: spacing.lg },

  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  labelSpacer: { marginTop: spacing.lg },
  preview: { width: '100%', height: 200, borderRadius: 12, backgroundColor: colors.surface },

  empty: { flex: 1 },
  emptyBody: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  emptyDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },

  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.header,
    borderRadius: 12,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  addText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  pressed: { opacity: 0.85 },
});
