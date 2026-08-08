// Trang chủ iWE FARM: header, banner, lối tắt, giới thiệu, số liệu, tin tức, liên hệ.
// Banner/tin tức/số liệu/liên hệ lấy từ API (public), ẩn khi không có dữ liệu; quickActions tĩnh.
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Linking,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { fetchBanners } from '../api/banner';
import { fetchArticles } from '../api/content';
import { fetchSetting } from '../api/setting';
import { toStaticUrl } from '../api/config';
import { colors, spacing } from '../utils/theme';
import { quickActions } from '../data/mock';
import CartButton from '../components/CartButton';

// Banner tĩnh dùng khi API lỗi/không kết nối được (giữ trang chủ không trống).
const FALLBACK_BANNERS = [
  {
    id: 'fallback',
    title: 'iWE FARM',
    subtitle: 'Khám phá các dịch vụ chúng tôi và bắt đầu phát triển trại của bạn.',
  },
];

const mapArticle = (a) => ({
  id: a.id,
  title: a.title,
  excerpt: a.summary,
  image: a.coverImage,
});

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [banners, setBanners] = useState(FALLBACK_BANNERS);
  const [articles, setArticles] = useState([]);
  const [stats, setStats] = useState([]);
  const [contact, setContact] = useState(null);
  const [about, setAbout] = useState(null);

  useEffect(() => {
    let active = true;

    fetchBanners('home')
      .then((data) => active && data.length && setBanners(data))
      .catch(() => {});

    fetchArticles({ perPage: 5 })
      .then((data) => active && data.length && setArticles(data.map(mapArticle)))
      .catch(() => {});

    fetchSetting('homeStats')
      .then((data) => active && Array.isArray(data) && data.length && setStats(data))
      .catch(() => {});

    fetchSetting('homeContact')
      .then((data) => active && data && setContact(data))
      .catch(() => {});

    fetchSetting('homeAbout')
      .then((data) => active && data?.description && setAbout(data.description))
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

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
          <CartButton />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Banner banners={banners} />

        <View style={styles.actionsRow}>
          {quickActions.map((a) => (
            <QuickAction key={a.key} icon={a.icon} label={a.label} onPress={onAction[a.key]} />
          ))}
        </View>

        <Intro user={user} about={about} />

        {stats.length ? (
          <View style={styles.statsGrid}>
            {stats.map((s, i) => (
              <StatCard key={i} icon={s.icon} value={s.value} label={s.label} />
            ))}
          </View>
        ) : null}

        {articles.length ? (
          <>
            <SectionHeader title="Thông tin" action="Xem tất cả" />
            {articles.map((n) => (
              <NewsCard key={n.id} title={n.title} excerpt={n.excerpt} image={n.image} />
            ))}
          </>
        ) : null}

        {contact ? <ContactBlock contact={contact} /> : null}
      </ScrollView>

      <Pressable style={[styles.support, { bottom: insets.bottom + spacing.lg }]}>
        <Ionicons name="headset-outline" size={26} color="#fff" />
      </Pressable>
    </View>
  );
}

