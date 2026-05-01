// Script để cập nhật tất cả practice screens với animation và âm thanh
// Dùng để áp dụng AnimatedOptionButton và QuestionTransition cho tất cả screens

const practiceScreens = [
  'CountingPracticeScreen',
  'ComparisonPracticeScreen', 
  'OrderingPracticeScreen',
  'SudokuPracticeScreen',
  'VideoLessonsPracticeScreen',
  'WordProblemsPracticeScreen'
];

// Template để thêm imports
const importTemplate = `import { AnimatedOptionButton } from '../components/AnimatedOptionButton';
import { QuestionTransition } from '../components/QuestionTransition';`;

// Template để thay thế TouchableOpacity
const buttonTemplate = `<AnimatedOptionButton
                key={idx}
                option={option}
                idx={idx}
                selected={selected}
                answered={answered}
                correct={correct}
                backgroundColor={backgroundColor}
                textColor={textColor}
                onPress={() => handleAnswer(option)}
                disabled={answered}
              />`;

// Template để wrap question với transition
const questionTemplate = `<QuestionTransition isVisible={true}>
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{currentQuestion.prompt}</Text>
        </View>
      </QuestionTransition>`;

export { practiceScreens, importTemplate, buttonTemplate, questionTemplate };
