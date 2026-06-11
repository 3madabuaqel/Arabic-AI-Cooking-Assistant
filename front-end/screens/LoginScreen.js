import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Utensils, Eye, Smartphone, User } from 'lucide-react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '149721092255-bd5691qkq9cuvklaefo1pk2ea7gu70en.apps.googleusercontent.com',
});

export default function LoginScreen({ navigation, setUser, lang, isDark, user }) {
  const t = lang === 'ar';
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("خطأ", "يرجى تعبئة الحقل وكلمة المرور");
      return;
    }
    try {
      let loginEmail = email.trim();
      // If user entered a phone number (contains digits and no @), convert to the fake email
      if (!loginEmail.includes('@') && /\d+/.test(loginEmail)) {
        loginEmail = loginEmail.replace(/\+/g, '') + '@arabicai.com';
      }
      const userCredential = await auth().signInWithEmailAndPassword(loginEmail, password);
      setUser({ ...user, isLoggedIn: true, name: userCredential.user.displayName || userCredential.user.email });
      navigation.replace('Chat');
    } catch (error) {
      Alert.alert("خطأ", "البيانات غير صحيحة أو החساب غير موجود");
    }
  };
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const idToken = userInfo.data?.idToken || userInfo.idToken;

      const googleCredential =
        auth.GoogleAuthProvider.credential(idToken);

      const userCredential =
        await auth().signInWithCredential(googleCredential);

      setUser({
        ...user,
        isLoggedIn: true,
        name:
          userCredential.user.displayName ||
          userCredential.user.email,
      });

      navigation.replace('Chat');

    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Google Login Error', `${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
    }
  };
  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <ScrollView contentContainerStyle={styles.centerContent}>

        <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} size={24} />
        </TouchableOpacity>

        <View style={styles.greenIconBox}>
          <Utensils color="white" size={32} />
        </View>

        <View style={styles.textWrapper}>
          <Text style={[styles.titleText, isDark && { color: '#fff' }]}>Welcome Back</Text>
          <Text style={[styles.subtitleText, isDark && { color: '#aaa' }]}>Log in to continue</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={[styles.label, isDark && { color: '#ccc' }]}>Email or Phone Number</Text>
          <TextInput
            style={[styles.input, isDark && styles.darkInput]}
            placeholder="example@email.com or +962..."
            placeholderTextColor={isDark ? '#777' : '#999'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />

          <Text style={[styles.label, { marginTop: 20 }, isDark && { color: '#ccc' }]}>Password</Text>
          <View style={[styles.passwordWrapper, isDark && styles.darkInput]}>
            <TextInput
              style={[styles.passwordInput, isDark && { color: '#fff' }]}
              placeholder="Enter your password"
              secureTextEntry={!showPass}
              placeholderTextColor={isDark ? '#777' : '#999'}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Eye color={isDark ? '#aaa' : '#999'} size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn} onPress={() => navigation.navigate('ForgotPass')}>
            <Text style={styles.greenBold}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin}>
            <Text style={styles.primaryBtnText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* الفاصل OR */}
        <View style={styles.orDivider}>
          <View style={[styles.line, isDark && { backgroundColor: '#333' }]} />
          <Text style={[styles.orText, isDark && { color: '#777' }]}>OR</Text>
          <View style={[styles.line, isDark && { backgroundColor: '#333' }]} />
        </View>

        {/* زر جوجل */}
        <TouchableOpacity
          style={[styles.googleBtn, isDark && { borderColor: '#333' }]}
          onPress={signInWithGoogle}
        >
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
            style={styles.googleIcon}
          />
          <Text style={[styles.googleBtnText, isDark && { color: '#fff' }]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* زر الدخول كضيف */}
        <TouchableOpacity
          style={[styles.googleBtn, { marginTop: 15 }, isDark && { borderColor: '#333' }]}
          onPress={() => {
            setUser({
              name: 'Guest',
              email: 'guest@arabicai.com',
              phone: '',
              isLoggedIn: true,
              isGuest: true
            });
            navigation.replace('Chat');
          }}
        >
          <User color={isDark ? '#fff' : '#333'} size={20} style={{ marginRight: 10 }} />
          <Text style={[styles.googleBtnText, isDark && { color: '#fff' }]}>Continue as Guest</Text>
        </TouchableOpacity>

        {/* أسفل الشاشة لإنشاء حساب جديد */}
        <View style={styles.footerRow}>
          <Text style={{ color: isDark ? '#aaa' : '#000' }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.greenBold}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  centerContent: { paddingHorizontal: 25, alignItems: 'center', paddingBottom: 40 },
  backBtnAction: { marginBottom: 20, alignSelf: 'flex-start', marginTop: 20 },
  greenIconBox: { width: 65, height: 65, backgroundColor: '#2D8C46', borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 25 },
  textWrapper: { marginBottom: 35, alignItems: 'center' },
  titleText: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  subtitleText: { fontSize: 16, color: '#666', marginTop: 5 },
  formContainer: { width: '100%' },
  label: { fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#F3F3F3', padding: 16, borderRadius: 15, fontSize: 14, color: '#000' },
  darkInput: { backgroundColor: '#222', color: '#fff' },
  passwordWrapper: { flexDirection: 'row', backgroundColor: '#F3F3F3', borderRadius: 15, alignItems: 'center', paddingHorizontal: 16 },
  passwordInput: { flex: 1, paddingVertical: 16, fontSize: 14, color: '#000' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 12 },
  greenBold: { color: '#2D8C46', fontWeight: 'bold' },
  primaryBtn: { backgroundColor: '#2D8C46', width: '100%', padding: 18, borderRadius: 25, alignItems: 'center', marginTop: 25 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 25, width: '100%' },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  orText: { marginHorizontal: 15, color: '#999', fontSize: 12, fontWeight: '700' },
  googleBtn: { flexDirection: 'row', width: '100%', padding: 15, borderRadius: 25, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  googleIcon: { width: 20, height: 20 },
  googleBtnText: { fontWeight: '600', color: '#333', marginLeft: 10 },
  footerRow: { flexDirection: 'row', marginTop: 30, justifyContent: 'center' }
});