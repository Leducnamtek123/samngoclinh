// Trang chủ iWE FARM: header, banner, lối tắt, giới thiệu, số liệu, tin tức, liên hệ.
// Ảnh (banner/cây sâm/thumbnail tin) hiện là placeholder — thay bằng <Image source> khi có asset.
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { colors, spacing } from '../utils/theme';
import { contactInfo, farmStats, newsArticles, quickActions } from '../data/mock';

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const onAction = {
    buy: () => navigation.navigate('Planting'),
    store: () => navigation.navigate('Products'),
    promo: () => navigation.navigate('Promo'),
  };

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.brand}>
          <View style={styles.brandLogo}>
            <Ionicons name="leaf" size={16} color={colors.primary} />
          </View>
          <Text style={styles.brandText}>iWE FARM</Text>
        </View>
        <View style={styles.headerActions}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Banner />

        <View style={styles.actionsRow}>
          {quickActions.map((a) => (
            <QuickAction key={a.key} icon={a.icon} label={a.label} onPress={onAction[a.key]} />
          ))}
        </View>

        <Intro user={user} />

        <View style={styles.statsGrid}>
          {farmStats.map((s) => (
            <StatCard key={s.key} {...s} />
          ))}
        </View>

        <SectionHeader title="Thông tin" action="Xem tất cả" />
        {newsArticles.map((n) => (
          <NewsCard key={n.id} title={n.title} excerpt={n.excerpt} />
        ))}

        <ContactBlock />
      </ScrollView>

      <Pressable style={[styles.support, { bottom: insets.bottom + spacing.lg }]}>
        <Ionicons name="headset-outline" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

function Banner() {
  return (
    <View style={styles.bannerWrap}>
      <View style={styles.banner}>
        <View style={styles.bannerBadge}>
          <Ionicons name="leaf" size={12} color={colors.primary} />
          <Text style={styles.bannerBadgeText}>iWE FARM</Text>
        </View>
        <Text style={styles.bannerTitle}>iWE FARM</Text>
        <Text style={styles.bannerDesc}>
          Khám phá các dịch vụ chúng tôi và bắt đầu phát triển trại của bạn.
        </Text>
      </View>
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

function QuickAction({ icon, label, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.action, pressed && styles.pressed]}
    >
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={24} color={colors.primary} />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </Pressable>
  );
}

function Intro({ user }) {
  const name = user?.name || user?.email;
  return (
    <View style={styles.intro}>
      <View style={styles.plant}>
        <Ionicons name="leaf" size={44} color={colors.primary} />
      </View>
      <Text style={styles.introTitle}>iWE FARM</Text>
      {name ? <Text style={styles.introHello}>Xin chào, {name}</Text> : null}
      <Text style={styles.introDesc}>
        Ứng dụng iWE FARM ra đời với mục tiêu đưa người tiêu dùng chạm đến cây sâm thật – chuẩn gen
        – trồng đúng vùng ngay trên điện thoại.
      </Text>
    </View>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={22} color="#fff" />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({ title, action }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable hitSlop={8}>
          <Text style={styles.sectionAction}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function NewsCard({ title, excerpt }) {
  return (
    <Pressable style={({ pressed }) => [styles.news, pressed && styles.pressed]}>
      <View style={styles.newsThumb}>
        <Ionicons name="image-outline" size={26} color={colors.textMuted} />
      </View>
      <View style={styles.newsBody}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.newsExcerpt} numberOfLines={2}>
          {excerpt}
        </Text>
      </View>
    </Pressable>
  );
}

function ContactBlock() {
  return (
    <View style={styles.contact}>
      <Text style={styles.contactHeading}>Thông tin liên hệ</Text>
      <ContactRow icon="location-outline" label="Địa chỉ" value={contactInfo.address} />
      <ContactRow
        icon="call-outline"
        label="Điện thoại"
        value={contactInfo.phone}
        onPress={() => Linking.openURL(`tel:${contactInfo.phone.replace(/\s/g, '')}`)}
      />
      <ContactRow
        icon="mail-outline"
        label="Email"
        value={contactInfo.email}
        onPress={() => Linking.openURL(`mailto:${contactInfo.email}`)}
      />
    </View>
  );
}

function ContactRow({ icon, label, value, onPress }) {
  return (
    <Pressable style={styles.contactRow} onPress={onPress} disabled={!onPress}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.contactText}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </Pressable>
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
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandLogo: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: { color: '#fff', fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  scroll: { paddingBottom: spacing.xl },

  bannerWrap: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  banner: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    minHeight: 130,
    justifyContent: 'center',
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: spacing.sm,
  },
  bannerBadgeText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  bannerTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: spacing.xs },
  bannerDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 13, lineHeight: 18 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { width: 18, backgroundColor: colors.primary },

  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  action: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: { fontSize: 12, color: colors.text, fontWeight: '600' },

  intro: { alignItems: 'center', paddingHorizontal: spacing.xl, marginTop: spacing.xl },
  plant: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  introTitle: { fontSize: 26, fontWeight: '800', color: colors.primary },
  introHello: { fontSize: 14, color: colors.text, marginTop: spacing.xs, fontWeight: '600' },
  introDesc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.sm,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  stat: {
    width: '47%',
    flexGrow: 1,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.greenSoftBorder,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 17 },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: colors.text },
  sectionAction: { fontSize: 14, color: colors.primary, fontWeight: '600' },

  news: {
    flexDirection: 'row',
    gap: spacing.md,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  newsThumb: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsBody: { flex: 1, justifyContent: 'center' },
  newsTitle: { fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 },
  newsExcerpt: { fontSize: 13, color: colors.textMuted, marginTop: 4, lineHeight: 18 },

  contact: {
    backgroundColor: colors.greenSoft,
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },
  contactHeading: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.xs },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactText: { flex: 1 },
  contactLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  contactValue: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  support: {
    position: 'absolute',
    right: spacing.lg,
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
