
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  FlatList
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Star,
  Settings,
  Camera,
  Mic,
  ArrowUp,
  RefreshCw,
  LogOut,
  Bell,
  Moon,
  Eye,
  EyeOff,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Lock,
  LockKeyhole,
  Phone,
  Globe,
  User,
  Utensils
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
const Stack = createNativeStackNavigator();
const { width } = Dimensions.get('window');

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
]

function LoginScreen({ navigation, setUser, lang, isDark, user }) {
  const t = lang === 'ar';
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = (method) => {
    setUser({ ...user, isLoggedIn: true, name: 'Sara', password: user.password || '123456' });
    Alert.alert(t ? "نجاح" : "Success", `${t ? "تم الدخول عبر" : "Logged in via"} ${method}`);
navigation.replace('Chat');  };
return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.centerContent}>
        
        {/* زر الرجوع */}
        <TouchableOpacity style={styles.backBtnAction} onPress={() => navigation.goBack()}>
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>

        {/* المربع الأخضر مع الأيقونة */}
        <View style={styles.greenIconBox}>
          <Utensils color="white" size={32} />
        </View>

        {/* النصوص الترحيبية */}
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>Welcome Back</Text>
          <Text style={styles.subtitleText}>Log in to continue</Text>
        </View>

        {/* حقول الإدخال */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="your@email.com" 
            placeholderTextColor="#999"
          />

          <Text style={[styles.label, { marginTop: 20 }]}>Password</Text>
          <View style={styles.passwordWrapper}>
           <TextInput 
  style={styles.passwordInput} 
  placeholder="Enter your password" 
  secureTextEntry={!showPass}
  placeholderTextColor="#999"
  value={password}
  onChangeText={setPassword}
/>
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Eye color="#999" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.forgotBtn} 
            onPress={() => {
              console.log("Navigating to ForgotPass..."); // سيظهر لكِ في الـ Terminal عند الضغط
              navigation.navigate('ForgotPass');
            }}
          >
            <Text style={styles.greenBold}>Forgot Password?</Text>
          </TouchableOpacity>

   <TouchableOpacity
  style={styles.primaryBtn}
  onPress={() => {

    if (!password) {
      Alert.alert("Error", "Enter password");
      return;
    }
setUser({
  ...user,
  isLoggedIn: true,
});
    navigation.replace('Chat');
  }}
>
  <Text style={styles.primaryBtnText}>Login</Text>
</TouchableOpacity>
        </View>

        {/* فاصل OR */}
        <View style={styles.orDivider}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        {/* زر جوجل */}
        <TouchableOpacity style={styles.googleBtn}   onPress={() => navigation.replace('Chat')}
>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }} 
            style={styles.googleIcon} 
          />
          <Text style={styles.googleBtnText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.footerRow}>
  <Text>Don't have an account? </Text>
  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
    <Text style={styles.greenBold}>Sign Up</Text>
  </TouchableOpacity>

