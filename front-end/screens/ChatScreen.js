import React, { useState } from 'react';
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
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Star, Settings, Camera, Mic, ArrowUp, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
export default function ChatScreen({ navigation, lang, isDark, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(null); // لحفظ حالة تسجيل الصوت
  const t = lang === 'ar';
const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      type: 'text',
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    simulateBotReply(input);
  };
const simulateBotReply = (userInput) => {
    setTimeout(() => {
      let reply = '';
      if (userInput.includes('مرحبا') || userInput.includes('اهلا') || userInput.includes('كيفك')) {
        reply = 'اهلا 👋 انا مساعدك الذكي، شو المكونات يلي عندك؟';
      } else if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
        reply = 'Hello 👋 I am your smart cooking assistant. What ingredients do you have?';
      } else {
        reply = t ? 'امممممممممم شو عندك مكونات اساعدك يغالي؟ 👨‍🍳' : "Hmm, what ingredients do you have so I can help you, my friend? 👨‍🍳";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          type: 'text',
          sender: 'bot',
        },
      ]);
    }, 700);
  };
  const handlePickImage = async () => {
    Alert.alert(
      t ? 'إدخال صورة' : 'Insert Image',
      t ? 'اختر طريقة رفع الصورة:' : 'Choose image source:',
      [
        {
          text: t ? 'الكاميرا' : 'Camera',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert(t ? 'خطأ' : 'Error', t ? 'نحتاج إذن للوصول للكاميرا' : 'Camera permission required');
              return;
            }
            let result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
            if (!result.canceled) {
              sendImageMessage(result.assets[0].uri);
            }
          }
        },
        {
          text: t ? 'معرض الصور' : 'Gallery',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
              Alert.alert(t ? 'خطأ' : 'Error', t ? 'نحتاج إذن للوصول للصور' : 'Gallery permission required');
              return;
            }
            let result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
            if (!result.canceled) {
              sendImageMessage(result.assets[0].uri);
            }
          }
        },
        { text: t ? 'إلغاء' : 'Cancel', style: 'cancel' }
      ]
    );
  };
  const sendImageMessage = (uri) => {
    const imageMessage = {
      id: Date.now(),
      imageUri: uri,
      type: 'image',
      sender: 'user',
    };
    setMessages((prev) => [...prev, imageMessage]);
    
    // رد تلقائي من البوت عند إرسال صورة
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t ? 'صورة رائعة! دعني أحصي المكونات الموجودة فيها... 🧐' : "Great picture! Let me check the ingredients inside... 🧐",
          type: 'text',
          sender: 'bot',
        },
      ]);
    }, 1000);
  };
  const handleAudioRecording = async () => {
    try {
      if (recording) {
        // إذا كان يسجل بالفعل -> قم بالإيقاف والإرسال
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);

        const audioMessage = {
          id: Date.now(),
          type: 'audio',
          sender: 'user',
          duration: '0:05' // قيمة افتراضية للتبسيط
        };
        setMessages((prev) => [...prev, audioMessage]);

        // رد البوت على الصوت
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now() + 1,
              text: t ? 'سمعت صوتك بوضوح، لحظات لأفهم طلبك! 🎙️' : "I heard your voice note, give me a moment! 🎙️",
              type: 'text',
              sender: 'bot',
            },
          ]);
        }, 1000);

      } else {
        // إذا لم يكن يسجل -> اطلب الإذن وابدأ التسجيل
        const permission = await Audio.requestPermissionsAsync();
        if (permission.status !== 'granted') {
          Alert.alert(t ? 'خطأ' : 'Error', t ? 'نحتاج إذن الوصول للمايكروفون' : 'Microphone permission required');
          return;
        }
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
      }
    } catch (err) {
      console.error('Failed to start/stop recording', err);
    }
  };
  // دالة لتمييز الرسالة بنجمة
const toggleFavorite = (messageId) => {
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
    )
  );
};

