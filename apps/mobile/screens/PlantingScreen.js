// Trồng sâm — "Tất cả cây trồng": danh sách nhóm cây theo tuổi.
// Ảnh cây là placeholder (icon trên nền bán nguyệt xanh) — thay bằng <Image source> khi có asset.
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { plantingGroups } from '../data/mock';

export default function PlantingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [showSupport, setShowSupport] = useState(true);

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Tất cả cây trồng</Text>
        <View style={styles.headerActions}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        {plantingGroups.map((g) => (
          <GroupCard key={g.id} age={g.age} />
        ))}
      </ScrollView>

      {showSupport ? (
        <View style={[styles.supportWrap, { bottom: insets.bottom + spacing.lg }]}>
          <Pressable style={styles.supportClose} hitSlop={8} onPress={() => setShowSupport(false)}>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
          <Pressable style={styles.support}>
            <Ionicons name="headset-outline" size={26} color="#fff" />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function GroupCard({ age }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardLabel}>Nhóm cây trồng</Text>
        <Text style={styles.cardAge}>{age} Tuổi</Text>
        <Pressable style={({ pressed }) => [styles.cta, pressed && styles.pressed]}>
          <Text style={styles.ctaText}>Xem ngay</Text>
        </Pressable>
      </View>
      <View style={styles.cardArt}>
        <View style={styles.arc} />
        <Ionicons name="leaf" size={52} color={colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.header,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  scroll: { padding: spacing.lg, gap: spacing.lg },

  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    minHeight: 150,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardLeft: { flex: 1, padding: spacing.lg, justifyContent: 'center' },
  cardLabel: { fontSize: 15, fontStyle: 'italic', color: colors.textMuted },
  cardAge: { fontSize: 34, fontWeight: '800', color: colors.text, marginTop: 2, marginBottom: spacing.md },
  cta: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: 22,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  ctaText: { color: colors.primary, fontSize: 15, fontWeight: '700' },

  cardArt: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arc: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.greenSoft,
    right: -70,
  },

  supportWrap: { position: 'absolute', right: spacing.lg, alignItems: 'center' },
  supportClose: {
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
  support: {
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

  pressed: { opacity: 0.85 },
});
