import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Records from './pages/Records';
import SelectWine from './pages/SelectWine';
import AddTastingRecord from './pages/AddTastingRecord';
import WineDetail from './pages/WineDetail';
import QuizGame from './pages/QuizGame';
import BottomNavigation from './components/BottomNavigation';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/records" element={<Records />} />
                <Route path="/select-wine" element={<SelectWine />} />
                <Route path="/add-tasting-record/:wineId" element={<AddTastingRecord />} />
                <Route path="/edit-tasting-record/:recordId" element={<AddTastingRecord />} />
                <Route path="/wine-detail/:wineId" element={<WineDetail />} />
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
    </ThemeProvider>
  );
}

export default App;
