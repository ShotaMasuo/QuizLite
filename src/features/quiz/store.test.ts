import { describe, it, expect, beforeEach } from 'vitest';
import { useQuizStore } from './store';
import { Question } from '../../services/types';

describe('Quiz Store', () => {
  beforeEach(() => {
    useQuizStore.setState({
      questions: [],
      index: 0,
      answers: {},
      status: 'idle',
      settings: undefined,
    });
  });

  describe('answer', () => {
    it('should store user answers', () => {
      const { answer } = useQuizStore.getState();
      answer('q1', 'test answer');
      
      expect(useQuizStore.getState().answers).toEqual({
        q1: 'test answer',
      });
    });
  });

  describe('next', () => {
    it('should increment index when not at last question', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
        { id: 'q2', kind: 'math', expr: '2 + 2', answer: '4' },
      ];
      useQuizStore.setState({ questions, index: 0, status: 'ready' });
      
      const { next } = useQuizStore.getState();
      next();
      
      expect(useQuizStore.getState().index).toBe(1);
      expect(useQuizStore.getState().status).toBe('ready');
    });

    it('should set status to finished when at last question', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
      ];
      useQuizStore.setState({ questions, index: 0, status: 'ready' });
      
      const { next } = useQuizStore.getState();
      next();
      
      expect(useQuizStore.getState().status).toBe('finished');
    });
  });

  describe('score', () => {
    it('should calculate score correctly', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
        { id: 'q2', kind: 'math', expr: '2 + 2', answer: '4' },
        { id: 'q3', kind: 'english', word: 'cat', answer: '猫' },
      ];
      const answers = {
        q1: '2',  // correct
        q2: '5',  // wrong
        q3: '猫', // correct
      };
      
      useQuizStore.setState({ questions, answers });
      const { score } = useQuizStore.getState();
      const result = score();
      
      expect(result.score).toBe(2);
      expect(result.total).toBe(3);
      expect(result.percentage).toBe(67);
      expect(result.answers).toHaveLength(3);
      expect(result.answers[0].isCorrect).toBe(true);
      expect(result.answers[1].isCorrect).toBe(false);
      expect(result.answers[2].isCorrect).toBe(true);
    });
  });

  describe('getCurrentQuestion', () => {
    it('should return current question', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
        { id: 'q2', kind: 'math', expr: '2 + 2', answer: '4' },
      ];
      useQuizStore.setState({ questions, index: 1 });
      
      const { getCurrentQuestion } = useQuizStore.getState();
      expect(getCurrentQuestion()).toEqual(questions[1]);
    });
  });

  describe('isLastQuestion', () => {
    it('should return true when at last question', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
        { id: 'q2', kind: 'math', expr: '2 + 2', answer: '4' },
      ];
      useQuizStore.setState({ questions, index: 1 });
      
      const { isLastQuestion } = useQuizStore.getState();
      expect(isLastQuestion()).toBe(true);
    });

    it('should return false when not at last question', () => {
      const questions: Question[] = [
        { id: 'q1', kind: 'math', expr: '1 + 1', answer: '2' },
        { id: 'q2', kind: 'math', expr: '2 + 2', answer: '4' },
      ];
      useQuizStore.setState({ questions, index: 0 });
      
      const { isLastQuestion } = useQuizStore.getState();
      expect(isLastQuestion()).toBe(false);
    });
  });
});