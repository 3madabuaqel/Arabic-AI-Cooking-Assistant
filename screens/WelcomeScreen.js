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

export default function App() {
  const handleLogin = () => {
    Alert.alert('Login', 'تم الضغط على زر Login');
  };

  const handleCreateAccount = () => {
    Alert.alert('Create Account', 'تم الضغط على زر Create Account');
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
          <Text style={styles.logo}>🍳</Text>
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
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our
        </Text>

        <View style={styles.linksRow}>
          <TouchableOpacity onPress={handleTerms}>
            <Text style={styles.link}>Terms</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}> and </Text>

          <TouchableOpacity onPress={handlePrivacy}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#0A5C2F',
    marginBottom: 70,
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

  footer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    alignItems: 'center',
  },

  footerText: {
    color: '#B0B0B0',
    fontSize: 15,
  },

  linksRow: {
    flexDirection: 'row',
    marginTop: 5,
  },

  link: {
    color: '#0A5C2F',
    fontSize: 15,
    fontWeight: '700',
  },
});