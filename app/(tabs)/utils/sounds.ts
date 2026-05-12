import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

type SoundType = 'correct' | 'wrong' | 'transition';
type NativeSoundType = Exclude<SoundType, 'transition'>;

const soundFiles = {
  correct: require('../../../assets/correct.wav'),
  wrong: require('../../../assets/wrong.wav'),
  transition: null,
};

export class SoundManager {
  private static instance: SoundManager;
  private audioModeReady = false;
  private players: Partial<Record<NativeSoundType, AudioPlayer>> = {};

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  async playCorrectSound() {
    try {
      Speech.stop();
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
      Speech.stop();
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

  private playSystemSound(type: SoundType) {
    // For React Native, use both system sound and haptics for better feedback
    if (Platform.OS !== 'web') {
      try {
        switch (type) {
          case 'correct':
            // Play success sound
            void this.playAudioFile('correct');
            // Add haptic feedback
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            break;
          case 'wrong':
            // Play wrong sound
            void this.playAudioFile('wrong');
            // Add haptic feedback
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            break;
          case 'transition':
            // Play transition sound
            void this.playAudioFile('transition');
            // Add haptic feedback
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            break;
        }
      } catch (error) {
        console.log('Sound/Haptics not available:', error);
      }
    }
  }

  private async playAudioFile(type: SoundType) {
    try {
      if (type === 'transition') {
        return;
      }

      await this.ensureAudioMode();

      const player = this.getPlayer(type);
      player.pause();
      await player.seekTo(0).catch(() => undefined);
      player.play();
    } catch (error) {
      console.log('Error playing audio file:', error);
    }
  }

  private async ensureAudioMode() {
    if (this.audioModeReady) {
      return;
    }

    await setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
    this.audioModeReady = true;
  }

  private getPlayer(type: NativeSoundType) {
    if (!this.players[type]) {
      this.players[type] = createAudioPlayer(soundFiles[type], {
        downloadFirst: true,
        keepAudioSessionActive: true,
      });
      this.players[type].volume = 0.85;
    }

    return this.players[type];
  }
}

export const soundManager = SoundManager.getInstance();
