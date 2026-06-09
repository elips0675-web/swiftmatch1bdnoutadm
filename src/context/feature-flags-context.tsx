import React, { createContext, useContext, useMemo, useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

export interface FeatureFlags {
  videoCallsEnabled: boolean;
  aiIcebreakersEnabled: boolean;
  aiCompatibilityEnabled: boolean;
  groupsPageEnabled: boolean;
}

const defaultFlags: FeatureFlags = {
  videoCallsEnabled: true,
  aiIcebreakersEnabled: true,
  aiCompatibilityEnabled: true,
  groupsPageEnabled: true,
};

const FeatureFlagsContext = createContext<FeatureFlags>(defaultFlags);

export const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>(defaultFlags);

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    const url = import.meta.env.VITE_SUPABASE_URL
    if (!url || url.includes('your-project.supabase.co')) return

    supabase
      .from('feature_flags')
      .select('*')
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setFlags(prev => ({ ...prev, ...data }))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  );
};

export const useFeatureFlags = () => {
  return useContext(FeatureFlagsContext);
};
