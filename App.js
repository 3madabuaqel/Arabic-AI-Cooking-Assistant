import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  SafeAreaView, ScrollView, useColorScheme, Alert, Modal, Image, FlatList 
} from 'react-native';
import { 
  Settings, Star, User, Lock, Phone, Globe, Moon, Sun, 
  Monitor, ArrowLeft, ChevronRight, Send, Camera, Mic, 
  Image as ImageIcon, X, ChevronDown, Mail, Eye, EyeOff, 
  Utensils, Bell, LogOut 
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
const allCountries = [
  { name: "Jordan", code: "+962" }, { name: "UAE", code: "+971" }, { name: "Saudi Arabia", code: "+966" },
  { name: "Palestine", code: "+970" }, { name: "Egypt", code: "+20" }, { name: "Syria", code: "+963" },
  { name: "Iraq", code: "+964" }, { name: "Lebanon", code: "+961" }, { name: "Kuwait", code: "+965" },
  { name: "Oman", code: "+968" }, { name: "Qatar", code: "+974" }, { name: "Bahrain", code: "+973" },
  { name: "Yemen", code: "+967" }, { name: "Algeria", code: "+213" }, { name: "Morocco", code: "+212" },
  { name: "Tunisia", code: "+216" }, { name: "Libya", code: "+218" }, { name: "Sudan", code: "+249" },
  { name: "Turkey", code: "+90" }, { name: "USA", code: "+1" }, { name: "Germany", code: "+49" },
  { name: "Sweden", code: "+46" }, { name: "France", code: "+33" }, { name: "Canada", code: "+1" },
  { name: "Switzerland", code: "+41" }
].sort((a, b) => a.name.localeCompare(b.name));

function FavoritesScreen({ navigation, favorites, lang, isDark }) {
  const t = lang === 'ar';
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>{t ? 'المفضلة' : 'Favorites'}</Text>
        <View style={{width: 24}} />
      </View>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, isDark && {backgroundColor: '#1A1A1A'}, {marginBottom: 15}]}>
            {item.image && <Image source={{uri: item.image}} style={styles.messageImage} />}
            <Text style={[styles.messageText, isDark && {color: '#fff'}]}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{alignItems: 'center', marginTop: 50}}>
            <Star size={50} color="#ccc" />
            <Text style={{color: '#888', marginTop: 10}}>{t ? 'قائمة المفضلة فارغة' : 'No favorites yet'}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function ForgotPasswordScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 25, alignItems: 'center'}}>
        <View style={[styles.sparkBox, {width: 70, height: 70, borderRadius: 20, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center'}]}>
          <Mail color="#22C55E" size={35} />
        </View>
        <Text style={[styles.authTitle, isDark && {color: '#fff'}]}>{t ? 'استعادة الحساب' : 'Forgot Password'}</Text>
        <Text style={styles.authSubtitle}>
          {t ? 'أدخل بريدك الإلكتروني وسنرسل لك كود التحقق' : "Enter your email and we'll send you a verification code"}
        </Text>
        
        <View style={{width: '100%', marginTop: 20}}>
          <Text style={[styles.sectionLabel, {marginTop: 0}, isDark && {color: '#ccc'}]}>{t ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}</Text>
          <TextInput 
            style={[styles.input, isDark && styles.darkInput]} 
            placeholder="chef@culinaryatelier.com" 
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity 
          style={[styles.miniBtn, {width: '100%', marginTop: 20, height: 50, justifyContent: 'center'}]}
          onPress={() => navigation.navigate('VerifyOTP')}
        >
          <Text style={styles.btnText}>{t ? 'إرسال الكود' : 'Send Code'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 20}} onPress={() => navigation.goBack()}>
          <Text style={{color: '#888'}}>{t ? 'تذكرت كلمة السر؟ ' : 'Remember your password? '}<Text style={{color: '#22C55E', fontWeight: 'bold'}}>{t ? 'دخول' : 'Log in'}</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function VerifyOTPScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 25, alignItems: 'center'}}>
        <View style={[styles.sparkBox, {width: 70, height: 70, borderRadius: 20, backgroundColor: '#DCFCE7', justifyContent: 'center', alignItems: 'center'}]}>
          <Lock color="#22C55E" size={35} />
        </View>
        <Text style={[styles.authTitle, isDark && {color: '#fff'}]}>{t ? 'كود التحقق' : 'Enter Code'}</Text>
        <Text style={styles.authSubtitle}>
          {t ? 'أدخل الكود المكون من 6 أرقام المرسل إليك' : "We've sent a 6-digit code to your email"}
        </Text>
        
        <View style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 30}}>
          {[1, 2, 3, 4, 5, 6].map((_, i) => (
            <TextInput 
              key={i}
              style={[styles.input, isDark && styles.darkInput, {width: 45, textAlign: 'center', fontSize: 18, fontWeight: 'bold'}]}
              keyboardType="numeric"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.miniBtn, {width: '100%', marginTop: 30, height: 50, justifyContent: 'center'}]}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Text style={styles.btnText}>{t ? 'تحقق' : 'Verify Code'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 20}}>
          <Text style={{color: '#888'}}>{t ? 'لم يصلك الكود؟ ' : "Didn't receive code? "}<Text style={{color: '#22C55E', fontWeight: 'bold'}}>{t ? 'إعادة إرسال' : 'Resend'}</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function ResetPasswordScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 25}}>
        <Text style={[styles.authTitle, isDark && {color: '#fff'}]}>{t ? 'كلمة سر جديدة' : 'New Password'}</Text>
        <Text style={styles.authSubtitle}>{t ? 'يرجى تعيين كلمة سر قوية وجديدة' : 'Please set a strong new password'}</Text>
        
        <View style={{marginTop: 20}}>
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'كلمة السر الجديدة' : 'NEW PASSWORD'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} secureTextEntry placeholder="********" placeholderTextColor="#888" />
          
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'تأكيد كلمة السر' : 'CONFIRM PASSWORD'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} secureTextEntry placeholder="********" placeholderTextColor="#888" />
        </View>

        <TouchableOpacity 
          style={[styles.miniBtn, {width: '100%', marginTop: 20, height: 50, justifyContent: 'center'}]}
          onPress={() => {
            Alert.alert(t ? 'نجاح' : 'Success', t ? 'تم تغيير كلمة السر بنجاح' : 'Password updated');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.btnText}>{t ? 'تغيير كلمة السر' : 'Update Password'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SignUpScreen({ navigation, setUser, lang, isDark }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const t = lang === 'ar';

  const handleSignUp = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert(t ? "خطأ" : "Error", t ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t ? "خطأ" : "Error", t ? "كلمتا السر غير متطابقتين" : "Passwords do not match");
      return;
    }
    setUser({ name: name, password: password, isLoggedIn: true, email: email });
    Alert.alert(t ? "مرحباً بك!" : "Welcome!", t ? "تم إنشاء حسابك بنجاح" : "Account created successfully");
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{paddingHorizontal: 25, paddingBottom: 40}}>
        <Text style={[styles.authTitle, {fontSize: 32, marginBottom: 30}, isDark && {color: '#fff'}]}>
          {t ? 'إنشاء حساب' : 'Create Account'}
        </Text>

        <View>
          <Text style={[styles.sectionLabel, {marginTop: 0}, isDark && {color: '#ccc'}]}>{t ? 'الاسم الكامل' : 'FULL NAME'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "أدخل اسمك" : "John Doe"} placeholderTextColor="#888" onChangeText={setName} />
          
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="chef@culinaryatelier.com" placeholderTextColor="#888" keyboardType="email-address" onChangeText={setEmail} />
          
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'كلمة السر' : 'PASSWORD'}</Text>
          <View style={[styles.input, isDark && styles.darkInput, {flexDirection: 'row', alignItems: 'center'}]}>
            <TextInput style={{flex: 1, color: isDark ? '#fff' : '#000'}} placeholder="********" placeholderTextColor="#888" secureTextEntry={!showPass} onChangeText={setPassword} />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>{showPass ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}</TouchableOpacity>
          </View>

          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'تأكيد كلمة السر' : 'CONFIRM PASSWORD'}</Text>
          <View style={[styles.input, isDark && styles.darkInput, {flexDirection: 'row', alignItems: 'center'}]}>
            <TextInput style={{flex: 1, color: isDark ? '#fff' : '#000'}} placeholder="********" placeholderTextColor="#888" secureTextEntry={!showPass} onChangeText={setConfirmPassword} />
          </View>
        </View>

        <TouchableOpacity style={[styles.miniBtn, {marginTop: 30, height: 55, justifyContent: 'center'}]} onPress={handleSignUp}>
          <Text style={[styles.btnText, {fontSize: 18}]}>{t ? 'إنشاء حساب' : 'Sign Up'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} /><Text style={styles.dividerText}>{t ? 'أو' : 'OR'}</Text><View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialBtn} onPress={() => Alert.alert(t ? "جوجل" : "Google", t ? "تم اختيار جوجل" : "Google Selected")}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'}} style={{width: 20, height: 20, marginRight: 10}} />
          <Text style={[{fontWeight: '600'}, isDark && {color: '#fff'}]}>{t ? 'المتابعة باستخدام جوجل' : 'Continue with Google'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 30, alignSelf: 'center'}} onPress={() => navigation.navigate('Login')}>
          <Text style={{color: '#888'}}>{t ? 'لديك حساب بالفعل؟ ' : 'Already have an account? '}<Text style={{color: '#22C55E', fontWeight: 'bold'}}>{t ? 'سجل دخول' : 'Log in'}</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function LoginScreen({ navigation, setUser, lang, isDark, user }) {
  const t = lang === 'ar';
  const [showPass, setShowPass] = useState(false);

  const handleLogin = (method) => {
    setUser({ ...user, isLoggedIn: true, name: 'Sara', password: user.password || '123456' });
    Alert.alert(t ? "نجاح" : "Success", `${t ? "تم الدخول عبر" : "Logged in via"} ${method}`);
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{padding: 25}}>
        <View style={[styles.sparkBox, {width: 60, height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center'}]}>
          <Utensils color="white" size={30} />
        </View>
        
        <Text style={[styles.authTitle, {textAlign: 'left', marginTop: 15}, isDark && {color: '#fff'}]}>
          {t ?' اهلا' : 'Welcome Back'}
        </Text>
        <Text style={[styles.authSubtitle, {textAlign: 'left'}]}>{t ? 'سجل دخولك للمتابعة' : 'Log in to continue'}</Text>

        <View style={{marginTop: 25}}>
          <Text style={[styles.sectionLabel, {marginTop: 0}, isDark && {color: '#ccc'}]}>{t ? 'البريد الإلكتروني' : 'Email'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="your@email.com" placeholderTextColor="#888" />
          
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'كلمة السر' : 'Password'}</Text>
          <View style={[styles.input, isDark && styles.darkInput, {flexDirection: 'row', alignItems: 'center'}]}>
            <TextInput 
              style={{flex: 1, color: isDark ? '#fff' : '#000'}} 
              placeholder={t ? "أدخل كلمة السر" : "Enter your password"} 
              secureTextEntry={!showPass} 
              placeholderTextColor="#888" 
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={20} color="#888" /> : <Eye size={20} color="#888" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{alignSelf: 'flex-end', marginBottom: 20}}>
          <Text style={{color: '#22C55E', fontWeight: '600'}}>{t ? 'نسيت كلمة السر؟' : 'Forgot Password?'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.miniBtn, {height: 50, justifyContent: 'center'}]} onPress={() => handleLogin('Email')}>
          <Text style={styles.btnText}>{t ? 'دخول' : 'Login'}</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} /><Text style={styles.dividerText}>{t ? 'أو' : 'OR'}</Text><View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.socialBtn} onPress={() => handleLogin('Google')}>
          <Image source={{uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png'}} style={{width: 20, height: 20, marginRight: 10}} />
          <Text style={[{fontWeight: '600'}, isDark && {color: '#fff'}]}>{t ? 'المتابعة باستخدام جوجل' : 'Continue with Google'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{marginTop: 30, alignSelf: 'center'}} onPress={() => navigation.navigate('SignUp')}>
          <Text style={{color: '#888'}}>{t ? 'ليس لديك حساب؟ ' : "Don't have an account? "}<Text style={{color: '#22C55E', fontWeight: 'bold'}}>{t ? 'سجل الآن' : 'Sign Up'}</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function AccountInfoScreen({ navigation, user, setUser, lang, isDark }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null); 
  const t = lang === 'ar';

  const handleUpdate = (type) => {
    if (type === 'pass') {
      if (oldPass !== (user.password || "123456")) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمة السر القديمة غير صحيحة" : "Old password incorrect");
        return;
      }
      if (newPass !== confirmPass) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمتا السر غير متطابقتين" : "Passwords do not match");
        return;
      }
      setUser({ ...user, password: newPass });
    } else if (type === 'phone') {
      setUser({ ...user, fullPhone: `${selectedCountry.code} ${phone}`, country: selectedCountry.name, phone: phone });
    }
    Alert.alert(t ? "تم" : "Success", t ? "تم التحديث بنجاح" : "Updated successfully");
    setExpandedSection(null);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>{t ? 'معلومات الحساب' : 'Account Info'}</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView style={{padding: 20}}>
        <TouchableOpacity style={[styles.menuItem, isDark && {borderBottomColor: '#333'}]} onPress={() => setExpandedSection(expandedSection === 'pass' ? null : 'pass')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Lock color="#22C55E" size={20} /><Text style={[styles.menuText, isDark && {color: '#fff'}]}>{t ? 'إعادة تعيين كلمة السر' : 'Reset Password'}</Text></View>
          {expandedSection === 'pass' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>
        
        {expandedSection === 'pass' && (
          <View style={[styles.expandedContent, isDark && {backgroundColor: '#1A1A1A'}]}>
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "كلمة السر القديمة" : "Old Password"} secureTextEntry onChangeText={setOldPass} placeholderTextColor="#888" />
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "كلمة السر الجديدة" : "New Password"} secureTextEntry onChangeText={setNewPass} placeholderTextColor="#888" />
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "تأكيد كلمة السر الجديدة" : "Confirm New Password"} secureTextEntry onChangeText={setConfirmPass} placeholderTextColor="#888" />
            <TouchableOpacity style={styles.miniBtn} onPress={() => handleUpdate('pass')}><Text style={styles.btnText}>{t ? 'حفظ كلمة السر' : 'Save Password'}</Text></TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={[styles.menuItem, isDark && {borderBottomColor: '#333'}]} onPress={() => setExpandedSection(expandedSection === 'phone' ? null : 'phone')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Phone color="#22C55E" size={20} /><Text style={[styles.menuText, isDark && {color: '#fff'}]}>{t ? 'إضافة رقم هاتف للحماية' : 'Add Recovery Phone'}</Text></View>
          {expandedSection === 'phone' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>

        {expandedSection === 'phone' && (
          <View style={[styles.expandedContent, isDark && {backgroundColor: '#1A1A1A'}]}>
            <TouchableOpacity style={[styles.input, isDark && styles.darkInput, {flexDirection: 'row', justifyContent: 'space-between'}]} onPress={() => setShowCountryPicker(!showCountryPicker)}>
              <Text style={{color: isDark ? '#fff' : '#000'}}>{selectedCountry.name}</Text><ChevronDown color="#22C55E" size={18} />
            </TouchableOpacity>
            {showCountryPicker && (
              <View style={[styles.pickerBox, isDark && {backgroundColor: '#222'}]}>
                <ScrollView nestedScrollEnabled={true} style={{maxHeight: 150}}>{allCountries.map(c => (
                  <TouchableOpacity key={c.name} style={styles.pickerItem} onPress={() => {setSelectedCountry(c); setShowCountryPicker(false)}}><Text style={{color: isDark ? '#fff' : '#000'}}>{c.name} ({c.code})</Text></TouchableOpacity>
                ))}</ScrollView>
              </View>
            )}
            <View style={{flexDirection: 'row'}}><View style={[styles.input, isDark && styles.darkInput, {width: 80, marginRight: 10, justifyContent: 'center', alignItems: 'center'}]}><Text style={{color: '#22C55E', fontWeight: 'bold'}}>{selectedCountry.code}</Text></View>
            <TextInput style={[styles.input, isDark && styles.darkInput, {flex: 1}]} placeholder="7XXXXXXXX" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholderTextColor="#888" /></View>
            <TouchableOpacity style={styles.miniBtn} onPress={() => handleUpdate('phone')}><Text style={styles.btnText}>{t ? 'حفظ الرقم' : 'Save Number'}</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsScreen({ navigation, lang, setLang, themeMode, setThemeMode, isDark, user, setUser }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const t = lang === 'ar';

  const handlePickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t ? "عذراً" : "Sorry", t ? "نحتاج إذن الوصول للصور لتغيير الصورة" : "We need permissions to change the photo");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setUser({ ...user, profileImage: result.assets[0].uri });
    }
  };


  const executeFinalLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleLogout = () => {
    Alert.alert(
      t ? "تسجيل الخروج" : "Logout",
      t ? "هل بدك تسجل خروج فعلاً؟" : "Do you really want to log out?",
      [
        { text: t ? "إلغاء" : "Cancel", style: "cancel" },
        { 
          text: t ? "نعم" : "Yes", 
          onPress: () => {
            Alert.alert(
              t ? "حفظ البيانات" : "Save Info",
              t ? "هل بدك تحفظ معلومات حسابك؟" : "Do you want to save your info?",
              [
                { text: t ? "لا" : "No", onPress: () => executeFinalLogout() },
                { 
                  text: t ? "نعم، احفظها" : "Yes, Save", 
                  onPress: () => {
                    Alert.alert(t ? "تم الحفظ" : "Saved");
                    executeFinalLogout();
                  } 
                }
              ]
            );
          }
        }
      ]
    );
  };
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>
          {t ? 'الإعدادات' : 'Settings'}
        </Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView style={{padding: 20}}>
       {}
        {user?.isLoggedIn && (
          <View style={{alignItems: 'center', marginBottom: 25}}>
            <TouchableOpacity onPress={handlePickProfileImage}>
              <View style={styles.profileImageContainer}>
                {user.profileImage ? (
                  <Image 
               
                    key={user.profileImage} 
                    source={{uri: user.profileImage}} 
                    style={styles.profileLargeImage} 
                  />
                ) : (
                  <View style={[styles.avatarPlaceholder, {backgroundColor: '#22C55E'}]}>
                    <User color="white" size={40} />
                  </View>
                )}
                <View style={styles.cameraIconBadge}>
                  <Camera color="white" size={14} />
                </View>
              </View>
            </TouchableOpacity>
            <Text style={[styles.menuText, {marginTop: 10, fontSize: 18, fontWeight: 'bold'}, isDark && {color: '#fff'}]}>
              {user.name}
            </Text>
          </View>
        )}

        {}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AccountInfo')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <User color="#22C55E" size={22} />
            <Text style={[styles.menuText, isDark && {color: '#fff'}]}>{t ? 'معلومات الحساب' : 'Account Info'}</Text>
          </View>
          <ChevronRight color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Bell color="#22C55E" size={22} />
            <Text style={[styles.menuText, isDark && {color: '#fff'}]}>{t ? 'الإشعارات' : 'Notifications'}</Text>
          </View>
          <Text style={{color: notificationsEnabled ? '#22C55E' : '#888'}}>{notificationsEnabled ? (t ? 'مفعلة' : 'On') : (t ? 'معطلة' : 'Off')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Globe color="#22C55E" size={22} />
            <Text style={[styles.menuText, isDark && {color: '#fff'}]}>{t ? 'اللغة' : 'Language'}</Text>
          </View>
          <Text style={{color: '#22C55E'}}>{lang === 'en' ? 'English' : 'العربية'}</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>{t ? 'المظهر' : 'Theme'}</Text>
        <View style={styles.themeRow}>
          {['light', 'dark', 'system'].map(m => (
            <TouchableOpacity 
              key={m} 
              style={[styles.themeBtn, themeMode === m && {backgroundColor: '#22C55E'}]} 
              onPress={() => setThemeMode(m)}
            >
              <Text style={{color: themeMode === m ? '#fff' : '#888'}}>{m}</Text>
            </TouchableOpacity>
          ))}
        </View>

 {/* زر تسجيل الخروج - نسخة الطوارئ */}
        <View style={{ marginTop: 30, marginBottom: 80 }}>
        <TouchableOpacity 
  onPress={handleLogout} 
  style={{
    flexDirection: t ? 'row-reverse' : 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF5F5',
    borderRadius: 12,
    marginTop: 20,
    zIndex: 1000, 
    elevation: 5,
    borderWidth: 1,
    borderColor: '#FFEBEB'
  }}
>
  <View style={{ backgroundColor: '#FF3B30', padding: 8, borderRadius: 10 }}>
    <LogOut color="white" size={22} />
  </View>
  
  <Text style={{ 
    flex: 1, 
    marginHorizontal: 15, 
    color: '#FF3B30', 
    fontWeight: 'bold',
    textAlign: t ? 'right' : 'left' 
  }}>
    {t ? "تسجيل الخروج" : "Log Out"}
  </Text>
</TouchableOpacity>
        </View>
      </ScrollView> 
    </SafeAreaView>
  );
}

function HomeScreen({ navigation, lang, isDark, user, messages, setMessages }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [inputText, setInputText] = useState('');
  const t = lang === 'ar';

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return Alert.alert('Camera permission denied');
    let result = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3], quality: 1 });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const toggleVoice = () => {
    if (!isRecording) { setIsRecording(true); } 
    else { setIsRecording(false); Alert.alert(lang === 'ar' ? "تم الإرسال" : "Sent", lang === 'ar' ? "جاري المعالجة..." : "Processing..."); }
  };

  const handleSend = () => {
    if (inputText.trim() === '' && !selectedImage) return;
    
    const foodKeywords = ['أكل', 'وصفة', 'طبخ', 'جوعان', 'مطعم', 'recipe', 'food', 'cook', 'hungry', 'eat'];
    const isFoodOrder = foodKeywords.some(keyword => inputText.toLowerCase().includes(keyword));

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      image: selectedImage,
      isRecipe: isFoodOrder,
      isFavorite: false
    };

    setMessages([newMessage, ...messages]);
    setInputText('');
    setSelectedImage(null);
  };

  const toggleFavorite = (id) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === id) {
        const newState = !msg.isFavorite;
        if(newState) Alert.alert(t ? "تم الإضافة" : "Added", t ? "تمت الإضافة للمفضلة" : "Added to favorites");
        return { ...msg, isFavorite: newState };
      }
      return msg;
    }));
  };

  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.loginBadge} onPress={() => !user.isLoggedIn && navigation.navigate('Login')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {user?.isLoggedIn && user.profileImage ? (
              <Image source={{uri: user.profileImage}} style={styles.miniAvatar} />
            ) : null}
            <Text style={styles.loginText}>{user?.isLoggedIn ? user.name : 'Login'}</Text>
          </View>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>Cook with AI</Text>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Star color="#15803D" size={24} style={{marginHorizontal: 12}} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Settings color="#15803D" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={[styles.messageBubble, isDark && {backgroundColor: '#1A1A1A'}, {marginBottom: 10}]}>
            {item.image && <Image source={{uri: item.image}} style={styles.messageImage} />}
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Text style={[styles.messageText, isDark && {color: '#fff'}, {flex: 1}]}>{item.text}</Text>
                {item.isRecipe && (
                  <TouchableOpacity onPress={() => toggleFavorite(item.id)} style={{marginLeft: 10}}>
                    <Star size={22} color={item.isFavorite ? "#FFD700" : "#888"} fill={item.isFavorite ? "#FFD700" : "transparent"} />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={[styles.mainContent, { transform: [{ scaleY: -1 }] }]}>
            <View style={styles.sparkBox}><Star color="white" fill="white" size={32} /></View>
            <Text style={[styles.welcomeText, isDark && {color: '#fff'}]}>
              {t ? 'مرحباً! أنا مساعدك الذكي، ماذا تود أن تطبخ اليوم؟' : "Welcome! I am your smart assistant. What would you like to cook today?"}
            </Text>
          </View>
        )}
      />

      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image source={{uri: selectedImage}} style={styles.imagePreview} />
          <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedImage(null)}><X color="white" size={16} /></TouchableOpacity>
        </View>
      )}

      <View style={[styles.inputContainer, isDark && {backgroundColor: '#1A1A1A', borderTopColor: '#333'}]}>
        <TouchableOpacity style={styles.iconBtn} onPress={takePhoto}><Camera color="#15803D" /></TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={pickImage}><ImageIcon color="#15803D" /></TouchableOpacity>
        <TextInput 
          style={[styles.chatInput, isDark && {color: '#fff'}]} 
          placeholder={t ? "اكتب هنا..." : "Type here..."} 
          placeholderTextColor="#888" 
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.iconBtn} onPress={toggleVoice}><Mic color={isRecording ? "#EF4444" : "#15803D"} /></TouchableOpacity>
        <TouchableOpacity style={[styles.sendBtn, {backgroundColor: (inputText || selectedImage) ? '#22C55E' : '#E5E7EB'}]} onPress={handleSend}>
          <Send color="white" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [lang, setLang] = useState('ar');
  const [themeMode, setThemeMode] = useState('system');
  const [user, setUser] = useState({ name: 'User', isLoggedIn: false, profileImage: null });
  const [messages, setMessages] = useState([]);
  
  const systemTheme = useColorScheme();
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemTheme === 'dark');

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} lang={lang} isDark={isDark} user={user} messages={messages} setMessages={setMessages} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => <LoginScreen {...props} setUser={setUser} user={user} lang={lang} isDark={isDark} />}
        </Stack.Screen>
        <Stack.Screen name="SignUp">
          {(props) => <SignUpScreen {...props} setUser={setUser} lang={lang} isDark={isDark} />}
        </Stack.Screen>
        <Stack.Screen name="ForgotPassword">
          {(props) => <ForgotPasswordScreen {...props} lang={lang} isDark={isDark} />}
        </Stack.Screen>
        <Stack.Screen name="VerifyOTP">
          {(props) => <VerifyOTPScreen {...props} lang={lang} isDark={isDark} />}
        </Stack.Screen>
        <Stack.Screen name="ResetPassword">
          {(props) => <ResetPasswordScreen {...props} lang={lang} isDark={isDark} />}
        </Stack.Screen>
        <Stack.Screen name="Favorites">
          {(props) => <FavoritesScreen {...props} favorites={messages.filter(m => m.isFavorite)} lang={lang} isDark={isDark} />}
        </Stack.Screen>
       <Stack.Screen name="Settings">
  {(props) => (
    <SettingsScreen 
      {...props} 
      lang={lang} 
      setLang={setLang} 
      themeMode={themeMode} 
      setThemeMode={setThemeMode} 
      isDark={isDark} 
      user={user} 
      setUser={setUser} 
    />
  )}
