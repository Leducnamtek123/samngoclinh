// Chi tiết cây/luống trồng (GET /public/cultivation/beds/:code): ảnh, giá, mô tả, thông tin luống,
// lịch sử chăm sóc, chọn gói chăm sóc/bảo vệ, mã QR + số lượng và Mua ngay (khách -> Login).
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing } from '../utils/theme';
import { groupThousands, formatDateVN } from '../utils/format';
import { fetchBedDetail } from '../api/cultivation';
import { fetchCarePackages, fetchProtectionPackages } from '../api/packages';
import { toStaticUrl, WEB_ORIGIN } from '../api/config';
import { useRequireAuth } from '../hooks/useRequireAuth';
import ImageCarousel from '../components/ImageCarousel';

const HEALTH_LABELS = {
  healthy: 'Cây khỏe',
  good: 'Tốt',
  monitoring: 'Đang theo dõi',
  weak: 'Cây yếu',
  sick: 'Cần chăm sóc',
};

const CARE_STATUS_LABELS = { done: 'Hoàn thành', pending: 'Đang xử lý' };

const CARE_ACCENT = '#E08A1E';
const PROTECT_ACCENT = '#2F80ED';

export default function PlantDetailScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const requireAuth = useRequireAuth();
  const { width } = useWindowDimensions();

  const { code, bed: initial } = route.params || {};
  const [bed, setBed] = useState(initial || null);
  const [loading, setLoading] = useState(!initial);
  const [expanded, setExpanded] = useState(false);
  const [qty, setQty] = useState(1);

  const [carePkgs, setCarePkgs] = useState([]);
  const [protPkgs, setProtPkgs] = useState([]);
  const [careId, setCareId] = useState(null);
  const [protId, setProtId] = useState(null);

  const load = useCallback(async () => {
    if (!code) return;
    try {
      const data = await fetchBedDetail(code);
      if (data) setBed((prev) => ({ ...prev, ...data }));
    } catch {
      // giữ dữ liệu từ danh sách nếu fetch lỗi
    } finally {
      setLoading(false);
    }
  }, [code]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    let active = true;
    fetchCarePackages()
      .then((p) => {
        if (!active) return;
        setCarePkgs(p);
        if (p[0]) setCareId(p[0].code);
      })
      .catch(() => {});
    fetchProtectionPackages()
      .then((p) => {
        if (!active) return;
        setProtPkgs(p);
        if (p[0]) setProtId(p[0].code);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const onBuy = () =>
    requireAuth(() => navigation.navigate('ComingSoon', { title: 'Mua cây' }));

  const traceUrl = `${WEB_ORIGIN}/vi/trace/${code || ''}`;
  const qrImage = bed?.qrCode || null;
  const onShare = () => Share.share({ message: traceUrl }).catch(() => {});

  // Web: tải PNG bằng thẻ <a download>; native: mở share sheet để lưu ảnh QR.
  const onDownloadQr = async () => {
    if (!qrImage) return;
    if (Platform.OS === 'web' && globalThis.document) {
      const a = globalThis.document.createElement('a');
      a.href = qrImage;
      a.download = `ma-qr-cay-${code || 'sam'}.png`;
      globalThis.document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    try {
      await Share.share({ url: qrImage, message: traceUrl });
    } catch {
      // bỏ qua khi người dùng huỷ
    }
  };

  const images = (bed?.images || []).map(toStaticUrl).filter(Boolean);
  const description = bed?.description || '';
  const longDesc = description.length > 90;

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
        <View style={{ flex: 1 }} />
        <View style={styles.headerActions}>
          <Ionicons name="cart-outline" size={24} color="#fff" />
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </View>
      </View>

      {loading && !bed ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : bed ? (
        <>
          <ScrollView
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <ImageCarousel images={images} width={width} />

            <View style={styles.body}>
              <Text style={styles.name}>Cây Sâm Ngọc Linh</Text>
              <Text style={styles.price}>{groupThousands(bed.price)}đ</Text>

              <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
              <View style={styles.descHeadRow}>
                <Ionicons name="leaf" size={16} color={colors.primary} />
                <Text style={styles.descHead}>Sâm Ngọc Linh {bed.ageYear} năm tuổi</Text>
              </View>
              {description ? (
                <>
                  <Text style={styles.desc} numberOfLines={expanded ? undefined : 3}>
                    {description}
                  </Text>
                  {longDesc ? (
                    <Pressable onPress={() => setExpanded((v) => !v)} hitSlop={6}>
                      <Text style={styles.link}>{expanded ? 'Thu gọn' : 'Xem thêm'}</Text>
                    </Pressable>
                  ) : null}
                </>
              ) : null}

              <View style={styles.infoBox}>
                <InfoRow label="Tuổi cây" value={`${bed.ageYear} năm`} />
                <InfoRow label="Số cây còn lại" value={String(bed.treeCount)} />
                {bed.gardenName ? <InfoRow label="Vườn" value={bed.gardenName} /> : null}
                {bed.name ? (
                  <InfoRow label="Luống" value={bed.name.replace(/^Luống\s*/i, '')} />
                ) : null}
                {bed.healthStatus ? (
                  <InfoRow
                    label="Trạng thái"
                    value={HEALTH_LABELS[bed.healthStatus] || bed.healthStatus}
                  />
                ) : null}
                {bed.plantedAt ? (
                  <InfoRow label="Ngày trồng" value={formatDateVN(bed.plantedAt)} />
                ) : null}
              </View>

              {bed.careLogs?.length ? (
                <View style={styles.section}>
                  <View style={styles.sectionHead}>
                    <Ionicons name="clipboard-outline" size={18} color={colors.primary} />
                    <Text style={styles.sectionHeadText}>Lịch sử chăm sóc</Text>
                  </View>
                  {bed.careLogs.map((log) => (
                    <CareLogItem key={log.code} log={log} />
                  ))}
                </View>
              ) : null}

              {carePkgs.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionHeadText}>Chọn gói chăm sóc</Text>
                  {carePkgs.map((pkg) => (
                    <PackageOption
                      key={pkg.code}
                      pkg={pkg}
                      icon="leaf-outline"
                      accent={CARE_ACCENT}
                      selected={careId === pkg.code}
                      onSelect={() => setCareId(pkg.code)}
                    />
                  ))}
                </View>
              ) : null}

              {protPkgs.length ? (
                <View style={styles.section}>
                  <Text style={styles.sectionHeadText}>Chọn gói bảo vệ cây</Text>
                  {protPkgs.map((pkg) => (
                    <PackageOption
                      key={pkg.code}
                      pkg={pkg}
                      icon="shield-checkmark-outline"
                      accent={PROTECT_ACCENT}
                      selected={protId === pkg.code}
                      onSelect={() => setProtId(pkg.code)}
                    />
                  ))}
                </View>
              ) : null}

              <View style={styles.qrCard}>
                <View style={styles.sectionHead}>
                  <Ionicons name="qr-code-outline" size={18} color={colors.primary} />
                  <Text style={styles.sectionHeadText}>Mã QR sản phẩm</Text>
                </View>
                {qrImage ? (
                  <Image source={{ uri: qrImage }} style={styles.qr} resizeMode="contain" />
                ) : (
                  <View style={[styles.qr, styles.qrEmpty]}>
                    <Ionicons name="qr-code-outline" size={72} color={colors.textMuted} />
                  </View>
                )}
                <Text style={styles.qrHint}>Quét mã để xem chi tiết sản phẩm trên Web</Text>
                <View style={styles.qrActions}>
                  <Pressable
                    onPress={onDownloadQr}
                    style={({ pressed }) => [styles.qrBtn, pressed && styles.pressed]}
                  >
                    <Ionicons name="download-outline" size={18} color="#fff" />
                    <Text style={styles.qrBtnText}>Tải về</Text>
                  </Pressable>
                  <Pressable
                    onPress={onShare}
                    style={({ pressed }) => [styles.qrBtnOutline, pressed && styles.pressed]}
                  >
                    <Ionicons name="share-social-outline" size={18} color={colors.primary} />
                    <Text style={styles.qrBtnOutlineText}>Chia sẻ</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.stepper}>
              <Pressable
                onPress={() => setQty((q) => Math.max(1, q - 1))}
                style={styles.stepBtn}
                hitSlop={6}
              >
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable onPress={() => setQty((q) => q + 1)} style={styles.stepBtn} hitSlop={6}>
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>
            <Pressable
              onPress={onBuy}
              style={({ pressed }) => [styles.buyBtn, pressed && styles.pressed]}
            >
              <Ionicons name="flash" size={18} color="#fff" />
              <Text style={styles.buyText}>Mua ngay</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <Text style={styles.empty}>Không tải được thông tin cây.</Text>
      )}
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function CareLogItem({ log }) {
  return (
    <View style={styles.logCard}>
      <View style={styles.logTopRow}>
        <Text style={styles.logTitle} numberOfLines={1}>
          {log.title}
        </Text>
        <View style={styles.logBadge}>
          <Text style={styles.logBadgeText}>Chung luống</Text>
        </View>
      </View>
      <View style={styles.logMeta}>
        <Ionicons name="calendar-outline" size={13} color={colors.textMuted} />
        <Text style={styles.logMetaText}>{formatDateVN(log.loggedAt)}</Text>
        <Ionicons name="checkmark-circle" size={13} color={colors.primary} />
        <Text style={styles.logMetaText}>{CARE_STATUS_LABELS[log.status] || log.status}</Text>
      </View>
      {log.description ? <Text style={styles.logDesc}>{log.description}</Text> : null}
    </View>
  );
}

function PackageOption({ pkg, icon, accent, selected, onSelect }) {
  return (
    <Pressable
      onPress={onSelect}
      style={[styles.pkg, selected && { borderColor: accent, backgroundColor: `${accent}14` }]}
    >
      <Ionicons name={icon} size={24} color={accent} />
      <View style={styles.pkgInfo}>
        <Text style={styles.pkgName}>{pkg.name}</Text>
        <Text style={[styles.pkgPrice, { color: accent }]}>{groupThousands(pkg.price)}đ</Text>
      </View>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={selected ? accent : colors.border}
      />
    </Pressable>
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
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },

  loader: { marginTop: spacing.xl },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },

  body: { padding: spacing.lg, gap: spacing.sm },
  name: { fontSize: 24, fontWeight: '800', color: colors.text },
  price: { fontSize: 24, fontWeight: '800', color: colors.primary },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: spacing.md },
  descHeadRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  descHead: { fontSize: 15, fontWeight: '700', color: colors.text },
  desc: { fontSize: 15, lineHeight: 22, color: colors.text },
  link: { color: '#2F80ED', fontSize: 14, fontWeight: '600', marginTop: 2 },

  infoBox: { marginTop: spacing.md, gap: spacing.md },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  infoLabel: { fontSize: 15, fontWeight: '700', color: colors.text, minWidth: 118 },
  infoValue: { flex: 1, fontSize: 15, color: colors.text },

  section: { marginTop: spacing.lg, gap: spacing.sm },
  sectionHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  sectionHeadText: { fontSize: 17, fontWeight: '800', color: colors.text },

  logCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
    gap: spacing.xs,
    backgroundColor: colors.surface,
  },
  logTopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  logBadge: {
    backgroundColor: colors.greenSoft,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  logBadgeText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  logMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' },
  logMetaText: { fontSize: 13, color: colors.textMuted, marginRight: spacing.sm },
  logDesc: { fontSize: 14, lineHeight: 20, color: colors.text },

  pkg: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    padding: spacing.md,
  },
  pkgInfo: { flex: 1 },
  pkgName: { fontSize: 15, fontWeight: '700', color: colors.text },
  pkgPrice: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  qrCard: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  qr: { width: 200, height: 200, marginTop: spacing.sm },
  qrEmpty: { alignItems: 'center', justifyContent: 'center' },
  qrHint: { fontSize: 13, fontStyle: 'italic', color: colors.textMuted, textAlign: 'center' },
  qrActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  qrBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  qrBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
  },
  qrBtnOutlineText: { color: colors.primary, fontSize: 14, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 24, textAlign: 'center' },
  buyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buyText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  pressed: { opacity: 0.85 },
});
