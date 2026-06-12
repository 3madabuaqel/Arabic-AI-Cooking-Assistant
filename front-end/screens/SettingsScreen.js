import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  Modal,
  FlatList,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { ArrowLeft, Star, Settings, Camera, RotateCcw, Smartphone, ChevronDown, LogOut, Bell, Moon, Sun, Monitor, Globe } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';
const allCountries = [
  { name: "Jordan", code: "+962" },
  { name: "UAE", code: "+971" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Palestine", code: "+970" },
  { name: "Egypt", code: "+20" },
  { name: "Syria", code: "+963" },
  { name: "Iraq", code: "+964" },
  { name: "Lebanon", code: "+961" },
  { name: "Kuwait", code: "+965" },
  { name: "Oman", code: "+968" },
  { name: "Qatar", code: "+974" },
  { name: "Bahrain", code: "+973" },
  { name: "Yemen", code: "+967" },
  { name: "Algeria", code: "+213" },
  { name: "Morocco", code: "+212" },
  { name: "Tunisia", code: "+216" },
  { name: "Libya", code: "+218" },
  { name: "Sudan", code: "+249" },
  { name: "Turkey", code: "+90" },
  { name: "USA", code: "+1" },
  { name: "Germany", code: "+49" },
  { name: "Sweden", code: "+46" },
  { name: "France", code: "+33" },
  { name: "Canada", code: "+1" },
  { name: "Switzerland", code: "+41" }
];
const SettingsScreen = ({ navigation, lang, setLang, isDark, user, setUser, themeMode, setThemeMode }) => {
  const t = lang === 'ar';
  // These states are empty and automatically change based on the logged-in user
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
// States الخاصة برقم الهاتف والدول
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]); // Default is Jordan
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [phoneInputVisible, setPhoneInputVisible] = useState(false);
  useEffect(() => {
    const firebaseUser = auth().currentUser;

    if (!firebaseUser && !user?.isGuest) {
      navigation.replace('Login');
      return;
    }

    // Fetch real data from Firebase into the state
      if (firebaseUser) {
        setUserName(firebaseUser.displayName || 'User');
        setUserEmail(firebaseUser.email || '');
        setPhotoURL(firebaseUser.photoURL || '');
      } else if (user?.isGuest) {
        setUserName('Guest');
        setUserEmail('guest@arabicai.com');
      }
 if (user?.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, []);
  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('خطأ', 'نحتاج إذن للوصول للصور');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7, allowsEditing: true, aspect: [1, 1] });
    if (!result.canceled) {
      updateFirebasePhoto(result.assets[0].uri);
    }
  };
  const updateFirebasePhoto = async (uri) => {
    try {
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        await firebaseUser.updateProfile({ photoURL: uri });
        setPhotoURL(uri); // Automatically update UI with new photo
        if (setUser) {
          setUser(prev => ({...prev, profileImage: uri}));
        }
        Alert.alert('نجاح', 'تم تحديث صورة البروفايل بنجاح!');
      }
    } catch (error) {
      Alert.alert('خطأ أثناء التحديث', error.message);
    }
  };
  const handleSavePhoneNumber = () => {
    if (!phoneNumber) {
      Alert.alert('تنبيه', 'الرجاء إدخال رقم هاتف صالح.');
      return;
    }
    const fullNumber = `${selectedCountry.code}${phoneNumber}`;
    // Note: To officially link the number and confirm OTP, you need the linkWithPhoneNumber function.
    // Here we will show the user a simulated success message until your OTP server is ready.
    Alert.alert('تم حفظ الرقم', `تم ربط حسابك بالرقم: ${fullNumber}`);
    setPhoneInputVisible(false);
  };
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      const firebaseUser = auth().currentUser;
      if (firebaseUser && firebaseUser.email) {
        await auth().sendPasswordResetEmail(firebaseUser.email);
        Alert.alert(t ? 'نجاح' : 'Success', t ? 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.' : 'Password reset link sent to your email.');
      } else {
        Alert.alert(t ? 'خطأ' : 'Error', t ? 'لم نتمكن من العثور على بريدك الإلكتروني.' : 'Could not find your email address.');
      }
    } catch (error) {
      Alert.alert(t ? 'خطأ' : 'Error', error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}><ScrollView>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#0F8B4C" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#FFF' }]}>Settings</Text>
        <View style={styles.icons}>
          <TouchableOpacity><Star size={22} color="#0F8B4C" /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}><Settings size={22} color="#0F8B4C" /></TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      {!user?.isGuest && (
        <View style={[styles.profileSection, isDark && { borderBottomColor: '#333' }]}>
          <TouchableOpacity onPress={handleSelectImage} style={styles.avatarContainer}>
            <Image
              source={{ uri: photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={styles.avatar}
            />
            <View style={styles.cameraIconBadge}>
              <Camera size={16} color="#FFF" />
            </View>
          </TouchableOpacity>

          <Text style={[styles.name, isDark && { color: '#FFF' }]}>{userName}</Text>
          <Text style={[styles.email, isDark && { color: '#AAA' }]}>{userEmail}</Text>

          <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('AccountInfo')}>
            <Text style={styles.editText}>{t ? 'تعديل الملف الشخصي' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guest Section */}
      {user?.isGuest && (
        <View style={[styles.profileSection, isDark && { borderBottomColor: '#333' }]}>
          <Text style={[styles.name, isDark && { color: '#FFF' }]}>{t ? 'أنت تستخدم التطبيق كضيف' : 'You are using the app as a Guest'}</Text>
          <TouchableOpacity style={[styles.editBtn, { backgroundColor: '#0F8B4C', marginTop: 15, borderWidth: 0 }]} onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.editText, { color: '#FFF' }]}>{t ? 'تسجيل الدخول / إنشاء حساب' : 'Log in / Sign up'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ACCOUNT SECURITY */}
      {!user?.isGuest && (
        <>
          <Text style={[styles.sectionTitle, isDark && { color: '#888' }]}>ACCOUNT SECURITY</Text>

          <TouchableOpacity style={[styles.card, isDark && { backgroundColor: '#1E1E1E' }]} onPress={handleResetPassword}>
            <Text style={[styles.cardText, isDark && { color: '#FFF' }]}>{t ? 'إعادة تعيين كلمة المرور' : 'Reset Password'}</Text>
            <RotateCcw size={22} color="#0F8B4C" />
          </TouchableOpacity>



          <TouchableOpacity style={[styles.logoutCard, isDark && { backgroundColor: '#3D1C1D' }]} onPress={handleLogout}>
            <Text style={[styles.logoutText, isDark && { color: '#FF5252' }]}>Log Out</Text>
            <LogOut size={22} color={isDark ? '#FF5252' : '#E53935'} />
          </TouchableOpacity>
        </>
      )}

      {/* APP PREFERENCES */}
      <Text style={[styles.sectionTitle, isDark && { color: '#888' }]}>APP PREFERENCES</Text>
      <View style={styles.preferencesRow}>
        {!user?.isGuest && (
          <TouchableOpacity style={[styles.prefCard, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Bell size={24} color="#0F8B4C" />
            <Text style={[styles.prefText, isDark && { color: '#FFF' }]}>{t ? 'الإشعارات' : 'Notifications'}</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.prefCard, isDark && { backgroundColor: '#1E1E1E' }]} onPress={() => {
          setLang(lang === 'ar' ? 'en' : 'ar');
        }}>
          <Globe size={24} color="#0F8B4C" />
          <Text style={[styles.prefText, isDark && { color: '#FFF' }]}>
            {lang === 'ar' ? 'العربية' : 'English'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.prefCard, isDark && { backgroundColor: '#1E1E1E' }]} onPress={() => {
          if (themeMode === 'light') setThemeMode('dark');
          else if (themeMode === 'dark') setThemeMode('system');
          else setThemeMode('light');
        }}>
          {themeMode === 'light' ? <Sun size={24} color="#0F8B4C" /> : themeMode === 'dark' ? <Moon size={24} color="#0F8B4C" /> : <Monitor size={24} color="#0F8B4C" />}
          <Text style={[styles.prefText, isDark && { color: '#FFF' }]}>
            {themeMode === 'light' ? (t ? 'فاتح' : 'Light') : themeMode === 'dark' ? (t ? 'داكن' : 'Dark') : (t ? 'تلقائي' : 'System')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal اختيار الدول المخصص */}
      <Modal visible={countryModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Text style={[styles.modalTitle, isDark && { color: '#FFF' }]}>اختر الدولة</Text>
            <FlatList
              data={allCountries}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[styles.countryItem, isDark && { borderBottomColor: '#333' }]} 
                  onPress={() => {
                    setSelectedCountry(item);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={[styles.countryName, isDark && { color: '#FFF' }]}>{item.name}</Text>
                  <Text style={styles.countryCode}>{item.code}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeModalBtn} onPress={() => setCountryModalVisible(false)}>
              <Text style={styles.closeModalBtnText}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 50, paddingBottom: 15 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111' },
  icons: { flexDirection: 'row' },
  profileSection: { alignItems: 'center', marginTop: 25, paddingBottom: 25, borderBottomWidth: 1, borderBottomColor: '#F0F0F0', marginHorizontal: 20 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#0F8B4C', padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  name: { marginTop: 15, fontSize: 26, fontWeight: '700', color: '#111' },
  email: { fontSize: 16, color: '#666', marginTop: 4 },
  editBtn: { borderWidth: 1.5, borderColor: '#0F8B4C', width: '100%', padding: 12, borderRadius: 25, alignItems: 'center', marginTop: 20 },
  editText: { color: '#0F8B4C', fontWeight: '600', fontSize: 16 },
  sectionTitle: { marginTop: 30, marginLeft: 20, color: '#7f8c8d', fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
  card: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 12, padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  cardText: { fontSize: 16, fontWeight: '600', color: '#111' },
  
  // Dropdown phone number input screen
  phoneInputSection: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 5, padding: 15, borderRadius: 16, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
  inputLabel: { fontSize: 14, color: '#666', marginBottom: 10, textAlign: 'right' },
  phoneInputRow: { flexDirection: 'row', alignItems: 'center' },
  countryPickerButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', padding: 12, borderRadius: 10, marginRight: 8 },
  countryCodeText: { color: '#0F8B4C', fontWeight: 'bold', marginRight: 5, fontSize: 14 },
  phoneInput: { flex: 1, backgroundColor: '#F0F2F5', padding: 10, borderRadius: 10, fontSize: 16, textAlign: 'left' },
  savePhoneBtn: { backgroundColor: '#0F8B4C', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  savePhoneBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },

  logoutCard: { backgroundColor: '#FFF5F5', marginHorizontal: 20, marginTop: 12, padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#E53935' },
  preferencesRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginTop: 12, marginBottom: 40 },
  prefCard: { width: '31%', backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  prefText: { marginTop: 12, fontSize: 13, fontWeight: '600', color: '#111', textAlign: 'center' },

  // Modal styles (countries popup)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', height: '70%', backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  countryItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  countryName: { fontSize: 16, color: '#333' },
  countryCode: { fontSize: 16, fontWeight: 'bold', color: '#0F8B4C' },
  closeModalBtn: { backgroundColor: '#E53935', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  closeModalBtnText: { color: '#FFF', fontWeight: 'bold' }
});