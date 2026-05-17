import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Settings, Star, Send, Mic, Camera } from 'lucide-react-native';

export default function ChatScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Cook with AI</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}><Star color="#2D5A27" style={{marginRight: 15}}/></TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}><Settings color="#2D5A27" /></TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.chatBody}>
        <View style={styles.aiIcon}><Text style={{fontSize: 40}}>✨</Text></View>
        <Text style={styles.welcomeMsg}>Welcome! I'm your smart assistant. What are we cooking today?</Text>
      </View>

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <Camera size={22} color="#2D5A27" style={{marginRight: 10}} />
          <TextInput placeholder="Message Cook with AI..." style={{flex: 1}} />
          <Mic size={22} color="#2D5A27" />
        </View>
        <TouchableOpacity style={styles.sendBtn}><Send size={20} color="white" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderColor: '#EEE' },
  headerText: { fontSize: 20, fontWeight: 'bold', color: '#2D5A27' },
  headerIcons: { flexDirection: 'row' },
  chatBody: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  aiIcon: { width: 80, height: 80, backgroundColor: '#E8F5E9', borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  welcomeMsg: { textAlign: 'center', fontSize: 18, color: '#2D5A27', fontWeight: '500' },
  inputArea: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  inputContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 30, alignItems: 'center', marginRight: 10 },
  sendBtn: { backgroundColor: '#2D5A27', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});