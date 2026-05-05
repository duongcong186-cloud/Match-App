import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { categories } from '../constants/categories';
import { styles } from '../styles';
import { Props } from '../types';

const videoList = [
  {
    id: 1,
    title: 'Video 1: Basic Math Concepts',
    url: 'https://www.youtube.com/embed/mAH1MudP8_g',
    description: 'Learn basic math concepts for beginners'
  },
  {
    id: 2,
    title: 'Video 2: Advanced Problem Solving',
    url: 'https://www.youtube.com/embed/oeUVlnsuYMg',
    description: 'Advanced techniques for problem solving'
  },
  {
    id: 3,
    title: 'Video 3: Mental Math Tricks',
    url: 'https://www.youtube.com/embed/jLddqiMcCns',
    description: 'Quick mental math tricks and shortcuts'
  },
  {
    id: 4,
    title: 'Video 4: Practice Exercises',
    url: 'https://www.youtube.com/embed/QqGMpzLqflE',
    description: 'Practice exercises and solutions'
  }
];

export function VideoLessonsLevelScreen({ navigation }: Props) {
  const category = categories.find(cat => cat.key === 'video')!;
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoPress = (url: string) => {
    setSelectedVideo(url);
  };

  const closeVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={[styles.practiceHeader, { backgroundColor: category.color }]}>
          <View style={styles.practiceHeaderRow}>
            <TouchableOpacity style={styles.practiceBackButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.practiceHeaderTextGroup}>
              <Text style={[styles.practiceHeaderTitle, { color: '#ffffff' }]}>{category.title}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 12, paddingBottom: 118 }} showsVerticalScrollIndicator={false}>
          <Text style={{ 
            color: category.color, 
            marginBottom: 20,
            fontSize: 24,
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            Video Lessons
          </Text>
          
          {videoList.map((video) => (
            <TouchableOpacity
              key={video.id}
              style={{
                backgroundColor: '#ffffff',
                borderColor: category.color,
                borderWidth: 2,
                borderRadius: 12,
                padding: 16,
                marginBottom: 15,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => handleVideoPress(video.url)}
            >
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="play-circle" size={24} color={category.color} />
                  <Text style={{ 
                    color: category.color, 
                    marginLeft: 10, 
                    fontSize: 16, 
                    fontWeight: '600',
                    flex: 1
                  }}>
                    {video.title}
                  </Text>
                </View>
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 14, 
                  marginBottom: 12,
                  lineHeight: 20
                }}>
                  {video.description}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="link" size={16} color={category.color} />
                  <Text style={{ 
                    color: category.color, 
                    marginLeft: 6, 
                    fontSize: 14, 
                    fontWeight: '500'
                  }}>
                    Watch Now
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* WebView Modal for Video */}
      <Modal
        visible={selectedVideo !== null}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeVideoModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#000'
          }}>
            <TouchableOpacity onPress={closeVideoModal}>
              <Ionicons name="chevron-back" size={28} color="#ffffff" />
            </TouchableOpacity>
            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '600' }}>
              Video Lesson
            </Text>
            <View style={{ width: 28 }} />
          </View>
          
          {selectedVideo && (
            <WebView
              source={{ uri: selectedVideo }}
              style={{ flex: 1 }}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              scalesPageToFit={true}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
