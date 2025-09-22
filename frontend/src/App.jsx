import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/login_page.jsx';
import SignupPage from './components/signup_page.jsx';
import FindMedicine from './components/FirstPage.jsx';
import MapPage from './components/MapPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (!isAuthenticated) {
    return showSignup ? (
      <SignupPage onSwitchToLogin={() => setShowSignup(false)} />
    ) : (
      <LoginPage onSwitchToSignup={() => setShowSignup(true)} onLoginSuccess={() => setIsAuthenticated(true)} />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FindMedicine />} />
        <Route path="/mappage" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
