import { Platform } from 'react-native';

export class SoundManager {
  private static instance: SoundManager;

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async playCorrectSound() {
    try {
      if (Platform.OS === 'web') {
        // Web Audio API for correct sound (positive beep)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800; // High pitch for correct
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } else {
        // React Native - use system sound or vibration
        this.playSystemSound('correct');
      }
    } catch (error) {
      console.log('Error playing correct sound:', error);
    }
  }

  async playWrongSound() {
    try {
      if (Platform.OS === 'web') {
        // Web Audio API for wrong sound (negative buzz)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200; // Low pitch for wrong
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      } else {
        // React Native - use system sound or vibration
        this.playSystemSound('wrong');
      }
    } catch (error) {
      console.log('Error playing wrong sound:', error);
    }
  }

  async playTransitionSound() {
    try {
      if (Platform.OS === 'web') {
        // Web Audio API for transition sound (swoosh)
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else {
        // React Native - use system sound or vibration
        this.playSystemSound('transition');
      }
    } catch (error) {
      console.log('Error playing transition sound:', error);
    }
  }

  private playSystemSound(type: 'correct' | 'wrong' | 'transition') {
    // For React Native, use both system sound and haptics for better feedback
    if (Platform.OS !== 'web') {
      try {
        // Import dynamically to avoid issues
        const { Haptics } = require('expo-haptics');
        const { Audio } = require('expo-av');
        
        switch (type) {
          case 'correct':
            // Play success sound
            this.playAudioFile('correct');
            // Add haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'wrong':
            // Play wrong sound
            this.playAudioFile('wrong');
            // Add haptic feedback
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'transition':
            // Play transition sound
            this.playAudioFile('transition');
            // Add haptic feedback
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        }
      } catch (error) {
        console.log('Sound/Haptics not available:', error);
      }
    }
  }

  private async playAudioFile(type: 'correct' | 'wrong' | 'transition') {
    try {
      const { Audio } = require('expo-av');
      
      // Define sound files
      const soundFiles = {
        correct: require('../../assets/sounds/correct.mp3'),
        wrong: require('../../assets/sounds/wrong.mp3'),
        transition: require('../../assets/sounds/transition.mp3')
      };
      
      const { sound } = await Audio.Sound.createAsync(soundFiles[type]);
      
      await sound.playAsync();
      
      // Clean up the sound
      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing audio file:', error);
    }
  }
}

export const soundManager = SoundManager.getInstance();
