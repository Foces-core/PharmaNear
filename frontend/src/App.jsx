
import { useState } from 'react'
import './App.css'
import LoginPage from './components/login_page.jsx'
import SignupPage from './components/signup_page.jsx'

function App() {
  const [view, setView] = useState('login')
  return view === 'login' ? (
    <LoginPage onSwitchToSignup={() => setView('signup')} />
  ) : (
    <SignupPage onSwitchToLogin={() => setView('login')} />
  )
}
export default App
