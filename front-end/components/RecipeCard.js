import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Star, Clock, ChefHat, Info, Search } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function RecipeCard({ recipe, isDark, t, onToggleFavorite, onPress }) {
  const { 
    title, 
    image, 
    time, 
    calories, 
    difficulty, 
    aiWarning, 
    searchMethod,
    isFavorite,
  } = recipe;

  const isAIGenerated = searchMethod && searchMethod.includes('الذكاء');

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      {/* Recipe Image (Only for DB Recipes) */}
      {!isAIGenerated && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          
          {/* Search Method Badge */}
          {searchMethod && (
            <View style={styles.methodBadge}>
              <Search size={12} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.methodText}>{searchMethod}</Text>
            </View>
          )}

          {/* Favorite Button Overlay */}
          <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
            <Star 
              size={20} 
              color={isFavorite ? "#FFD700" : "#fff"} 
              fill={isFavorite ? "#FFD700" : "rgba(0,0,0,0.3)"} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 8 }}>
            <Text style={[styles.title, isDark && { color: '#fff' }, { marginBottom: 0 }]} numberOfLines={2}>
              {title}
            </Text>
            {isAIGenerated && (
              <Text style={{ fontSize: 10, color: '#999', marginLeft: 6, fontStyle: 'italic' }}>Ai✨</Text>
            )}
          </View>
          {isAIGenerated && (
            <TouchableOpacity onPress={onToggleFavorite} style={{ padding: 4 }}>
              <Star 
                size={20} 
                color={isFavorite ? "#FFD700" : (isDark ? "#888" : "#ccc")} 
                fill={isFavorite ? "#FFD700" : "transparent"} 
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Meta Tags */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Clock size={14} color="#2D8C46" />
            <Text style={[styles.metaText, isDark && { color: '#ccc' }]}>{time}</Text>
          </View>
          <View style={styles.metaItem}>
            <ChefHat size={14} color="#FF9F43" />
            <Text style={[styles.metaText, isDark && { color: '#ccc' }]}>{difficulty}</Text>
          </View>
        </View>

        {/* Gemini AI Warning (Allergy / Health Note) */}
        {aiWarning && (
          <View style={[styles.warningBox, isDark ? styles.warningBoxDark : styles.warningBoxLight]}>
            <Info size={16} color={isDark ? "#64B5F6" : "#1976D2"} style={{ marginTop: 2 }} />
            <Text style={[styles.warningText, isDark && { color: '#E0E0E0' }]} numberOfLines={2}>
              <Text style={{ fontWeight: 'bold' }}>{t ? 'ملاحظة: ' : 'Note: '}</Text>
              {aiWarning}
            </Text>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
          <Text style={styles.actionBtnText}>{t ? 'ابدأ الطبخ' : 'Cook'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '85%',
    alignSelf: 'flex-start',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardLight: {
    backgroundColor: '#fff',
    borderColor: '#F0F0F0',
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  imageContainer: {
    width: '100%',
    height: 120,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  methodBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  warningBox: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  warningBoxLight: {
    backgroundColor: '#F0F4F8',
    borderLeftWidth: 3,
    borderLeftColor: '#1976D2',
  },
  warningBoxDark: {
    backgroundColor: 'rgba(25, 118, 210, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#64B5F6',
  },
  warningText: {
    fontSize: 11,
    color: '#333333',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  actionBtn: {
    backgroundColor: '#2D8C46',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
