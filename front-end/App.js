import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';
// استيراد الشاشات
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
  const [lang, setLang] = useState('en');
  const [themeMode, setThemeMode] = useState('light');
  const [favorites, setFavorites] = useState([]);
 const [user, setUser] = useState({
  isLoggedIn: false,
  name: 'Sara',
  password: '123',
  phone: '',
  countryCode: '+962',
  profileImage: null,
});

const isDark = themeMode === 'dark';

// في ملف App.js
useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      // المستخدم مسجل دخول بالفعل في Firebase
      setUser(prev => ({ ...prev, isLoggedIn: true, name: firebaseUser.email }));
    } else {
      // لا يوجد مستخدم
      setUser(prev => ({ ...prev, isLoggedIn: false }));
    }
  });

  return unsubscribe; 
}, []);
const saveUserData = async () => {
  try {
    await AsyncStorage.setItem(
      'userData',
      JSON.stringify(user)
    );
  } catch (error) {
    console.log('Error saving user data:', error);
  }
};
const loadUserData = async () => {
  try {
    const savedUser = await AsyncStorage.getItem('userData');

    if (savedUser) {
      setUser(prev => ({
        ...prev,
        ...JSON.parse(savedUser),
      }));
    }
  } catch (error) {
    console.log('Error loading user data:', error);
  }
};

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
         screenOptions={{ headerShown: false }}
  initialRouteName={user.isLoggedIn ? "Chat" : "Login"}
>
          {/* شاشة الشات */}
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

          {/* شاشة إنشاء حساب */}
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

          {/* شاشة نسيت كلمة المرور */}
          <Stack.Screen name="ForgotPass">
            {(props) => (
              <ForgotPassScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة التحقق */}
          <Stack.Screen name="Verify">
            {(props) => (
              <VerifyScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة المفضلة */}
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