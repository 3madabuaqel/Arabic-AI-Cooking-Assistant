import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Trash2 } from 'lucide-react-native';

const FAVORITES = [
  { id: '1', title: 'Healthy Avocado Toast', time: '10 mins', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=1000' },
  { id: '2', title: 'Grilled Chicken Salad', time: '20 mins', img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000' },
];

const FavoritesScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}><ArrowLeft color="#2D5A27" /></TouchableOpacity>
      <Text style={styles.title}>My Favorites</Text>
      <View style={{ width: 24 }} />
    </View>
    <FlatList
      data={FAVORITES}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}>
          <Image source={{ uri: item.img }} style={styles.cardImg} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
          <TouchableOpacity><Trash2 size={20} color="#C62828" /></TouchableOpacity>
        </TouchableOpacity>
      )}
    />
  </SafeAreaView>
);

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