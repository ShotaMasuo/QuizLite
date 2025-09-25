import { http, HttpResponse } from 'msw';
import { Subject, Mode, Question, QuizResponse } from '../services/types';

// Mock data
const englishWordsWithAnswers = [
  { word: 'apple', answer: 'りんご' },
  { word: 'book', answer: '本' },
  { word: 'cat', answer: '猫' },
  { word: 'dog', answer: '犬' },
  { word: 'elephant', answer: '象' },
  { word: 'fish', answer: '魚' },
  { word: 'green', answer: '緑' },
  { word: 'happy', answer: '幸せ' },
  { word: 'ice', answer: '氷' },
  { word: 'jump', answer: '跳ぶ' },
];

const mathProblems = [
  { expr: '2 + 3', answer: '5' },
  { expr: '7 - 4', answer: '3' },
  { expr: '5 × 6', answer: '30' },
  { expr: '12 ÷ 3', answer: '4' },
  { expr: '8 + 9', answer: '17' },
  { expr: '15 - 7', answer: '8' },
  { expr: '4 × 5', answer: '20' },
  { expr: '20 ÷ 4', answer: '5' },
  { expr: '11 + 13', answer: '24' },
  { expr: '25 - 16', answer: '9' },
];

function generateChoices(correctAnswer: string, allAnswers: string[]): string[] {
  const choices = [correctAnswer];
  const otherAnswers = allAnswers.filter(a => a !== correctAnswer);
  
  while (choices.length < 4 && otherAnswers.length > 0) {
    const randomIndex = Math.floor(Math.random() * otherAnswers.length);
    const choice = otherAnswers.splice(randomIndex, 1)[0];
    if (!choices.includes(choice)) {
      choices.push(choice);
    }
  }
  
  return choices.sort(() => Math.random() - 0.5);
}

export const handlers = [
  http.get('/api/quizzes', ({ request }) => {
    try {
      const url = new URL(request.url);
      const subject = url.searchParams.get('subject') as Subject;
      const mode = url.searchParams.get('mode') as Mode;
      const total = parseInt(url.searchParams.get('total') || '5', 10);

      // Validate parameters
      if (!subject || !mode || !total) {
        return new HttpResponse(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Simulate random errors for testing (disabled for now)
      // if (Math.random() < 0.1) {
      //   return new HttpResponse(null, { status: 500 });
      // }

      const questions: Question[] = [];

      if (subject === 'english') {
        const shuffled = [...englishWordsWithAnswers].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(total, shuffled.length));
        const allAnswers = englishWordsWithAnswers.map(item => item.answer);

        questions.push(...selected.map((item, index) => ({
          id: `eng-${index}`,
          kind: 'english' as const,
          word: item.word,
          answer: item.answer,
          ...(mode === 'choice4' ? { choices: generateChoices(item.answer, allAnswers) } : {}),
        })));
      } else if (subject === 'math') {
        const shuffled = [...mathProblems].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(total, shuffled.length));

        questions.push(...selected.map((item, index) => ({
          id: `math-${index}`,
          kind: 'math' as const,
          expr: item.expr,
          answer: item.answer,
        })));
      }

      const response: QuizResponse = { items: questions };
      return HttpResponse.json(response);
    } catch (error) {
      console.error('Error in quiz handler:', error);
      return new HttpResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }),
];