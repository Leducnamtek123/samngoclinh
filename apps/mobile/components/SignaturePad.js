// Bảng vẽ chữ ký (WebView-based) — xuất base64 PNG data URL cho backend.
// Dùng cho màn Chữ ký số (profile) và ký hợp đồng. read() -> onOK(base64); clear() xoá nét.
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import SignatureCanvas from 'react-native-signature-canvas';

import { colors, spacing } from '../utils/theme';

const WEB_STYLE = `
  .m-signature-pad { box-shadow: none; border: none; margin: 0; }
  .m-signature-pad--body { border: none; }
  .m-signature-pad--footer { display: none; }
  body, html { height: 100%; margin: 0; }
`;

const SignaturePad = forwardRef(function SignaturePad({ onOK, onEmpty }, ref) {
  const inner = useRef(null);

  useImperativeHandle(ref, () => ({
    read: () => inner.current?.readSignature(),
    clear: () => inner.current?.clearSignature(),
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.canvas}>
        <SignatureCanvas
          ref={inner}
          onOK={onOK}
          onEmpty={onEmpty}
          autoClear={false}
          descriptionText=""
          backgroundColor="#ffffff"
          penColor="#111111"
          webStyle={WEB_STYLE}
        />
      </View>
      <Pressable style={styles.clearBtn} hitSlop={8} onPress={() => inner.current?.clearSignature()}>
        <Text style={styles.clearText}>Xóa & vẽ lại</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  canvas: {
    height: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  clearBtn: { alignSelf: 'flex-end', paddingVertical: spacing.xs },
  clearText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});

export default SignaturePad;
