import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

interface Memory {
  id: number;
  momentText: string;
  style: string;
  generatedMemory: string;
  imageUrl: string;
  isPremium: boolean;
  createdAt: string;
}

const API_BASE_URL = 'https://your-repl-name.username.repl.co'; // Update this with your actual Replit deployment URL

export default function App() {
  const [momentText, setMomentText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'nostalgic' | 'funny' | 'absurd' | 'poetic'>('nostalgic');
  const [intensity, setIntensity] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMemory, setGeneratedMemory] = useState<Memory | null>(null);
  const [imageLoading, setImageLoading] = useState(false);

  const styles = [
    { key: 'nostalgic', label: 'Nostalgic', emoji: '🌅', description: 'Warm, sentimental memories' },
    { key: 'funny', label: 'Funny', emoji: '😄', description: 'Humorous and playful' },
    { key: 'absurd', label: 'Absurd', emoji: '🎪', description: 'Surreal and imaginative' },
    { key: 'poetic', label: 'Poetic', emoji: '🌙', description: 'Artistic and lyrical' },
  ];

  const intensityLevels = [
    { level: 1, label: 'Gentle', emoji: '💙', description: 'Subtle transformation' },
    { level: 2, label: 'Mild', emoji: '✨', description: 'Light creative touches' },
    { level: 3, label: 'Playful', emoji: '⚡', description: 'Balanced creativity' },
    { level: 4, label: 'Wild', emoji: '🚀', description: 'Bold and imaginative' },
    { level: 5, label: 'Extreme', emoji: '🧠', description: 'Maximum creative freedom' },
  ];

  const generateMemory = async () => {
    if (momentText.length < 10) {
      Alert.alert('Error', 'Please write at least 10 characters about your moment.');
      return;
    }

    setIsGenerating(true);
    setImageLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-memory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          momentText,
          style: selectedStyle,
          intensity,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate memory');
      }

      const memory: Memory = await response.json();
      setGeneratedMemory(memory);
      setMomentText('');
      Alert.alert('Success', 'Your visual memory has been created!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate memory. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const shareMemory = async () => {
    if (!generatedMemory?.imageUrl) return;

    try {
      const { uri } = await FileSystem.downloadAsync(
        generatedMemory.imageUrl,
        FileSystem.documentDirectory + 'snapture-memory.png'
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'image/png',
          dialogTitle: 'Share your Snapture memory',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not share the image');
    }
  };

  return (
    <SafeAreaView style={appStyles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={appStyles.scrollContainer}>
        {/* Header */}
        <View style={appStyles.header}>
          <Text style={appStyles.title}>✨ Snapture</Text>
          <Text style={appStyles.subtitle}>Transform moments into AI art</Text>
        </View>

        {/* Moment Input */}
        <View style={appStyles.card}>
          <Text style={appStyles.sectionTitle}>🧠 Write a moment from today:</Text>
          <TextInput
            style={appStyles.textInput}
            value={momentText}
            onChangeText={setMomentText}
            placeholder="Today I walked home in the rain..."
            multiline
            maxLength={200}
            textAlignVertical="top"
          />
          <Text style={appStyles.charCount}>{momentText.length}/200</Text>
        </View>

        {/* Style Selector */}
        <View style={appStyles.card}>
          <Text style={appStyles.sectionTitle}>🎨 Choose your style:</Text>
          <View style={appStyles.optionGrid}>
            {styles.map((style) => (
              <TouchableOpacity
                key={style.key}
                style={[
                  appStyles.optionButton,
                  selectedStyle === style.key && appStyles.selectedOption,
                ]}
                onPress={() => setSelectedStyle(style.key as any)}
              >
                <Text style={appStyles.optionEmoji}>{style.emoji}</Text>
                <Text style={appStyles.optionLabel}>{style.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intensity Selector */}
        <View style={appStyles.card}>
          <Text style={appStyles.sectionTitle}>⚡ AI Transformation Intensity:</Text>
          <View style={appStyles.intensityGrid}>
            {intensityLevels.map((level) => (
              <TouchableOpacity
                key={level.level}
                style={[
                  appStyles.intensityButton,
                  intensity === level.level && appStyles.selectedIntensity,
                ]}
                onPress={() => setIntensity(level.level)}
              >
                <Text style={appStyles.intensityEmoji}>{level.emoji}</Text>
                <Text style={appStyles.intensityLabel}>{level.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={appStyles.intensityInfo}>
            <Text style={appStyles.intensityTitle}>
              Level {intensity}: {intensityLevels[intensity - 1].label}
            </Text>
            <Text style={appStyles.intensityDesc}>
              {intensityLevels[intensity - 1].description}
            </Text>
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[appStyles.generateButton, (momentText.length < 10 || isGenerating) && appStyles.disabledButton]}
          onPress={generateMemory}
          disabled={momentText.length < 10 || isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={appStyles.generateButtonText}>✨ Generate Memory</Text>
          )}
        </TouchableOpacity>

        {/* Loading State */}
        {isGenerating && (
          <View style={appStyles.card}>
            <View style={appStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={appStyles.loadingTitle}>Creating your visual memory...</Text>
              <Text style={appStyles.loadingSubtitle}>AI is transforming your moment into art</Text>
            </View>
          </View>
        )}

        {/* Generated Memory */}
        {generatedMemory && (
          <View style={appStyles.card}>
            <Text style={appStyles.sectionTitle}>🎨 Your Visual Memory</Text>
            {imageLoading && (
              <View style={appStyles.imagePlaceholder}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={appStyles.imageLoadingText}>Loading your artwork...</Text>
              </View>
            )}
            <Image
              source={{ uri: generatedMemory.imageUrl }}
              style={[appStyles.generatedImage, imageLoading && appStyles.hiddenImage]}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                Alert.alert('Error', 'Could not load the generated image');
              }}
            />
            <View style={appStyles.memoryActions}>
              <TouchableOpacity style={appStyles.shareButton} onPress={shareMemory}>
                <Text style={appStyles.shareButtonText}>📤 Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    height: 120,
    marginBottom: 8,
  },
  charCount: {
    textAlign: 'right',
    color: '#9CA3AF',
    fontSize: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    minWidth: (width - 64) / 2 - 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  intensityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  intensityButton: {
    flex: 1,
    minWidth: (width - 80) / 5 - 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedIntensity: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  intensityEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  intensityLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#374151',
  },
  intensityInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  intensityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  intensityDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  generateButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  generateButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  loadingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  imagePlaceholder: {
    height: 300,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imageLoadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  generatedImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 16,
  },
  hiddenImage: {
    opacity: 0,
    position: 'absolute',
  },
  memoryActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  shareButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});