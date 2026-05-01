// Template để áp dụng GameTimer cho tất cả practice screens

// Template để thêm import
const addTimerImport = `import GameTimer from '../components/GameTimer';`;

// Template để thêm state
const addTimerState = `const [elapsedSeconds, setElapsedSeconds] = useState(0);`;

// Template để thêm timer vào meta container
const addTimerToMeta = `<View style={styles.practiceMetaContainer}>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>Level {level}</Text>
        <Text style={[styles.practiceMetaText, { color: category.color }]}>{currentIndex + 1}/10</Text>
        <GameTimer 
          startTime={startTime} 
          isRunning={!answered} 
          onTimeUpdate={setElapsedSeconds}
        />
      </View>`;

// Danh sách các practice screen cần cập nhật
const practiceScreensToUpdate = [
  'CountingPracticeScreen',
  'ComparisonPracticeScreen',
  'OrderingPracticeScreen',
  'SudokuPracticeScreen',
  'VideoLessonsPracticeScreen',
  'WordProblemsPracticeScreen',
  'MultiplicationPracticeScreen',
  'PracticeScreen'
];

export { practiceScreensToUpdate, addTimerImport, addTimerState, addTimerToMeta };
