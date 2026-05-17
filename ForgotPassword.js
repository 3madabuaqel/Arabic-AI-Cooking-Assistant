import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const ForgetPasswordScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
      
      <TextInput placeholder="Your Email" style={styles.input} />
      
      <TouchableOpacity style={styles.resetBtn}>
        <Text style={styles.btnText}>Send Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { color: '#666', marginBottom: 30 },
  input: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 10, marginBottom: 20 },
  resetBtn: { backgroundColor: '#2D6A4F', padding: 18, borderRadius: 10 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});

export default ForgetPasswordScreen;