import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setSelectedRecipe, cacheRecipe } from '../store/slices/recipeSlice';
import { addMultipleItems } from '../store/slices/shoppingListSlice';
import { getRecipeInformation } from '../services/spoonacular.service';
import { RecipeDetail } from '../types/recipe.types';

const RecipeDetailScreen = ({ route }: any) => {
  const { recipeId } = route.params;
  const dispatch = useDispatch();
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const recipeData = await getRecipeInformation(recipeId);
      setRecipe(recipeData);
      dispatch(setSelectedRecipe(recipeData));
      dispatch(cacheRecipe(recipeData));
    } catch (error) {
      Alert.alert('Error', 'Failed to load recipe details');
    } finally {
      setLoading(false);
    }
  };

  const addToShoppingList = () => {
    if (!recipe) return;

    const inventoryNames = inventory.map(i => i.name.toLowerCase());
    const missingIngredients = recipe.extendedIngredients
      .filter(ing => !inventoryNames.includes(ing.name.toLowerCase()))
      .map(ing => ({
        id: `shopping-${Date.now()}-${ing.id}`,
        ingredientName: ing.name,
        quantity: ing.amount,
        unit: ing.unit,
        purchased: false,
        addedDate: new Date(),
      }));

    if (missingIngredients.length > 0) {
      dispatch(addMultipleItems(missingIngredients));
      Alert.alert('Success', `Added ${missingIngredients.length} items to shopping list`);
    } else {
      Alert.alert('Info', 'You have all ingredients!');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Recipe not found</Text>
      </View>
    );
  }

  const inventoryNames = inventory.map(i => i.name.toLowerCase());

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.title}>{recipe.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.metaText}>⏱️ {recipe.readyInMinutes} min</Text>
          <Text style={styles.metaText}>🍽️ {recipe.servings} servings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.extendedIngredients.map((ing, index) => {
            const hasIngredient = inventoryNames.includes(ing.name.toLowerCase());
            return (
              <View key={index} style={styles.ingredient}>
                <Text style={[styles.ingredientText, !hasIngredient && styles.ingredientMissing]}>
                  {hasIngredient ? '✓' : '○'} {ing.original}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity style={styles.button} onPress={addToShoppingList}>
          <Text style={styles.buttonText}>Add Missing to Shopping List</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.analyzedInstructions[0]?.steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <Text style={styles.stepText}>{step.step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#e5e7eb',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  ingredient: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  ingredientText: {
    fontSize: 14,
    color: '#1f2937',
  },
  ingredientMissing: {
    color: '#ef4444',
  },
  button: {
    backgroundColor: '#6366f1',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});

export default RecipeDetailScreen;
