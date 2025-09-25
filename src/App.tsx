import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './app/providers/AppContext';
import { Home } from './app/routes/Home';
import { Quiz } from './app/routes/Quiz';
import { Result } from './app/routes/Result';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
