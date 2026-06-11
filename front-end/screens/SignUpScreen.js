import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff, Smartphone, Mail, User } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '149721092255-bd5691qkq9cuvklaefo1pk2ea7gu70en.apps.googleusercontent.com',
});

export default function SignUpScreen({ navigation, setUser, lang, isDark }) {
  const t = lang === 'ar';
  const [showPass, setShowPass] = useState(false);
  const [authMode, setAuthMode] = useState('email'); // 'email' أو 'phone'

  // Email fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Phone fields
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken || userInfo.idToken;
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);

      setUser({
        name: userCredential.user.displayName || userCredential.user.email,
        email: userCredential.user.email,
        phone: userCredential.user.phoneNumber || '',
        isLoggedIn: true,
      });

      navigation.replace('Chat');
    } catch (error) {
      console.error('Google Sign-Up Error:', error);
      Alert.alert('Google Sign-Up Error', `${error.code || 'UNKNOWN_ERROR'}: ${error.message}`);
    }
  };

  const handleSignUpInit = async () => {
    if (!name || !password || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (authMode === 'email' && !email) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني'); return;
    }
    if (authMode === 'phone' && !phone) {
      Alert.alert('خطأ', 'يرجى إدخال رقم الهاتف'); return;
    }
    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمتا السر غير متطابقتين');
      return;
    }

    if (authMode === 'email') {
      // Normal email registration
      setLoading(true);
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email.trim(), password);
        await userCredential.user.updateProfile({ displayName: name });
        setUser({ name, email: email.trim(), phone: '', isLoggedIn: true });
        navigation.replace('Chat');
      } catch (error) {
        Alert.alert('خطأ', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Send verification code to phone number
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith('+')) {
        Alert.alert('تنبيه', 'يرجى إدخال الهاتف مع الرمز الدولي (مثال +962)');
        return;
      }
      setLoading(true);
      try {
        const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
        setConfirm(confirmation);
        setOtpModalVisible(true);
      } catch (error) {
        Alert.alert('خطأ في الإرسال', error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('خطأ', 'يرجى إدخال الرمز المكون من 6 أرقام'); return;
    }
    setLoading(true);
    try {
      // Confirm phone login
      const userCredential = await confirm.confirm(otp);

      // The user is now logged in via phone, we will link it to a dummy email and password so they can log in with them later
      let fakeEmail = phone.replace(/\+/g, '') + '@arabicai.com';
      const credential = auth.EmailAuthProvider.credential(fakeEmail, password);

      try {
        await userCredential.user.linkWithCredential(credential);
      } catch (linkError) {
        // If the dummy email is used, or account exists
        console.log('Link error (already linked?)', linkError);
      }

      await userCredential.user.updateProfile({ displayName: name });

      setOtpModalVisible(false);
      setUser({
        name,
        email: fakeEmail,
        phone: userCredential.user.phoneNumber,
        isLoggedIn: true,
      });
      navigation.replace('Chat');
    } catch (error) {
      Alert.alert('خطأ', 'رمز التحقق غير صحيح أو منتهي الصلاحية');
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

        {authMode === 'phone' ? (
          <>
            <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>PHONE NUMBER</Text>
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="+962 7X XXX XXXX" keyboardType="phone-pad" onChangeText={setPhone} />
          </>
        ) : (
          <>
            <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>EMAIL ADDRESS</Text>
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="example@email.com" keyboardType="email-address" autoCapitalize="none" onChangeText={setEmail} />
          </>
        )}

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

        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignUpInit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>{authMode === 'phone' ? 'Verify & Sign Up' : 'Sign Up'}</Text>}
        </TouchableOpacity>

        <View style={styles.switchContainer}>
          {authMode === 'phone' ? (
            <TouchableOpacity style={[styles.switchBtn, isDark && { borderColor: '#333' }]} onPress={() => setAuthMode('email')}>
              <Mail size={18} color={isDark ? '#fff' : '#333'} />
              <Text style={[styles.switchText, isDark && { color: '#fff' }]}>Use Email Instead</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.switchBtn, isDark && { borderColor: '#333' }]} onPress={() => setAuthMode('phone')}>
              <Smartphone size={18} color={isDark ? '#fff' : '#333'} />
              <Text style={[styles.switchText, isDark && { color: '#fff' }]}>Use Phone Instead</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
        </View>

        <TouchableOpacity style={[styles.socialBtn, isDark && { backgroundColor: '#1E1E1E', borderColor: '#333' }]} onPress={signInWithGoogle}>
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.googleIcon} />
          <Text style={[styles.socialBtnText, isDark && { color: '#fff' }]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* زر الدخول كضيف */}
        <TouchableOpacity
          style={[styles.socialBtn, { marginTop: 15 }, isDark && { backgroundColor: '#1E1E1E', borderColor: '#333' }]}
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
          <Text style={[styles.socialBtnText, isDark && { color: '#fff' }]}>Continue as Guest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginFooter} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Log in</Text></Text>
        </TouchableOpacity>
      </ScrollView>

      {/* مودال تأكيد الـ OTP */}
      <Modal visible={isOtpModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Text style={[styles.modalTitle, isDark && { color: '#fff' }]}>أدخل رمز التحقق</Text>
            <Text style={styles.modalSub}>أرسلنا رمزاً مكوناً من 6 أرقام إلى {phone}</Text>

            <TextInput
              style={[styles.otpInput, isDark && styles.darkInput]}
              placeholder="123456"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.signUpBtn} onPress={handleVerifyOTP} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>تأكيد الكود</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setOtpModalVisible(false)}>
              <Text style={styles.cancelText}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 25, paddingBottom: 40, alignItems: 'center' },
  authTitle: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', alignSelf: 'flex-start', marginBottom: 20, marginTop: 10 },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: '#333', marginBottom: 8, marginTop: 15, letterSpacing: 0.5, alignSelf: 'flex-start' },
  input: { backgroundColor: '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, color: '#000', fontSize: 15, width: '100%' },
  inputContainer: { backgroundColor: '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', width: '100%' },
  flexInput: { flex: 1, fontSize: 15, height: '100%' },
  darkInput: { backgroundColor: '#1E1E1E', color: '#fff' },
  signUpBtn: { backgroundColor: '#2D8C46', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginTop: 25, width: '100%' },
  switchContainer: { marginTop: 15, width: '100%' },
  switchBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 1, borderColor: '#EEE', borderRadius: 25 },
  switchText: { marginLeft: 10, fontSize: 14, fontWeight: '600', color: '#333' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '100%' },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#EAEAEA' },
  dividerText: { marginHorizontal: 15, color: '#888', fontSize: 14, fontWeight: '500' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EAEAEA', backgroundColor: '#fff', height: 55, borderRadius: 30, width: '100%' },
  googleIcon: { width: 20, height: 20, marginRight: 10 },
  socialBtnText: { fontWeight: '600', color: '#1A1A1A', fontSize: 15 },
  loginFooter: { marginTop: 25, alignSelf: 'center' },
  footerText: { color: '#888', fontSize: 14 },
  footerLink: { color: '#2D8C46', fontWeight: 'bold' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', padding: 25, borderRadius: 25, alignItems: 'center', width: '90%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  modalSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  otpInput: { backgroundColor: '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, color: '#000', fontSize: 20, width: '100%', textAlign: 'center', letterSpacing: 5 },
  cancelBtn: { marginTop: 15, padding: 10 },
  cancelText: { color: '#888', fontSize: 14, fontWeight: 'bold' }
});