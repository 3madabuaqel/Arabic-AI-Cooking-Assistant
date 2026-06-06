import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function VerifyScreen({ navigation, route, lang, isDark }) {
  // استقبال الإيميل الممرر من شاشة ForgotPassword
  const email = route?.params?.email || ''; 
  const t = lang === 'ar';
  
  // إنشاء مصفوفة من الحالات لمربعات الكود
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleInputChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // التنقل تلقائياً للمربع التالي
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleVerify = () => {
    const finalCode = code.join('');
    if (finalCode.length < 6) {
      Alert.alert("Error", "Please enter the full 6-digit code");
      return;
    }
    // هنا يتم إضافة منطق التحقق من الكود مع السيرفر/Firebase
    Alert.alert("Success", "Code verified!");
    navigation.navigate('Chat');
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.cardContainer, isDark && { backgroundColor: '#1E1E1E' }]}>

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <View style={[styles.backIconCircle, isDark && { backgroundColor: '#2D3A30' }]}>
              <ArrowLeft color="#2D8C46" size={24} />
            </View>
          </TouchableOpacity>

          <View style={[styles.lockCircle, isDark && { backgroundColor: '#1C3524' }]}>
             <RefreshCw color="#2D8C46" size={30} />
          </View>

          <Text style={[styles.titleText, isDark && { color: '#fff' }]}>
            {t ? 'أدخل رمز التحقق' : 'Enter Code'}
          </Text>
          
          <Text style={[styles.smallSub, isDark && { color: '#aaa' }]}>
            {t ? `تم إرسال الرمز إلى ${email}` : `We've sent a 6-digit code to your email`}
          </Text>
          
          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput 
                key={index}
                ref={(ref) => inputs.current[index] = ref}
                style={[styles.codeBox, isDark && { backgroundColor: '#333', color: '#fff' }]}
                keyboardType="numeric" 
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleVerify}>
            <Text style={styles.primaryBtnText}>
              {t ? 'التحقق من الرمز' : 'Verify Code'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cardContainer: { backgroundColor: '#FFFFFF', width: '100%', maxWidth: 400, borderRadius: 35, padding: 30 },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  backIconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#EBF4ED', justifyContent: 'center', alignItems: 'center' },
  lockCircle: { alignSelf: 'center', width: 80, height: 80, backgroundColor: '#E1F0E6', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  titleText: { fontSize: 26, fontWeight: '800', color: '#1A1A1A', textAlign: 'center', marginBottom: 10 },
  smallSub: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 30 },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  codeBox: { width: 45, height: 55, backgroundColor: '#F3F4F6', borderRadius: 12, fontSize: 20, fontWeight: '700', textAlign: 'center' },
  primaryBtn: { backgroundColor: '#2D8C46', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 }
});