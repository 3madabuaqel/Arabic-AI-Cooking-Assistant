import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Phone, ChevronDown, ChevronRight, User, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import auth from '@react-native-firebase/auth';

const allCountries = [
  { name: "Jordan", code: "+962" }, 
  { name: "UAE", code: "+971" }, 
  { name: "Saudi Arabia", code: "+966" },
  { name: "Palestine", code: "+970" }, 
  { name: "Egypt", code: "+20" }
];

export default function AccountInfoScreen({ navigation, user, setUser, lang, isDark }) {
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [newName, setNewName] = useState(user.name || '');
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const t = lang === 'ar';

  const handleUpdate = (type) => {
    if (type === 'name') {
      if (!newName.trim()) {
        Alert.alert(t ? "خطأ" : "Error", t ? "الرجاء إدخال اسم" : "Please enter a name");
        return;
      }
      const now = new Date().getTime();
      const fourteenDays = 14 * 24 * 60 * 60 * 1000;
      if (user.lastChangeNameDate && (now - user.lastChangeNameDate < fourteenDays)) {
         const daysLeft = Math.ceil((fourteenDays - (now - user.lastChangeNameDate)) / (1000 * 60 * 60 * 24));
         Alert.alert(t ? "عذراً" : "Sorry", t ? `لا يمكنك تغيير اسمك إلا بعد ${daysLeft} يوم` : `You can change your name after ${daysLeft} days`);
         return;
      }
      setUser(prevUser => ({...prevUser, name: newName, lastChangeNameDate: now}));
      Alert.alert(t ? "نجاح" : "Success", t ? "تم تغيير الاسم بنجاح" : "Name changed successfully");
    }

    if (type === 'pass') {
      if (oldPass !== user.password) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمة السر القديمة غير صحيحة" : "Old password incorrect");
        return;
      }
      if (newPass !== confirmPass) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمتا السر غير متطابقتين" : "Passwords do not match");
        return;
      }
      setUser(prevUser => ({...prevUser, password: newPass}));
      Alert.alert(t ? "نجاح" : "Success", t ? "تم تغيير كلمة السر بنجاح" : "Password changed successfully");
      navigation.navigate('Chat');
      setOldPass('');
      setNewPass('');
      setConfirmPass('');
    }

    if (type === 'phone') {
      if (!phone.trim()) {
        Alert.alert(t ? "خطأ" : "Error", t ? "الرجاء إدخال رقم الهاتف" : "Please enter a phone number");
        return;
      }
      setUser(prevUser => ({...prevUser, phone: phone, countryCode: selectedCountry.code}));
      Alert.alert(t ? "نجاح" : "Success", t ? "تم حفظ رقم الهاتف بنجاح" : "Phone number saved successfully");
      navigation.navigate('Chat');
    }
  };

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(t ? 'خطأ' : 'Error', t ? 'نحتاج إذن للوصول لمعرض الصور' : 'Gallery permission required');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({ 
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setUser(prevUser => ({...prevUser, profileImage: uri}));
      try {
        const firebaseUser = auth().currentUser;
        if (firebaseUser) {
          await firebaseUser.updateProfile({ photoURL: uri });
        }
      } catch (e) {
        console.error('Error updating Firebase photo:', e);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <View style={[styles.header, isDark && { borderBottomColor: '#222' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>
          {t ? 'معلومات الحساب' : 'Account Info'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ padding: 20 }}>
        
        <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 10 }}>
          <View style={{ position: 'relative' }}>
            <Image 
              source={{ uri: user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
              style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#2D8C46' }} 
            />
            <TouchableOpacity 
              style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#2D8C46', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: isDark ? '#121212' : '#FCFCFC' }}
              onPress={handlePickImage}
            >
              <Camera color="#fff" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.menuRow, isDark && styles.darkMenuRow]} 
          onPress={() => setExpandedSection(expandedSection === 'name' ? null : 'name')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <User color="#2D8C46" size={20} />
            <Text style={[styles.menuLabel, { marginLeft: 10 }, isDark && { color: '#fff' }]}>
              {t ? 'تغيير الاسم' : 'Change Name'}
            </Text>
          </View>
          {expandedSection === 'name' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>

        {expandedSection === 'name' && (
          <View style={[styles.expandedBox, isDark && { backgroundColor: '#1A1A1A' }]}>
            <TextInput 
              style={[styles.input, isDark && styles.darkInput, { opacity: 0.6, marginBottom: 10 }]} 
              value={user.email || (t ? 'لا يوجد بريد إلكتروني' : 'No Email')}
              editable={false}
              placeholderTextColor="#888" 
            />
            <TextInput 
              style={[styles.input, isDark && styles.darkInput]} 
              placeholder={t ? "اسم المستخدم الجديد" : "New Username"} 
              value={newName}
              onChangeText={setNewName} 
              placeholderTextColor="#888" 
            />
            {user.lastChangeNameDate && (new Date().getTime() - user.lastChangeNameDate < 14 * 24 * 60 * 60 * 1000) ? (
              <Text style={{color: '#E53935', fontSize: 12, marginTop: 10, textAlign: 'center'}}>
                {t ? 'لا يمكنك تغيير الاسم إلا مرة كل 14 يوماً' : 'You can only change your name once every 14 days'}
              </Text>
            ) : null}
            <TouchableOpacity
              style={[styles.primaryBtn, user.lastChangeNameDate && (new Date().getTime() - user.lastChangeNameDate < 14 * 24 * 60 * 60 * 1000) && { backgroundColor: '#888' }]}
              onPress={() => handleUpdate('name')}
              disabled={user.lastChangeNameDate && (new Date().getTime() - user.lastChangeNameDate < 14 * 24 * 60 * 60 * 1000)}
            >
              <Text style={styles.primaryBtnText}>{t ? "حفظ الاسم" : "Save Name"}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.menuRow, isDark && styles.darkMenuRow, { marginTop: 15 }]} 
          onPress={() => setExpandedSection(expandedSection === 'pass' ? null : 'pass')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Lock color="#2D8C46" size={20} />
            <Text style={[styles.menuLabel, { marginLeft: 10 }, isDark && { color: '#fff' }]}>
              {t ? 'إعادة تعيين كلمة السر' : 'Reset Password'}
            </Text>
          </View>
          {expandedSection === 'pass' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>
       
        {expandedSection === 'pass' && (
          <View style={[styles.expandedBox, isDark && { backgroundColor: '#1A1A1A' }]}>
            <TextInput 
              style={[styles.input, isDark && styles.darkInput]} 
              placeholder={t ? "كلمة السر القديمة" : "Old Password"} 
              secureTextEntry 
              onChangeText={setOldPass} 
              placeholderTextColor="#888" 
            />
            <TextInput 
              style={[styles.input, isDark && styles.darkInput, { marginTop: 10 }]} 
              placeholder={t ? "كلمة السر الجديدة" : "New Password"} 
              secureTextEntry 
              onChangeText={setNewPass} 
              placeholderTextColor="#888" 
            />
            <TextInput 
              style={[styles.input, isDark && styles.darkInput, { marginTop: 10 }]} 
              placeholder={t ? "تأكيد كلمة السر الجديدة" : "Confirm New Password"} 
              secureTextEntry 
              onChangeText={setConfirmPass} 
              placeholderTextColor="#888" 
            />
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handleUpdate('pass')}
            >
              <Text style={styles.primaryBtnText}>{t ? "حفظ كلمة السر" : "Save Password"}</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 18, borderRadius: 15 },
  darkMenuRow: { backgroundColor: '#1E1E1E' },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#333' },
  expandedBox: { padding: 15, backgroundColor: '#F9F9F9', borderRadius: 15, marginTop: 5 },
  input: { backgroundColor: '#F3F3F3', padding: 15, borderRadius: 12, fontSize: 14, color: '#000' },
  darkInput: { backgroundColor: '#2A2A2A', color: '#fff' },
  pickerDropdown: { backgroundColor: '#EEE', borderRadius: 12, marginVertical: 5, paddingVertical: 5 },
  pickerItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  primaryBtn: { backgroundColor: '#2D8C46', padding: 16, borderRadius: 25, alignItems: 'center', marginTop: 15 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});