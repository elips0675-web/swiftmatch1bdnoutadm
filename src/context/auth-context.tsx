import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react'
import { api } from '@/lib/api'
import type { AuthState } from '@/types'

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  register: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthState['user']; token: string }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null }
    case 'AUTH_SUCCESS':
      return {
        user: action.payload,
        token: action.token,
        isLoading: false,
        error: null,
      }
    case 'AUTH_FAILURE':
      return { ...state, isLoading: false, error: action.payload }
    case 'AUTH_LOGOUT':
      return { user: null, token: null, isLoading: false, error: null }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      dispatch({ type: 'AUTH_LOGOUT' })
      return
    }

    api
      .get<{ user: AuthState['user'] }>('/auth/me')
      .then((res) =>
        dispatch({ type: 'AUTH_SUCCESS', payload: res.user, token }),
      )
      .catch(() => {
        localStorage.removeItem('authToken')
        dispatch({ type: 'AUTH_LOGOUT' })
      })
  }, [])

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch({ type: 'AUTH_LOGOUT' })
      localStorage.removeItem('authToken')
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await api.post<{ user: AuthState['user']; token: string }>(
        '/auth/login',
        { email, password },
      )
      localStorage.setItem('authToken', res.token)
      dispatch({ type: 'AUTH_SUCCESS', payload: res.user, token: res.token })
    } catch (err: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Login failed' })
      throw err
    }
  }, [])

  const loginWithGoogle = useCallback(async () => {
    dispatch({ type: 'AUTH_START' })
    try {
      const res = await api.post<{ user: AuthState['user']; token: string }>(
        '/auth/google',
      )
      localStorage.setItem('authToken', res.token)
      dispatch({ type: 'AUTH_SUCCESS', payload: res.user, token: res.token })
    } catch (err: any) {
      dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Google login failed' })
      throw err
    }
  }, [])

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      dispatch({ type: 'AUTH_START' })
      try {
        const res = await api.post<{ user: AuthState['user']; token: string }>(
          '/auth/register',
          { email, password, name },
        )
        localStorage.setItem('authToken', res.token)
        dispatch({ type: 'AUTH_SUCCESS', payload: res.user, token: res.token })
      } catch (err: any) {
        dispatch({ type: 'AUTH_FAILURE', payload: err.message || 'Registration failed' })
        throw err
      }
    },
    [],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    dispatch({ type: 'AUTH_LOGOUT' })
  }, [])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  return (
    <AuthContext.Provider
      value={{ ...state, login, loginWithGoogle, register, logout, clearError }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
