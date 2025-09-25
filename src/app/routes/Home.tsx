import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SubjectPicker } from '../../components/SubjectPicker';
import { useAppContext } from '../providers/AppContext';
import { Subject, Mode } from '../../services/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { setSettings } = useAppContext();

  const handleSubmit = (subject: Subject, mode: Mode, total: number, userName?: string) => {
    setSettings({ subject, mode, total, userName });
    navigate('/quiz');
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>QuizLite</h1>
        <p>楽しく学べるクイズアプリ</p>
      </header>
      <main>
        <SubjectPicker onSubmit={handleSubmit} />
      </main>
    </div>
  );
};