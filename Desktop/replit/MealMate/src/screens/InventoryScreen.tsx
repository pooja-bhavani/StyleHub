import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { removeIngredient, addIngredient } from '../store/slices/inventorySlice';
import { Ionicons } from '@expo/vector-icons';
import IngredientSearchModal from '../components/ingredient/IngredientSearchModal';
import colors from '../theme/colors';

const InventoryScreen = () => {
  const dispatch = useDispatch();
  const inventory = useSelector((state: RootState) => state.inventory.items);
  const [searchModalVisible, setSearchModalVisible] = useState(false);

  const handleRemove = (id: string, name: string) => {
    Alert.alert(
      'Remove Ingredient',
      `Remove ${name} from inventory?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => dispatch(removeIngredient(id)) }
      ]
    );
  };

  const handleSelectIngredient = (ingredient: any) => {
    dispatch(addIngredient({
      id: Date.now().toString(),
      name: ingredient.name,
      category: ingredient.category.toLowerCase(),
      confidence: 1.0,
      addedDate: new Date(),
    }));
    setSearchModalVisible(false);
    Alert.alert('Success', `${ingredient.name} added to inventory!`);
  };

  if (inventory.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Ingredients</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <LinearGradient
              colors={[colors.primary, colors.accentOrange]}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add" size={24} color={colors.textWhite} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>No Ingredients Yet</Text>
          <Text style={styles.emptyText}>Scan your fridge or add manually!</Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => setSearchModalVisible(true)}
          >
            <Text style={styles.emptyButtonText}>+ Add Ingredient</Text>
          </TouchableOpacity>
        </View>
        <IngredientSearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectIngredient={handleSelectIngredient}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Ingredients</Text>
          <Text style={styles.headerSubtitle}>{inventory.length} items</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setSearchModalVisible(true)}
        >
          <LinearGradient
            colors={[colors.primary, colors.accentOrange]}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="add" size={24} color={colors.textWhite} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <FlatList
        data={inventory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.itemContent}>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>
                Added {new Date(item.addedDate).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleRemove(item.id, item.name)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
      <IngredientSearchModal
        visible={searchModalVisible}
        onClose={() => setSearchModalVisible(false)}
        onSelectIngredient={handleSelectIngredient}
      />
    </View>
  );
};

const getCategoryColor = (category: string) => {
  const categoryColors: any = {
    produce: colors.success,
    vegetables: colors.success,
    protein: colors.error,
    meat: colors.error,
    dairy: colors.secondary,
    grains: colors.accentOrange,
    spices: colors.accentPurple,
    condiments: colors.primary,
    beverages: colors.secondary,
    fruits: colors.accent,
    sweets: colors.accentPurple,
    nuts: colors.accentOrange,
    other: colors.textLight,
  };
  return categoryColors[category.toLowerCase()] || colors.textLight;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginTop: 4,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  itemContent: {
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: colors.textWhite,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemDate: {
    fontSize: 12,
    color: colors.textLight,
  },
  removeButton: {
    padding: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InventoryScreen;
