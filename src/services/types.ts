// API Types
export type Subject = 'english' | 'math';
export type Mode = 'choice4' | 'input';

export interface AppSettings {
  subject: Subject;
  mode: Mode;
  total: number;
  userName?: string;
}

// Question Types
export interface EnglishQuestion {
  id: string;
  kind: 'english';
  word: string;
  answer: string;
  choices?: string[];
}

export interface MathQuestion {
  id: string;
  kind: 'math';
  expr: string;
  answer: string;
}

export type Question = EnglishQuestion | MathQuestion;

// API Response
export interface QuizResponse {
  items: Question[];
}

// Quiz State Types
export type QuizStatus = 'idle' | 'loading' | 'ready' | 'finished';

export interface QuizState {
  questions: Question[];
  index: number;
  answers: Record<string, string>;
  status: QuizStatus;
  settings?: AppSettings;
}

// Answer Types
export interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

// Result Types
export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  answers: AnswerRecord[];
}