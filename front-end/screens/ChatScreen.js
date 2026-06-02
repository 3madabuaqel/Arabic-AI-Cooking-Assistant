import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet
} from 'react-native';
import { Star, Settings, Camera, Mic, ArrowUp } from 'lucide-react-native';

export default function ChatScreen({ navigation, lang, isDark }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const t = lang === 'ar';

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
    };

    // إضافة الرسالة الجديدة مع الاحتفاظ بالرسائل السابقة بدلاً من مسحها
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setTimeout(() => {
      let reply = '';

      // فحص الكلمات المفتاحية باللغة العربية
      if (
        input.includes('مرحبا') ||
        input.includes('اهلا') ||
        input.includes('كيفك') ||
        input.includes('ساعدني') ||
        input.includes('السلام عليكم') ||
        input.includes('هاي')
      ) {
        reply = 'اهلا 👋 انا مساعدك الذكي، شو المكونات يلي عندك؟';
      }
      // فحص الكلمات المفتاحية باللغة الإنجليزية
      else if (
        input.toLowerCase().includes('hello') ||
        input.toLowerCase().includes('how are you') ||
        input.toLowerCase().includes('hi')
      ) {
        reply = 'Hello 👋 I am your smart cooking assistant. What ingredients do you have?';
      }
      // الرد الافتراضي حسب لغة التطبيق الحالية
      else {
        reply = t 
          ? 'امممممممممم شو عندك مكونات اساعدك يغالي؟ 👨‍🍳' 
          : "Hmm, what ingredients do you have so I can help you, my friend? 👨‍🍳";
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
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>

      {/* HEADER - الهيدر العلوي */}
      <View style={[styles.chatHeader, isDark && { borderBottomColor: '#222' }]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={[styles.loginBadge, isDark && { backgroundColor: '#2D3A30' }]}
        >
          <Text style={styles.loginBadgeText}>
            {t ? 'دخول' : 'Login'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>
          Cook with AI
        </Text>

        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Star color="#2D8C46" size={22} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Settings
              color="#2D8C46"
              size={22}
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY - عرض الترحيب أو قائمة الرسائل */}
      {messages.length === 0 ? (
        <View style={styles.chatBody}>
          <View style={[styles.aiSparkBox, isDark && { backgroundColor: '#1E1E1E' }]}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/10515/10515234.png',
              }}
              style={{ width: 40, height: 40 }}
            />
          </View>

          <Text style={[styles.aiWelcomeText, isDark && { color: '#aaa' }]}>
            {t 
              ? 'أهلاً بك! أنا مساعدك الذكي الذي سيساعدك في الطهي اليوم 👨‍🍳' 
              : "Welcome! I'm your smart assistant who will help you cook today"}
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
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#2D8C46' : (isDark ? '#222' : '#EAEAEA'),
                padding: 12,
                borderRadius: 15,
                marginBottom: 10,
                maxWidth: '80%',
              }}
            >
              <Text style={{ color: msg.sender === 'user' ? '#fff' : (isDark ? '#fff' : '#000') }}>
                {msg.text}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* INPUT - شريط الإدخال السفلي */}
      <View style={[styles.chatInputWrapper, isDark && { borderTopColor: '#222', backgroundColor: '#121212' }]}>
        <View style={[styles.chatInputContainer, isDark && { backgroundColor: '#1E1E1E' }]}>

          <TouchableOpacity>
            <Camera color="#2D8C46" size={20} />
          </TouchableOpacity>

          <TextInput
            placeholder={t ? "اكتب للمساعد الذكي..." : "Message Cook with AI..."}
            placeholderTextColor={isDark ? '#666' : '#999'}
            style={[styles.chatTextInput, isDark && { color: '#fff' }]}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  loginBadge: {
    backgroundColor: '#EBF4ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loginBadgeText: {
    color: '#2D8C46',
    fontWeight: '700',
    fontSize: 13,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  aiSparkBox: {
    width: 70,
    height: 70,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  aiWelcomeText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  chatInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    backgroundColor: '#FCFCFC',
  },
  chatInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 50,
    marginRight: 10,
  },
  chatTextInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
  upBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#2D8C46',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});