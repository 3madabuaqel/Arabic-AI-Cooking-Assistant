import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  StyleSheet
} from 'react-native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';

export default function SignUpScreen({ navigation, setUser, lang, isDark }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const t = lang === 'ar';

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSignUp = () => {
    // التأكد من تعبئة كل الحقول
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(
        t ? "خطأ" : "Error",
        t ? "يرجى ملء جميع الحقول" : "Please fill all fields"
      );
      return;
    }

    // التأكد من الإيميل
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert(
        t ? "خطأ" : "Error",
        t ? "البريد الإلكتروني غير صحيح" : "Invalid email"
      );
      return;
    }

    // التأكد من قوة كلمة السر
    if (!isStrongPassword(password)) {
      Alert.alert(
        t ? "كلمة سر ضعيفة" : "Weak Password",
        t
          ? "يجب أن تحتوي على 8 أحرف، حرف كبير، حرف صغير، رقم، ورمز خاص"
          : "Password must have 8 characters, uppercase, lowercase, number, and special character"
      );
      return;
    }

    // التأكد من تطابق كلمة السر
    if (password !== confirmPassword) {
      Alert.alert(
        t ? "خطأ" : "Error",
        t ? "كلمتا السر غير متطابقتين" : "Passwords do not match"
      );
      return;
    }

    // حفظ بيانات المستخدم في الـ State العامة للتطبيق
    setUser({
      name,
      email,
      password,
      isLoggedIn: true,
    });

    // الانتقال مباشرة إلى شاشة الشات
    navigation.replace('Chat');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} size={24} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <Text style={[styles.authTitle, isDark && { color: '#fff' }]}>
          {t ? 'إنشاء حساب' : 'Create Account'}
        </Text>

        {/* Input Form */}
        <View style={{ width: '100%' }}>
          {/* حقل الاسم */}
          <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>
            {t ? 'الاسم الكامل' : 'FULL NAME'}
          </Text>
          <TextInput 
            style={[styles.input, isDark && styles.darkInput]} 
            placeholder={t ? "أدخل اسمك الكامل" : "Your full name"} 
            placeholderTextColor="#888" 
            onChangeText={setName} 
          />
          
          {/* حقل البريد الإلكتروني */}
          <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>
            {t ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
          </Text>
          <TextInput 
            style={[styles.input, isDark && styles.darkInput]} 
            placeholder="name@email.com" 
            placeholderTextColor="#888" 
            keyboardType="email-address" 
            autoCapitalize="none"
            onChangeText={setEmail} 
          />
          
          {/* حقل كلمة السر */}
          <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>
            {t ? 'كلمة السر' : 'PASSWORD'}
          </Text>
          <View style={[styles.inputContainer, isDark && styles.darkInput]}>
            <TextInput 
              style={[styles.flexInput, { color: isDark ? '#fff' : '#000' }]} 
              placeholder="********" 
              placeholderTextColor="#888" 
              secureTextEntry={!showPass} 
              autoCapitalize="none"
              onChangeText={setPassword} 
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
            </TouchableOpacity>
          </View>

          {/* حقل تأكيد كلمة السر */}
          <Text style={[styles.sectionLabel, isDark && { color: '#ccc' }]}>
            {t ? 'تأكيد كلمة السر' : 'CONFIRM PASSWORD'}
          </Text>
          <View style={[styles.inputContainer, isDark && styles.darkInput]}>
            <TextInput 
              style={[styles.flexInput, { color: isDark ? '#fff' : '#000' }]} 
              placeholder="********" 
              placeholderTextColor="#888" 
              secureTextEntry={!showPass} 
              autoCapitalize="none"
              onChangeText={setConfirmPassword} 
            />
          </View>
        </View>

        {/* زر إنشاء الحساب */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSignUp}
          style={styles.signUpBtn}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
            {t ? 'إنشاء حساب' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        {/* الفاصل الخطي (OR) */}
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
          <Text style={styles.dividerText}>{t ? 'أو' : 'OR'}</Text>
          <View style={[styles.dividerLine, isDark && { backgroundColor: '#333' }]} />
        </View>

        {/* زر جوجل */}
        <TouchableOpacity 
          style={[styles.socialBtn, isDark && { backgroundColor: '#1E1E1E', borderColor: '#333' }]} 
          onPress={() => Alert.alert(t ? "جوجل" : "Google", t ? "تم اختيار جوجل" : "Google Selected")}
        >
          <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} style={styles.googleIcon} />
          <Text style={[styles.socialBtnText, isDark && { color: '#fff' }]}>
            {t ? 'المتابعة باستخدام جوجل' : 'Continue with Google'}
          </Text>
        </TouchableOpacity>

        {/* التبديل لشاشة تسجيل الدخول */}
        <TouchableOpacity style={styles.loginFooter} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerText}>
            {t ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}
            <Text style={styles.footerLink}>
              {t ? 'سجل دخولك' : 'Log in'}
            </Text>
          </Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    alignSelf: 'flex-start',
    marginBottom: 30,
    marginTop: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    marginTop: 18,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F3F4F6',
    height: 55,
    borderRadius: 20,
    paddingHorizontal: 20,
    color: '#000',
    fontSize: 15,
  },
  inputContainer: {
    backgroundColor: '#F3F4F6',
    height: 55,
    borderRadius: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexInput: {
    flex: 1,
    fontSize: 15,
    height: '100%',
  },
  darkInput: {
    backgroundColor: '#1E1E1E',
    color: '#fff',
  },
  signUpBtn: {
    backgroundColor: '#2D8C46',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    width: '100%',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAEAEA',
  },
  dividerText: {
    marginHorizontal: 15,
    color: '#888',
    fontSize: 14,
    fontWeight: '500',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#fff',
    height: 55,
    borderRadius: 30,
    width: '100%',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialBtnText: {
    fontWeight: '600',
    color: '#1A1A1A',
    fontSize: 15,
  },
  loginFooter: {
    marginTop: 30,
    alignSelf: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 14,
  },
  footerLink: {
    color: '#2D8C46',
    fontWeight: 'bold',
  },
});