import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ImageUploadScreen() {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const requestPermissions = async () => {
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    const mediaStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cameraStatus.status === 'granted' && mediaStatus.status === 'granted';
  };

  const handleImage = async (source) => {
    const permission = await requestPermissions();
    if (!permission) {
      Alert.alert('Permission denied', 'Camera and media access are required.');
      return;
    }

    let result;

    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // manual crop instead
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const asset = result.assets[0];
      const { width, height, uri } = asset;

      // Calculate centered square crop
      const cropSize = Math.min(width, height);
      const cropOriginX = (width - cropSize) / 2;
      const cropOriginY = (height - cropSize) / 2;

      // Crop and resize
      const cropped = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            crop: {
              originX: cropOriginX,
              originY: cropOriginY,
              width: cropSize,
              height: cropSize,
            },
          },
          { resize: { width: 300, height: 300 } },
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(cropped);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No image selected", "Please pick or take an image first.");
      return;
    }

    const formData = new FormData();
    formData.append('photo', {
      uri: image.uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });

    try {
      setUploading(true);
      const response = await fetch('https://your-backend-api.com/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      console.log('✅ Upload success:', result);
      Alert.alert('Success', 'Image uploaded to backend.');
    } catch (error) {
      console.error('❌ Upload error:', error);
      Alert.alert('Upload Failed', 'An error occurred while uploading.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📷 Upload or Take a Picture</Text>

      {image ? (
        <Image source={{ uri: image.uri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No image selected</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.pickButton]}
          onPress={() => handleImage('gallery')}
        >
          <Text style={styles.buttonText}>Pick Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.cameraButton]}
          onPress={() => handleImage('camera')}
        >
          <Text style={styles.buttonText}>Take Picture</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadText}>🚀 Upload to Backend</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2d3436',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  placeholder: {
    width: 300,
    height: 300,
    borderRadius: 20,
    backgroundColor: '#dfe6e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    color: '#636e72',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  pickButton: {
    backgroundColor: '#0984e3',
  },
  cameraButton: {
    backgroundColor: '#6c5ce7',
  },
  uploadButton: {
    backgroundColor: '#00b894',
    padding: 16,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  uploadText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
