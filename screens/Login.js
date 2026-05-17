import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Cook with AI</Text>
      <Text style={styles.welcome}>Welcome Back!</Text>
      
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      
      <TouchableOpacity onPress={() => navigation.navigate('ForgetPass')}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 30, backgroundColor: '#fff' },
  logoText: { fontSize: 32, fontWeight: 'bold', color: '#2D6A4F', textAlign: 'center', marginBottom: 10 },
  welcome: { fontSize: 18, color: '#666', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#F0F0F0', padding: 15, borderRadius: 10, marginBottom: 15 },
  forgotText: { textAlign: 'right', color: '#2D6A4F', marginBottom: 30 },
  button: { backgroundColor: '#2D6A4F', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;