import React, { createContext, useState, useContext } from 'react';
import { useColorScheme } from 'react-native';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');
  const [lang, setLang] = useState('ar');
  const [user, setUser] = useState(null);

  // دالة لتغيير اللغة بسهولة
  const toggleLang = () => setLang(prev => (prev === 'ar' ? 'en' : 'ar'));
  
  // دالة لتغيير الثيم
  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AppContext.Provider value={{ 
      isDark, setIsDark, toggleTheme,
      lang, setLang, toggleLang,
      user, setUser 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);