import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Modal, SafeAreaView as RNSafeAreaView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Trash2, X } from 'lucide-react-native';

const renderFormattedText = (text, isDark) => {
  if (!text || typeof text !== 'string') return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text key={index} style={{ fontWeight: '900', fontSize: 16, color: isDark ? '#fff' : '#000' }}>{part.replace(/\*\*/g, '')}</Text>;
    }
    return <Text key={index}>{part}</Text>;
  });
};

const ExpandableBlock = ({ block, isDark }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={{ marginBottom: 10 }}>
      <TouchableOpacity 
        style={{ backgroundColor: isDark ? '#1C4A26' : '#E8F5E9', padding: 12, borderRadius: 8, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#2D8C46' }} 
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={{ color: isDark ? '#A5D6A7' : '#2D8C46', fontWeight: 'bold', fontSize: 16 }}>{block.title}</Text>
        <Text style={{ color: isDark ? '#A5D6A7' : '#2D8C46', fontWeight: 'bold', fontSize: 18 }}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={{ padding: 12, backgroundColor: isDark ? '#2A2A2A' : '#F5F5F5', borderBottomLeftRadius: 8, borderBottomRightRadius: 8, marginTop: -4, borderWidth: 1, borderTopWidth: 0, borderColor: '#2D8C46' }}>
           {block.items ? (
             block.items.map((item, i) => (
               <View key={i} style={{ flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 12, backgroundColor: isDark ? '#333' : '#fff', padding: 12, borderRadius: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 }}>
                 <Text style={{ color: isDark ? '#4CAF50' : '#2D8C46', marginLeft: 10, fontWeight: 'bold', fontSize: 18, marginTop: 2 }}>•</Text>
                 <Text style={{ color: isDark ? '#ddd' : '#333', flex: 1, textAlign: 'right', writingDirection: 'rtl', lineHeight: 26, fontSize: 15 }}>{renderFormattedText(item, isDark)}</Text>
               </View>
             ))
           ) : (
             <Text style={{ color: isDark ? '#ddd' : '#333', textAlign: 'right', writingDirection: 'rtl', lineHeight: 26, fontSize: 15 }}>{renderFormattedText(block.text, isDark)}</Text>
           )}
        </View>
      )}
    </View>
  );
};

export default function FavoritesScreen({ navigation, isDark, favorites, setFavorites }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  
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
            <TouchableOpacity 
              key={item.id} 
              onPress={() => setSelectedRecipe(item)}
              style={[styles.recipeCard, isDark && { backgroundColor: '#1E1E1E' }]}
            >
              
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

            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      
      {/* نافذة التفاصيل (Modal) */}
      <Modal visible={!!selectedRecipe} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedRecipe(null)}>
        <RNSafeAreaView style={{ flex: 1, backgroundColor: isDark ? '#121212' : '#F8F9FA' }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: isDark ? '#1E1E1E' : '#FFF', borderBottomWidth: 1, borderBottomColor: isDark ? '#333' : '#E0E0E0' }}>
            <TouchableOpacity onPress={() => setSelectedRecipe(null)} style={{ padding: 8 }}>
              <X color={isDark ? '#fff' : '#000'} size={24} />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isDark ? '#fff' : '#000' }}>التفاصيل</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView style={{ flex: 1 }}>
            {selectedRecipe && (
              <>
                <Image source={{ uri: selectedRecipe.image }} style={{ width: '100%', height: 250, resizeMode: 'cover' }} />
                
                <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: isDark ? '#fff' : '#1A1A1A', textAlign: 'right', marginBottom: 20 }}>
                    {selectedRecipe.title}
                  </Text>

                  {selectedRecipe.geminiBlocks && selectedRecipe.geminiBlocks.length > 0 ? (
                    selectedRecipe.geminiBlocks.map((block, index) => {
                      if (block.type === 'expandable') {
                        return <ExpandableBlock key={index} block={block} isDark={isDark} />;
                      }
                      return null;
                    })
                  ) : (
                    <View style={{ backgroundColor: isDark ? '#1E1E1E' : '#FFF', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#2D8C46' }}>
                      <Text style={{ color: isDark ? '#ccc' : '#666', textAlign: 'center', fontSize: 16, lineHeight: 24 }}>
                        لم يتم توليد تفاصيل الذكاء الاصطناعي لهذه الوصفة بعد.{'\n'}تفضل بطلبها في المحادثة أولاً ثم أضفها للمفضلة للحصول على التنسيق الكامل!
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>

        </RNSafeAreaView>
      </Modal>

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