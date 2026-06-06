import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Alert 
} from 'react-native';
import { ArrowLeft, Lock, Phone, ChevronDown, ChevronRight } from 'lucide-react-native';

// Array of countries for your project to avoid "allCountries is not defined" error
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
  const [confirmPass, setConfirmPass] = useState('');
  const [phone, setPhone] = useState(user.phone || '');
  const [selectedCountry, setSelectedCountry] = useState(allCountries[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const t = lang === 'ar';

  // Your original update and validation function
  const handleUpdate = (type) => {
    if (type === 'pass') {
      if (oldPass !== user.password) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمة السر القديمة غير صحيحة" : "Old password incorrect");
        return;
      }
      if (newPass !== confirmPass) {
        Alert.alert(t ? "خطأ" : "Error", t ? "كلمتا السر غير متطابقتين" : "Passwords do not match");
        return;
      }
      setUser(prevUser => ({
        ...prevUser,
        password: newPass,
      }));
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
      // Save phone number and country code to the global user state
      setUser(prevUser => ({
        ...prevUser,
        phone: phone,
        countryCode: selectedCountry.code
      }));
      Alert.alert(t ? "نجاح" : "Success", t ? "تم حفظ رقم الهاتف بنجاح" : "Phone number saved successfully");
      navigation.navigate('Chat');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      {/* Top header */}
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
        
        {/* Password section row */}
        <TouchableOpacity 
          style={[styles.menuRow, isDark && styles.darkMenuRow]} 
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
       
        {/* Password change fields */}
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

        {/* Phone number section row */}
        <TouchableOpacity 
          style={[styles.menuRow, isDark && styles.darkMenuRow, { marginTop: 15 }]} 
          onPress={() => setExpandedSection(expandedSection === 'phone' ? null : 'phone')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Phone color="#2D8C46" size={20} />
            <Text style={[styles.menuLabel, { marginLeft: 10 }, isDark && { color: '#fff' }]}>
              {t ? 'إضافة رقم هاتف للحماية' : 'Add Recovery Phone'}
            </Text>
          </View>
          {expandedSection === 'phone' ? <ChevronDown color="#888" /> : <ChevronRight color="#888" />}
        </TouchableOpacity>

        {/* Phone number fields and countries list */}
        {expandedSection === 'phone' && (
          <View style={[styles.expandedBox, isDark && { backgroundColor: '#1A1A1A' }]}>
            <TouchableOpacity 
              style={[styles.input, isDark && styles.darkInput, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} 
              onPress={() => setShowCountryPicker(!showCountryPicker)}
            >
              <Text style={{ color: isDark ? '#fff' : '#000' }}>{selectedCountry.name}</Text>
              <ChevronDown color="#2D8C46" size={18} />
            </TouchableOpacity>

            {showCountryPicker && (
              <View style={[styles.pickerDropdown, isDark && { backgroundColor: '#222' }]}>
                {allCountries.map(c => (
                  <TouchableOpacity 
                    key={c.name} 
                    style={styles.pickerItem} 
                    onPress={() => { setSelectedCountry(c); setShowCountryPicker(false); }}
                  >
                    <Text style={{ color: isDark ? '#fff' : '#000' }}>{c.name} ({c.code})</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <View style={[styles.input, isDark && styles.darkInput, { width: 80, marginRight: 10, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: '#2D8C46', fontWeight: 'bold' }}>{selectedCountry.code}</Text>
              </View>
              <TextInput 
                style={[styles.input, isDark && styles.darkInput, { flex: 1 }]} 
                placeholder="7XXXXXXXX" 
                keyboardType="phone-pad" 
                value={phone} 
                onChangeText={setPhone} 
                placeholderTextColor="#888" 
              />
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => handleUpdate('phone')}>
              <Text style={styles.primaryBtnText}>{t ? 'حفظ الرقم' : 'Save Number'}</Text>
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