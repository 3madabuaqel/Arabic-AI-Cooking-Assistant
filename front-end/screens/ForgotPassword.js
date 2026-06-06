import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView 
} from 'react-native';
import { ArrowLeft, LockKeyhole } from 'lucide-react-native';

export default function ForgotPassScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#F5F7F6' }}>
      {/* ScrollView with style to center everything */}
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        
        {/* White container (Card) - creates the desired shape */}
        <View style={{
          backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
          width: '100%',
          maxWidth: 400, // This line prevents items from spreading horizontally in the browser
          borderRadius: 35, // Large rounded borders like the image
          padding: 30,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
        }}>

          {/* Back button */}
          <TouchableOpacity 
            style={{ alignSelf: 'flex-start', marginBottom: 20 }} 
            onPress={() => navigation.goBack()}
          >
            <View style={{ width: 45, height: 45, borderRadius: 22.5, backgroundColor: isDark ? '#2D3A30' : '#EBF4ED', justifyContent: 'center', alignItems: 'center' }}>
              <ArrowLeft color="#2D8C46" size={24} />
            </View>
          </TouchableOpacity>

          {/* Central icon (Light green square) */}
          <View style={{ alignSelf: 'center', width: 80, height: 80, backgroundColor: isDark ? '#1C3524' : '#E1F0E6', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
             <LockKeyhole color="#2D8C46" size={35} />
          </View>

          {/* Title */}
          <Text style={{ fontSize: 28, fontWeight: '800', color: isDark ? '#fff' : '#1A1A1A', textAlign: 'center', marginBottom: 35 }}>
            {t ? 'نسيت كلمة السر' : 'Forgot Password'}
          </Text>

          {/* Email field and send button */}
          <View style={{ width: '100%' }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: isDark ? '#ccc' : '#333', marginBottom: 8, letterSpacing: 1 }}>
              {t ? 'عنوان البريد الإلكتروني' : 'EMAIL ADDRESS'}
            </Text>
            <TextInput 
              style={{ backgroundColor: isDark ? '#333' : '#F3F4F6', height: 55, borderRadius: 20, paddingHorizontal: 20, color: isDark ? '#fff' : '#000', marginBottom: 25 }} 
              placeholder="your@email.com" 
              placeholderTextColor={isDark ? '#777' : '#BBB'} 
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

          {/* Bottom link to return to login */}
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