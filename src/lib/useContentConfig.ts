import { useState, useEffect } from 'react'
import { INTEREST_OPTIONS, DATING_GOALS, EDUCATION_OPTIONS, CAPITALS } from './constants'
import { FORBIDDEN_WORDS_DEFAULT } from './admin-mock-data'

export interface ContentConfig {
  interests: string[]
  dating_goals: string[]
  education: string[]
  banned_words: string[]
  cities: string[]
}

const FALLBACK: ContentConfig = {
  interests: [...INTEREST_OPTIONS],
  dating_goals: [...DATING_GOALS],
  education: [...EDUCATION_OPTIONS],
  banned_words: [...FORBIDDEN_WORDS_DEFAULT],
  cities: [...CAPITALS],
}

let cached: ContentConfig | null = null
let loadingPromise: Promise<ContentConfig> | null = null

async function fetchConfig(): Promise<ContentConfig> {
  try {
    const res = await fetch('/api/content')
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    cached = {
      interests: data.interests || [],
      dating_goals: data.dating_goals || [],
      education: data.education || [],
      banned_words: data.banned_words || [],
      cities: data.cities || [],
    }
    return cached
  } catch {
    cached = FALLBACK
    return FALLBACK
  }
}

function getOrFetch(): Promise<ContentConfig> {
  if (cached) return Promise.resolve(cached)
  if (!loadingPromise) loadingPromise = fetchConfig()
  return loadingPromise
}

export function useContentConfig(): ContentConfig {
  const [config, setConfig] = useState<ContentConfig>(cached || FALLBACK)

  useEffect(() => {
    if (cached) return
    getOrFetch().then(setConfig)
  }, [])

  return config
}

export function getContentConfig(): Promise<ContentConfig> {
  return getOrFetch()
}

export function invalidateContentCache(): void {
  cached = null
  loadingPromise = null
}
