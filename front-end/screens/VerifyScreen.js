import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet 
} from 'react-native';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function VerifyScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* حاوية الحافة أو البطاقة البيضاء/الرمادية الداكنة */}
        <View style={[styles.cardContainer, isDark && { backgroundColor: '#1E1E1E' }]}>

          {/* زر الرجوع */}
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
          >
            <View style={[styles.backIconCircle, isDark && { backgroundColor: '#2D3A30' }]}>
              <ArrowLeft color="#2D8C46" size={24} />
            </View>
          </TouchableOpacity>

          {/* الدائرة المركزية مع الأيقونة */}
          <View style={[styles.lockCircle, isDark && { backgroundColor: '#1C3524' }]}>
             <RefreshCw color="#2D8C46" size={30} />
          </View>

          {/* النصوص الترحيبية المترجمة */}
          <Text style={[styles.titleText, isDark && { color: '#fff' }]}>
            {t ? 'أدخل رمز التحقق' : 'Enter Code'}
          </Text>
          
          <Text style={[styles.smallSub, isDark && { color: '#aaa' }]}>
            {t ? 'لقد أرسلنا رمزاً مكوناً من 6 أرقام إلى بريدك الإلكتروني' : "We've sent a 6-digit code to your email"}
          </Text>
          
          {/* مربعات إدخال كود التحقق الستة */}
          <View style={styles.codeContainer}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <View key={i} style={[styles.codeBox, isDark && { backgroundColor: '#333' }]}>
                <TextInput 
                  style={[styles.codeEntry, isDark && { color: '#fff' }]} 
                  keyboardType="numeric" 
                  maxLength={1} 
                  placeholderTextColor={isDark ? '#666' : '#BBB'}
                />
              </View>
            ))}
          </View>

          {/* زر التأكيد */}
          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => navigation.navigate('Chat')}
          >
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
  container: {
    flex: 1,
    backgroundColor: '#F5F7F6',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 400,
    borderRadius: 35,
    padding: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backIconCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#EBF4ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockCircle: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    backgroundColor: '#E1F0E6',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  smallSub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  codeBox: {
    width: '14%',
    aspectRatio: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  codeEntry: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    width: '100%',
    padding: 0,
  },
  primaryBtn: {
    backgroundColor: '#2D8C46',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});