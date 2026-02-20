import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setRecipeMatches, setLoading } from '../store/slices/recipeSlice';
import { searchRecipesByIngredients } from '../services/spoonacular.service';
import { convertToRecipeMatches } from '../utils/recipeMatching';
import RecipeCard from '../components/recipe/RecipeCard';
import colors from '../theme/colors';

const HomeScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const { matches, loading } = useSelector((state: RootState) => state.recipes);
  const [refreshing, setRefreshing] = React.useState(false);

  const loadRecipes = async () => {
    if (inventory.length === 0) return;

    try {
      dispatch(setLoading(true));
      const ingredientNames = inventory.map(item => item.name);
      const recipes = await searchRecipesByIngredients(ingredientNames, 10);
      const recipeMatches = convertToRecipeMatches(recipes, inventory);
      dispatch(setRecipeMatches(recipeMatches));
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [inventory]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  };

  if (inventory.length === 0) {
    return (
      <LinearGradient
        colors={[colors.primaryLight, colors.secondaryLight, colors.accentOrange]}
        style={styles.emptyContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.emptyContent}>
          <Text style={styles.emptyIcon}>🍽️</Text>
          <Text style={styles.emptyTitle}>No Ingredients Yet</Text>
          <Text style={styles.emptyText}>
            Scan your fridge to discover amazing recipes you can make!
          </Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={matches}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            onPress={() => navigation.navigate('RecipeDetail', { recipeId: item.id })}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    marginHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HomeScreen;
