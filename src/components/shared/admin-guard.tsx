import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSupabase } from '@/lib/supabase'

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = getSupabase()
      if (!supabase) {
        navigate('/login', { replace: true })
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        navigate('/login', { replace: true })
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
      if (profile?.role === 'admin') {
        setAuthorized(true)
      } else {
        navigate('/', { replace: true })
      }
    }
    checkAdmin()
  }, [navigate])

  if (authorized === null) return null
  if (!authorized) return null
  return <>{children}</>
}
