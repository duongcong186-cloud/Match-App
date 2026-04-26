import { useState, useRef, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';

import { Audio } from 'expo-av';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ================= APP =================

export default function App() {
  const [screen, setScreen] = useState('home');
  const [level, setLevel] = useState(1);

  return (
    <View style={{ flex: 1 }}>
      {screen === 'home' && (
        <HomeScreen onStart={(lv) => {
          setLevel(lv);
          setScreen('game');
        }} />
      )}

      {screen === 'game' && (
        <GameScreen
          level={level}
          onExit={() => setScreen('home')}
        />
      )}
    </View>
  );
}

// ================= HOME =================

function HomeScreen({ onStart }) {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.homeTitle}>🧠 Math Adventure</Text>

      <View style={styles.levelGrid}>
        {[...Array(10)].map((_, i) => (
          <TouchableOpacity
            key={i}
            style={styles.levelCard}
            onPress={() => onStart(i + 1)}
          >
            <Text style={styles.levelText}>Level {i + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ================= GAME =================

function GameScreen({ level, onExit }) {
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [difficulty, setDifficulty] = useState(1);

  const [message, setMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const msgAnim = useRef(new Animated.Value(0)).current;

  const correctSound = useRef(null);
  const wrongSound = useRef(null);

  // ===== SOUND =====
  useEffect(() => {
    (async () => {
      try {
        const { sound: c } = await Audio.Sound.createAsync(
          require('./assets/correct.mp3')
        );
        const { sound: w } = await Audio.Sound.createAsync(
          require('./assets/wrong.mp3')
        );
        correctSound.current = c;
        wrongSound.current = w;
      } catch {}
    })();
  }, []);

  const play = async (ref) => {
    try {
      await ref.current?.replayAsync();
    } catch {}
  };

  // ===== MESSAGE =====
  const showMsg = (text) => {
    setMessage(text);
    msgAnim.setValue(0);

    Animated.sequence([
      Animated.timing(msgAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(600),
      Animated.timing(msgAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  // ===== SHAKE =====
  const runShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  // ===== STORAGE =====

  const saveProgress = async () => {
    try {
      const data = {
        score,
        lives,
        streak,
        index,
        difficulty,
      };
      await AsyncStorage.setItem('math_game', JSON.stringify(data));
    } catch {}
  };

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('math_game');
      if (saved) {
        const d = JSON.parse(saved);
        setScore(d.score || 0);
        setLives(d.lives || 3);
        setStreak(d.streak || 0);
        setIndex(d.index || 0);
        setDifficulty(d.difficulty || 1);
      }
    } catch {}
  };

  useEffect(() => {
    loadProgress();
  }, []);

  useEffect(() => {
    saveProgress();
  }, [score, lives, streak, index, difficulty]);

  // ===== QUESTION =====
  function createQuestion() {
    const max = Math.floor(difficulty * 10);

    let a = Math.floor(Math.random() * max) + 1;
    let b = Math.floor(Math.random() * max) + 1;

    let ops = ['+'];
    if (difficulty >= 2) ops.push('-');
    if (difficulty >= 4) ops.push('×');
    if (difficulty >= 6) ops.push('÷');

    const op = ops[Math.floor(Math.random() * ops.length)];

    let ans;

    if (op === '+') ans = a + b;
    if (op === '-') ans = Math.max(0, a - b);
    if (op === '×') ans = a * b;

    if (op === '÷') {
      ans = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
      a = ans * b;
    }

    return {
      q: `${a} ${op} ${b} = ?`,
      correct: ans,
      options: [ans, ans + 1, ans - 1, ans + 2].sort(() => Math.random() - 0.5),
      answered: false,
      selected: null,
    };
  }

  useEffect(() => {
    setQuestions(Array.from({ length: 10 }, createQuestion));
  }, []);

  const current = questions[index];
  if (!current) return null;

  // ===== ANSWER =====
  const answer = (val) => {
    if (current.answered) return;

    const updated = [...questions];
    updated[index].answered = true;
    updated[index].selected = val;

    if (val === current.correct) {
      const bonus = streak >= 2 ? 2 : 1;

      setScore(s => s + bonus);
      setStreak(s => s + 1);
      setDifficulty(d => Math.min(d + 0.2, 10));

      play(correctSound);
      setShowConfetti(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      showMsg(`🔥 Chính xác! +${bonus}`);

      setTimeout(() => setShowConfetti(false), 1000);
    } else {
      setLives(l => l - 1);
      setStreak(0);
      setDifficulty(d => Math.max(d - 0.3, 1));

      play(wrongSound);
      runShake();

      showMsg('❌ Sai rồi!');
    }

    setQuestions(updated);

    // GAME OVER
    if (lives - (val !== current.correct ? 1 : 0) <= 0) {
      AsyncStorage.removeItem('math_game');
      setTimeout(onExit, 1000);
    }
  };

  return (
    <Animated.View style={[styles.gameContainer, { transform: [{ translateX: shake }] }]}>
      
      {showConfetti && (
        <ConfettiCannon count={120} origin={{ x: 200, y: 0 }} fadeOut />
      )}

      <Text style={styles.levelTag}>Level {level}</Text>
      <Text style={styles.scoreTag}>⭐ {score}</Text>
      <Text style={{ color: '#fff' }}>❤️ {lives} | 🔥 {streak}</Text>
      <Text style={{ color: '#94a3b8' }}>🎯 {difficulty.toFixed(1)}</Text>

      <Animated.Text style={{
        opacity: msgAnim,
        transform: [{ scale: msgAnim }],
        fontSize: 18,
        marginTop: 10,
        color: message.includes('Chính xác') ? '#22c55e' : '#ef4444'
      }}>
        {message}
      </Animated.Text>

      <Text style={styles.questionText}>{current.q}</Text>

      <View style={styles.answerGrid}>
        {current.options.map((o, i) => {
          let bg = '#2196F3';

          if (current.answered) {
            if (o === current.selected && o !== current.correct) bg = 'red';
            if (o === current.correct) bg = 'green';
          }

          return (
            <TouchableOpacity key={i} style={[styles.answerBtn, { backgroundColor: bg }]} onPress={() => answer(o)}>
              <Text style={styles.answerText}>{o}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity onPress={onExit}>
        <Text style={{ color: '#aaa', marginTop: 20 }}>← Thoát</Text>
      </TouchableOpacity>

    </Animated.View>
  );
}

// ================= STYLE =================

const styles = StyleSheet.create({
  homeContainer: { flex: 1, justifyContent: 'center', backgroundColor: '#0f172a' },
  homeTitle: { color: '#fff', fontSize: 28, textAlign: 'center' },
  levelGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  levelCard: { width: 80, height: 60, margin: 8, backgroundColor: '#1e293b', justifyContent: 'center', alignItems: 'center' },
  levelText: { color: '#fff' },
  gameContainer: { flex: 1, alignItems: 'center', backgroundColor: '#0f172a', paddingTop: 100 },
  levelTag: { color: '#fff' },
  scoreTag: { color: 'yellow' },
  questionText: { color: '#fff', fontSize: 28, marginVertical: 20 },
  answerGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  answerBtn: { padding: 15, margin: 8, borderRadius: 10 },
  answerText: { color: '#fff', fontSize: 18 },
});