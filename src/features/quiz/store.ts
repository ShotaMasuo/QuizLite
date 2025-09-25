import { create } from 'zustand';
import { QuizState, AppSettings, Question, AnswerRecord } from '../../services/types';
import { fetchQuestions } from '../../services/api';

interface QuizStore extends QuizState {
  load: (settings: AppSettings) => Promise<void>;
  answer: (questionId: string, userAnswer: string) => void;
  next: () => void;
  reset: () => void;
  score: () => { score: number; total: number; percentage: number; answers: AnswerRecord[] };
  getCurrentQuestion: () => Question | undefined;
  isLastQuestion: () => boolean;
}

const initialState: QuizState = {
  questions: [],
  index: 0,
  answers: {},
  status: 'idle',
  settings: undefined,
};

export const useQuizStore = create<QuizStore>((set, get) => ({
  ...initialState,

  load: async (settings: AppSettings) => {
    set({ status: 'loading', settings });
    try {
      const response = await fetchQuestions(settings);
      set({
        questions: response.items,
        status: 'ready',
        index: 0,
        answers: {},
      });
    } catch (error) {
      set({ status: 'idle' });
      throw error;
    }
  },

  answer: (questionId: string, userAnswer: string) => {
    set(state => ({
      answers: { ...state.answers, [questionId]: userAnswer },
    }));
  },

  next: () => {
    const state = get();
    if (state.index < state.questions.length - 1) {
      set({ index: state.index + 1 });
    } else {
      set({ status: 'finished' });
    }
  },

  reset: () => {
    set(initialState);
  },

  score: () => {
    const state = get();
    const answers: AnswerRecord[] = state.questions.map(question => ({
      questionId: question.id,
      userAnswer: state.answers[question.id] || '',
      isCorrect: (state.answers[question.id] || '').toLowerCase().trim() === 
                 question.answer.toLowerCase().trim(),
    }));

    const score = answers.filter(a => a.isCorrect).length;
    const total = state.questions.length;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return { score, total, percentage, answers };
  },

  getCurrentQuestion: () => {
    const state = get();
    return state.questions[state.index];
  },

  isLastQuestion: () => {
    const state = get();
    return state.index === state.questions.length - 1;
  },
}));