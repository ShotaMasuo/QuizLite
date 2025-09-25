import React from 'react';
import { QuizResult, Question } from '../services/types';
import { formatPercentage, getResultMessage } from '../features/quiz/utils';
import './ResultSummary.css';

interface ResultSummaryProps {
  result: QuizResult;
  questions: Question[];
  userName?: string;
  onRetry: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({ 
  result, 
  questions, 
  userName,
  onRetry 
}) => {
  return (
    <div className="result-summary">
      <div className="result-header">
        <h1>クイズ終了！</h1>
        {userName && <p className="user-name">{userName}さんの結果</p>}
      </div>

      <div className="score-display" role="region" aria-label="スコア">
        <div className="score-circle">
          <span className="score-number">{result.score}</span>
          <span className="score-total">/ {result.total}</span>
        </div>
        <p className="score-percentage">{formatPercentage(result.percentage)}</p>
        <p className="result-message">{getResultMessage(result.percentage)}</p>
      </div>

      {result.percentage < 100 && (
        <div className="mistakes-section">
          <h2>間違えた問題</h2>
          <div className="mistakes-list">
            {result.answers
              .filter(answer => !answer.isCorrect)
              .map(answer => {
                const question = questions.find(q => q.id === answer.questionId);
                if (!question) return null;

                return (
                  <div key={answer.questionId} className="mistake-item">
                    <div className="mistake-question">
                      {question.kind === 'english' 
                        ? `「${question.word}」` 
                        : question.expr}
                    </div>
                    <div className="mistake-answers">
                      <div className="user-answer wrong">
                        <span className="label">あなたの回答:</span>
                        <span className="value">{answer.userAnswer || '(未回答)'}</span>
                      </div>
                      <div className="correct-answer">
                        <span className="label">正解:</span>
                        <span className="value">{question.answer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <button onClick={onRetry} className="retry-button">
        もう一度挑戦する
      </button>
    </div>
  );
};