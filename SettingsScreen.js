import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Settings</Text></View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.row}>
          <Text>Notifications</Text>
          <Switch value={true} />
        </View>
      </View>

      <TouchableOpacity style={styles.row}>
        <Text>Language</Text>
        <Text style={{color: '#999'}}>English</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.row, {marginTop: 40}]}>
        <Text style={{color: 'red'}}>Logout</Text>
        <Icon name="logout" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 50 },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  section: { padding: 20 },
  sectionTitle: { color: '#999', marginBottom: 10, textTransform: 'uppercase' },
  row: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee', alignItems: 'center' }
});

export default SettingScreen;