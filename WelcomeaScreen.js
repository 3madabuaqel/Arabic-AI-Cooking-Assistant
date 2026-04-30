import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WelcomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Icon name="cog-outline" size={28} color="#2D6A4F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Icon name="star-outline" size={28} color="#2D6A4F" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.logoContainer}>
          <Icon name="silverware-fork-knife" size={50} color="#fff" />
        </View>
        <Text style={styles.title}>Ready to cook?</Text>
        <Text style={styles.description}>
          Let's go! I'm your smart assistant. Send me either text, a picture, or audio, and we'll get started.
        </Text>
      </View>

      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <Icon name="image-outline" size={24} color="#2D6A4F" style={{marginHorizontal: 10}} />
          <Icon name="camera-outline" size={24} color="#2D6A4F" />
          <TextInput placeholder="Ask for a recipe..." style={styles.textInput} />
          <Icon name="microphone-outline" size={24} color="#2D6A4F" />
        </View>
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={() => navigation.navigate('Login')}
        >
          <Icon name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row-reverse', padding: 20, gap: 15 },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  logoContainer: { backgroundColor: '#2D6A4F', width: 90, height: 90, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  inputWrapper: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  inputContainer: { flex: 1, flexDirection: 'row', backgroundColor: '#F0F0F0', borderRadius: 25, alignItems: 'center', paddingHorizontal: 10, marginRight: 10, height: 50 },
  textInput: { flex: 1, marginLeft: 10 },
  sendButton: { backgroundColor: '#2D6A4F', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }
});

export default WelcomeScreen;