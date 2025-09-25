import React, { useState } from 'react';
import { Subject, Mode } from '../services/types';
import './SubjectPicker.css';

interface SubjectPickerProps {
  onSubmit: (subject: Subject, mode: Mode, total: number, userName?: string) => void;
}

export const SubjectPicker: React.FC<SubjectPickerProps> = ({ onSubmit }) => {
  const [subject, setSubject] = useState<Subject>('english');
  const [mode, setMode] = useState<Mode>('input');
  const [total, setTotal] = useState(5);
  const [userName, setUserName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(subject, mode, total, userName || undefined);
  };

  return (
    <form onSubmit={handleSubmit} className="subject-picker" aria-label="クイズ設定フォーム">
      <div className="form-group">
        <label htmlFor="userName">名前（任意）</label>
        <input
          id="userName"
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="名前を入力"
          className="form-input"
        />
      </div>

      <fieldset>
        <legend>科目を選択</legend>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="subject"
              value="english"
              checked={subject === 'english'}
              onChange={(e) => setSubject(e.target.value as Subject)}
            />
            <span>英語</span>
          </label>
          <label>
            <input
              type="radio"
              name="subject"
              value="math"
              checked={subject === 'math'}
              onChange={(e) => setSubject(e.target.value as Subject)}
            />
            <span>数学</span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>回答形式を選択</legend>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="mode"
              value="input"
              checked={mode === 'input'}
              onChange={(e) => setMode(e.target.value as Mode)}
            />
            <span>記述式</span>
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              value="choice4"
              checked={mode === 'choice4'}
              onChange={(e) => setMode(e.target.value as Mode)}
              disabled={subject === 'math'}
            />
            <span>4択問題{subject === 'math' && '（数学は記述式のみ）'}</span>
          </label>
        </div>
      </fieldset>

      <div className="form-group">
        <label htmlFor="total">問題数</label>
        <select
          id="total"
          value={total}
          onChange={(e) => setTotal(Number(e.target.value))}
          className="form-select"
        >
          {[3, 5, 10].map(num => (
            <option key={num} value={num}>{num}問</option>
          ))}
        </select>
      </div>

      <button type="submit" className="submit-button">
        クイズを開始
      </button>
    </form>
  );
};