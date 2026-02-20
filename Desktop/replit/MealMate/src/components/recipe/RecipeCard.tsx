import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RecipeMatch } from '../../types/recipe.types';
import colors from '../../theme/colors';

interface RecipeCardProps {
  recipe: RecipeMatch;
  onPress: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: recipe.image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.imageOverlay}
      />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.info}>
          <View style={styles.timeContainer}>
            <Text style={styles.timeIcon}>⏱️</Text>
            <Text style={styles.time}>{recipe.readyInMinutes} min</Text>
          </View>
          <LinearGradient
            colors={recipe.canMakeNow ? [colors.success, colors.accentGreen] : [colors.accentOrange, colors.accent]}
            style={styles.badge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.badgeText}>
              {recipe.canMakeNow ? '✓ Can Make Now!' : `${recipe.matchPercentage}% Match`}
            </Text>
          </LinearGradient>
        </View>
        {recipe.missedIngredientCount > 0 && (
          <View style={styles.missingContainer}>
            <Text style={styles.missingIcon}>🛒</Text>
            <Text style={styles.missing}>
              Need {recipe.missedIngredientCount} more ingredient{recipe.missedIngredientCount > 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: colors.backgroundDark,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 220,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    lineHeight: 26,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: colors.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },
  missingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  missingIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  missing: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default RecipeCard;
