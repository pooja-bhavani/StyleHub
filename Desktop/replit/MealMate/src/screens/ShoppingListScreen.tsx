import React, { useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  markAsPurchased, 
  clearPurchased, 
  addItem, 
  removeItem 
} from '../store/slices/shoppingListSlice';
import { Ionicons } from '@expo/vector-icons';
import IngredientSearchModal from '../components/ingredient/IngredientSearchModal';
import colors from '../theme/colors';

const ShoppingListScreen = () => {
  const dispatch = useDispatch();
  const shoppingList = useSelector((state: RootState) => state.shoppingList.list);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [manualModalVisible, setManualModalVisible] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: '🛒', color: colors.primary },
    { id: 'produce', name: 'Produce', icon: '🥬', color: colors.success },
    { id: 'meat', name: 'Meat', icon: '🥩', color: colors.error },
    { id: 'dairy', name: 'Dairy', icon: '🧀', color: colors.secondary },
    { id: 'grains', name: 'Grains', icon: '🌾', color: colors.accentOrange },
    { id: 'spices', name: 'Spices', icon: '🌶️', color: colors.accentPurple },
    { id: 'other', name: 'Other', icon: '📦', color: colors.textLight },
  ];

  const unpurchasedItems = shoppingList?.items.filter(item => !item.purchased) || [];
  const purchasedItems = shoppingList?.items.filter(item => item.purchased) || [];

  // Filter items by selected category
  const filteredUnpurchasedItems = selectedCategory === 'all' 
    ? unpurchasedItems 
    : unpurchasedItems.filter(item => item.category === selectedCategory || !item.category);
  
  const filteredPurchasedItems = selectedCategory === 'all'
    ? purchasedItems
    : purchasedItems.filter(item => item.category === selectedCategory || !item.category);

  const handleSelectIngredient = (ingredient: any) => {
    const newItem = {
      id: Date.now().toString(),
      ingredientName: ingredient.name,
      quantity: 1,
      unit: 'unit',
      purchased: false,
      category: ingredient.category || 'other',
      addedDate: new Date(),
    };
    dispatch(addItem(newItem));
  };

  const handleAddManualItem = () => {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      ingredientName: newItemName.trim(),
      quantity: parseFloat(newItemQuantity) || 1,
      unit: newItemUnit || 'unit',
      purchased: false,
      category: 'other',
      addedDate: new Date(),
    };

    dispatch(addItem(newItem));
    setNewItemName('');
    setNewItemQuantity('');
    setNewItemUnit('');
    setManualModalVisible(false);
    Alert.alert('Success', `${newItemName} added to shopping list!`);
  };

  const handleDeleteItem = (id: string, name: string) => {
    console.log('Delete requested for:', id, name);
    Alert.alert(
      'Remove Item',
      `Remove ${name} from shopping list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => {
            console.log('Dispatching removeItem for:', id);
            dispatch(removeItem(id));
            console.log('RemoveItem dispatched');
          }
        }
      ]
    );
  };

  const handleTogglePurchased = (id: string) => {
    dispatch(markAsPurchased(id));
  };

  const handleClearPurchased = () => {
    if (purchasedItems.length === 0) return;
    
    Alert.alert(
      'Clear Purchased Items',
      `Remove ${purchasedItems.length} purchased item${purchasedItems.length !== 1 ? 's' : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearPurchased()) }
      ]
    );
  };

  if (!shoppingList || shoppingList.items.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <View style={styles.headerButtons}>
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
                <Ionicons name="search" size={20} color={colors.textWhite} />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setManualModalVisible(true)}
            >
              <LinearGradient
                colors={[colors.success, colors.accent]}
                style={styles.addButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="add" size={24} color={colors.textWhite} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Shopping List Empty</Text>
          <Text style={styles.emptyText}>
            Search ingredients with recipe preview or add manually
          </Text>
          <View style={styles.emptyButtonContainer}>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => setSearchModalVisible(true)}
            >
              <Ionicons name="search" size={20} color={colors.textWhite} />
              <Text style={styles.emptyButtonText}>Search Ingredients</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.success }]}
              onPress={() => setManualModalVisible(true)}
            >
              <Ionicons name="add" size={20} color={colors.textWhite} />
              <Text style={styles.emptyButtonText}>Add Manually</Text>
            </TouchableOpacity>
          </View>
        </View>
        <IngredientSearchModal
          visible={searchModalVisible}
          onClose={() => setSearchModalVisible(false)}
          onSelectIngredient={handleSelectIngredient}
        />
        <ManualAddModal
          visible={manualModalVisible}
          onClose={() => setManualModalVisible(false)}
          itemName={newItemName}
          setItemName={setNewItemName}
          quantity={newItemQuantity}
          setQuantity={setNewItemQuantity}
          unit={newItemUnit}
          setUnit={setNewItemUnit}
          onAdd={handleAddManualItem}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shopping List</Text>
          <Text style={styles.headerSubtitle}>
            {filteredUnpurchasedItems.length} to buy • {filteredPurchasedItems.length} purchased
          </Text>
        </View>
        <View style={styles.headerButtons}>
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
              <Ionicons name="search" size={20} color={colors.textWhite} />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setManualModalVisible(true)}
          >
            <LinearGradient
              colors={[colors.success, colors.accent]}
              style={styles.addButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="add" size={24} color={colors.textWhite} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && { backgroundColor: category.color },
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.categoryTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {purchasedItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearPurchased}
          >
            <Ionicons name="trash-outline" size={16} color={colors.textWhite} />
            <Text style={styles.clearButtonText}>
              Clear {purchasedItems.length} Purchased
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Shopping List */}
      <FlatList
        data={[...filteredUnpurchasedItems, ...filteredPurchasedItems]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, item.purchased && styles.itemPurchased]}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => handleTogglePurchased(item.id)}
            >
              <View style={[styles.checkbox, item.purchased && styles.checkboxChecked]}>
                {item.purchased && <Ionicons name="checkmark" size={16} color={colors.textWhite} />}
              </View>
            </TouchableOpacity>
            <View style={styles.itemContent}>
              <Text style={[styles.itemName, item.purchased && styles.itemNamePurchased]}>
                {item.ingredientName}
              </Text>
              <Text style={styles.itemQuantity}>
                {item.quantity} {item.unit}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteItem(item.id, item.ingredientName)}
              style={styles.deleteButton}
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

      <ManualAddModal
        visible={manualModalVisible}
        onClose={() => setManualModalVisible(false)}
        itemName={newItemName}
        setItemName={setNewItemName}
        quantity={newItemQuantity}
        setQuantity={setNewItemQuantity}
        unit={newItemUnit}
        setUnit={setNewItemUnit}
        onAdd={handleAddManualItem}
      />
    </View>
  );
};

