import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionCard } from '../../components/QuestionCard';
import { ProgressBar } from '../../components/ProgressBar';
import { useQuizStore } from '../../features/quiz/store';
import { useAppContext } from '../providers/AppContext';

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useAppContext();
  const { 
    status, 
    index, 
    questions,
    answers,
    load, 
    answer, 
    next,
    getCurrentQuestion
  } = useQuizStore();

  useEffect(() => {
    if (!settings) {
      navigate('/');
      return;
    }

    if (status === 'idle') {
      load(settings).catch(() => {
        alert('問題の読み込みに失敗しました。もう一度お試しください。');
        navigate('/');
      });
    }
  }, [settings, status, load, navigate]);

  useEffect(() => {
    if (status === 'finished') {
      navigate('/result');
    }
  }, [status, navigate]);

  const handleAnswer = (userAnswer: string) => {
    const currentQuestion = getCurrentQuestion();
    if (currentQuestion) {
      answer(currentQuestion.id, userAnswer);
      
      setTimeout(() => {
        next();
      }, 500);
    }
  };

  if (status === 'loading') {
    return (
      <div className="page-container">
        <div className="loading-state">
          <p>問題を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = getCurrentQuestion();
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="page-container">
      <header className="quiz-header">
        <ProgressBar current={index} total={questions.length} />
      </header>
      <main>
        <QuestionCard
          key={currentQuestion.id}
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentAnswer={answers[currentQuestion.id]}
        />
      </main>
    </div>
  );
};