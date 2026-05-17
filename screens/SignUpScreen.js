import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

export default function SignupScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.container}>
        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create Account</Text>

        {/* Full Name */}
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          placeholder="username"
          style={styles.input}
        />

        {/* Email */}
        <Text style={styles.label}>EMAIL ADDRESS</Text>
        <TextInput
          placeholder="user@email.com"
          style={styles.input}
          keyboardType="email-address"
        />

        {/* Password */}
        <Text style={styles.label}>PASSWORD</Text>
        <View style={styles.passwordBox}>
          <TextInput
            placeholder="********"
            style={styles.passwordInput}
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Text style={styles.eye}>👁</Text>
          </TouchableOpacity>
        </View>

        {/* Confirm Password */}
        <Text style={styles.label}>CONFIRM PASSWORD</Text>
        <TextInput
          placeholder="********"
          style={styles.input}
          secureTextEntry
        />

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sign Up ✕</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    maxWidth: 420,   // 🔥 هذا أهم سطر
    padding: 20,
  },
  back: {
    fontSize: 22,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    color: '#000',
  },
  input: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
  },
  passwordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 14,
  },
  eye: {
    fontSize: 18,
    opacity: 0.6,
  },
  button: {
    backgroundColor: '#0a8f3c',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});