// ... داخل السكرول فيو عند عرض الرسائل الماب:
{messages.map((msg) => (
  <View key={msg.id} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
    
    <View style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble(isDark)]}>
       {/* عرض النص أو الصورة كما فعلنا سابقاً */}
       {msg.type === 'text' && (
          <Text style={{ color: msg.sender === 'user' ? '#fff' : (isDark ? '#fff' : '#000') }}>{msg.text}</Text>
       )}
    </View>

    {/* إظهار النجمة فقط بجانب رسائل البوت */}
    {msg.sender === 'bot' && (
      <TouchableOpacity onPress={() => toggleFavorite(msg.id)} style={{ marginLeft: 8 }}>
        <Star 
          size={18} 
          color={msg.isFavorite ? "#FFD700" : "#CCC"} // ذهبي إذا كانت مفضلة، رمادي إذا لا
          fill={msg.isFavorite ? "#FFD700" : "transparent"} 
        />
      </TouchableOpacity>
    )}
  </View>
))}
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>

        {/* الهيدر العلوي */}
        <View style={[styles.chatHeader, isDark && { borderBottomColor: '#222' }]}>
          <TouchableOpacity
            onPress={() => user ? navigation.navigate('Account') : navigation.navigate('Login')}
            style={[styles.loginBadge, isDark && { backgroundColor: '#2D3A30' }]}
          >
            {user ? <User color="#2D8C46" size={20} /> : <Text style={styles.loginBadgeText}>{t ? 'دخول' : 'Login'}</Text>}
          </TouchableOpacity>

          <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>Cook with AI</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Favorites')}><Star color="#2D8C46" size={22} /></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Settings color="#2D8C46" size={22} style={{ marginLeft: 15 }} /></TouchableOpacity>
          </View>
        </View>

        {/* BODY (عرض الرسائل) */}
        {messages.length === 0 ? (
          <View style={styles.chatBody}>
            <View style={[styles.aiSparkBox, isDark && { backgroundColor: '#1E1E1E' }]}>
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10515/10515234.png' }} style={{ width: 40, height: 40 }} />
            </View>
            <Text style={[styles.aiWelcomeText, isDark && { color: '#aaa' }]}>
              {t ? 'أهلاً بك! أنا مساعدك الذكي الذي سيساعدك في الطهي اليوم 👨‍🍳' : "Welcome! I'm your smart assistant who will help you cook today"}
            </Text>
          </View>
        ) : (
          <ScrollView style={{ flex: 1, padding: 15 }} contentContainerStyle={{ paddingBottom: 20 }}>
            {messages.map((msg) => (
              <View key={msg.id} style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble(isDark)]}>
                
                {/* إذا كانت الرسالة نصية */}
                {msg.type === 'text' && (
                  <Text style={{ color: msg.sender === 'user' ? '#fff' : (isDark ? '#fff' : '#000') }}>{msg.text}</Text>
                )}

                {/* إذا كانت الرسالة صورة مبعوثة */}
                {msg.type === 'image' && (
                  <Image source={{ uri: msg.imageUri }} style={{ width: 200, height: 150, borderRadius: 10 }} />
                )}

                {/* إذا كانت الرسالة تسجيل صوتی */}
                {msg.type === 'audio' && (
                  <Text style={{ color: '#fff', fontStyle: 'italic' }}>🎵 voice note ({msg.duration})</Text>
                )}

              </View>
            ))}
          </ScrollView>
        )}

        {/* INPUT (منطقة الكتابة والأزرار المحسنة) */}
        <View style={[styles.chatInputWrapper, isDark && { borderTopColor: '#222', backgroundColor: '#121212' }]}>
          <View style={[styles.chatInputContainer, isDark && { backgroundColor: '#1E1E1E' }]}>
            
            {/* زر الكاميرا والاستوديو */}
            <TouchableOpacity onPress={handlePickImage}>
              <Camera color="#2D8C46" size={20} />
            </TouchableOpacity>

            <TextInput
              placeholder={t ? "اكتب للمساعد الذكي..." : "Message Cook with AI..."}
              placeholderTextColor={isDark ? '#666' : '#999'}
              style={[styles.chatTextInput, isDark && { color: '#fff' }]}
              value={input}
              onChangeText={setInput}
            />

            {input.trim() ? (
  <TouchableOpacity style={styles.upBtn} onPress={handleSend}>
    <ArrowUp color="#fff" size={20} />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={[
      styles.voiceBtn,
      recording && styles.voiceBtnRecording
    ]}
    onPress={handleAudioRecording}
  >
    <Mic color="#fff" size={22} />
  </TouchableOpacity>
)}

          </View>

          {/* زر السهم لإرسال النص */}
          <TouchableOpacity style={styles.upBtn} onPress={handleSend}>
            <ArrowUp color="#fff" size={20} />
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  loginBadge: { backgroundColor: '#EBF4ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  loginBadgeText: { color: '#2D8C46', fontWeight: '700', fontSize: 13 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  chatBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  aiSparkBox: { width: 70, height: 70, backgroundColor: '#F3F4F6', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  aiWelcomeText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  chatInputWrapper: { flexDirection: 'row', alignItems: 'center', padding: 15, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FCFCFC' },
  chatInputContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 25, paddingHorizontal: 15, alignItems: 'center', height: 50, marginRight: 10 },
  chatTextInput: { flex: 1, marginHorizontal: 10, fontSize: 14, color: '#000', paddingVertical: 0 },
  upBtn: { width: 48, height: 48, backgroundColor: '#2D8C46', borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  messageBubble: { padding: 12, borderRadius: 15, marginBottom: 10, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2D8C46' },
  botBubble: (isDark) => ({ alignSelf: 'flex-start', backgroundColor: isDark ? '#222' : '#EAEAEA' }),
  voiceBtn: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: '#2D8C46',
  justifyContent: 'center',
  alignItems: 'center',
},

voiceBtnRecording: {
  transform: [{ scale: 1.1 }],
},
});
