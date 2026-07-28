// Thêm giấy tờ tùy thân — chọn ảnh mặt trước/sau (base64 data URL) rồi gửi xác thực.
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import PrimaryButton from '../components/PrimaryButton';
import { submitKyc } from '../api/auth';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

export default function AddKycScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const alert = useAlert();

  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ảnh base64 lớn nên nén quality 0.5; tạo data URL để backend lưu chuỗi (không upload S3).
  const pickImage = async (setter) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      base64: true,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (asset?.base64) setter(`data:image/jpeg;base64,${asset.base64}`);
  };

  const onSubmit = async () => {
    if (!frontImage || !backImage) {
      return alert.error('Thiếu ảnh', 'Vui lòng chọn đủ ảnh mặt trước và mặt sau.');
    }
    setLoading(true);
    try {
      await submitKyc({
        frontImageUrl: frontImage,
        backImageUrl: backImage,
      });
      alert.success('Thành công', 'Đã gửi hồ sơ xác minh. Vui lòng chờ duyệt.', {
        confirmText: 'Xong',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e) {
      alert.error('Gửi thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Thêm giấy tờ tùy thân</Text>
        <View style={styles.headerBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.label}>Ảnh mặt trước</Text>
            <ImagePickerBox
              image={frontImage}
              placeholder="Chọn ảnh mặt trước"
              onPress={() => pickImage(setFrontImage)}
            />

            <Text style={[styles.label, styles.labelSpacer]}>Ảnh mặt sau</Text>
            <ImagePickerBox
              image={backImage}
              placeholder="Chọn ảnh mặt sau"
              onPress={() => pickImage(setBackImage)}
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Chọn đủ ảnh mặt trước và mặt sau để kiểm tra thông tin trước khi tải lên.
            </Text>
          </View>

          <PrimaryButton title="Gửi xác thực" onPress={onSubmit} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ImagePickerBox({ image, placeholder, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.imageBox, pressed && styles.pressed]}>
      {image ? (
        <Image source={{ uri: image }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
          <Text style={styles.imageHint}>{placeholder}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

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

  scroll: { padding: spacing.lg },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  labelSpacer: { marginTop: spacing.lg },

  imageBox: {
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 12,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  imageHint: { fontSize: 14, color: colors.textMuted },
  preview: { width: '100%', height: 200 },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  infoText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 20 },

  pressed: { opacity: 0.85 },
});
