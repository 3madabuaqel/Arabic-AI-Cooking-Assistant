import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens (ensure your paths are correct)
import ChatScreen from './screens/ChatScreen.js';
import LoginScreen from './screens/LoginScreen.js';
import SettingsScreen from './screens/SettingsScreen.js';
import AccountInfoScreen from './screens/AccountInfoScreen.js';
import SignUpScreen from './screens/SignUpScreen.js';
import ForgotPassScreen from './screens/ForgotPassword.js';
import VerifyScreen from './screens/VerifyScreen.js';
import WelcomeScreen from './screens/WelcomeScreen.js';
import RecipeDetailScreen from './screens/RecipeDetailScreen.js';
import FavoritesScreen from './screens/FavoritesScreen.js';

const Stack = createNativeStackNavigator();

export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'
  const [favorites, setFavorites] = useState([]); // State for the favorites list
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
          initialRouteName="Welcome"
        >
          
          {/* Welcome Screen */}
          <Stack.Screen name="Welcome">
            {(props) => (
              <WelcomeScreen
                {...props}
                setUser={setUser}
              />
            )}
          </Stack.Screen>
          
          {/* Chat Screen - passing all props to enable Dark mode and Language */}
          <Stack.Screen name="Chat">
            {(props) => (
              <ChatScreen
                {...props}
                lang={lang}
                isDark={isDark}
                favorites={favorites}
                setFavorites={setFavorites}
                user={user}
              />
            )}
          </Stack.Screen>

          {}
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

          {/* Settings Screen */}
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

          {/* Account Info Screen */}
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

          {/* Sign Up Screen */}
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

          {/* Forgot Password Screen */}
          <Stack.Screen name="ForgotPass">
            {(props) => (
              <ForgotPassScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* Verify Code Screen */}
          <Stack.Screen name="Verify">
            {(props) => (
              <VerifyScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* Favorites Screen - linked to the app's actual State */}
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

          {/* Recipe Detail Screen */}
          <Stack.Screen name="RecipeDetail">
            {(props) => (
              <RecipeDetailScreen
                {...props}
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