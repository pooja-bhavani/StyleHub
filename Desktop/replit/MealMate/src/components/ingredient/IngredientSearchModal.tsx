import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { getIngredientAutocomplete, getIngredientsByCategory } from '../../services/ingredient.service';
import { searchRecipesByIngredients } from '../../services/spoonacular.service';
import colors from '../../theme/colors';

const { width, height } = Dimensions.get('window');

interface Ingredient {
  id: number;
  name: string;
  image: string;
  category: string;
}

interface IngredientSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectIngredient: (ingredient: Ingredient) => void;
}

const IngredientSearchModal: React.FC<IngredientSearchModalProps> = ({
  visible,
  onClose,
  onSelectIngredient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Ingredient[]>([]);
  const [recipePreview, setRecipePreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showRecipePreview, setShowRecipePreview] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'meat', name: 'Meat', icon: '🥩' },
    { id: 'seafood', name: 'Seafood', icon: '🐟' },
    { id: 'dairy', name: 'Dairy', icon: '🧀' },
    { id: 'grains', name: 'Grains', icon: '🌾' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'sauces', name: 'Sauces', icon: '🥫' },
    { id: 'indian', name: 'Indian', icon: '🇮🇳' },
    { id: 'chinese', name: 'Chinese', icon: '🇨🇳' },
    { id: 'italian', name: 'Italian', icon: '🇮🇹' },
    { id: 'japanese', name: 'Japanese', icon: '🇯🇵' },
    { id: 'mexican', name: 'Mexican', icon: '🇲🇽' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
  ];

  useEffect(() => {
    if (searchQuery.length > 2) {
      handleSearch();
    } else if (searchQuery.length === 0) {
      setIngredients([]);
    }
  }, [searchQuery]);

  // Load ingredients when category changes
  useEffect(() => {
    if (selectedCategory !== 'all' && searchQuery.length === 0) {
      loadCategoryIngredients(selectedCategory);
    } else if (selectedCategory === 'all') {
      setIngredients([]);
    }
  }, [selectedCategory, searchQuery]);

  // Load recipe preview when ingredients are selected
  useEffect(() => {
    if (selectedIngredients.length > 0) {
      loadRecipePreview();
    } else {
      setRecipePreview([]);
    }
  }, [selectedIngredients]);

  const loadCategoryIngredients = async (category: string) => {
    setLoading(true);
    try {
      const results = await getIngredientsByCategory(category);
      setIngredients(results);
    } catch (error) {
      console.error('Category load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRecipePreview = async () => {
    setLoadingRecipes(true);
    try {
      const ingredientNames = selectedIngredients.map(i => i.name);
      const recipes = await searchRecipesByIngredients(ingredientNames, 6);
      setRecipePreview(recipes);
    } catch (error) {
      console.error('Error loading recipe preview:', error);
    } finally {
      setLoadingRecipes(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const results = await getIngredientAutocomplete(searchQuery);
      setIngredients(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleIngredientSelection = (ingredient: Ingredient) => {
    const isSelected = selectedIngredients.some(i => i.id === ingredient.id);
    if (isSelected) {
      setSelectedIngredients(selectedIngredients.filter(i => i.id !== ingredient.id));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };

  const handleAddSelectedToInventory = () => {
    selectedIngredients.forEach(ingredient => {
      onSelectIngredient(ingredient);
    });
    setSelectedIngredients([]);
    setRecipePreview([]);
    setSearchQuery('');
    setIngredients([]);
    onClose();
  };

  const isIngredientSelected = (ingredientId: number) => {
    return selectedIngredients.some(i => i.id === ingredientId);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Ingredient</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textLight} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ingredients (e.g., tomato, chicken)..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>

        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <View style={styles.selectedContainer}>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedTitle}>
                Selected ({selectedIngredients.length})
              </Text>
              <TouchableOpacity onPress={() => setSelectedIngredients([])}>
                <Text style={styles.clearText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.selectedList}
            >
              {selectedIngredients.map((ingredient) => (
                <TouchableOpacity
                  key={ingredient.id}
                  style={styles.selectedChip}
                  onPress={() => toggleIngredientSelection(ingredient)}
                >
                  <Text style={styles.selectedChipText}>{ingredient.name}</Text>
                  <Ionicons name="close-circle" size={16} color={colors.textWhite} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Category Filter */}
        <View style={styles.categoryContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === item.id && styles.categoryChipActive,
                ]}
                onPress={() => {
                  setSelectedCategory(item.id);
                  setSearchQuery(''); // Clear search when selecting category
                  if (item.id === 'all') {
                    setIngredients([]); // Clear ingredients for "All"
                  }
                }}
              >
                <Text style={styles.categoryIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.id && styles.categoryTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoryList}
          />
        </View>

        {/* Helper Text */}
        {searchQuery.length === 0 && (
          <View style={styles.helperContainer}>
            <Text style={styles.helperTitle}>💡 Quick Tips</Text>
            <Text style={styles.helperText}>• Type any ingredient name to search</Text>
            <Text style={styles.helperText}>• Use categories for quick browsing</Text>
            <Text style={styles.helperText}>• Real food images from Spoonacular</Text>
            <Text style={styles.helperText}>• 1000+ ingredients available</Text>
          </View>
        )}

        {/* Loading */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Searching ingredients...</Text>
          </View>
        )}

        {/* Results */}
        {!loading && ingredients.length > 0 && (
          <>
            <Text style={styles.resultsCount}>
              {ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''} found
            </Text>
            <FlatList
              data={ingredients}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item }) => {
                const selected = isIngredientSelected(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.ingredientCard, selected && styles.ingredientCardSelected]}
                    onPress={() => toggleIngredientSelection(item)}
                    activeOpacity={0.7}
                  >
                    {selected && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                      </View>
                    )}
                    <Image
                      source={{ uri: item.image }}
                      style={styles.ingredientImage}
                      resizeMode="cover"
                    />
                    <View style={styles.ingredientInfo}>
                      <Text style={styles.ingredientName} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              contentContainerStyle={styles.ingredientList}
            />
          </>
        )}

        {/* No Results */}
        {!loading && searchQuery.length > 2 && ingredients.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No ingredients found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        )}

        {/* Recipe Preview Panel */}
        {selectedIngredients.length > 0 && recipePreview.length > 0 && (
          <View style={styles.recipePreviewContainer}>
            <View style={styles.recipePreviewHeader}>
              <Text style={styles.recipePreviewTitle}>
                🍳 Recipes You Can Make ({recipePreview.length})
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipePreviewList}
            >
              {recipePreview.map((recipe: any) => (
                <View key={recipe.id} style={styles.recipePreviewCard}>
                  <Image
                    source={{ uri: recipe.image }}
                    style={styles.recipePreviewImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.recipePreviewName} numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <View style={styles.recipePreviewBadge}>
                    <Text style={styles.recipePreviewBadgeText}>
                      {recipe.usedIngredientCount}/{recipe.usedIngredientCount + recipe.missedIngredientCount} ingredients
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {loadingRecipes && selectedIngredients.length > 0 && (
          <View style={styles.recipeLoadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.recipeLoadingText}>Finding recipes...</Text>
          </View>
        )}

        {/* Add to Inventory Button */}
        {selectedIngredients.length > 0 && (
          <View style={styles.addButtonContainer}>
            <TouchableOpacity
              style={styles.addToInventoryButton}
              onPress={handleAddSelectedToInventory}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[colors.primary, colors.accentOrange]}
                style={styles.addToInventoryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
                <Text style={styles.addToInventoryText}>
                  Add {selectedIngredients.length} to Inventory
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 36,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryContainer: {
    marginTop: 16,
  },
  categoryList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  categoryTextActive: {
    color: colors.textWhite,
  },
  helperContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textLight,
  },
  resultsCount: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientList: {
    padding: 16,
  },
  ingredientCard: {
    flex: 1,
    margin: 6,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: (width - 48) / 2,
  },
  ingredientImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.backgroundLight,
  },
  ingredientInfo: {
    padding: 12,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedContainer: {
    backgroundColor: colors.backgroundLight,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  selectedTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  selectedList: {
    paddingHorizontal: 16,
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textWhite,
    marginRight: 4,
    textTransform: 'capitalize',
  },
  ingredientCardSelected: {
    borderWidth: 3,
    borderColor: colors.success,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  recipePreviewContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 16,
  },
  recipePreviewHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  recipePreviewTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  recipePreviewList: {
    paddingHorizontal: 16,
  },
  recipePreviewCard: {
    width: 140,
    marginRight: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    overflow: 'hidden',
  },
  recipePreviewImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.border,
  },
  recipePreviewName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    padding: 8,
    paddingBottom: 4,
  },
  recipePreviewBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 8,
    marginTop: 0,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  recipePreviewBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textWhite,
  },
  recipeLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: colors.backgroundLight,
  },
  recipeLoadingText: {
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 8,
  },
  addButtonContainer: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addToInventoryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addToInventoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addToInventoryText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
    marginLeft: 8,
  },
});

export default IngredientSearchModal;
