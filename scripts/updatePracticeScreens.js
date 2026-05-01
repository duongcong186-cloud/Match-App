const fs = require('fs');
const path = require('path');
const base = path.join(process.cwd(), 'app', '(tabs)', 'screens');
const files = [
  'AdditionPracticeScreen.tsx',
  'MultiplicationPracticeScreen.tsx',
  'ComparisonPracticeScreen.tsx',
  'OrderingPracticeScreen.tsx',
  'SudokuPracticeScreen.tsx',
  'CountingPracticeScreen.tsx',
  'GeometryPracticeScreen.tsx',
  'WordProblemsPracticeScreen.tsx',
  'VideoLessonsPracticeScreen.tsx',
];
for (const file of files) {
  const filePath = path.join(base, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;

  updated = updated.replace(
    /<Text style=\{styles\.practiceHeaderTitle\}>\{category\.title\} - Level \{level\}<\/Text>/g,
    '<Text style={styles.practiceHeaderTitle}>Math Match · {category.title}</Text>'
  );

  updated = updated.replace(
    /<Text style=\{styles\.practiceProgressText\}>\{currentIndex \+ 1\}\/10<\/Text>/g,
    '<Text style={styles.practiceProgressText}>Level {level} • {currentIndex + 1}/10</Text>'
  );

  if (!/const isCorrect = selectedAnswer === currentQuestion\?\.answer;/.test(updated)) {
    updated = updated.replace(
      /const currentQuestion = questions\[currentIndex\];\n  const progressWidth = \(\(currentIndex \+ 1\) \/ 10\) \* \(Dimensions\.get\('window'\)\.width - 40\);/,
      `const currentQuestion = questions[currentIndex];\n  const isCorrect = selectedAnswer === currentQuestion?.answer;\n  const progressWidth = ((currentIndex + 1) / 10) * (Dimensions.get('window').width - 40);`
    );
  }

  if (!/styles\.feedbackText/.test(updated)) {
    updated = updated.replace(
      /\s*<\/View>\n      <\/ScrollView>/,
      `</View>\n\n        {answered && currentQuestion && (\n          <Text style={[styles.feedbackText, { color: isCorrect ? '#10b981' : '#ef4444', marginBottom: 24 }]}>\n            {isCorrect ? 'Correct! Great job.' : \`Incorrect — the correct answer is ${currentQuestion.answer}.\` }\n          </Text>\n        )}\n      </ScrollView>`
    );
  }

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated', file);
  } else {
    console.log('No change needed', file);
  }
}
