// Chỉnh sửa thông tin cá nhân — hiện chỉ các trường backend hỗ trợ: họ tên + giới tính.
// Backend PUT /shared/user/profile/update yêu cầu countryId (giữ nguyên) và gender bắt buộc.
import { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import IconField from '../components/IconField';
import PrimaryButton from '../components/PrimaryButton';
import {
  addMobileNumber,
  deleteMobileNumber,
  updateMobileNumber,
  updateProfile,
} from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import { colors, spacing } from '../utils/theme';

const GENDERS = [
  { value: 'male', label: 'Nam', icon: 'male' },
  { value: 'female', label: 'Nữ', icon: 'female' },
];

const pad2 = (n) => String(n).padStart(2, '0');
const ITEM_H = 44;
const CUR_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CUR_YEAR - 1920 + 1 }, (_, i) => CUR_YEAR - i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const daysInMonth = (y, m) => new Date(y, m, 0).getDate();

// Tự chèn dấu '-' theo YYYY-MM-DD khi gõ các con số.
const maskDate = (raw) => {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  let out = d.slice(0, 4);
  if (d.length > 4) out += `-${d.slice(4, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  return out;
};

const parseValidDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = +m[1];
  const mo = +m[2];
  const d = +m[3];
  const dt = new Date(y, mo - 1, d);
  const real = dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d;
  if (!real || y < 1900 || dt > new Date()) return null;
  return dt;
};

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, refreshProfile } = useAuth();
  const alert = useAlert();

  const existingPhone = user?.mobileNumbers?.[0] || null;
  const [name, setName] = useState(user?.name || '');
  const [gender, setGender] = useState(user?.gender || null);
  const [birthDate, setBirthDate] = useState((user?.birthDate || '').slice(0, 10));
  const [identityNumber, setIdentityNumber] = useState(user?.identityNumber || '');
  const [phone, setPhone] = useState(existingPhone?.number || '');
  const [loading, setLoading] = useState(false);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pY, setPY] = useState(2000);
  const [pM, setPM] = useState(1);
  const [pD, setPD] = useState(1);

  const openPicker = () => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(birthDate);
    setPY(m ? +m[1] : 2000);
    setPM(m ? +m[2] : 1);
    setPD(m ? +m[3] : 1);
    setPickerOpen(true);
  };

  const confirmPicker = () => {
    const day = Math.min(pD, daysInMonth(pY, pM));
    setBirthDate(`${pY}-${pad2(pM)}-${pad2(day)}`);
    setPickerOpen(false);
  };

  const onSave = async () => {
    if (!name.trim()) return alert.error('Thiếu thông tin', 'Vui lòng nhập họ tên.');
    if (!gender) return alert.error('Thiếu thông tin', 'Vui lòng chọn giới tính.');
    const trimmedBirth = birthDate.trim();
    if (trimmedBirth && !parseValidDate(trimmedBirth)) {
      return alert.error('Ngày sinh không hợp lệ', 'Vui lòng chọn hoặc nhập ngày hợp lệ (YYYY-MM-DD).');
    }
    const trimmedId = identityNumber.trim();
    if (trimmedId && !/^\d{9}$|^\d{12}$/.test(trimmedId)) {
      return alert.error('Số CCCD không hợp lệ', 'CCCD gồm 12 số hoặc CMND gồm 9 số.');
    }
    const digits = phone.replace(/\D/g, '');
    if (digits && digits.length < 8) {
      return alert.error('Số điện thoại không hợp lệ', 'Nhập số hợp lệ (tối thiểu 8 số) hoặc để trống.');
    }
    setLoading(true);
    try {
      await updateProfile({
        name: name.trim(),
        gender,
        countryId: user?.countryId,
        birthDate: trimmedBirth,
        identityNumber: trimmedId,
      });
      const phoneCode = user?.country?.phoneCode?.[0] || '84';
      if (digits) {
        if (!existingPhone) {
          await addMobileNumber({ countryId: user?.countryId, phoneCode, number: digits });
        } else if (digits !== existingPhone.number) {
          await updateMobileNumber(existingPhone.id, {
            countryId: user?.countryId,
            phoneCode,
            number: digits,
          });
        }
      } else if (existingPhone) {
        await deleteMobileNumber(existingPhone.id);
      }
      await refreshProfile();
      alert.success('Thành công', 'Đã cập nhật thông tin cá nhân.', {
        confirmText: 'Xong',
        onConfirm: () => navigation.goBack(),
      });
    } catch (e) {
      alert.error('Cập nhật thất bại', e?.message || 'Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const dayList = Array.from({ length: daysInMonth(pY, pM) }, (_, i) => i + 1);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <Pressable style={styles.headerBtn} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </Pressable>
        <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
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
            <Text style={styles.label}>Họ tên</Text>
            <IconField
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Họ tên"
              autoCapitalize="words"
            />

            <Text style={[styles.label, styles.labelSpacer]}>Giới tính</Text>
            <View style={styles.genderRow}>
              {GENDERS.map((g) => {
                const active = gender === g.value;
                return (
                  <Pressable
                    key={g.value}
                    onPress={() => setGender(g.value)}
                    style={({ pressed }) => [
                      styles.genderPill,
                      active && styles.genderPillActive,
                      pressed && styles.pressed,
                    ]}
                  >
                    <Ionicons name={g.icon} size={18} color={active ? '#fff' : colors.textMuted} />
                    <Text style={[styles.genderText, active && styles.genderTextActive]}>
                      {g.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.label, styles.labelSpacer]}>Ngày sinh</Text>
            <View style={styles.dateField}>
              <Ionicons name="calendar-outline" size={22} color={colors.textMuted} />
              <TextInput
                style={styles.dateInput}
                value={birthDate}
                onChangeText={(t) => setBirthDate(maskDate(t))}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                maxLength={10}
              />
              <Pressable hitSlop={8} onPress={openPicker} style={styles.datePickBtn}>
                <Ionicons name="chevron-down" size={18} color={colors.primary} />
              </Pressable>
            </View>

            <Text style={[styles.label, styles.labelSpacer]}>Số CCCD</Text>
            <IconField
              icon="card-outline"
              value={identityNumber}
              onChangeText={(t) => setIdentityNumber(t.replace(/\D/g, ''))}
              placeholder="Số CCCD (12 số) hoặc CMND (9 số)"
              keyboardType="number-pad"
              maxLength={12}
            />

            <Text style={[styles.label, styles.labelSpacer]}>Số điện thoại</Text>
            <IconField
              icon="call-outline"
              value={phone}
              onChangeText={setPhone}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              maxLength={20}
            />
          </View>

          <View style={styles.readonlyCard}>
            <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
            <View style={styles.flex}>
              <Text style={styles.roLabel}>Email (không thể thay đổi)</Text>
              <Text style={styles.roValue}>{user?.email || '—'}</Text>
            </View>
          </View>

          <PrimaryButton title="Lưu thay đổi" onPress={onSave} loading={loading} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={pickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerOpen(false)}
      >
        <Pressable style={styles.modalBg} onPress={() => setPickerOpen(false)}>
          {pickerOpen ? (
            <Pressable style={styles.pickerCard} onPress={() => {}}>
              <Text style={styles.pickerTitle}>Chọn ngày sinh</Text>
              <View style={styles.pickerCols}>
                <PickerColumn label="Năm" data={YEARS} selected={pY} onSelect={setPY} />
                <PickerColumn label="Tháng" data={MONTHS} selected={pM} onSelect={setPM} />
                <PickerColumn
                  label="Ngày"
                  data={dayList}
                  selected={Math.min(pD, dayList.length)}
                  onSelect={setPD}
                />
              </View>
              <View style={styles.pickerActions}>
                <Pressable style={styles.pickerCancel} onPress={() => setPickerOpen(false)}>
                  <Text style={styles.pickerCancelText}>Hủy</Text>
                </Pressable>
                <Pressable style={styles.pickerConfirm} onPress={confirmPicker}>
                  <Text style={styles.pickerConfirmText}>Chọn</Text>
                </Pressable>
              </View>
            </Pressable>
          ) : null}
        </Pressable>
      </Modal>
    </View>
  );
}

function PickerColumn({ label, data, selected, onSelect }) {
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    const idx = data.indexOf(selected);
    if (idx < 0) return;
    done.current = true;
    ref.current?.scrollTo({ y: Math.max(0, idx * ITEM_H - ITEM_H * 2), animated: false });
  });

  return (
    <View style={styles.pickerCol}>
      <Text style={styles.pickerColLabel}>{label}</Text>
      <ScrollView
        ref={ref}
        style={styles.pickerScroll}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {data.map((n) => {
          const active = n === selected;
          return (
            <Pressable
              key={n}
              onPress={() => onSelect(n)}
              style={[styles.pickerItem, active && styles.pickerItemActive]}
            >
              <Text style={[styles.pickerItemText, active && styles.pickerItemTextActive]}>
                {pad2(n)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
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
  label: { fontSize: 14, fontWeight: '700', color: colors.text },
  labelSpacer: { marginTop: spacing.lg },

  genderRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  genderPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
  },
  genderPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  genderText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  genderTextActive: { color: '#fff' },

  readonlyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.greenSoft,
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  roLabel: { fontSize: 13, color: colors.textMuted },
  roValue: { fontSize: 15, color: colors.text, fontWeight: '500', marginTop: 2 },

  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
  },
  dateInput: { flex: 1, fontSize: 16, color: colors.text, padding: 0 },
  datePickBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  pickerCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: spacing.lg,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  pickerCols: { flexDirection: 'row', gap: spacing.md },
  pickerCol: { flex: 1 },
  pickerColLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  pickerScroll: {
    height: ITEM_H * 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
  },
  pickerItem: { height: ITEM_H, alignItems: 'center', justifyContent: 'center' },
  pickerItemActive: { backgroundColor: colors.primary, borderRadius: 8 },
  pickerItemText: { fontSize: 17, color: colors.text },
  pickerItemTextActive: { color: '#fff', fontWeight: '800' },
  pickerActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  pickerCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pickerCancelText: { fontSize: 16, fontWeight: '700', color: colors.textMuted },
  pickerConfirm: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pickerConfirmText: { fontSize: 16, fontWeight: '800', color: '#fff' },

  pressed: { opacity: 0.85 },
});
