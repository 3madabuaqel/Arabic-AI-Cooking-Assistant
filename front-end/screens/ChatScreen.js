import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Settings, Camera, Mic, ArrowUp, ChefHat } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Markdown from 'react-native-markdown-display';

export default function ChatScreen({ navigation, lang, isDark, favorites, setFavorites, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recordingRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const t = lang === 'ar';

  const blinkAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (isLoading || isRecording || isTranscribing) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(blinkAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      blinkAnim.setValue(1);
    }
  }, [isLoading, isRecording, isTranscribing, blinkAnim]);

  const toggleFavorite = (recipe) => {
    if (user?.isGuest) {
      alert(t ? 'عذراً، يرجى تسجيل الدخول لتتمكن من إضافة الوصفات للمفضلة.' : 'Sorry, please login to add recipes to favorites.');
      return;
    }
    if (!favorites || !setFavorites) return;
    const isFav = favorites.some((fav) => fav.id === recipe.recipe_id);
    if (isFav) {
      setFavorites(favorites.filter((fav) => fav.id !== recipe.recipe_id));
    } else {
      setFavorites([...favorites, {
        id: recipe.recipe_id,
        title: recipe.title,
        time: '30 mins',
        img: `http://192.168.100.28:8000/${recipe.image}`
      }]);
    }
  };

  const startRecording = async () => {
    if (isTranscribing || isLoading) return;
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        alert(t ? 'يجب السماح باستخدام المايكروفون' : 'Microphone permission is required');
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    const rec = recordingRef.current;
    if (!rec) return;

    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;
      transcribeAudio(uri);
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const transcribeAudio = async (uri) => {
    setIsTranscribing(true);
    try {
      const API_BASE_URL = 'http://192.168.100.28:8000';
      const formData = new FormData();
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });

      const response = await fetch(`${API_BASE_URL}/transcribe`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Transcription failed');

      const data = await response.json();
      if (data.text) {
        setInput((prev) => prev + (prev ? ' ' : '') + data.text);
      }
    } catch (error) {
      console.error('Error transcribing:', error);
      alert(t ? 'فشل في تحويل الصوت إلى نص' : 'Failed to transcribe audio');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleSend = async (overrideInput = null) => {
    const textToSend = typeof overrideInput === 'string' ? overrideInput : input;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
    };

    // Add the new message while keeping the previous messages instead of clearing them
    setMessages((prev) => [...prev, userMessage]);
    if (typeof overrideInput !== 'string') {
      setInput('');
    }
    setIsLoading(true);

    // Check for greeting keywords only if it's a standalone greeting
    const lowerInput = textToSend.trim().toLowerCase();
    const words = lowerInput.split(/\s+/);
    const isShortMessage = words.length <= 3;
    const hasGreetingWord = words.some(w => ['مرحبا', 'مرحباً', 'اهلا', 'أهلا', 'أهلاً', 'كيفك', 'السلام', 'عليكم', 'هاي', 'hello', 'hi'].includes(w));
    const hasIngredientsContext = lowerInput.includes('عندي') || lowerInput.includes('معي') || lowerInput.includes('بدي') || lowerInput.includes('اريد') || lowerInput.includes('أريد') || lowerInput.includes('وصفة');
    
    const isGreeting = isShortMessage && hasGreetingWord && !hasIngredientsContext;

    if (isGreeting) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: t 
              ? 'أهلاً بك 👋 أنا مساعدك الذكي في المطبخ! هل تبحث عن طبخة معينة أو لديك مكونات وتريد مني اقتراح وصفة لذيذة؟ 👨‍🍳'
              : 'Welcome 👋 I am your smart kitchen assistant! Are you looking for a specific recipe, or do you have ingredients to cook with? 👨‍🍳',
            sender: 'bot',
          },
        ]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      // IMPORTANT: Change this IP to your computer's local IPv4 address (e.g. 192.168.X.X) if testing on a physical device.
      // Use 10.0.2.2 if testing on an Android Emulator.
      const API_BASE_URL = 'http://192.168.100.28:8000'; 
      
      // Prepare history (excluding the new input)
      const history = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        text: msg.text
      }));

      const payload = {
        message: textToSend,
        history: history
      };
      
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      const reply = data.response || (t ? "عذراً، حدث خطأ غير متوقع." : "Sorry, an unexpected error occurred.");

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: reply,
          sender: 'bot',
        },
      ]);
    } catch (error) {
      console.error('Error fetching from backend:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t 
            ? "عذراً، لا يمكنني الاتصال بالخادم الآن. الرجاء التأكد من تشغيل الباك-إند والاتصال بالإنترنت ووضع الـ IP الصحيح." 
            : "Sorry, I cannot connect to the server right now. Please ensure the backend is running, you have internet, and the IP is correct.",
          sender: 'bot',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
  <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
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

      {/* BODY - Show welcome or message list */}
      {messages.length === 0 ? (
        <View style={styles.chatBody}>
          <View style={[styles.aiSparkBox, isDark && { backgroundColor: '#1E1E1E' }]}>
            <ChefHat color="#2D8C46" size={40} />
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
                backgroundColor: msg.sender === 'user' ? '#18A84F' : (isDark ? '#2C2C2E' : '#FFFFFF'),
                padding: 14,
                borderRadius: 20,
                borderBottomRightRadius: msg.sender === 'user' ? 4 : 20,
                borderBottomLeftRadius: msg.sender === 'user' ? 20 : 4,
                marginBottom: 15,
                maxWidth: '85%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: msg.sender === 'user' ? 0.2 : 0.05,
                shadowRadius: 3,
                elevation: 2,
                borderWidth: msg.sender === 'user' ? 0 : 1,
                borderColor: isDark ? '#3A3A3C' : '#EFEFEF',
              }}
            >
              {msg.sender === 'user' ? (
                <Text style={{ color: '#fff' }}>{msg.text}</Text>
              ) : (
                <Markdown
                  style={{
                    body: { color: isDark ? '#fff' : '#000', fontSize: 15, textAlign: 'right', writingDirection: 'rtl' },
                    heading1: { color: isDark ? '#fff' : '#000', marginTop: 10, textAlign: 'right', writingDirection: 'rtl' },
                    heading2: { color: isDark ? '#fff' : '#000', marginTop: 10, textAlign: 'right', writingDirection: 'rtl' },
                    strong: { color: isDark ? '#4CAF50' : '#2D8C46' },
                    paragraph: { textAlign: 'right', writingDirection: 'rtl' },
                    list_item: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
                    bullet_list: { textAlign: 'right', writingDirection: 'rtl' },
                    ordered_list: { textAlign: 'right', writingDirection: 'rtl' },
                    bullet_list_icon: { marginLeft: 10, marginRight: 0 },
                    ordered_list_icon: { marginLeft: 10, marginRight: 0 },
                    link: { color: '#18A84F', textDecorationLine: 'underline', fontWeight: 'bold' }
                  }}
                  onLinkPress={(url) => {
                    if (url.startsWith('choose:')) {
                      const recipeName = decodeURIComponent(url.replace('choose:', ''));
                      handleSend(`طريقة تحضير ${recipeName}`);
                      return false;
                    }
                    return true;
                  }}
                >
                  {msg.text}
                </Markdown>
              )}

            </View>
          ))}
          
          {/* Loading Indicator */}
          {isLoading && (
            <View style={{
              alignSelf: 'flex-start',
              backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 20,
              marginBottom: 10,
              maxWidth: '80%',
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <Animated.Text style={{ opacity: blinkAnim, color: isDark ? '#ddd' : '#444', fontWeight: 'bold', fontSize: 14 }}>
                {t ? 'يفكر...' : 'Thinking...'}
              </Animated.Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* INPUT - Bottom input bar */}
      {isRecording && (
        <Animated.View style={{
          position: 'absolute',
          bottom: 80,
          right: 70,
          backgroundColor: '#D32F2F',
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 50,
          opacity: blinkAnim,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#fff', marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
            {t ? 'جاري التسجيل...' : 'Recording...'}
          </Text>
        </Animated.View>
      )}

      {isTranscribing && (
        <Animated.View style={{
          position: 'absolute',
          bottom: 80,
          right: 70,
          backgroundColor: '#F59E0B',
          paddingVertical: 8,
          paddingHorizontal: 15,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 50,
          opacity: blinkAnim,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
          <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>
            {t ? 'جاري الفهم...' : 'Processing...'}
          </Text>
        </Animated.View>
      )}

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

          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            disabled={isTranscribing || isLoading}
            style={{ padding: 5, borderRadius: 20, backgroundColor: isRecording ? '#FFcccc' : 'transparent', opacity: (isTranscribing || isLoading) ? 0.5 : 1 }}
          >
            <Mic color={isRecording ? "#D32F2F" : "#2D8C46"} size={20} />
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
    backgroundColor: '#F7F8FA',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 10,
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
    padding: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 10,
  },
  chatInputContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F5F6F8',
    borderRadius: 30,
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 54,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8EBEF',
  },
  chatTextInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 15,
    color: '#000',
    paddingVertical: 0,
  },
  upBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#18A84F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#18A84F',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  recipeCard: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    width: 250,
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
    textAlign: 'right',
  },
});