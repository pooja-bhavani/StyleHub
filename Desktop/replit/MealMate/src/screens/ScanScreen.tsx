import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera, CameraType, CameraView } from 'expo-camera';
import type { CameraView as CameraViewType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { addMultipleIngredients } from '../store/slices/inventorySlice';
import { incrementScanQuota } from '../store/slices/userSlice';
import { compressImage, convertToBase64 } from '../utils/imageProcessing';
import { identifyIngredients } from '../services/openai.service';
import colors from '../theme/colors';

const ScanScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraViewType>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || !user) return;

    // Check scan quota for free users
    if (user.tier === 'free' && user.scanQuota.used >= user.scanQuota.limit) {
      Alert.alert(
        'Daily Limit Reached',
        `You've used all ${user.scanQuota.limit} daily scans. Upgrade to Premium for unlimited scans!`,
        [
          { text: 'Upgrade', onPress: () => navigation.navigate('Settings') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      setLoading(true);
      const photo = await cameraRef.current.takePictureAsync();
      await processImage(photo.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan ingredients. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    if (!user) return;

    // Check scan quota for free users
    if (user.tier === 'free' && user.scanQuota.used >= user.scanQuota.limit) {
      Alert.alert(
        'Daily Limit Reached',
        `You've used all ${user.scanQuota.limit} daily scans. Upgrade to Premium for unlimited scans!`,
        [
          { text: 'Upgrade', onPress: () => navigation.navigate('Settings') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable photo library access in settings');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setLoading(true);
        await processImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      // Compress and convert image
      const compressedUri = await compressImage(imageUri);
      const base64 = await convertToBase64(compressedUri);

      // Identify ingredients with AI
      const ingredients = await identifyIngredients(base64);

      // Add to inventory
      dispatch(addMultipleIngredients(ingredients));
      dispatch(incrementScanQuota());

      Alert.alert(
        'Success!',
        `Found ${ingredients.length} ingredients. Added to your inventory.`,
        [{ text: 'View Inventory', onPress: () => navigation.navigate('Inventory') }]
      );
    } catch (error) {
      throw error;
    }
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.errorSubtext}>Please enable camera access in settings</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Position ingredients in frame</Text>
            {user?.tier === 'free' && (
              <Text style={styles.quotaText}>
                Scans: {user.scanQuota.used}/{user.scanQuota.limit}
              </Text>
            )}
          </View>

          <View style={styles.captureContainer}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.loadingText}>Analyzing ingredients...</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.galleryButton}
                  onPress={pickImage}
                >
                  <LinearGradient
                    colors={[colors.secondary, colors.accent]}
                    style={styles.galleryButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Ionicons name="images" size={24} color={colors.textWhite} />
                    <Text style={styles.galleryButtonText}>Pick from Gallery</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                  disabled={loading}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <View style={styles.placeholder} />
              </>
            )}
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  quotaText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  galleryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  galleryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  galleryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  placeholder: {
    width: 120,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ScanScreen;
