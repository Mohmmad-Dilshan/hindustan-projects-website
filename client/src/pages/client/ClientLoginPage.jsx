/**
 * ClientLoginPage.jsx — Client login and password setup portal.
 */
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ShieldCheck, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useClientLogin, useClientSetupPassword } from '@/hooks/useClientPortal'

export default function ClientLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loginMutation = useClientLogin()
  const setupMutation = useClientSetupPassword()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      await loginMutation.mutateAsync({ email, password })
      navigate('/client/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.')
    }
  }

  const handleSetup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      await setupMutation.mutateAsync({ token, password })
      setSuccess('Password set successfully! Logging in...')
      setTimeout(() => {
        navigate('/client/dashboard', { replace: true })
      }, 1500)
    } catch (err) {
      setError(err.message || 'Setup link is invalid or has expired.')
    }
  }

  const isSetupMode = !!token
  const loading = loginMutation.isPending || setupMutation.isPending

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-brand-red/10">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Logo & Header */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 mb-4 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-brand-blue" />
        </div>
        <h2 className="text-3xl font-bold font-heading text-gray-900 tracking-tight">
          {isSetupMode ? 'Client Portal Setup' : 'Client Portal'}
        </h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
          {isSetupMode
            ? 'Establish a secure password to access your Hindustan Projects dashboard.'
            : 'Access your project progress, deliverables, and shared updates.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-gray-200 shadow-xl rounded-2xl sm:px-10">
          {/* Error and Success banners */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-755 text-sm rounded-xl font-medium">
              {success}
            </div>
          )}

          {isSetupMode ? (
            /* PASSWORD SETUP FORM */
            <form onSubmit={handleSetup} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                    placeholder="Min 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all cursor-pointer"
              >
                {loading ? 'Setting up...' : 'Complete Setup & Login'}
              </button>
            </form>
          ) : (
            /* PORTAL LOGIN FORM */
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/25 focus:border-brand-blue transition-all"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-brand-blue hover:bg-brand-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all cursor-pointer"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-gray-150 pt-5 text-center">
            <a
              href="/"
              className="text-xs font-semibold text-brand-blue hover:text-brand-blue-hover transition-colors"
            >
              ← Back to Main Website
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
