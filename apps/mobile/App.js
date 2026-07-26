import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import MainTabs from './navigation/MainTabs';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import ComingSoonScreen from './screens/ComingSoonScreen';
import { colors } from './utils/theme';

const Stack = createNativeStackNavigator();

// Deep link cơ bản (không dùng cho reset mật khẩu — reset gửi mật khẩu tạm qua email).
const linking = {
  prefixes: ['samngoclinh://'],
  config: {
    screens: {
      Login: 'login',
      ForgotPassword: 'forgot-password',
    },
  },
};

function RootNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Khách vào thẳng Home (duyệt tự do); các màn auth chỉ được đẩy lên khi cần
  // (bấm hành động mua hàng -> Login). Trạng thái đăng nhập phản ánh trong từng màn qua useAuth.
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: '', headerShadowVisible: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{ title: 'Đổi mật khẩu', headerShadowVisible: false }}
      />
      <Stack.Screen
        name="ComingSoon"
        component={ComingSoonScreen}
        options={({ route }) => ({
          title: route.params?.title || 'Sắp ra mắt',
          headerShadowVisible: false,
        })}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <AlertProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </AlertProvider>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
