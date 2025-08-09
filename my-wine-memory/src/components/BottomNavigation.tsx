import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: '🏠', label: 'ホーム' },
    { path: '/records', icon: '📝', label: '記録' },
    { path: '/quiz', icon: '🧠', label: 'クイズ' },
    { path: '/stats', icon: '📊', label: '統計' },
    { path: '/profile', icon: '👤', label: 'プロフィール' },
  ];
  
  return (
    <nav className="bottom-navigation">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
      <div className="nav-item theme-toggle-container">
        <ThemeToggle />
        <span className="nav-label">テーマ</span>
      </div>
    </nav>
  );
};

export default BottomNavigation;