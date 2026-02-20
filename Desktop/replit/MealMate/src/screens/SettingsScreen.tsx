import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { upgradeToPremium } from '../store/slices/userSlice';
import colors from '../theme/colors';

const SettingsScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const scansRemaining = user.tier === 'free' ? user.scanQuota.limit - user.scanQuota.used : Infinity;

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'Get unlimited scans, meal planning, and nutrition info!',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Upgrade',
          onPress: () => {
            dispatch(upgradeToPremium());
            Alert.alert('Success', 'You are now a Premium user!');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Subscription Status</Text>
            <View style={[styles.badge, user.tier === 'premium' ? styles.premiumBadge : styles.freeBadge]}>
              <Text style={styles.badgeText}>{user.tier === 'premium' ? 'Premium' : 'Free'}</Text>
            </View>
          </View>

          {user.tier === 'free' && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Scans Remaining</Text>
                <Text style={styles.value}>{scansRemaining} / {user.scanQuota.limit}</Text>
              </View>

              <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                <LinearGradient
                  colors={[colors.primary, colors.accentOrange]}
                  style={styles.upgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.upgradeButtonText}>✨ Upgrade to Premium</Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Premium Benefits:</Text>
                <Text style={styles.benefit}>✓ Unlimited ingredient scans</Text>
                <Text style={styles.benefit}>✓ Weekly meal planning</Text>
                <Text style={styles.benefit}>✓ Detailed nutrition information</Text>
                <Text style={styles.benefit}>✓ Advanced recipe filters</Text>
              </View>
            </>
          )}

          {user.tier === 'premium' && (
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumText}>🎉 You have unlimited access to all features!</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>App</Text>
            <Text style={styles.value}>MealMate</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: colors.textLight,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadge: {
    backgroundColor: colors.accent,
  },
  freeBadge: {
    backgroundColor: colors.backgroundDark,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  upgradeButton: {
    borderRadius: 12,
    marginTop: 16,
    overflow: 'hidden',
  },
  upgradeGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: colors.textWhite,
    fontSize: 17,
    fontWeight: '700',
  },
  benefitsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  benefit: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 6,
    lineHeight: 20,
  },
  premiumInfo: {
    marginTop: 16,
    padding: 14,
    backgroundColor: colors.accent,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default SettingsScreen;
