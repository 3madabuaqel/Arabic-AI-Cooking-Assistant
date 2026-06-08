import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Feather';
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
const SettingsScreen = ({ navigation }) => {
  // هذه الـ States فارغة وتتغير تلقائياً حسب حساب الشخص اللي سجل دخول
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
// States الخاصة برقم الهاتف والدول
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]); // افتراضياً الأردن
  const [countryModalVisible, setCountryModalVisible] = useState(false);
  const [phoneInputVisible, setPhoneInputVisible] = useState(false);
  useEffect(() => {
    const user = auth().currentUser;

    if (!user) {
      navigation.replace('Login');
      return;
    }

    // جلب البيانات الحقيقية من الـ Firebase للداخل الـ State
    setUserName(user.displayName || 'User');
    setUserEmail(user.email || '');
    setPhotoURL(user.photoURL || '');
 if (user.phoneNumber) {
      setPhoneNumber(user.phoneNumber);
    }
  }, []);
  const handleSelectImage = () => {
    Alert.alert(
      'تغيير صورة البروفايل',
      'اختر طريقة رفع الصورة:',
      [
        { text: 'التقاط صورة بالكاميرا', onPress: openCamera },
        { text: 'اختيار من الاستوديو', onPress: openLibrary },
        { text: 'إلغاء', style: 'cancel' },
      ]
    );
  };
const openCamera = () => {
    const options = { mediaType: 'photo', quality: 0.7 };
    launchCamera(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('خطأ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        updateFirebasePhoto(response.assets[0].uri);
      }
    });
  };
  const openLibrary = () => {
    const options = { mediaType: 'photo', quality: 0.7 };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) return;
      if (response.errorMessage) {
        Alert.alert('خطأ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        updateFirebasePhoto(response.assets[0].uri);
      }
    });
  };
  const updateFirebasePhoto = async (uri) => {
    try {
      const user = auth().currentUser;
      if (user) {
        await user.updateProfile({ photoURL: uri });
        setPhotoURL(uri); // تحديث الواجهة تلقائياً بالصورة الجديدة
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
    // ملاحظة: لربط الرقم بشكل رسمي لتأكيد الـ OTP تحتاج دالة linkWithPhoneNumber،
    // هنا سنعرض للمستخدم رسالة نجاح محاكاة للربط لحين تجهيز خادم الـ OTP لديك.
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

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#0F8B4C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.icons}>
          <TouchableOpacity><Icon name="star" size={22} color="#0F8B4C" /></TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }}><Icon name="settings" size={22} color="#0F8B4C" /></TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleSelectImage} style={styles.avatarContainer}>
          <Image
            source={{ uri: photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
            style={styles.avatar}
          />
          <View style={styles.cameraIconBadge}>
            <Icon name="camera" size={16} color="#FFF" />
          </View>
        </TouchableOpacity>

        <Text style={styles.name}>{userName}</Text>
        <Text style={styles.email}>{userEmail}</Text>

        <TouchableOpacity style={styles.editBtn} onPress={handleSelectImage}>
          <Text style={styles.editText}>Edit Profile Image</Text>
        </TouchableOpacity>
      </View>

      {/* ACCOUNT SECURITY */}
      <Text style={styles.sectionTitle}>ACCOUNT SECURITY</Text>

      <TouchableOpacity style={styles.card}>
        <Text style={styles.cardText}>Reset Password</Text>
        <Icon name="rotate-ccw" size={22} color="#0F8B4C" />
      </TouchableOpacity>

      {/* خاصية رقم الهاتف المضافة بناءً على طلبك */}
      <TouchableOpacity style={styles.card} onPress={() => setPhoneInputVisible(!phoneInputVisible)}>
        <Text style={styles.cardText}>
          {phoneNumber ? `Phone: ${phoneNumber}` : 'Verify Phone Number'}
        </Text>
        <Icon name="smartphone" size={22} color="#0F8B4C" />
      </TouchableOpacity>

      {/* قائمة منبثقة صغيرة لإدخال الهاتف واختيار الدولة داخل نفس الصفحة */}
      {phoneInputVisible && (
        <View style={styles.phoneInputSection}>
          <Text style={styles.inputLabel}>اختر الدولة واكتب الرقم لمزيد من الأمان:</Text>
          <View style={styles.phoneInputRow}>
            <TouchableOpacity 
              style={styles.countryPickerButton} 
              onPress={() => setCountryModalVisible(true)}
            >
              <Text style={styles.countryCodeText}>{selectedCountry.code} ({selectedCountry.name})</Text>
              <Icon name="chevron-down" size={16} color="#0F8B4C" />
            </TouchableOpacity>

            <TextInput
              style={styles.phoneInput}
              placeholder="5xxxxxxxx"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity style={styles.savePhoneBtn} onPress={handleSavePhoneNumber}>
            <Text style={styles.savePhoneBtnText}>تأكيد وحفظ الرقم</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.logoutCard} onPress={handleLogout}>
        <Text style={styles.logoutText}>Log Out</Text>
        <Icon name="log-out" size={22} color="#E53935" />
      </TouchableOpacity>

      {/* APP PREFERENCES */}
      <Text style={styles.sectionTitle}>APP PREFERENCES</Text>
      <View style={styles.preferencesRow}>
        <TouchableOpacity style={styles.prefCard}>
          <Icon name="bell" size={24} color="#0F8B4C" />
          <Text style={styles.prefText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.prefCard}>
          <Icon name="moon" size={24} color="#0F8B4C" />
          <Text style={styles.prefText}>Appearance</Text>
        </TouchableOpacity>
      </View>

      {/* Modal اختيار الدول المخصص */}
      <Modal visible={countryModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اختر الدولة</Text>
            <FlatList
              data={allCountries}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.countryItem} 
                  onPress={() => {
                    setSelectedCountry(item);
                    setCountryModalVisible(false);
                  }}
                >
                  <Text style={styles.countryName}>{item.name}</Text>
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
  
  // شاشة إدخال رقم الهاتف المنسدلة
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
  prefCard: { width: '47%', backgroundColor: '#FFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  prefText: { marginTop: 12, fontSize: 15, fontWeight: '600', color: '#111' },

  // استايلات المودال (نافذة الدول المنبثقة)
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', height: '70%', backgroundColor: '#FFF', borderRadius: 20, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  countryItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  countryName: { fontSize: 16, color: '#333' },
  countryCode: { fontSize: 16, fontWeight: 'bold', color: '#0F8B4C' },
  closeModalBtn: { backgroundColor: '#E53935', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 15 },
  closeModalBtnText: { color: '#FFF', fontWeight: 'bold' }
});