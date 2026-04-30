import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const FavoritesScreen = () => {
  // بيانات تجريبية للوصفات المفضلة
  const [favorites, setFavorites] = useState([
    { id: '1', title: 'Pasta Primavera', time: '25 min', image: 'https://via.placeholder.com/150' },
    { id: '2', title: 'Grilled Chicken', time: '40 min', image: 'https://via.placeholder.com/150' },
    { id: '3', title: 'Greek Salad', time: '15 min', image: 'https://via.placeholder.com/150' },
  ]);

  const renderFavoriteItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <View style={styles.timeContainer}>
          <Icon name="clock-outline" size={16} color="#666" />
          <Text style={styles.recipeTime}>{item.time}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.heartButton}>
        <Icon name="heart" size={24} color="#E63946" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorites</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="heart-outline" size={80} color="#ccc" />
          <Text style={styles.emptyText}>No favorites yet. Start saving some recipes!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D6A4F',
    textAlign: 'center',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    marginBottom: 15,
    padding: 10,
    alignItems: 'center',
    // تأثير الظل
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardInfo: {
    flex: 1,
    paddingLeft: 15,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  heartButton: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default FavoritesScreen;