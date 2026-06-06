import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, StyleSheet } from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import auth from '@react-native-firebase/auth'; // استيراد Firebase Auth

export default function SignUpScreen({ navigation, setUser, lang, isDark }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false); // لإظهار حالة التحميل
  const t = lang === 'ar';

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("خطأ", "يرجى ملء جميع الحقول");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("خطأ", "كلمتا السر غير متطابقتين");
      return;
    }

    setLoading(true);
    try {
      // إنشاء حساب حقيقي في Firebase
      const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      
      // تحديث ملف تعريف المستخدم بالاسم
      await userCredential.user.updateProfile({ displayName: name });

      setUser({
        name,
        email: userCredential.user.email,
        isLoggedIn: true,
      });

      navigation.replace('Chat');
    } catch (error) {
      // التعامل مع أخطاء Firebase (مثل البريد موجود مسبقاً)
      Alert.alert("خطأ", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.authTitle, isDark && { color: '#fff' }]}>Create Account</Text>

        <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>FULL NAME</Text>
        <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="Your full name" placeholderTextColor="#888" onChangeText={setName} />

        <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>EMAIL ADDRESS</Text>
        <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="name@email.com" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />

        <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>PASSWORD</Text>
        <View style={[styles.inputContainer, isDark && styles.darkInput]}>
          <TextInput style={[styles.flexInput, { color: isDark ? '#fff' : '#000' }]} placeholder="********" secureTextEntry={!showPass} onChangeText={setPassword} />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            {showPass ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>CONFIRM PASSWORD</Text>
        <View style={[styles.inputContainer, isDark && styles.darkInput]}>
          <TextInput style={[styles.flexInput, { color: isDark ? '#fff' : '#000' }]} placeholder="********" secureTextEntry={!showPass} onChangeText={setConfirmPassword} />
        </View>

        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUp} disabled={loading}>
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{loading ? "Loading..." : "Sign Up"}</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
        </View>

        <TouchableOpacity style={[styles.socialBtn, isDark && { backgroundColor: '#1E1E1E', borderColor: '#333' }]} onPress={() => Alert.alert("تنبيه", "يجب إعداد Google Sign-In في Firebase Console")}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.googleIcon} />
          <Text style={[styles.socialBtnText, isDark && { color: '#fff' }]}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginFooter} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Log in</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
  authTitle: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', alignSelf: 'flex-start', marginBottom: 30, marginTop: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#333', marginBottom: 8, marginTop: 18, letterSpacing: 0.5 },
  input: { backgroundColor: '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, color: '#000', fontSize: 15, width: '100%' },
  inputContainer: { backgroundColor: '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', width: '100%' },
  flexInput: { flex: 1, fontSize: 15, height: '100%' },
  darkInput: { backgroundColor: '#1E1E1E', color: '#fff' },
  signUpBtn: { backgroundColor: '#2D8C46', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 35, width: '100%' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EAEAEA' },
  dividerText: { marginHorizontal: 15, color: '#888', fontSize: 14, fontWeight: '500' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EAEAEA', backgroundColor: '#fff', height: 55, borderRadius: 30, width: '100%' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  socialBtnText: { fontWeight: '600', color: '#1A1A1A', fontSize: 15 },
  loginFooter: { marginTop: 30, alignSelf: 'center' },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#2D8C46', fontWeight: 'bold' }
});