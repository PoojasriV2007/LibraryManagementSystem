import { useState } from 'react'
import { BookCheck, Eye, EyeOff, Lock, Mail, Search, TriangleAlert, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const validate = (mode, { name, email, password }) => {
  const errors = {}
  if (mode === 'signup' && !name.trim()) errors.name = 'Please enter your name.'
  if (!EMAIL_RE.test(email.trim())) errors.email = 'Please enter a valid email address.'
  if (mode === 'signup' && password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (mode === 'login' && !password) errors.password = 'Please enter your password.'
  return errors
}

function Field({ id, label, icon: Icon, error, children }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={`input-icon${error ? ' invalid' : ''}`}>
        <Icon size={18} />
        {children}
      </div>
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
    </div>
  )
}

export default function AuthPage() {
  const { login, signup, notice, clearNotice } = useAuth()
  const [mode, setMode] = useState('login')
  const [values, setValues] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)

  const switchMode = (next) => {
    setMode(next)
    setErrors({})
    setServerError('')
    clearNotice()
  }

  const update = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    if (errors[field]) setErrors((er) => ({ ...er, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    clearNotice()
    const found = validate(mode, values)
    setErrors(found)
    if (Object.keys(found).length) return

    setBusy(true)
    try {
      const payload = { email: values.email.trim(), password: values.password }
      if (mode === 'signup') await signup({ ...payload, name: values.name.trim() })
      else await login(payload)
    } catch (err) {
      setServerError(err.message)
      if (err.errors) setErrors(err.errors)
    } finally {
      setBusy(false)
    }
  }

  const describe = (id) => (errors[id] ? `${id}-error` : undefined)

  return (
    <div className="auth">
      <section className="auth-visual">
        <img src="/images/auth-library.jpg" alt="" aria-hidden="true" />
        <div className="auth-visual-inner">
          <Logo />
          <div>
            <h1 className="auth-headline">Your library,<br /><span className="text-gradient-light">beautifully organised.</span></h1>
            <ul className="auth-points">
              <li><BookCheck size={20} /> Track which books are available or issued</li>
              <li><Search size={20} /> Find any book by title or author in seconds</li>
              <li><Lock size={20} /> Your account keeps the library secure</li>
            </ul>
          </div>
          <p className="auth-quote">“A room without books is like a body without a soul.” — Cicero</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-mobile-logo"><Logo /></div>
          <h2 className="auth-title">{mode === 'login' ? 'Welcome back 👋' : 'Create your account'}</h2>
          <p className="auth-sub">
            {mode === 'login' ? 'Log in to manage your library.' : 'Sign up to start managing your library.'}
          </p>

          <div className="auth-tabs" role="tablist" aria-label="Choose login or sign up">
            <button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => switchMode('login')}>Log In</button>
            <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'active' : ''} onClick={() => switchMode('signup')}>Sign Up</button>
          </div>

          {(serverError || notice) && (
            <div className="alert" role="alert"><TriangleAlert size={18} /> {serverError || notice}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <Field id="name" label="Full name" icon={User} error={errors.name}>
                <input id="name" autoComplete="name" placeholder="e.g. Sachin Kumar" value={values.name} onChange={update('name')} maxLength={60} aria-invalid={Boolean(errors.name)} aria-describedby={describe('name')} />
              </Field>
            )}
            <Field id="email" label="Email" icon={Mail} error={errors.email}>
              <input id="email" type="email" autoComplete="email" placeholder="you@example.com" value={values.email} onChange={update('email')} maxLength={120} aria-invalid={Boolean(errors.email)} aria-describedby={describe('email')} />
            </Field>
            <Field id="password" label="Password" icon={Lock} error={errors.password}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={values.password}
                onChange={update('password')}
                maxLength={72}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={describe('password')}
              />
              <button type="button" className="reveal" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </Field>

            <button type="submit" className="btn-gradient btn-block" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button type="button" className="link-btn" onClick={() => switchMode(mode === 'login' ? 'signup' : 'login')}>
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </section>
    </div>
  )
}
