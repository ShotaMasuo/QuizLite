import { describe, it, expect } from 'vitest';
import {
  formatQuestionNumber,
  calculateProgress,
  isAnswerCorrect,
  getResultMessage,
  formatPercentage,
} from './utils';

describe('Quiz Utils', () => {
  describe('formatQuestionNumber', () => {
    it('should format question number correctly', () => {
      expect(formatQuestionNumber(0, 10)).toBe('問題 1 / 10');
      expect(formatQuestionNumber(4, 10)).toBe('問題 5 / 10');
      expect(formatQuestionNumber(9, 10)).toBe('問題 10 / 10');
    });
  });

  describe('calculateProgress', () => {
    it('should calculate progress percentage correctly', () => {
      expect(calculateProgress(0, 10)).toBe(10);
      expect(calculateProgress(4, 10)).toBe(50);
      expect(calculateProgress(9, 10)).toBe(100);
    });

    it('should return 0 for empty quiz', () => {
      expect(calculateProgress(0, 0)).toBe(0);
    });
  });

  describe('isAnswerCorrect', () => {
    it('should check English answers correctly', () => {
      const question = { id: '1', kind: 'english' as const, word: 'cat', answer: '猫' };
      expect(isAnswerCorrect(question, '猫')).toBe(true);
      expect(isAnswerCorrect(question, '犬')).toBe(false);
    });

    it('should check Math answers correctly', () => {
      const question = { id: '1', kind: 'math' as const, expr: '2 + 2', answer: '4' };
      expect(isAnswerCorrect(question, '4')).toBe(true);
      expect(isAnswerCorrect(question, '5')).toBe(false);
    });

    it('should be case-insensitive and trim whitespace', () => {
      const question = { id: '1', kind: 'english' as const, word: 'cat', answer: 'Cat' };
      expect(isAnswerCorrect(question, 'cat')).toBe(true);
      expect(isAnswerCorrect(question, ' CAT ')).toBe(true);
    });
  });

  describe('getResultMessage', () => {
    it('should return correct message based on percentage', () => {
      expect(getResultMessage(100)).toBe('パーフェクト！素晴らしい！');
      expect(getResultMessage(85)).toBe('よくできました！');
      expect(getResultMessage(70)).toBe('もう少しで合格です！');
      expect(getResultMessage(50)).toBe('がんばりましょう！');
      expect(getResultMessage(30)).toBe('復習しましょう！');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage correctly', () => {
      expect(formatPercentage(100)).toBe('100%');
      expect(formatPercentage(50)).toBe('50%');
      expect(formatPercentage(0)).toBe('0%');
    });
  });
});