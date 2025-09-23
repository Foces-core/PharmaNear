import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import FirstPage from './Components/FirstPage.jsx';
import MapPage from './Components/MapPage.jsx';
import PharmacyPage from './Components/PharmacyPage.jsx';
import LoginPage from './Components/login_page.jsx';
import SignupPage from './Components/signup_page.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/mappage" element={<MapPage />} />
        <Route path="/pharmacy" element={<PharmacyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
