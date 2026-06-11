import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import RecipeCard from './RecipeCard';

export default function RecipeCarousel({ recipes, isDark, t, onToggleFavorite, onPressRecipe }) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={recipes}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        scrollEnabled={false} // Disable scrolling so it expands fully inside the Chat ScrollView
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            isDark={isDark}
            t={t}
            onToggleFavorite={() => onToggleFavorite(item.id)}
            onPress={() => onPressRecipe(item)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    marginVertical: 10,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
});
