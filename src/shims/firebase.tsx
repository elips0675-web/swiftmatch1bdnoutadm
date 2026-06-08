import { createContext, useContext, type ReactNode } from "react"
import { api } from "@/lib/api"
import type { UserProfile } from "@/types"

interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

interface UserState {
  user: FirebaseUser | null
  loading: boolean
  error: string | null
}

interface DocState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

interface CollectionState<T> {
  data: T[]
  loading: boolean
  error: string | null
}

const Ctx = createContext<null>(null)

export const FirebaseClientProvider = ({ children }: { children: ReactNode }) => {
  return <Ctx.Provider value={null}>{children}</Ctx.Provider>
}

export function useFirebase() {
  return null
}

export function useFirestore() {
  return null
}

export function useAuth(): UserState {
  const token = localStorage.getItem("authToken")
  if (!token) return { user: null, loading: false, error: null }
  return { user: null, loading: true, error: null }
}

export function useStorage() {
  return null
}

export async function uploadProfilePhoto(file: File): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append("photo", file)
    const res = await api.post<{ url: string }>("/upload/profile-photo", formData, {
      headers: {} as Record<string, string>,
    })
    return res.url
  } catch {
    return null
  }
}

export function useUser(): UserState {
  const token = localStorage.getItem("authToken")
  if (!token) return { user: null, loading: false, error: null }
  return { user: null, loading: true, error: null }
}

export function useDoc<T = UserProfile>(_ref: string): DocState<T> {
  return { data: null as T | null, loading: false, error: null }
}

export function useCollection<T = UserProfile>(_ref: string): CollectionState<T> {
  return { data: [] as T[], loading: false, error: null }
}

export function useMemoFirebase<T>(factory: () => T, _deps: unknown[]) {
  return factory()
}

type EventHandler = (...args: unknown[]) => void

export const errorEmitter = {
  on(_event: string, _handler: EventHandler) {},
  off(_event: string, _handler: EventHandler) {},
  emit(_event: string, ..._args: unknown[]) {},
}
