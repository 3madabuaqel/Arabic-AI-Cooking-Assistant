import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image 
} from 'react-native';
import { ArrowLeft, Star, Trash2 } from 'lucide-react-native';

export default function FavoritesScreen({ route, navigation, isDark }) {
  const initialFavorites = route?.params?.favorites || [
    {
      id: '1',
      title: 'Avocado & Arugula Z...',
      time: '15 mins',
      category: 'Healthy',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '2',
      title: 'Dark Cocoa Lava Clo...',
      time: '45 mins',
      category: 'Dessert',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '3',
      title: 'Hand-Crushed Basil ...',
      time: '20 mins',
      category: 'Italian',
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?q=80&w=200&auto=format&fit=crop',
    },
    {
      id: '4',
      title: 'Crispy Skin Citrus Sa...',
      time: '25 mins',
      category: 'High Protein',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=200&auto=format&fit=crop',
    }
  ];

  const [favorites, setFavorites] = useState(initialFavorites);

  // دالة لحذف الأكلة من المفضلة عند الضغط على سلة المهملات
  const handleRemove = (id) => {
    setFavorites((prev) => prev.filter(item => item.id !== id));
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      
      {/* الهيدر العلوي */}
      <View style={[styles.header, isDark && { borderBottomColor: '#222' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <ArrowLeft color="#2D8C46" size={24} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, isDark && { color: '#fff' }]}>My Favorites</Text>
        
        <View style={styles.headerBtn}>
          <Star color="#2D8C46" size={24} fill="#2D8C46" />
        </View>
      </View>

      {/* قائمة الأكلات المفضلة */}
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && { color: '#666' }]}>No favorites added yet.</Text>
          </View>
        ) : (
          favorites.map((item) => (
            <View key={item.id} style={[styles.recipeCard, isDark && { backgroundColor: '#1E1E1E' }]}>
              
              {/* صورة الأكلة */}
              <Image source={{ uri: item.image }} style={styles.recipeImage} />
              
              {/* تفاصيل الأكلة */}
              <View style={styles.recipeDetails}>
                <Text 
                  numberOfLines={1} 
                  style={[styles.recipeTitle, isDark && { color: '#fff' }]}
                >
                  {item.title}
                </Text>
                <Text style={styles.recipeSub}>
                  {item.time} • {item.category}
                </Text>
              </View>

              {/* زر الحذف (أيقونة السلة الخضراء) */}
              <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.deleteBtn}>
                <Trash2 color="#2D8C46" size={20} />
              </TouchableOpacity>

            </View>
          ))
        )}
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A', textAlign: 'center' },
  listContainer: { padding: 20 },
  recipeCard: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    padding: 15, 
    marginBottom: 15, 
    alignItems: 'center',
    // تأثير الظل الخفيف المحيط بالبطاقة كما في الصورة
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  recipeImage: { width: 75, height: 75, borderRadius: 16, backgroundColor: '#EAEAEA' },
  recipeDetails: { flex: 1, marginLeft: 15, justifyContent: 'center' },
  recipeTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  recipeSub: { fontSize: 13, color: '#666', fontWeight: '500' },
  deleteBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { fontSize: 16, color: '#999', fontWeight: '500' }
});