// Thông tin thiết bị cho endpoint login (backend yêu cầu device.fingerprint).
// Fingerprint được tạo một lần rồi lưu lại để ổn định qua các lần mở app.

import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';

import { secureStorage } from './secureStorage';

const FINGERPRINT_KEY = '@device/fingerprint';

// EnumDevicePlatform của backend: ios | android | web.
const PLATFORM = Platform.OS === 'ios' || Platform.OS === 'android' ? Platform.OS : 'web';

async function getFingerprint() {
  let fp = await secureStorage.getItem(FINGERPRINT_KEY);
  if (!fp) {
    fp = Crypto.randomUUID().replace(/-/g, '');
    await secureStorage.setItem(FINGERPRINT_KEY, fp);
  }
  return fp;
}

export async function getDeviceInfo() {
  return {
    fingerprint: await getFingerprint(),
    name: `${PLATFORM} device`,
    platform: PLATFORM,
  };
}
