import { useState } from 'react'
import './login_page.css'

import { Link, useNavigate } from 'react-router-dom'

function LoginPage() {
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  function handleSubmit(event) {
    event.preventDefault()
    // TODO: hook up real auth later
    // eslint-disable-next-line no-alert
    alert(`Username: ${userName}\nPassword: ${password}`)
    navigate('/pharmacy')
  }

  return (
    <div className="login-layout">
      <div className="login-layout__left" />
      <div className="login-layout__right">
        <div className="login-card">
          <h1 className="login-title">LOGIN</h1>

          <form onSubmit={handleSubmit} className="login-form" autoComplete="on">
            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                {/* User icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M4 22C4 18.134 7.13401 15 11 15H13C16.866 15 20 18.134 20 22" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type="text"
                name="userName"
                placeholder="Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon input-icon--left" aria-hidden="true">
                {/* Lock icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="11" width="16" height="9" rx="2" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M8 11V8C8 5.79 9.79 4 12 4C14.21 4 16 5.79 16 8V11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="input-icon input-icon--right btn-reset"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? (
                  // Eye icon
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12C3.8 7.6 7.6 5 12 5C16.4 5 20.2 7.6 22 12C20.2 16.4 16.4 19 12 19C7.6 19 3.8 16.4 2 12Z" stroke="currentColor" strokeWidth="1.7"/>
                    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7"/>
                  </svg>
                ) : (
                  // Eye off icon
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M2 12C3.8 7.6 7.6 5 12 5C14.1 5 16.07 5.57 17.78 6.57M21.97 14.07C20.37 17.47 16.55 19 12 19C10.48 19 9.05 18.75 7.75 18.29" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                    <path d="M9.5 9.5C10.1 9.18 10.78 9 11.5 9C13.71 9 15.5 10.79 15.5 13C15.5 13.72 15.32 14.4 15 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="form-row form-row--between">
              <a className="muted-link" href="#">Forgot Password ?</a>
            </div>

            <button className="btn-primary" type="submit">Log in</button>

            <p className="signup-row">
              Don’t have an account?{' '}
              <Link to="/signup" className="link-btn" style={{ textDecoration: 'none' }}>Sign up</Link>
            </p>

            <div className="separator">
              <span />
              <em>or</em>
              <span />
            </div>

            <div className="social-row">
              <button type="button" aria-label="Continue with Google" className="social-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M12 10.2v3.7h5.2c-.2 1.2-1.4 3.5-5.2 3.5-3.1 0-5.6-2.6-5.6-5.8S8.9 5.8 12 5.8c1.8 0 3 .8 3.7 1.5l2.5-2.4C16.9 3.4 14.7 2.5 12 2.5 6.9 2.5 2.7 6.7 2.7 11.9S6.9 21.2 12 21.2c7 0 9.3-4.9 8.6-7.9H12z"/>
                </svg>
              </button>
              <button type="button" aria-label="Continue with Facebook" className="social-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#1877F2" d="M22 12.07C22 6.48 17.52 2 11.93 2 6.35 2 1.87 6.48 1.87 12.07c0 4.97 3.63 9.09 8.38 9.93v-7.02H7.9v-2.9h2.35V9.41c0-2.33 1.38-3.62 3.5-3.62.99 0 2.03.18 2.03.18v2.23h-1.14c-1.12 0-1.47.7-1.47 1.41v1.69h2.5l-.4 2.9h-2.1v7.02c4.75-.84 8.38-4.96 8.38-9.93z"/>
                </svg>
              </button>
              <button type="button" aria-label="Continue with X" className="social-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#000" d="M18.244 2H21L14.33 9.62 22 22h-6.244l-4.44-6.91L5.91 22H3.15l7.17-7.97L2 2h6.38l4.03 6.35L18.244 2Zm-2.19 18h2.16L8.04 4H5.8l10.254 16Z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


