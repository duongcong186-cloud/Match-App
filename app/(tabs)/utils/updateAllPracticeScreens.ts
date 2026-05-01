// Batch update script để áp dụng FeedbackMessage cho tất cả practice screens
// Template để thêm import
const addImport = `import { FeedbackMessage } from '../components/FeedbackMessage';`;

// Template để thay thế feedback text
const replaceFeedback = `<FeedbackMessage 
            isCorrect={isCorrect}
            correctAnswer={currentQuestion?.answer}
          />`;

// Danh sách các practice screen cần cập nhật
const practiceScreens = [
  'CountingPracticeScreen',
  'ComparisonPracticeScreen',
  'OrderingPracticeScreen', 
  'SudokuPracticeScreen',
  'VideoLessonsPracticeScreen',
  'WordProblemsPracticeScreen',
  'MultiplicationPracticeScreen' // Cần cập nhật lại
];

// Pattern để tìm và thay thế feedback text
const feedbackPattern = /{answered && \(\s*\n\s*<Text style={\[styles\.feedbackText.*?\}>\s*\n\s*{isCorrect.*?\}>\s*\n\s*{isCorrect.*?\}\s*:\s*`.*?\}\s*\n\s*<\/Text>\s*\n\s*\)}/g;

export { practiceScreens, addImport, replaceFeedback, feedbackPattern };
