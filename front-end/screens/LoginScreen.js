import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>Cook with AI</Text>
      <Text style={styles.welcome}>Welcome Back!</Text>
      
      <TextInput placeholder="Email" style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" style={styles.input} secureTextEntry />
      
{/* حقل الباسورد وبعده الزر مباشرة */}
<View style={styles.passwordWrapper}>
  <TextInput 
    style={styles.passwordInput} 
    placeholder="Enter your password" 
    secureTextEntry={!showPass}
  />
  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
    <Eye color="#999" size={20} />
  </TouchableOpacity>
</View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.greenBold}>Sign Up</Text>
      </TouchableOpacity>


{/* حقل كلمة المرور */}
          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput 
              style={styles.passwordInput} 
              placeholder="Enter your password" 
              secureTextEntry={!showPass}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Eye color="#999" size={20} />
            </TouchableOpacity>
          </View>

          {/* انقليه لهذا المكان بالضبط ليعمل */}
          <TouchableOpacity 
            style={styles.forgotBtn} 
            onPress={() => {
              console.log("Navigating to ForgotPass..."); // سيظهر لكِ في الـ Terminal عند الضغط
              navigation.navigate('ForgotPass');
            }}
          >
            <Text style={styles.greenBold}>Forgot Password?</Text>
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