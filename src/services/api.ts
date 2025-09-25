import axios from 'axios';
import { AppSettings, QuizResponse } from './types';

const api = axios.create({
  baseURL: '',
  timeout: 10000,
});

export const fetchQuestions = async (settings: AppSettings): Promise<QuizResponse> => {
  const { subject, mode, total } = settings;
  const response = await api.get<QuizResponse>('/api/quizzes', {
    params: { subject, mode, total },
  });
  return response.data;
};