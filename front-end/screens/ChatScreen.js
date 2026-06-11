import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, Settings, Camera, Mic, ArrowUp, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import RecipeCarousel from '../components/RecipeCarousel';

const API_URL = 'http://192.168.100.28:8000'; // Updated to your real Wi-Fi IP for physical device testing

export default function ChatScreen({ navigation, lang, isDark, user, favorites, setFavorites }) {
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();
  const [input, setInput] = useState('');
  const [recording, setRecording] = useState(null);
  const isRecordingRef = useRef(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const t = lang === 'ar';
  const insets = useSafeAreaInsets();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  React.useEffect(() => {
    if (Platform.OS === 'ios') return;
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const formatHistoryForAPI = (currentMessages) => {
    return currentMessages
      .filter(m => m.type === 'text' || m.type === 'rich_text')
      .map(m => {
        let textContent = m.text || '';
        if (m.type === 'rich_text' && m.blocks) {
          textContent = JSON.stringify({ type: 'rich_text', blocks: m.blocks });
        }
        return {
          role: m.sender === 'user' ? 'user' : 'model',
          text: textContent
        };
      });
  };

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: textToSend,
      type: 'text',
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (textToSend === input) setInput('');
    setIsTyping(true);

    const greetings = ['مرحبا', 'مرحباً', 'السلام عليكم', 'اهلا', 'أهلا', 'أهلاً', 'هلا', 'مراحب', 'صباح الخير', 'مساء الخير', 'hi', 'hello'];
    const isGreeting = greetings.some(g => textToSend.trim().toLowerCase().includes(g)) && textToSend.trim().length < 30;

    if (isGreeting) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: 'أهلاً بك يا صديقي! أنا "مساعد الطهي الذكي"، شيفك العربي الخاص، هنا لأجعل تجربة الطهي لديك أسهل وأمتع. يمكنني مساعدتك في البحث عن وصفات عربية شهية، أو اقتراح أطباق رائعة بناءً على المكونات المتوفرة لديك، أو حتى إعطائك أفكاراً لطبخة اليوم.\n\nكيف يمكنني مساعدتك اليوم؟ هل لديك مكونات معينة في ثلاجتك؟ أو هل تبحث عن طبخة محددة؟',
            type: 'text',
            sender: 'bot',
          },
        ]);
        setIsTyping(false);
      }, 1000); // Small delay to look like real typing
      return;
    }

    try {
      const history = formatHistoryForAPI(messages);

      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend, history }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      if (data.type === 'recipes') {
        setMessages((prev) => {
          const newMessages = [];
          if (data.text) {
            newMessages.push({
              id: Date.now() + 1,
              text: data.text,
              type: 'text',
              sender: 'bot',
            });
          }
          if (data.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
            newMessages.push({
              id: Date.now() + 2,
              type: 'recipes',
              sender: 'bot',
              recipes: data.recipes.map(r => ({ 
                ...r, 
                isFavorite: false,
                image: r.image && r.image.startsWith('images/') ? `${API_URL}/${r.image}` : (r.image || 'https://via.placeholder.com/300')
              }))
            });
          }
          return [...prev, ...newMessages];
        });
      } else if (data.type === 'rich_text') {
        setMessages((prev) => {
          const newMessages = [];
          
          const textBlocks = data.blocks.filter(b => b.type !== 'show_card');
          const cardBlock = data.blocks.find(b => b.type === 'show_card');
          
          if (textBlocks.length > 0) {
            newMessages.push({
              id: Date.now() + 1,
              type: 'rich_text',
              blocks: textBlocks,
              sender: 'bot',
            });
          }
          
          if (cardBlock && cardBlock.recipes && cardBlock.recipes.length > 0) {
            newMessages.push({
              id: Date.now() + 2,
              type: 'recipes',
              sender: 'bot',
              recipes: cardBlock.recipes.map(r => ({ 
                ...r, 
                isFavorite: false,
                image: r.image && r.image.startsWith('images/') ? `${API_URL}/${r.image}` : (r.image || 'https://via.placeholder.com/300')
              }))
            });
          }
          
          return [...prev, ...newMessages];
        });
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: data.response || (t ? 'عذراً، حدث خطأ' : 'Sorry, an error occurred.'),
            type: 'text',
            sender: 'bot',
          },
        ]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: t ? 'عذراً، لا يمكن الاتصال بالخادم الآن' : 'Sorry, cannot connect to the server right now.',
          type: 'text',
          sender: 'bot',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
              uploadImageForDetection(result.assets[0].uri);
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
              uploadImageForDetection(result.assets[0].uri);
            }
          }
        },
        { text: t ? 'إلغاء' : 'Cancel', style: 'cancel' }
      ]
    );
  };

  const uploadImageForDetection = async (uri) => {
    setIsDetecting(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      const response = await fetch(`${API_URL}/detect_food`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) throw new Error('Detection failed');
      const data = await response.json();
      
      if (data.detected_items && data.detected_items.length > 0) {
        const itemsStr = '- ' + data.detected_items.join('\n- ');
        setInput(prev => prev ? prev + '\n' + itemsStr : itemsStr);
      } else {
        Alert.alert(t ? 'تنبيه' : 'Alert', t ? 'لم أتمكن من التعرف على مكونات طعام واضحة في الصورة.' : 'Could not detect clear food items in the image.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert(t ? 'خطأ' : 'Error', t ? 'حدث خطأ أثناء فحص الصورة.' : 'Error checking image.');
    } finally {
      setIsDetecting(false);
    }
  };

  const startRecording = async () => {
    if (isRecordingRef.current) return;
    try {
      isRecordingRef.current = true;
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== 'granted') {
        isRecordingRef.current = false;
        Alert.alert(t ? 'خطأ' : 'Error', t ? 'نحتاج إذن الوصول للمايكروفون' : 'Microphone permission required');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(newRecording);
    } catch (err) {
      isRecordingRef.current = false;
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!isRecordingRef.current || !recording) {
      isRecordingRef.current = false;
      return;
    }
    try {
      isRecordingRef.current = false;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      setIsTranscribing(true);
      try {
        const formData = new FormData();
        formData.append('audio', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          type: 'audio/m4a',
          name: 'recording.m4a',
        });

        const response = await fetch(`${API_URL}/transcribe`, {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        if (data.text) {
          handleSend(data.text);
        }
      } catch (error) {
        console.error('Transcription error:', error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            text: t ? 'عذراً، لم أتمكن من فهم الصوت.' : "Sorry, couldn't transcribe the audio.",
            type: 'text',
            sender: 'bot',
          },
        ]);
      } finally {
        setIsTranscribing(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsTranscribing(false);
    }
  };

  const toggleFavorite = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isFavorite: !msg.isFavorite } : msg
      )
    );
  };

  const handleToggleRecipeFavorite = (messageId, recipeId) => {
    let recipeToToggle = null;
    let isCurrentlyFavorite = false;

    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId && msg.type === 'recipes') {
          const updatedRecipes = msg.recipes.map((r) => {
            if (r.id === recipeId) {
              recipeToToggle = r;
              isCurrentlyFavorite = r.isFavorite;
              return { ...r, isFavorite: !r.isFavorite };
            }
            return r;
          });
          return { ...msg, recipes: updatedRecipes };
        }
        return msg;
      })
    );

    if (recipeToToggle && setFavorites) {
      if (isCurrentlyFavorite) {
        // remove from favorites
        setFavorites(prev => prev.filter(r => r.id !== recipeId));
      } else {
        // add to favorites
        setFavorites(prev => {
          if (!prev.find(r => r.id === recipeId)) {
            return [...prev, recipeToToggle];
          }
          return prev;
        });
      }
    }
  };

  const androidPaddingBottom = keyboardHeight > 0 ? keyboardHeight + 24 : insets.bottom;
  const paddingBottom = Platform.OS === 'ios' ? insets.bottom : androidPaddingBottom;

  return (
    <View style={[styles.container, isDark && { backgroundColor: '#121212' }, { paddingTop: insets.top, paddingBottom }]}>
      <KeyboardAvoidingView behavior="padding" enabled={Platform.OS === 'ios'} style={{ flex: 1 }} keyboardVerticalOffset={0}>

        {/* Header */}
        <View style={[styles.chatHeader, isDark && { borderBottomColor: '#222' }]}>
          <TouchableOpacity
            onPress={() => (user?.isLoggedIn && !user?.isGuest) ? navigation.navigate('AccountInfo') : navigation.navigate('Login')}
            style={[(!user?.isLoggedIn || user?.isGuest) && styles.loginBadge, (!user?.isLoggedIn || user?.isGuest) && isDark && { backgroundColor: '#2D3A30' }]}
          >
            {user?.isLoggedIn && !user?.isGuest ? (
              <Image 
                source={{ uri: user?.profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} 
                style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#EEE' }} 
              />
            ) : (
              <Text style={styles.loginBadgeText}>{t ? 'دخول' : 'Login'}</Text>
            )}
          </TouchableOpacity>

          <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>Cook with AI</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Favorites')}><Star color="#2D8C46" size={22} /></TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Settings color="#2D8C46" size={22} style={{ marginLeft: 15 }} /></TouchableOpacity>
          </View>
        </View>

        {/* Body */}
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
          <ScrollView 
            ref={scrollViewRef}
            style={{ flex: 1, padding: 15 }} 
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          >
            {messages.map((msg) => {
              if (msg.type === 'recipes') {
                return (
                  <RecipeCarousel 
                    key={msg.id} 
                    recipes={msg.recipes} 
                    isDark={isDark} 
                    t={t}
                    onToggleFavorite={(recipeId) => handleToggleRecipeFavorite(msg.id, recipeId)} 
                    onPressRecipe={(recipe) => handleSend(t ? `أريد البدء بتحضير وصفة: ${recipe.title}` : `I want to start cooking recipe: ${recipe.title}`)}
                  />
                );
              }

              return (
                <View key={msg.id} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <View style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.botBubble(isDark), { marginBottom: 0 }]}>
                    {msg.type === 'text' && (
                      <Text style={{ color: msg.sender === 'user' ? '#fff' : (isDark ? '#fff' : '#000') }}>{msg.text}</Text>
                    )}
                    {msg.type === 'rich_text' && msg.blocks && (
                      <View style={{ width: '100%' }}>
                        {msg.blocks.map((block, index) => {
                          if (block.type === 'highlight_box') {
                            const bgColor = block.color === 'red' ? (isDark ? '#4A1C1C' : '#FFEBEB') 
                              : block.color === 'green' ? (isDark ? '#1C4A26' : '#E8F5E9')
                              : (isDark ? '#1C314A' : '#E3F2FD');
                            const textColor = block.color === 'red' ? (isDark ? '#FFAAAA' : '#D32F2F')
                              : block.color === 'green' ? (isDark ? '#A5D6A7' : '#2E7D32')
                              : (isDark ? '#90CAF9' : '#1565C0');
                            return (
                              <View key={index} style={{ backgroundColor: bgColor, padding: 10, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: textColor + '40' }}>
                                <Text style={{ color: textColor, fontWeight: 'bold', textAlign: 'center', writingDirection: 'rtl' }}>{block.text}</Text>
                              </View>
                            );
                          } else if (block.type === 'header') {
                            return <Text key={index} style={{ color: isDark ? '#fff' : '#000', fontSize: 16, fontWeight: 'bold', marginTop: 6, marginBottom: 6, textAlign: 'right', writingDirection: 'rtl' }}>{block.text}</Text>;
                          } else if (block.type === 'list') {
                            return (
                              <View key={index} style={{ marginBottom: 8, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', padding: 10, borderRadius: 8 }}>
                                {block.items.map((item, i) => (
                                  <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 4 }}>
                                    <Text style={{ color: isDark ? '#4CAF50' : '#2D8C46', marginLeft: 6, fontWeight: 'bold' }}>•</Text>
                                    <Text style={{ color: isDark ? '#ddd' : '#333', flex: 1, textAlign: 'right', writingDirection: 'rtl' }}>{item}</Text>
                                  </View>
                                ))}
                              </View>
                            );
                          } else {
                            return <Text key={index} style={{ color: isDark ? '#ddd' : '#333', marginBottom: 8, lineHeight: 20, textAlign: 'right', writingDirection: 'rtl' }}>{block.text}</Text>;
                          }
                        })}
                      </View>
                    )}
                    {msg.type === 'image' && (
                      <Image source={{ uri: msg.imageUri }} style={{ width: 200, height: 150, borderRadius: 10 }} />
                    )}
                    {msg.type === 'audio' && (
                      <Text style={{ color: '#fff', fontStyle: 'italic' }}>🎵 voice note ({msg.duration})</Text>
                    )}
                  </View>
                </View>
              );
            })}
            {isTyping && (
              <View style={[styles.messageBubble, styles.botBubble(isDark), { alignSelf: 'flex-start' }]}>
                <Text style={{ color: isDark ? '#fff' : '#000', fontStyle: 'italic' }}>
                  {t ? 'المساعد يكتب...' : 'Assistant is typing...'}
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        {/* Input */}
        <View style={[styles.chatInputWrapper, isDark && { borderTopColor: '#222', backgroundColor: '#121212' }]}>
          <View style={[styles.chatInputContainer, isDark && { backgroundColor: '#1E1E1E' }]}>
            
            <TouchableOpacity onPress={handlePickImage} style={styles.iconButton} disabled={isDetecting}>
              {isDetecting ? (
                <ActivityIndicator color={isDark ? '#aaa' : '#666'} size="small" />
              ) : (
                <Camera color={isDark ? '#aaa' : '#666'} size={24} />
              )}
            </TouchableOpacity>

            <TextInput
              placeholder={t ? "اكتب للمساعد الذكي..." : "Message Cook with AI..."}
              placeholderTextColor={isDark ? '#666' : '#999'}
              style={[styles.chatTextInput, isDark && { color: '#fff' }]}
              value={input}
              onChangeText={setInput}
              multiline
            />
          </View>

          {input.trim() ? (
            <TouchableOpacity style={styles.mainActionBtn} onPress={() => handleSend()}>
              <ArrowUp color="#fff" size={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.mainActionBtn, recording && styles.voiceBtnRecording, isTranscribing && { opacity: 0.7 }]}
              onPressIn={startRecording}
              onPressOut={stopRecording}
              disabled={isTranscribing}
            >
              {isTranscribing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Mic color="#fff" size={24} />
              )}
            </TouchableOpacity>
          )}
        </View>

      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FCFCFC' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  loginBadge: { backgroundColor: '#EBF4ED', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  loginBadgeText: { color: '#2D8C46', fontWeight: '700', fontSize: 13 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  chatBody: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  aiSparkBox: { width: 70, height: 70, backgroundColor: '#F3F4F6', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  aiWelcomeText: { fontSize: 15, color: '#666', textAlign: 'center', lineHeight: 22, fontWeight: '500' },
  chatInputWrapper: { flexDirection: 'row', alignItems: 'flex-end', padding: 10, borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FCFCFC' },
  chatInputContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F3F4F6', borderRadius: 25, paddingHorizontal: 15, alignItems: 'center', minHeight: 50, marginRight: 10 },
  chatTextInput: { flex: 1, marginHorizontal: 10, fontSize: 15, color: '#000', paddingVertical: 12, maxHeight: 120 },
  iconButton: { padding: 5 },
  mainActionBtn: { width: 50, height: 50, backgroundColor: '#2D8C46', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  messageBubble: { padding: 12, borderRadius: 15, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#2D8C46' },
  botBubble: (isDark) => ({ alignSelf: 'flex-start', backgroundColor: isDark ? '#222' : '#EAEAEA' }),
  voiceBtnRecording: { transform: [{ scale: 1.1 }] },
});
