import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorProvider } from './contexts/ErrorContext';
import BottomNavigation from './components/BottomNavigation';
import LoadingSpinner from './components/LoadingSpinner';
import { OfflineIndicator } from './components/OfflineIndicator';
// import { analyticsService } from './services/analyticsService';
import { errorTrackingService } from './services/errorTrackingService';
import './App.css';

// スクロール位置をリセットするコンポーネント
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Lazy load page components
const Home = React.lazy(() => import('./pages/Home'));
const Quiz = React.lazy(() => import('./pages/Quiz'));
const Stats = React.lazy(() => import('./pages/Stats'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Records = React.lazy(() => import('./pages/Records'));
const SelectWine = React.lazy(() => import('./pages/SelectWine'));
const AddTastingRecord = React.lazy(() => import('./pages/AddTastingRecord'));
const WineDetail = React.lazy(() => import('./pages/WineDetail'));
const QuizGame = React.lazy(() => import('./pages/QuizGame'));
const QuizLevelSelect = React.lazy(() => import('./pages/QuizLevelSelect'));
const PublicProfile = React.lazy(() => import('./pages/PublicProfile'));

function App() {
  // Initialize monitoring services
  useEffect(() => {
    // Initialize error tracking
    errorTrackingService.initialize({
      environment: import.meta.env.VITE_NODE_ENV || 'development',
      release: import.meta.env.VITE_BUILD_VERSION,
    });

    // Start session tracking
    errorTrackingService.startSession();

    // Cleanup on unmount
    return () => {
      errorTrackingService.endSession();
    };
  }, []);

  return (
    <ThemeProvider>
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <div className="app">
              <OfflineIndicator />
              <main className="main-content">
              <Suspense fallback={
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  height: '50vh' 
                }}>
                  <LoadingSpinner message="ページを読み込み中..." />
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/select-wine" element={<SelectWine />} />
                  <Route path="/add-tasting-record" element={<AddTastingRecord />} />
                  <Route path="/edit-tasting-record/:recordId" element={<AddTastingRecord />} />
                  <Route path="/wine-detail/:wineId" element={<WineDetail />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/quiz/levels" element={<QuizLevelSelect />} />
                  <Route path="/quiz/play/:difficulty" element={<QuizGame />} />
                  <Route path="/stats" element={<Stats />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/:userId" element={<PublicProfile />} />
                </Routes>
              </Suspense>
            </main>
            <BottomNavigation />
          </div>
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;
