import React, { useState, useEffect } from 'react';
import { Question } from '../services/types';
import './QuestionCard.css';

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
  currentAnswer?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  onAnswer,
  currentAnswer = ''
}) => {
  const [inputValue, setInputValue] = useState(currentAnswer);
  const [selectedChoice, setSelectedChoice] = useState(currentAnswer);

  useEffect(() => {
    setInputValue(currentAnswer);
    setSelectedChoice(currentAnswer);
  }, [question.id, currentAnswer]);

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  };

  const handleChoiceSelect = (choice: string) => {
    setSelectedChoice(choice);
    onAnswer(choice);
  };

  if (question.kind === 'english' && question.choices) {
    return (
      <div className="question-card" role="group" aria-labelledby="question-text">
        <h2 id="question-text" className="question-text">
          「{question.word}」の日本語訳は？
        </h2>
        <div className="choices-grid" role="radiogroup" aria-required="true">
          {question.choices.map((choice, index) => (
            <button
              key={choice}
              className={`choice-button ${selectedChoice === choice ? 'selected' : ''}`}
              onClick={() => handleChoiceSelect(choice)}
              aria-pressed={selectedChoice === choice}
              aria-label={`選択肢${index + 1}: ${choice}`}
            >
              {choice}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="question-card" role="group" aria-labelledby="question-text">
      <h2 id="question-text" className="question-text">
        {question.kind === 'english' 
          ? `「${question.word}」の日本語訳は？`
          : `${question.expr} = ?`}
      </h2>
      <form onSubmit={handleInputSubmit} className="answer-form">
        <label htmlFor="answer-input" className="visually-hidden">
          回答を入力
        </label>
        <input
          id="answer-input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={question.kind === 'english' ? '日本語で回答' : '答えを入力'}
          className="answer-input"
          aria-required="true"
          autoFocus
        />
        <button 
          type="submit" 
          className="submit-answer-button"
          disabled={!inputValue.trim()}
        >
          回答する
        </button>
      </form>
    </div>
  );
};