
import { useState } from 'react'
import './App.css'
import LoginPage from './Components/login_page.jsx'
import SignupPage from './Components/signup_page.jsx'
import FindMedicine from "./Components/FirstPage";

function App() {
  const [view, setView] = useState('login')
  return view === 'login' ? (
    <LoginPage onSwitchToSignup={() => setView('signup')} />
  ) : (
    <SignupPage onSwitchToLogin={() => setView('login')} />
  )
  return <FindMedicine />;
}

export default App;

