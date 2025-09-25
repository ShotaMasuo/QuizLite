import { Question } from '../../services/types';

export const formatQuestionNumber = (current: number, total: number): string => {
  return `問題 ${current + 1} / ${total}`;
};

export const calculateProgress = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round(((current + 1) / total) * 100);
};

export const isAnswerCorrect = (question: Question, userAnswer: string): boolean => {
  const normalizedUserAnswer = userAnswer.toLowerCase().trim();
  const normalizedCorrectAnswer = question.answer.toLowerCase().trim();
  return normalizedUserAnswer === normalizedCorrectAnswer;
};

export const getResultMessage = (percentage: number): string => {
  if (percentage === 100) return 'パーフェクト！素晴らしい！';
  if (percentage >= 80) return 'よくできました！';
  if (percentage >= 60) return 'もう少しで合格です！';
  if (percentage >= 40) return 'がんばりましょう！';
  return '復習しましょう！';
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};