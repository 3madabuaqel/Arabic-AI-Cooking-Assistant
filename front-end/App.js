import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// استيراد الشاشات (تأكدي من صحة المسارات لديكِ)
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountInfoScreen from './screens/AccountInfoScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPassScreen from './screens/ForgotPassScreen';
import VerifyScreen from './screens/VerifyScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'
  const [favorites, setFavorites] = useState([]); // الـ State الخاصة بالقائمة المفضلة
  const [user, setUser] = useState({ 
    isLoggedIn: false, 
    name: 'Sara', 
    password: '123',
    profileImage: null 
  });

  const isDark = themeMode === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Chat"
        >
          
          {/* شاشة الشات - تم تمرير الـ Props بالكامل لتفعيل الـ Dark mode واللغة */}
          <Stack.Screen name="Chat">
            {(props) => (
              <ChatScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة تسجيل الدخول */}
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                lang={lang}
                isDark={isDark}
                user={user}
                setUser={setUser}
              />
            )}
          </Stack.Screen>

          {/* شاشة الإعدادات */}
          <Stack.Screen name="Settings">
            {(props) => (
              <SettingsScreen
                {...props}
                lang={lang}
                setLang={setLang}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                isDark={isDark}
                user={user}
                setUser={setUser}
              />
            )}
          </Stack.Screen>

          {/* شاشة معلومات الحساب */}
          <Stack.Screen name="AccountInfo">
            {(props) => (
              <AccountInfoScreen
                {...props}
                lang={lang}
                isDark={isDark}
                user={user}
                setUser={setUser}
              />
            )}
          </Stack.Screen>

          {/* شاشة إنشاء الحساب */}
          <Stack.Screen name="SignUp">
            {(props) => (
              <SignUpScreen
                {...props}
                setUser={setUser}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة استعادة كلمة المرور */}
          <Stack.Screen name="ForgotPass">
            {(props) => (
              <ForgotPassScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة التحقق الكود */}
          <Stack.Screen name="Verify">
            {(props) => (
              <VerifyScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة المفضلة - تم ربطها بـ الـ State الفعلية للتطبيق */}
          <Stack.Screen name="Favorites">
            {(props) => (
              <FavoritesScreen
                {...props}
                favorites={favorites}
                setFavorites={setFavorites}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}