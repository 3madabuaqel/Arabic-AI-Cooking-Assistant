import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { ArrowLeft, Star, Clock, Flame } from 'lucide-react-native';

const RecipeDetailScreen = ({ navigation }) => (
  <SafeAreaView style={styles.container}>
    <ScrollView>
      <Image source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000' }} style={styles.mainImg} />
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <ArrowLeft color="white" />
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.recipeName}>Grilled Chicken Salad</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}><Clock size={16} color="#666"/><Text> 20 mins</Text></View>
          <View style={styles.stat}><Flame size={16} color="#666"/><Text> 350 kcal</Text></View>
          <View style={styles.stat}><Star size={16} color="#FFB300"/><Text> 4.8</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <Text style={styles.text}>• 200g Chicken Breast{"\n"}• Fresh Lettuce & Spinach{"\n"}• Cherry Tomatoes{"\n"}• Olive Oil & Lemon</Text>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <Text style={styles.text}>1. Grill the chicken until golden brown.{"\n"}2. Chop the vegetables and mix in a bowl.{"\n"}3. Add dressing and serve fresh.</Text>
      </View>
    </ScrollView>
    <TouchableOpacity style={styles.cookBtn}><Text style={styles.cookBtnText}>Add to Favorites</Text></TouchableOpacity>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mainImg: { width: '100%', height: 300 },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  content: { padding: 25, marginTop: -30, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  recipeName: { fontSize: 26, fontWeight: 'bold', color: '#1A3C17' },
  statsRow: { flexDirection: 'row', marginVertical: 20, gap: 20 },
  stat: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#2D5A27' },
  text: { lineHeight: 22, color: '#444' },
  cookBtn: { backgroundColor: '#2D5A27', margin: 20, padding: 18, borderRadius: 30, alignItems: 'center' },
  cookBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 }
});

export default RecipeDetailScreen;