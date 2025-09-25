import React from 'react';
import { calculateProgress, formatQuestionNumber } from '../features/quiz/utils';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const progress = calculateProgress(current, total);
  
  return (
    <div className="progress-container">
      <div className="progress-info">
        <span className="progress-text">{formatQuestionNumber(current, total)}</span>
        <span className="progress-percentage">{progress}%</span>
      </div>
      <div 
        className="progress-bar"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`進捗: ${progress}%`}
      >
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};