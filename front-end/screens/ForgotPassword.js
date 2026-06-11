import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, LockKeyhole } from 'lucide-react-native';
import auth from '@react-native-firebase/auth';

export default function ForgotPassScreen({ navigation, lang, isDark }) {
  const t = lang === 'ar';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert("Success", "Check your email for the reset link");
      navigation.navigate('Verify', { email });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Central Card */}
        <View style={[styles.card, isDark && { backgroundColor: '#1E1E1E' }]}>
          
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft color={isDark ? '#fff' : '#000'} size={24} />
          </TouchableOpacity>

          {/* Lock Icon */}
          <View style={[styles.iconBox, isDark && { backgroundColor: '#1C3524' }]}>
            <LockKeyhole color="#2D8C46" size={35} />
          </View>

          <Text style={[styles.title, isDark && { color: '#fff' }]}>Forgot Password</Text>

          {/* Email Field */}
          <Text style={[styles.label, isDark && { color: '#ccc' }]}>EMAIL ADDRESS</Text>
          <TextInput 
            style={[styles.input, isDark && { backgroundColor: '#333', color: '#fff' }]} 
            placeholder="your@email.com" 
            placeholderTextColor={isDark ? '#777' : '#BBB'}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSendCode} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send code</Text>}
          </TouchableOpacity>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, isDark && { color: '#aaa' }]}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.linkText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7F6' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: '#FFFFFF', width: '100%', maxWidth: 400, borderRadius: 35, padding: 30, alignItems: 'center' },
  backBtn: { alignSelf: 'flex-start', marginBottom: 20 },
  iconBox: { width: 80, height: 80, backgroundColor: '#E1F0E6', borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A', marginBottom: 35 },
  label: { fontSize: 11, fontWeight: '700', color: '#333', marginBottom: 8, letterSpacing: 1, alignSelf: 'flex-start' },
  input: { backgroundColor: '#F3F4F6', width: '100%', height: 55, borderRadius: 20, paddingHorizontal: 20, marginBottom: 25 },
  primaryBtn: { backgroundColor: '#2D8C46', width: '100%', height: 55, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  footerRow: { flexDirection: 'row', marginTop: 30 },
  footerText: { color: '#666', fontSize: 14 },
  linkText: { color: '#2D8C46', fontWeight: 'bold', fontSize: 14 }
});