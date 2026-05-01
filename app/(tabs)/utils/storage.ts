import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'mathAppRankings';

export interface LevelResult {
  topic: string;
  level: number;
  score: number;
  duration: number;
  timestamp: number;
}

export type RankingsRecord = Record<string, LevelResult>;

export async function loadRankings(): Promise<RankingsRecord> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RankingsRecord) : {};
  } catch (error) {
    console.warn('Failed to load rankings:', error);
    return {};
  }
}

export async function saveLevelResult(
  topic: string,
  level: number,
  score: number,
  duration: number,
): Promise<LevelResult> {
  const key = `${topic}:${level}`;
  const now = Date.now();
  const newResult: LevelResult = {
    topic,
    level,
    score,
    duration,
    timestamp: now,
  };

  try {
    const existing = await loadRankings();
    const current = existing[key];

    if (!current || score > current.score || (score === current.score && duration < current.duration)) {
      existing[key] = newResult;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return newResult;
    }

    return current;
  } catch (error) {
    console.warn('Failed to save level result:', error);
    return newResult;
  }
}
