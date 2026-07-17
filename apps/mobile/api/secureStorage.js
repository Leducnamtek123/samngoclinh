// Adapter lưu trữ tách theo nền tảng:
//  - Mobile (iOS/Android): expo-secure-store (mã hoá Keychain/Keystore).
//  - Web: AsyncStorage (SecureStore không hỗ trợ web).
// Phần code khác chỉ gọi getItem/setItem/removeItem, không cần biết nền tảng.

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

// SecureStore chỉ chấp nhận key gồm [A-Za-z0-9._-]; key của ta có '@' và '/' nên phải làm sạch.
const safeKey = (key) => key.replace(/[^a-zA-Z0-9._-]/g, '_');

export const secureStorage = {
  getItem(key) {
    const k = safeKey(key);
    return isWeb ? AsyncStorage.getItem(k) : SecureStore.getItemAsync(k);
  },
  setItem(key, value) {
    const k = safeKey(key);
    return isWeb ? AsyncStorage.setItem(k, value) : SecureStore.setItemAsync(k, value);
  },
  removeItem(key) {
    const k = safeKey(key);
    return isWeb ? AsyncStorage.removeItem(k) : SecureStore.deleteItemAsync(k);
  },
};
