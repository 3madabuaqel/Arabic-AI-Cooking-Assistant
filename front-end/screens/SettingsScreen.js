import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Switch,
  StyleSheet
} from 'react-native';
import { 
  ArrowLeft, 
  User, 
  Camera, 
  Bell, 
  Globe, 
  ChevronRight, 
  ChevronLeft, 
  LogOut, 
  Moon 
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker'; // تأكدي من تثبيت حزمة expo-image-picker

export default function SettingsScreen({ 
  navigation, 
  lang, 
  setLang, 
  themeMode, 
  setThemeMode, 
  isDark, 
  user, 
  setUser 
}) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const t = lang === 'ar';

  const handlePickImage = async (useCamera = false) => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        t ? "مطلوب إذن" : "Permission Required", 
        t ? "يجب السماح للوصول للصور أو الكاميرا" : "We need access to your photos/camera"
      );
      return;
    }

    let result;
    const pickerOptions = {
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    };

    if (useCamera) {
      result = await ImagePicker.launchCameraAsync(pickerOptions);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
    }

    if (!result.canceled) {
      setUser({ ...user, profileImage: result.assets[0].uri });
    }
  };

  const showImageSourceAlert = () => {
    Alert.alert(
      t ? "تغيير الصورة" : "Change Photo",
      t ? "اختر مصدراً" : "Select Source",
      [
        { text: t ? "المعرض" : "Gallery", onPress: () => handlePickImage(false) },
        { text: t ? "الكاميرا" : "Camera", onPress: () => handlePickImage(true) },
        { text: t ? "إلغاء" : "Cancel", style: "cancel" }
      ]
    );
  };

  const handleLogout = () => {
    setUser({ ...user, isLoggedIn: false });
    navigation.replace('Login');
  };

  const changeTheme = (mode) => {
    setThemeMode(mode); // mode: 'light' or 'dark'
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      
      {/* HEADER - الهيدر */}
      <View style={[styles.header, isDark && { borderBottomColor: '#222' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color={isDark ? '#fff' : '#000'} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>
          {t ? 'الإعدادات' : 'Settings'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 30 }}>
        
        {/* PROFILE AREA - قسم البروفايل */}
        <View style={styles.profileArea}>
          <TouchableOpacity onPress={showImageSourceAlert}>
            <View style={styles.profileAvatarWrapper}>
              {user?.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  style={styles.profileAvatar}
                />
              ) : (
                <View style={[styles.profileAvatar, styles.avatarPlaceholder, isDark && { backgroundColor: '#222' }]}>
                  <User color="#2D8C46" size={40} />
                </View>
              )}
              <View style={styles.editIconBadge}>
                <Camera color="#fff" size={12} />
              </View>
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, isDark && { color: '#fff' }]}>
            {user?.name || (t ? 'مستخدم زائر' : 'Guest User')}
          </Text>
        </View>

        {/* SETTINGS MENU - القائمة */}
        <View style={{ paddingHorizontal: 20 }}>
          
          {/* معلومات الحساب */}
          <TouchableOpacity style={[styles.menuRow, isDark && { borderBottomColor: '#222' }]} onPress={() => navigation.navigate('AccountInfo')}>
            <View style={[styles.rowLeft, t && { flexDirection: 'row-reverse' }]}>
              <User color="#2D8C46" size={22} />
              <Text style={[styles.menuLabel, t ? { marginRight: 15 } : { marginLeft: 15 }, isDark && { color: '#fff' }]}>
                {t ? 'معلومات الحساب' : 'Account Info'}
              </Text>
            </View>
            {t ? <ChevronLeft color="#888" size={20} /> : <ChevronRight color="#888" size={20} />}
          </TouchableOpacity>

          {/* الإشعارات */}
          <TouchableOpacity 
            style={[styles.menuRow, isDark && { borderBottomColor: '#222' }]} 
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <View style={[styles.rowLeft, t && { flexDirection: 'row-reverse' }]}>
              <Bell color="#2D8C46" size={22} />
              <Text style={[styles.menuLabel, t ? { marginRight: 15 } : { marginLeft: 15 }, isDark && { color: '#fff' }]}>
                {t ? 'الإشعارات' : 'Notifications'}
              </Text>
            </View>
            <Text style={{ color: notificationsEnabled ? '#2D8C46' : '#888', fontWeight: '600' }}>
              {notificationsEnabled ? (t ? 'مفعلة' : 'On') : (t ? 'معطلة' : 'Off')}
            </Text>
          </TouchableOpacity>

          {/* تغيير اللغة */}
          <TouchableOpacity 
            style={[styles.menuRow, isDark && { borderBottomColor: '#222' }]} 
            onPress={() => setLang(lang === 'en' ? 'ar' : 'en')}
          >
            <View style={[styles.rowLeft, t && { flexDirection: 'row-reverse' }]}>
              <Globe color="#2D8C46" size={22} />
              <Text style={[styles.menuLabel, t ? { marginRight: 15 } : { marginLeft: 15 }, isDark && { color: '#fff' }]}>
                {t ? 'اللغة' : 'Language'}
              </Text>
            </View>
            <Text style={{ color: '#2D8C46', fontWeight: 'bold' }}>
              {lang === 'en' ? 'English' : 'العربية'}
            </Text>
          </TouchableOpacity>

          {/* كرت تبديل الوضع الداكن (Dark Mode) */}
          <View style={[styles.themeCard, isDark && { backgroundColor: '#1E1E1E' }]}>
            <View style={[styles.themeLeft, t && { flexDirection: 'row-reverse' }]}>
              <View style={[styles.themeIcon, { backgroundColor: isDark ? '#2D2D2D' : '#F3F4F6' }]}>
                <Moon size={22} color={isDark ? '#FFD54F' : '#555'} />
              </View>

              <View style={[t ? { marginRight: 15, alignItems: 'flex-end' } : { marginLeft: 15 }]}>
                <Text style={[styles.themeTitle, isDark && { color: '#fff' }]}>
                  {t ? 'الوضع الداكن' : 'Dark Mode'}
                </Text>
                <Text style={styles.themeSubtitle}>
                  {t ? 'تغيير مظهر التطبيق' : 'Change app appearance'}
                </Text>
              </View>
            </View>

            <Switch
              value={isDark}
              onValueChange={(value) => changeTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#D1D5DB', true: '#2D8C46' }}
              thumbColor={isDark ? '#fff' : '#f4f3f4'}
            />
          </View>

          {/* زر تسجيل الخروج */}
          <TouchableOpacity style={[styles.logoutRow, t && { flexDirection: 'row-reverse' }]} onPress={handleLogout}>
            <Text style={[styles.logoutLabel, t ? { marginRight: 10 } : { marginLeft: 10 }]}>
              {t ? 'تسجيل الخروج' : 'Log Out'}
            </Text>
            <LogOut color="#D32F2F" size={20} />
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  profileArea: {
    alignItems: 'center',
    marginVertical: 25,
  },
  profileAvatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  profileAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EBF4ED',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1F0E6',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: '#2D8C46',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  themeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 20,
    marginTop: 25,
  },
  themeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  themeSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#FFE3E3',
  },
  logoutLabel: {
    color: '#D32F2F',
    fontSize: 15,
    fontWeight: '700',
  },
});