export type Category = 'promises' | 'data-binding' | 'http' | 'httpclient' | 'rxjs' | 'signals' | 'angular-core';

export interface QuizQuestion {
  id: number;
  category: Category;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BugChallenge {
  id: number;
  category: Category;
  title: string;
  description: string;
  buggyCode: string;
  fixedCode: string;
  hint: string;
  bugDescription: string;
}

export interface CategoryScore {
  category: Category;
  label: string;
  correct: number;
  incorrect: number;
}

export interface UserScore {
  totalCorrect: number;
  totalIncorrect: number;
  totalBugsFound: number;
  totalBugsMissed: number;
  categoryScores: CategoryScore[];
  quizAnswers: QuizAnswer[];
  bugAttempts: BugAttempt[];
}

export interface QuizAnswer {
  questionId: number;
  category: Category;
  isCorrect: boolean;
  answeredAt: Date;
}

export interface BugAttempt {
  challengeId: number;
  category: Category;
  isCorrect: boolean;
  answeredAt: Date;
}