</View>

      </ScrollView>
    </SafeAreaView>
  );
};
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

    if (oldPass !== user.password) {
      Alert.alert("Error", "Old password incorrect");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setUser(prevUser => ({
      ...prevUser,
      password: newPass,
    }));

    Alert.alert("Success", "Password changed successfully");

    navigation.navigate('Chat');

    setOldPass('');
    setNewPass('');
    setConfirmPass('');
  }
};
  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>{t ? 'معلومات الحساب' : 'Account Info'}</Text>
        <View style={{width: 24}} />
      </View>
      <ScrollView style={{padding: 20}}>
        <TouchableOpacity style={styles.menuRow} onPress={() => setExpandedSection(expandedSection === 'pass' ? null : 'pass')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Lock color="#2D8C46" size={20} /><Text style={[styles.menuLabel, {marginLeft: 10}, isDark && {color: '#fff'}]}>{t ? 'إعادة تعيين كلمة السر' : 'Reset Password'}</Text></View>
          {expandedSection === 'pass' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>
       
        {expandedSection === 'pass' && (
          <View style={{padding: 10, backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9', borderRadius: 15, marginBottom: 10}}>
            <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "كلمة السر القديمة" : "Old Password"} secureTextEntry onChangeText={setOldPass} placeholderTextColor="#888" />
            <TextInput style={[styles.input, isDark && styles.darkInput, {marginTop: 10}]} placeholder={t ? "كلمة السر الجديدة" : "New Password"} secureTextEntry onChangeText={setNewPass} placeholderTextColor="#888" />
            <TextInput style={[styles.input, isDark && styles.darkInput, {marginTop: 10}]} placeholder={t ? "تأكيد كلمة السر الجديدة" : "Confirm New Password"} secureTextEntry onChangeText={setConfirmPass} placeholderTextColor="#888" />
<TouchableOpacity
  style={styles.primaryBtn}
  onPress={() => {

    if (oldPass !== user.password) {
      Alert.alert("Error", "Old password incorrect");
      return;
    }

    if (newPass !== confirmPass) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setUser(prev => ({
      ...prev,
      password: newPass,
    }));

    Alert.alert(
      "Success",
      "Password changed successfully",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.replace('Chat');
          },
        },
      ]
    );
  }}
>
  <Text style={styles.primaryBtnText}>
    Save Password
  </Text>
</TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.menuRow} onPress={() => setExpandedSection(expandedSection === 'phone' ? null : 'phone')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Phone color="#2D8C46" size={20} /><Text style={[styles.menuLabel, {marginLeft: 10}, isDark && {color: '#fff'}]}>{t ? 'إضافة رقم هاتف للحماية' : 'Add Recovery Phone'}</Text></View>
          {expandedSection === 'phone' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>

        {expandedSection === 'phone' && (
          <View style={{padding: 10, backgroundColor: isDark ? '#1A1A1A' : '#F9F9F9', borderRadius: 15}}>
            <TouchableOpacity style={[styles.input, isDark && styles.darkInput, {flexDirection: 'row', justifyContent: 'space-between'}]} onPress={() => setShowCountryPicker(!showCountryPicker)}>
              <Text style={{color: isDark ? '#fff' : '#000'}}>{selectedCountry.name}</Text><ChevronDown color="#2D8C46" size={18} />
            </TouchableOpacity>
            {showCountryPicker && (
              <View style={{backgroundColor: isDark ? '#222' : '#EEE', borderRadius: 10, marginVertical: 5}}>
                {allCountries.map(c => (
                  <TouchableOpacity key={c.name} style={{padding: 12}} onPress={() => {setSelectedCountry(c); setShowCountryPicker(false)}}>
                    <Text style={{color: isDark ? '#fff' : '#000'}}>{c.name} ({c.code})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={[styles.input, isDark && styles.darkInput, {width: 80, marginRight: 10, justifyContent: 'center', alignItems: 'center'}]}>
                <Text style={{color: '#2D8C46', fontWeight: 'bold'}}>{selectedCountry.code}</Text>
              </View>
              <TextInput style={[styles.input, isDark && styles.darkInput, {flex: 1}]} placeholder="7XXXXXXXX" keyboardType="phone-pad" value={phone} onChangeText={setPhone} placeholderTextColor="#888" />
            </View>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => handleUpdate('phone')}><Text style={styles.primaryBtnText}>{t ? 'حفظ الرقم' : 'Save Number'}</Text></TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ForgotPassScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';

  
return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#F5F7F6' }}>
      {/* ScrollView مع ستايل يخلي كل شي بالمنتصف */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        
        {/* الحاوية البيضاء (البطاقة) - هي اللي بتعمل الشكل المطلوب */}
        <View style={{
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          width: '100%',
          maxWidth: 400, // هذا السطر هو اللي بيمنع العناصر تفرش عرضي في المتصفح
          borderRadius: 35, // حواف دائرية كبيرة زي الصورة
          padding: 30,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        }}>

          {/* زر الرجوع */}
          <TouchableOpacity 
            style={{ alignSelf: 'flex-start', marginBottom: 20 }} 
            onPress={() => navigation.goBack()}
          >
            <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#EBF4ED', justifyContent: 'center', alignItems: 'center' }}>
              <ArrowLeft color="#2D8C46" size={24} />
            </View>
          </TouchableOpacity>

          {/* الأيقونة المركزية (المربع الأخضر الفاتح) */}
          <View style={{ alignSelf: 'center', width: 80, height: 80, backgroundColor: '#E1F0E6', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
             <LockKeyhole color="#2D8C46" size={35} />
          </View>

          {/* العنوان */}
          <Text style={{ fontSize: 28, fontWeight: '800', color: isDark ? '#fff' : '#1A1A1A', textAlign: 'center', marginBottom: 35 }}>
            {t ? 'نسيت كلمة السر' : 'Forgot Password'}
          </Text>

          {/* حقل الإيميل وزر الإرسال */}
          <View style={{ width: '100%' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#ccc' : '#333', marginBottom: 8, letterSpacing: 1 }}>
              {t ? 'عنوان البريد الإلكتروني' : 'EMAIL ADDRESS'}
            </Text>
            <TextInput 
              style={{ backgroundColor: isDark ? '#333' : '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, color: isDark ? '#fff' : '#000', marginBottom: 25 }} 
              placeholder="your@email.com" 
              placeholderTextColor="#BBB" 
            />

            <TouchableOpacity 
              style={{ backgroundColor: '#2D8C46', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => navigation.navigate('Verify')}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                {t ? 'إرسال الكود' : 'Send code'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* الرابط السفلي */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 30 }}>
            <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 14 }}>
              {t ? 'تذكرت كلمة السر؟ ' : 'Remember your password? '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: '#2D8C46', fontWeight: 'bold', fontSize: 14 }}>
                {t ? 'تسجيل الدخول' : 'Log In'}
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



// --- 4. شاشة التحقق (Verify Screen) ---
const VerifyScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
     <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><ArrowLeft color="#2D8C46" /></TouchableOpacity>
     <View style={styles.centerContent}>
        <View style={styles.cardContainer}>
           <View style={styles.lockCircle}><RefreshCw color="#2D8C46" size={24} /></View>
           <Text style={styles.titleText}>Enter Code</Text>
           <Text style={styles.smallSub}>We've sent a 6-digit code to your email</Text>
           
           <View style={styles.codeContainer}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <View key={i} style={styles.codeBox}><TextInput style={styles.codeEntry} keyboardType="numeric" maxLength={1} /></View>
              ))}
           </View>

           <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.primaryBtnText}>Verify Code</Text>
           </TouchableOpacity>
        </View>
     </View>
  </SafeAreaView>
);

// --- 5. شاشة الدردشة (Chat Screen) - تم تفعيل الأزرار هنا ---
const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    setMessages([userMessage]);

    setInput('');

    setTimeout(() => {
      let reply = '';

      // عربي
      if (
        input.includes('مرحبا') ||
        input.includes('اهلا') ||
         input.includes('كيفك') ||
          input.includes('ساعدني') ||
           input.includes('السلام عليكم') ||
        input.includes('هاي')
      ) {
        reply =
          'اهلا 👋 انا مساعدك الذكي، شو المكونات يلي عندك؟';
      }

      // انجليزي
      else if (
        input.toLowerCase().includes('hello') ||
        input.toLowerCase().includes('how are you') ||
        input.toLowerCase().includes('hi')
      ) {
        reply =
          'Hello 👋 I am your smart cooking assistant. What ingredients do you have?';
      }

      else {
        reply =
          'شو بدك تطبخ اليوم؟ 👨‍🍳';
          reply =
          'امممممممممم شو عندك مكونات اساعدك يغالي؟';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          sender: 'bot',
        },
      ]);
    }, 700);
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginBadge}
        >
          <Text style={styles.loginBadgeText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Cook with AI
        </Text>
<View style={styles.headerIcons}>

  <TouchableOpacity
    onPress={() => navigation.navigate('Favorites')}
  >
    <Star color="#2D8C46" size={22} />
  </TouchableOpacity>

  <TouchableOpacity
    onPress={() => navigation.navigate('Settings')}
  >
            <Settings
              color="#2D8C46"
              size={22}
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* اذا ما في رسائل يضل الترحيب */}
      {messages.length === 0 ? (
        <View style={styles.chatBody}>
          <View style={styles.aiSparkBox}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/10515/10515234.png',
              }}
              style={{ width: 40, height: 40 }}
            />
          </View>

          <Text style={styles.aiWelcomeText}>
            welcomm ! I'm your smart assistant who will help you cook today
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, padding: 15 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={{
                alignSelf:
                  msg.sender === 'user'
                    ? 'flex-end'
                    : 'flex-start',

                backgroundColor:
                  msg.sender === 'user'
                    ? '#2D8C46'
                    : '#EAEAEA',

                padding: 12,
                borderRadius: 15,
                marginBottom: 10,
                maxWidth: '80%',
              }}
            >
              <Text
                style={{
                  color:
                    msg.sender === 'user'
                      ? '#fff'
                      : '#000',
                }}
              >
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* INPUT */}
      <View style={styles.chatInputWrapper}>
        <View style={styles.chatInputContainer}>

          <TouchableOpacity>
            <Camera color="#2D8C46" size={20} />
          </TouchableOpacity>

          <TextInput
            placeholder="Message Cook with AI..."
            style={styles.chatTextInput}
            value={input}
            onChangeText={setInput}
          />

          <TouchableOpacity>
            <Mic color="#2D8C46" size={20} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.upBtn}
          onPress={handleSend}
        >
          <ArrowUp color="#fff" size={20} />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

// --- 6. شاشة الإعدادات (Settings Screen) ---
function SettingsScreen({ navigation, lang, setLang, themeMode, setThemeMode, isDark, user, setUser }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const t = lang === 'ar';
const handlePickImage = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(t ? "مطلوب إذن" : "Permission Required", t ? "يجب السماح للوصول للصور" : "We need access to your photos/camera");
      return;
    }

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setUser({ ...user, profileImage: result.assets[0].uri });
    }
  };

  const showImageSourceAlert = () => {
    Alert.alert(
      t ? "تغيير الصورة" : "Change Photo",
      t ? "اختر مصدراً" : "Select Source",
      [
        { text: t ? "المعرض" : "Gallery", onPress: () => handlePickImage(false) },
        { text: t ? "الكاميرا" : "Camera", onPress: () => handlePickImage(true) },
        { text: t ? "إلغاء" : "Cancel", style: "cancel" }
      ]
    );
  };
  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    navigation.replace('Login');
  };
  const changeTheme = (mode) => {
    setThemeMode(mode); // mode: 'light', 'dark', or 'system'
  };

  return (
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && {color: '#fff'}]}>{t ? 'الإعدادات' : 'Settings'}</Text>
        <View style={{width: 24}} />
      </View>
     {/* 2. قسم البروفايل (الآن في الأعلى) */}
        <View style={styles.profileArea}>
          <TouchableOpacity onPress={showImageSourceAlert}>
    <View style={styles.profileAvatarWrapper}>

      {user.profileImage ? (
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileAvatar}
        />
      ) : (
        <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
          <User color="#2D8C46" size={40} />
                </View>
              )}
              <View style={styles.editIconBadge}><Camera color="#fff" size={12} /></View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, isDark && {color: '#fff'}]}>{user.name}</Text>
        </View>
      <ScrollView style={{padding: 20}}>
        <TouchableOpacity style={styles.menuRow} onPress={() => navigation.navigate('AccountInfo')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><User color="#2D8C46" size={22} /><Text style={[styles.menuLabel, {marginLeft: 10}, isDark && {color: '#fff'}]}>{t ? 'معلومات الحساب' : 'Account Info'}</Text></View>
          <ChevronRight color="#888" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => setNotificationsEnabled(!notificationsEnabled)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Bell color="#2D8C46" size={22} /><Text style={[styles.menuLabel, {marginLeft: 10}, isDark && {color: '#fff'}]}>{t ? 'الإشعارات' : 'Notifications'}</Text></View>
          <Text style={{color: notificationsEnabled ? '#2D8C46' : '#888'}}>{notificationsEnabled ? (t ? 'مفعلة' : 'On') : (t ? 'معطلة' : 'Off')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}><Globe color="#2D8C46" size={22} /><Text style={[styles.menuLabel, {marginLeft: 10}, isDark && {color: '#fff'}]}>{t ? 'اللغة' : 'Language'}</Text></View>
          <Text style={{color: '#2D8C46'}}>{lang === 'en' ? 'English' : 'العربية'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutRow, {marginTop: 20}]} onPress={handleLogout}>
          <Text style={styles.logoutLabel}>Log Out</Text>
          <LogOut color="#D32F2F" size={18} />
        </TouchableOpacity>
        <Text style={[styles.sectionTitle, isDark && {color: '#888'}]}>
          {t ? 'المظهر' : 'Appearance'}
        </Text>
        
        <View style={[styles.themeContainer, isDark && {backgroundColor: '#1E1E1E'}]}>
          {/* خيار: فاتح */}
          <TouchableOpacity 
            style={[styles.themeOption, themeMode === 'light' && styles.activeTheme]} 
            onPress={() => changeTheme('light')}
          >
            <Text style={[styles.themeText, isDark && {color: '#fff'}, themeMode === 'light' && {color: '#2D8C46'}]}>
              {t ? 'فاتح' : 'Light'}
            </Text>
          </TouchableOpacity>

          {/* خيار: داكن */}
          <TouchableOpacity 
            style={[styles.themeOption, themeMode === 'dark' && styles.activeTheme]} 
            onPress={() => changeTheme('dark')}
          >
            <Text style={[styles.themeText, isDark && {color: '#fff'}, themeMode === 'dark' && {color: '#2D8C46'}]}>
              {t ? 'داكن' : 'Dark'}
            </Text>
          </TouchableOpacity>

          {/* خيار: حسب النظام */}
          <TouchableOpacity 
            style={[styles.themeOption, themeMode === 'system' && styles.activeTheme]} 
            onPress={() => changeTheme('system')}
          >
            <Text style={[styles.themeText, isDark && {color: '#fff'}, themeMode === 'system' && {color: '#2D8C46'}]}>
              {t ? 'تلقائي' : 'System'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
// --- شاشة التسجيل ---
function SignUpScreen({ navigation, setUser, lang, isDark }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const t = lang === 'ar';
const isStrongPassword = (password) => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  return strongPasswordRegex.test(password);
};

const handleSignUp = () => {
    console.log("Signup button pressed");
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

  // حفظ المستخدم
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
    <SafeAreaView style={[styles.container, isDark && {backgroundColor: '#121212'}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#000'} /></TouchableOpacity>
      </View>
<ScrollView
  contentContainerStyle={{
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40
  }}
  keyboardShouldPersistTaps="handled"
>       <Text style={[styles.authTitle, {fontSize: 32, marginBottom: 30}, isDark && {color: '#fff'}]}>
          {t ? 'إنشاء حساب' : 'Create Account'}
        </Text>

        <View>
          <Text style={[styles.sectionLabel, {marginTop: 0}, isDark && {color: '#ccc'}]}>{t ? 'الاسم الكامل' : 'FULL NAME'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder={t ? "أدخل اسمك" : "your name "} placeholderTextColor="#888" onChangeText={setName} />
          
          <Text style={[styles.sectionLabel, isDark && {color: '#ccc'}]}>{t ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}</Text>
          <TextInput style={[styles.input, isDark && styles.darkInput]} placeholder="name@email.com" placeholderTextColor="#888" keyboardType="email-address" onChangeText={setEmail} />
          
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
<TouchableOpacity
  activeOpacity={0.7}
  onPress={() => {
    console.log("SIGNUP PRESSED");
    Alert.alert("Test", "Pressed");
    handleSignUp();
  }}
  style={{
    backgroundColor: '#2D8C46',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
    zIndex: 999,
  }}
>
  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>
    Sign Up
  </Text>
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


// --- المكون الرئيسي (App Component) ---
export default function App() {
  const [lang, setLang] = useState('en');
  const [themeMode, setThemeMode] = useState('light');
  const [user, setUser] = useState({ isLoggedIn: false, name: 'Sara', password: '123' });
  const isDark = themeMode === 'dark';

  return (
    <SafeAreaProvider>
   <NavigationContainer>
  <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="Chat"
  >

    <Stack.Screen name="Chat" component={ChatScreen} />

    <Stack.Screen name="Login">
      {(props) => (
        <LoginScreen
          {...props}
          lang={lang}
          isDark={isDark}
          user={user}
          setUser={setUser}
        />
      )}
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
      {(props) => (
        <AccountInfoScreen
          {...props}
          lang={lang}
          isDark={isDark}
          user={user}
          setUser={setUser}
        />
      )}
    </Stack.Screen>

    <Stack.Screen name="SignUp">
      {(props) => (
        <SignUpScreen
          {...props}
          setUser={setUser}
          lang={lang}
          isDark={isDark}
        />
      )}
    </Stack.Screen>

    <Stack.Screen
      name="ForgotPass"
      component={ForgotPassScreen}
    />

    <Stack.Screen
      name="Verify"
      component={VerifyScreen}
    />

    <Stack.Screen
      name="Favorites"
    >
      {(props) => (
        <FavoritesScreen
          {...props}
          favorites={[]}
          lang={lang}
          isDark={isDark}
        />
      )}
    </Stack.Screen>

  </Stack.Navigator>
</NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#F9FBFA',
},  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  titleText: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  subtitleText: { fontSize: 16, color: '#666' },
  label: { fontSize: 12, fontWeight: '700', color: '#333', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#F3F3F3', padding: 16, borderRadius: 15, fontSize: 14 },
  darkInput: { backgroundColor: '#333', color: '#fff' },
  primaryBtn: { backgroundColor: '#2D8C46', width: '100%', padding: 18, borderRadius: 25, alignItems: 'center', marginTop: 15 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  orText: { marginHorizontal: 10, color: '#999', fontSize: 12, fontWeight: '700' },
  googleBtn: { flexDirection: 'row', width: '100%', padding: 15, borderRadius: 25, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  googleBtnText: { fontWeight: '600', color: '#333' },
  backBtn: { padding: 20 },
  centerContent: { flex: 1, alignItems: 'center', padding: 30 },
  lightGreenIconBox: { width: 80, height: 80, backgroundColor: '#E8F5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  greenIconBox: { width: 60, height: 60, backgroundColor: '#2D8C46', borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  cardContainer: { backgroundColor: '#fff', padding: 25, borderRadius: 30, width: '100%', elevation: 2 },
  lockCircle: { alignSelf: 'center', width: 50, height: 50, backgroundColor: '#E8F5E9', borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  smallSub: { textAlign: 'center', color: '#888', marginBottom: 25, fontSize: 13 },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  codeBox: { width: 40, height: 45, backgroundColor: '#F5F5F5', borderRadius: 8, borderBottomWidth: 2, borderBottomColor: '#EEE' },
  codeEntry: { textAlign: 'center', flex: 1, fontSize: 18, fontWeight: 'bold' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#fff' },
  loginBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  loginBadgeText: { color: '#2D8C46', fontWeight: 'bold', fontSize: 14 },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  chatBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  aiSparkBox: { width: 65, height: 65, backgroundColor: '#2D8C46', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  aiWelcomeText: { textAlign: 'center', marginTop: 30, color: '#2D8C46', fontSize: 18, fontWeight: '700' },
  chatInputWrapper: { flexDirection: 'row', padding: 15, alignItems: 'center' },
  chatInputContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 30, paddingHorizontal: 15, height: 50, alignItems: 'center', marginRight: 10 },
  chatTextInput: { flex: 1, paddingHorizontal: 10 },
  upBtn: { width: 45, height: 45, backgroundColor: '#2D8C46', borderRadius: 22.5, justifyContent: 'center', alignItems: 'center' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 18, borderRadius: 15, marginBottom: 10 },
  logoutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF5F5', padding: 18, borderRadius: 15 },
  menuLabel: { fontWeight: '600', color: '#333' },
  logoutLabel: { fontWeight: '600', color: '#D32F2F' },
  footerText: { marginTop: 20, color: '#666' },
  profileArea: { alignItems: 'center', marginVertical: 30 },
  profileAvatarWrapper: { position: 'relative' },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#2D8C46' },
  avatarPlaceholder: { backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  editIconBadge: { position: 'absolute', bottom: 5, right: 5, backgroundColor: '#2D8C46', width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  profileName: { fontSize: 20, fontWeight: 'bold', marginTop: 15, color: '#333' },
  greenBold: { color: '#2D8C46', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  centerContent: { paddingHorizontal: 25, paddingTop: 20, paddingBottom: 40 },
  backBtnAction: { marginBottom: 20, alignSelf: 'flex-start' },
  
  greenIconBox: { 
    width: 65, 
    height: 65, 
    backgroundColor: '#2D8C46', 
    borderRadius: 18, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 25 
  },

  textWrapper: { marginBottom: 35 },
  titleText: { fontSize: 30, fontWeight: '800', color: '#1A1A1A' },
  subtitleText: { fontSize: 16, color: '#666', marginTop: 5 },

  formContainer: { width: '100%' },
  label: { fontSize: 13, fontWeight: '700', color: '#333', marginBottom: 8 },
  input: { backgroundColor: '#F3F3F3', padding: 18, borderRadius: 20, fontSize: 15 },
  
  passwordWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F3F3', 
    borderRadius: 20, 
    paddingHorizontal: 18 
  },
  passwordInput: { flex: 1, paddingVertical: 18, fontSize: 15 },

  forgotBtn: { alignSelf: 'flex-end', marginTop: 12, marginBottom: 30 },
  greenBold: { color: '#2D8C46', fontWeight: 'bold' },

  primaryBtn: { 
    backgroundColor: '#2D8C46', 
    width: '100%', 
    padding: 18, 
    borderRadius: 30, 
    alignItems: 'center' 
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  line: { flex: 1, height: 1, backgroundColor: '#EEE' },
  orText: { marginHorizontal: 15, color: '#999', fontSize: 13, fontWeight: '700' },

  googleBtn: { 
    flexDirection: 'row', 
    width: '100%', 
    padding: 16, 
    borderRadius: 30, 
    borderWidth: 1, 
    borderColor: '#EEE', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFF'
  },
  googleIcon: { width: 20, height: 20, marginRight: 12 },
  googleBtnText: { fontWeight: '600', color: '#333', fontSize: 15 },

  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 40 },
  footerText: { color: '#666', fontSize: 14 } ,
  container: {
    flex: 1,
    backgroundColor: '#F9FBFA',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#555',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#EEEFF1',
    height: 55,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEEFF1',
    borderRadius: 25,
    marginBottom: 20,
  },
  eyeIcon: {
    paddingRight: 20,
  },
  signUpButton: {
    backgroundColor: '#1B8A44',
    height: 55,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  signUpText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontWeight: '600',
  },
  googleButton: {
    flexDirection: 'row',
    height: 55,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
  },
  googleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#1B8A44',
    fontWeight: 'bold',
    fontSize: 14,
  },  
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6',
  },
  // تمركز البطاقة في منتصف الشاشة
  centerContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  // *** شكل البطاقة البيضاء ***
  cardContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400, // يمنع التمدد الزائد في المتصفح
    borderRadius: 30,
    padding: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  // المربع الأخضر الفاتح للأيقونة
  lightGreenIconBox: {
    width: 80,
    height: 80,
    backgroundColor: '#E1F0E6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 8, color: '#333' },
  input: { backgroundColor: '#F3F4F6', padding: 15, borderRadius: 15, marginBottom: 20 },
  primaryBtn: { backgroundColor: '#2D8C46', padding: 18, borderRadius: 30, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  titleText: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 30 },
  authTitle: {
  fontWeight: '800',
  color: '#111',
},

sectionLabel: {
  fontSize: 12,
  fontWeight: '700',
  color: '#333',
  marginBottom: 8,
  marginTop: 18,
  letterSpacing: 1,
},

miniBtn: {
  backgroundColor: '#2D8C46',
  borderRadius: 30,
  alignItems: 'center',
},

btnText: {
  color: '#fff',
  fontWeight: '700',
},

dividerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 30,
},

dividerLine: {
  flex: 1,
  height: 1,
  backgroundColor: '#E5E5E5',
},

dividerText: {
  marginHorizontal: 10,
  color: '#999',
  fontWeight: '600',
},

socialBtn: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 1,
  borderColor: '#E5E5E5',
  borderRadius: 30,
  height: 55,
  backgroundColor: '#fff',
},
miniBtn: {
  backgroundColor: '#2D8C46',
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: 55,
},
container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topSection: {
    height: 350,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.75)',
  },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  content: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0A5C2F',
    marginBottom: 70,
  },

  loginBtn: {
    width: '100%',
    height: 60,
    backgroundColor: '#20B455',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  loginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  signupBtn: {
    width: '100%',
    height: 60,
    borderWidth: 1.5,
    borderColor: '#DCEEDD',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signupText: {
    color: '#0A5C2F',
    fontSize: 20,
    fontWeight: '700',
  },

  footer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
});