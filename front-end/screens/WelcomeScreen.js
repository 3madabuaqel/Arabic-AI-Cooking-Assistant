// App.js

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import { ChefHat } from 'lucide-react-native';

export default function WelcomeScreen({ navigation, setUser }) {
  const handleGuest = () => {
    setUser({ isLoggedIn: true, isGuest: true, name: 'زائر', profileImage: null });
    navigation.navigate('Chat');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleCreateAccount = () => {
    navigation.navigate('SignUp');
  };

  const handleTerms = () => {
    Alert.alert('Terms', 'فتح الشروط والأحكام');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacy Policy', 'فتح سياسة الخصوصية');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top Image */}
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        }}
        style={styles.topImage}
        imageStyle={styles.imageRadius}
      >
        <View style={styles.overlay} />

        {/* Logo */}
        <View style={styles.logoBox}>
          <ChefHat color="#2D8C46" size={42} />
        </View>
      </ImageBackground>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Cook with AI</Text>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
          activeOpacity={0.8}
        >
          <Text style={styles.createText}>Create Account</Text>
        </TouchableOpacity>

        {/* Guest Button */}
        <TouchableOpacity
          style={[styles.createButton, { marginTop: 15, borderColor: '#ccc' }]}
          onPress={handleGuest}
          activeOpacity={0.8}
        >
          <Text style={[styles.createText, { color: '#666' }]}>Guest Mode</Text>
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  topImage: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageRadius: {
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },

  logoBox: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  logo: {
    fontSize: 42,
  },

  content: {
    flex: 1,
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A5C2F',
    marginBottom: 40,
  },

  loginButton: {
    width: '100%',
    height: 60,
    backgroundColor: '#18A84F',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  loginText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  createButton: {
    width: '100%',
    height: 60,
    borderWidth: 2,
    borderColor: '#D7EBDD',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  createText: {
    color: '#0A5C2F',
    fontSize: 22,
    fontWeight: '700',
  },


});