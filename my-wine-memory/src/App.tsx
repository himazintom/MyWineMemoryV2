import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Records from './pages/Records';
import Quiz from './pages/Quiz';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import AddWine from './pages/AddWine';
import QuizGame from './pages/QuizGame';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/records" element={<Records />} />
              <Route path="/add-wine" element={<AddWine />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/quiz/play/:difficulty" element={<QuizGame />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