function Banner({ banners }) {
  const { width } = useWindowDimensions();
  const slideWidth = width - spacing.lg * 2;
  const count = banners.length;
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  // Refs để PanResponder (tạo 1 lần) luôn đọc giá trị hiện tại.
  const indexRef = useRef(0);
  const slideWidthRef = useRef(slideWidth);
  const countRef = useRef(count);
  const draggingRef = useRef(false);
  slideWidthRef.current = slideWidth;
  countRef.current = count;

  const goTo = useCallback(
    (i, animated = true) => {
      const c = countRef.current || 1;
      const clamped = ((i % c) + c) % c;
      indexRef.current = clamped;
      setIndex(clamped);
      const toValue = -clamped * slideWidthRef.current;
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
      onPanResponderGrant: () => {
        draggingRef.current = true;
      },
      onPanResponderMove: (_, g) => {
        translateX.setValue(-indexRef.current * slideWidthRef.current + g.dx);
      },
      onPanResponderRelease: (_, g) => {
        draggingRef.current = false;
        const w = slideWidthRef.current;
        let next = indexRef.current;
        if (g.dx < -w * 0.25 || g.vx < -0.35) next = indexRef.current + 1;
        else if (g.dx > w * 0.25 || g.vx > 0.35) next = indexRef.current - 1;
        next = Math.max(0, Math.min(countRef.current - 1, next));
        goTo(next);
      },
      onPanResponderTerminate: () => {
        draggingRef.current = false;
        goTo(indexRef.current);
      },
    })
  ).current;

  // Giữ đúng vị trí khi slideWidth đổi (xoay/resize màn).
  useEffect(() => {
    goTo(indexRef.current, false);
  }, [slideWidth, goTo]);

  // Auto-slide chậm (8.5s), tạm dừng khi đang kéo.
  useEffect(() => {
    if (count <= 1) return undefined;
    const timer = setInterval(() => {
      if (!draggingRef.current) goTo(indexRef.current + 1);
    }, 8500);
    return () => clearInterval(timer);
  }, [count, goTo]);

  return (
    <View style={styles.bannerWrap}>
      <View style={[styles.bannerViewport, { width: slideWidth }]} {...pan.panHandlers}>
        <Animated.View style={[styles.bannerRow, { transform: [{ translateX }] }]}>
          {banners.map((b) => (
            <View key={b.id} style={[styles.banner, { width: slideWidth }]}>
              <View style={styles.bannerBadge}>
                <Ionicons name="leaf" size={12} color={colors.primary} />
                <Text style={styles.bannerBadgeText}>iWE FARM</Text>
              </View>
              <Text style={styles.bannerTitle} numberOfLines={2}>
                {b.title}
              </Text>
              <Text style={styles.bannerDesc} numberOfLines={3}>
                {b.subtitle}
              </Text>
            </View>
          ))}
        </Animated.View>
      </View>
      {count > 1 ? (
        <View style={styles.dots}>
          {banners.map((b, i) => (
            <Pressable key={b.id} hitSlop={8} onPress={() => goTo(i)}>
              <View style={[styles.dot, i === index && styles.dotActive]} />
            </Pressable>
          ))}
        </View>
      ) : null}
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

function Intro({ user, about }) {
  const name = user?.name || user?.email;
  return (
    <View style={styles.intro}>
      <View style={styles.plant}>
        <Ionicons name="leaf" size={44} color={colors.primary} />
      </View>
      <Text style={styles.introTitle}>iWE FARM</Text>
      {name ? <Text style={styles.introHello}>Xin chào, {name}</Text> : null}
      <Text style={styles.introDesc}>
        {about ||
          'Ứng dụng iWE FARM ra đời với mục tiêu đưa người tiêu dùng chạm đến cây sâm thật – chuẩn gen – trồng đúng vùng ngay trên điện thoại.'}
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

function NewsCard({ title, excerpt, image }) {
  const uri = toStaticUrl(image);
  return (
    <Pressable style={({ pressed }) => [styles.news, pressed && styles.pressed]}>
      {uri ? (
        <Image source={{ uri }} style={styles.newsThumb} resizeMode="cover" />
      ) : (
        <View style={styles.newsThumb}>
          <Ionicons name="image-outline" size={26} color={colors.textMuted} />
        </View>
      )}
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

function ContactBlock({ contact }) {
  return (
    <View style={styles.contact}>
      <Text style={styles.contactHeading}>Thông tin liên hệ</Text>
      <ContactRow icon="location-outline" label="Địa chỉ" value={contact.address} />
      <ContactRow
        icon="call-outline"
        label="Điện thoại"
        value={contact.phone}
        onPress={() => Linking.openURL(`tel:${contact.phone.replace(/\s/g, '')}`)}
      />
      <ContactRow
        icon="mail-outline"
        label="Email"
        value={contact.email}
        onPress={() => Linking.openURL(`mailto:${contact.email}`)}
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
  bannerViewport: { overflow: 'hidden' },
  bannerRow: { flexDirection: 'row' },
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
