// Carousel ảnh kéo được cả web (chuột) lẫn native (chạm), snap từng ảnh, chấm trang bấm được.
// Ảnh lỗi -> fallback icon lá. Dùng chung cho màn chi tiết sản phẩm & cây trồng.
import { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';

export default function ImageCarousel({ images = [], width, height = 300 }) {
  const count = images.length;
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState({});
  const translateX = useRef(new Animated.Value(0)).current;

  const indexRef = useRef(0);
  const widthRef = useRef(width);
  const countRef = useRef(count);
  widthRef.current = width;
  countRef.current = count;

  const goTo = useCallback(
    (i, animated = true) => {
      const c = countRef.current || 1;
      const clamped = Math.max(0, Math.min(c - 1, i));
      indexRef.current = clamped;
      setIndex(clamped);
      const toValue = -clamped * widthRef.current;
      if (animated) {
        Animated.spring(translateX, {
          toValue,
          useNativeDriver: true,
          bounciness: 0,
          speed: 14,
        }).start();
      } else {
        translateX.setValue(toValue);
      }
    },
    [translateX]
  );

  const pan = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderMove: (_, g) => {
        translateX.setValue(-indexRef.current * widthRef.current + g.dx);
      },
      onPanResponderRelease: (_, g) => {
        const w = widthRef.current;
        let next = indexRef.current;
        if (g.dx < -w * 0.25 || g.vx < -0.35) next = indexRef.current + 1;
        else if (g.dx > w * 0.25 || g.vx > 0.35) next = indexRef.current - 1;
        goTo(next);
      },
      onPanResponderTerminate: () => goTo(indexRef.current),
    })
  ).current;

  useEffect(() => {
    goTo(indexRef.current, false);
  }, [width, goTo]);

  const frame = { width, height };

  if (!count) {
    return (
      <View style={[styles.slide, styles.empty, frame]}>
        <Ionicons name="leaf" size={72} color={colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <View style={[styles.viewport, { width }]} {...pan.panHandlers}>
        <Animated.View style={[styles.row, { transform: [{ translateX }] }]}>
          {images.map((uri, i) =>
            failed[i] ? (
              <View key={`${uri}-${i}`} style={[styles.slide, styles.empty, frame]}>
                <Ionicons name="leaf" size={72} color={colors.primary} />
              </View>
            ) : (
              <Image
                key={`${uri}-${i}`}
                source={{ uri }}
                style={[styles.slide, frame]}
                resizeMode="cover"
                onError={() => setFailed((prev) => ({ ...prev, [i]: true }))}
              />
            )
          )}
        </Animated.View>
      </View>
      {count > 1 ? (
        <View style={styles.dots}>
          {images.map((uri, i) => (
            <Pressable key={`${uri}-${i}`} hitSlop={8} onPress={() => goTo(i)}>
              <View style={[styles.dot, i === index && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: { overflow: 'hidden' },
  row: { flexDirection: 'row' },
  slide: { backgroundColor: colors.greenSoft },
  empty: { alignItems: 'center', justifyContent: 'center' },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.primary, width: 20 },
});
