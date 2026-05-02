import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
    AdditionIntroScreen,
    AdditionLevelScreen,
    AdditionPracticeScreen,
    ComparisonIntroScreen,
    ComparisonLevelScreen,
    ComparisonPracticeScreen,
    CountingIntroScreen,
    CountingLevelScreen,
    CountingPracticeScreen,
    GeometryIntroScreen,
    GeometryLevelScreen,
    GeometryPracticeScreen,
    HomeScreen,
    MultiplicationIntroScreen,
    MultiplicationLevelScreen,
    MultiplicationPracticeScreen,
    OrderingIntroScreen,
    OrderingLevelScreen,
    OrderingPracticeScreen,
    RankingsScreen,
    ResultScreen,
    SudokuIntroScreen,
    SudokuLevelScreen,
    SudokuPracticeScreen,
    VideoLessonsIntroScreen,
    VideoLessonsLevelScreen,
    WordProblemsIntroScreen,
    WordProblemsLevelScreen,
    WordProblemsPracticeScreen,
} from './screens';

const Stack = createNativeStackNavigator();

// -------- Stack for Home --------
function HomeStack({ initialRouteName = 'HomeMain' }: { initialRouteName?: string }) {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRouteName}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="AdditionIntro" component={AdditionIntroScreen} />
      <Stack.Screen name="AdditionLevel" component={AdditionLevelScreen} />
      <Stack.Screen name="MultiplicationIntro" component={MultiplicationIntroScreen} />
      <Stack.Screen name="MultiplicationLevel" component={MultiplicationLevelScreen} />
      <Stack.Screen name="ComparisonIntro" component={ComparisonIntroScreen} />
      <Stack.Screen name="ComparisonLevel" component={ComparisonLevelScreen} />
      <Stack.Screen name="OrderingIntro" component={OrderingIntroScreen} />
      <Stack.Screen name="OrderingLevel" component={OrderingLevelScreen} />
      <Stack.Screen name="SudokuIntro" component={SudokuIntroScreen} />
      <Stack.Screen name="SudokuLevel" component={SudokuLevelScreen} />
      <Stack.Screen name="CountingIntro" component={CountingIntroScreen} />
      <Stack.Screen name="CountingLevel" component={CountingLevelScreen} />
      <Stack.Screen name="GeometryIntro" component={GeometryIntroScreen} />
      <Stack.Screen name="GeometryLevel" component={GeometryLevelScreen} />
      <Stack.Screen name="WordProblemsIntro" component={WordProblemsIntroScreen} />
      <Stack.Screen name="WordProblemsLevel" component={WordProblemsLevelScreen} />
      <Stack.Screen name="VideoLessonsIntro" component={VideoLessonsIntroScreen} />
      <Stack.Screen name="VideoLessonsLevel" component={VideoLessonsLevelScreen} />
      <Stack.Screen name="AdditionPractice" component={AdditionPracticeScreen} />
      <Stack.Screen name="MultiplicationPractice" component={MultiplicationPracticeScreen} />
      <Stack.Screen name="ComparisonPractice" component={ComparisonPracticeScreen} />
      <Stack.Screen name="OrderingPractice" component={OrderingPracticeScreen} />
      <Stack.Screen name="SudokuPractice" component={SudokuPracticeScreen} />
      <Stack.Screen name="CountingPractice" component={CountingPracticeScreen} />
      <Stack.Screen name="GeometryPractice" component={GeometryPracticeScreen} />
      <Stack.Screen name="WordProblemsPractice" component={WordProblemsPracticeScreen} />
            <Stack.Screen name="Result" component={ResultScreen} />
      <Stack.Screen name="Rankings" component={RankingsScreen} />
    </Stack.Navigator>
  );
}

// -------- Main App Stack --------
export default function App() {
  return <HomeStack />;
}

export { HomeStack };

