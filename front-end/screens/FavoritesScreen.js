import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';



const FavoritesScreen = ({ navigation, favorites, setFavorites, lang, isDark }) => {
  const t = lang === 'ar';
  
  const removeFavorite = (id) => {
    setFavorites(favorites.filter(fav => fav.id !== id));
  };

  return (
    <SafeAreaView style={[styles.container, isDark && { backgroundColor: '#121212' }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color={isDark ? '#fff' : '#2D5A27'} /></TouchableOpacity>
        <Text style={[styles.title, isDark && { color: '#fff' }]}>{t ? 'المفضلة' : 'My Favorites'}</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={favorites || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, isDark && { backgroundColor: '#1E1E1E' }]} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
            <Image source={{ uri: item.img }} style={styles.cardImg} />
            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, isDark && { color: '#fff' }]}>{item.title}</Text>
              <Text style={styles.cardTime}>{item.time}</Text>
            </View>
            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
              <Trash2 size={20} color="#C62828" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: isDark ? '#aaa' : '#666', fontSize: 16 }}>
              {t ? 'لا توجد وصفات في المفضلة.' : 'No favorites yet.'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2D5A27' },
  card: { flexDirection: 'row', margin: 15, backgroundColor: '#F9F9F9', borderRadius: 15, padding: 10, alignItems: 'center' },
  cardImg: { width: 70, height: 70, borderRadius: 10 },
  cardInfo: { flex: 1, marginLeft: 15 },
  cardTitle: { fontWeight: 'bold', fontSize: 16 },
  cardTime: { color: '#666', fontSize: 12 }
});

export default FavoritesScreen;