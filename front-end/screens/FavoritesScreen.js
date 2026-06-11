import React from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Trash2 } from 'lucide-react-native';

export default function FavoritesScreen({ navigation, isDark, favorites, setFavorites }) {
  
  // Function to remove meal from favorites on trash click
  const handleRemove = (id) => {
    if (setFavorites) {
      setFavorites((prev) => prev.filter(item => item.id !== id));
    }
  };

  const currentFavorites = favorites || [];

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
        {currentFavorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, isDark && { color: '#666' }]}>No favorites added yet.</Text>
          </View>
        ) : (
          currentFavorites.map((item) => (
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
                  {item.time || '15 mins'} • {item.category || 'Healthy'}
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
    // Light shadow effect surrounding the card like in the image
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