import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ArrowLeft, LogOut, RefreshCw, Bell, Moon } from 'lucide-react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color="#2D5A27" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{width: 24}}/>
      </View>

      <ScrollView>
        <View style={styles.profileBox}>
          <Image source={{uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000'}} style={styles.avatar} />
          <Text style={styles.name}>Layla</Text>
          <Text style={styles.email}>layla@email.com</Text>
          <TouchableOpacity style={styles.editBtn}><Text style={{color: '#2D5A27'}}>Edit Profile</Text></TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT SECURITY</Text>
          <TouchableOpacity style={styles.item}><Text>Reset Password</Text><RefreshCw size={18} color="#2D5A27"/></TouchableOpacity>
          <TouchableOpacity style={[styles.item, {backgroundColor: '#FFF5F5'}]} onPress={() => navigation.navigate('Welcome')}>
            <Text style={{color: '#C62828'}}>Log Out</Text><LogOut size={18} color="#C62828"/>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  profileBox: { alignItems: 'center', padding: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold' },
  email: { color: '#666', marginBottom: 15 },
  editBtn: { borderWidth: 1, borderColor: '#2D5A27', paddingHorizontal: 25, paddingVertical: 8, borderRadius: 20 },
  section: { padding: 25 },
  sectionTitle: { fontSize: 12, color: '#999', fontWeight: 'bold', marginBottom: 15 },
  item: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#F5F5F5', padding: 18, borderRadius: 15, marginBottom: 10 }
});