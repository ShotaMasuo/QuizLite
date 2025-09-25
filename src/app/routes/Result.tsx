import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResultSummary } from '../../components/ResultSummary';
import { useQuizStore } from '../../features/quiz/store';
import { useAppContext } from '../providers/AppContext';

export const Result: React.FC = () => {
  const navigate = useNavigate();
  const { settings } = useAppContext();
  const { questions, status, score, reset } = useQuizStore();

  useEffect(() => {
    if (status !== 'finished' || questions.length === 0) {
      navigate('/');
    }
  }, [status, questions, navigate]);

  const handleRetry = () => {
    reset();
    navigate('/');
  };

  if (status !== 'finished') {
    return null;
  }

  const result = score();

  return (
    <div className="page-container">
      <main>
        <ResultSummary
          result={result}
          questions={questions}
          userName={settings?.userName}
          onRetry={handleRetry}
        />
      </main>
    </div>
  );
};