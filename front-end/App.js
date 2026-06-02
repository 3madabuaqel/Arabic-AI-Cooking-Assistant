import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// استيراد الشاشات (تأكدي من صحة المسارات لديكِ)
import ChatScreen from './screens/ChatScreen';
import LoginScreen from './screens/LoginScreen';
import SettingsScreen from './screens/SettingsScreen';
import AccountInfoScreen from './screens/AccountInfoScreen';
import SignUpScreen from './screens/SignUpScreen';
import ForgotPassScreen from './screens/ForgotPassScreen';
import VerifyScreen from './screens/VerifyScreen';
import FavoritesScreen from './screens/FavoritesScreen';

const Stack = createNativeStackNavigator();

<<<<<<< HEAD
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


const API_BASE_URL = 'http://192.168.100.28:8000';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    // إضافة رسالة المستخدم للمحادثة بدون مسح الرسائل القديمة
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/search_and_guide?query=${encodeURIComponent(input)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      let reply = '';
      if (data && data.guide_text) {
        reply = data.guide_text;
      } else {
        reply = "عذراً، لم أجد وصفات تطابق طلبك. هل لديك مكونات أخرى؟";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      console.error("Fetch Error: ", error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "حدث خطأ أثناء الاتصال بالخادم. يرجى التأكد من تشغيل السيرفر.",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
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
        <View style={[
  styles.themeCard,
  isDark && { backgroundColor: '#1E1E1E' }
]}>
  <View style={styles.themeLeft}>
    <View style={[
      styles.themeIcon,
      { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }
    ]}>
      <Moon
        size={22}
        color={isDark ? '#FFD54F' : '#555'}
      />
    </View>

    <View>
      <Text style={[
        styles.themeTitle,
        isDark && { color: '#fff' }
      ]}>
        {t ? 'الوضع الداكن' : 'Dark Mode'}
      </Text>

      <Text style={styles.themeSubtitle}>
        {t ? 'تغيير مظهر التطبيق' : 'Change app appearance'}
      </Text>
    </View>
  </View>

  <Switch
    value={isDark}
    onValueChange={(value) =>
      changeTheme(value ? 'dark' : 'light')
    }
    trackColor={{
      false: '#D1D5DB',
      true: '#2D8C46'
    }}
  />
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
=======
export default function App() {
  const [lang, setLang] = useState('en'); // 'en' or 'ar'
  const [themeMode, setThemeMode] = useState('light'); // 'light' or 'dark'
  const [favorites, setFavorites] = useState([]); // الـ State الخاصة بالقائمة المفضلة
  const [user, setUser] = useState({ 
    isLoggedIn: false, 
    name: 'Sara', 
    password: '123',
    profileImage: null 
>>>>>>> c9e1bf9165e1584f45c43b3c3aaf94dfddc9f172
  });

  const isDark = themeMode === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Chat"
        >
          
          {/* شاشة الشات - تم تمرير الـ Props بالكامل لتفعيل الـ Dark mode واللغة */}
          <Stack.Screen name="Chat">
            {(props) => (
              <ChatScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة تسجيل الدخول */}
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

          {/* شاشة الإعدادات */}
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

          {/* شاشة معلومات الحساب */}
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

          {/* شاشة إنشاء الحساب */}
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

          {/* شاشة استعادة كلمة المرور */}
          <Stack.Screen name="ForgotPass">
            {(props) => (
              <ForgotPassScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة التحقق الكود */}
          <Stack.Screen name="Verify">
            {(props) => (
              <VerifyScreen
                {...props}
                lang={lang}
                isDark={isDark}
              />
            )}
          </Stack.Screen>

          {/* شاشة المفضلة - تم ربطها بـ الـ State الفعلية للتطبيق */}
          <Stack.Screen name="Favorites">
            {(props) => (
              <FavoritesScreen
                {...props}
                favorites={favorites}
                setFavorites={setFavorites}
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