// Manual Add Modal Component
interface ManualAddModalProps {
  visible: boolean;
  onClose: () => void;
  itemName: string;
  setItemName: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  onAdd: () => void;
}

const ManualAddModal: React.FC<ManualAddModalProps> = ({
  visible,
  onClose,
  itemName,
  setItemName,
  quantity,
  setQuantity,
  unit,
  setUnit,
  onAdd,
}) => {
  const units = ['unit', 'kg', 'g', 'lb', 'oz', 'L', 'ml', 'cup', 'tbsp', 'tsp', 'piece', 'pack', 'can', 'bottle'];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Item Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Milk, Eggs, Bread"
              placeholderTextColor={colors.textMuted}
              value={itemName}
              onChangeText={setItemName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                placeholderTextColor={colors.textMuted}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Unit</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.unitScroll}
              >
                {units.map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.unitChip,
                      unit === u && styles.unitChipActive,
                    ]}
                    onPress={() => setUnit(u)}
                  >
                    <Text
                      style={[
                        styles.unitChipText,
                        unit === u && styles.unitChipTextActive,
                      ]}
                    >
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <TouchableOpacity
            style={styles.addItemButton}
            onPress={onAdd}
          >
            <LinearGradient
              colors={[colors.primary, colors.accentOrange]}
              style={styles.addItemGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="checkmark-circle" size={24} color={colors.textWhite} />
              <Text style={styles.addItemText}>Add to List</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
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
    marginLeft: 8,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  addButtonGradient: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    marginTop: 16,
    marginBottom: 8,
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
    borderWidth: 2,
    borderColor: colors.border,
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
  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  clearButtonText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '600',
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
  itemPurchased: {
    opacity: 0.5,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  itemContent: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textLight,
  },
  deleteButton: {
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    gap: 8,
  },
  emptyButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  emptyButtonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 2,
    borderColor: colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  unitScroll: {
    maxHeight: 50,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.backgroundLight,
    marginRight: 8,
    borderWidth: 2,
    borderColor: colors.border,
  },
  unitChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  unitChipTextActive: {
    color: colors.textWhite,
  },
  addItemButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textWhite,
    marginLeft: 8,
  },
});

export default ShoppingListScreen;