</Stack.Screen>
        <Stack.Screen name="AccountInfo">
          {(props) => <AccountInfoScreen {...props} user={user} setUser={setUser} lang={lang} isDark={isDark} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#15803D' },
  loginBadge: { backgroundColor: '#DCFCE7', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  loginText: { color: '#15803D', fontWeight: '600' },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  mainContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  sparkBox: { backgroundColor: '#22C55E', padding: 15, borderRadius: 20, marginBottom: 20 },
  welcomeText: { textAlign: 'center', fontSize: 18, color: '#374151', lineHeight: 28 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  chatInput: { flex: 1, height: 45, backgroundColor: '#F3F4F6', borderRadius: 22, paddingHorizontal: 15, marginHorizontal: 8 },
  iconBtn: { padding: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  messageBubble: { backgroundColor: '#fff', padding: 15, borderRadius: 20, maxWidth: '90%', alignSelf: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  messageText: { fontSize: 16, color: '#333' },
  messageImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 10 },
  imagePreviewContainer: { position: 'absolute', bottom: 70, left: 20, right: 20, height: 100, borderRadius: 15, overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.1)' },
  imagePreview: { width: '100%', height: '100%' },
  closeBtn: { position: 'absolute', top: 5, right: 5, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, padding: 4 },
  authTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#111827' },
  authSubtitle: { fontSize: 16, color: '#6B7280', marginBottom: 30, textAlign: 'center' },
  input: { height: 50, backgroundColor: '#F3F4F6', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15 },
  darkInput: { backgroundColor: '#262626', color: '#fff' },
  miniBtn: { backgroundColor: '#22C55E', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#9CA3AF', marginBottom: 10, marginTop: 25, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  menuText: { fontSize: 16, marginLeft: 15, color: '#374151' },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  themeBtn: { flex: 1, padding: 12, alignItems: 'center', backgroundColor: '#F3F4F6', marginHorizontal: 5, borderRadius: 10 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E5E7EB' },
  dividerText: { marginHorizontal: 10, color: '#9CA3AF' },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  pickerBox: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 15, padding: 10, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2 },
  pickerItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  expandedContent: { padding: 15, borderRadius: 12, backgroundColor: '#F9FAFB', marginBottom: 10 },
  profileImageContainer: { position: 'relative' },
  profileLargeImage: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
  cameraIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#22C55E', width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c', 
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
});

