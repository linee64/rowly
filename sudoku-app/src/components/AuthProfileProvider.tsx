import { type ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { flushProfileStatsNow, extractUserStats, setProfileSyncUserId } from '../lib/profileSync';
import { setStatsPersistUserScope } from '../lib/statsPersistScope';
import {
  rehydrateStatsStore,
  pullRemoteProfileIntoStore,
  useStatsStore,
} from '../store/statsStore';

export function AuthProfileProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const flush = () => {
      void flushProfileStatsNow(() => extractUserStats(useStatsStore.getState()));
    };
    window.addEventListener('pagehide', flush);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session?.user) {
        await flushProfileStatsNow(() => extractUserStats(useStatsStore.getState()));
        setStatsPersistUserScope(null);
        setProfileSyncUserId(null);
        await rehydrateStatsStore();
        return;
      }
      if (event === 'SIGNED_IN') {
        const uid = session.user.id;
        setStatsPersistUserScope(uid);
        setProfileSyncUserId(uid);
        await rehydrateStatsStore();
        await pullRemoteProfileIntoStore(uid, { mergeGuestLocal: true });
      }
    });

    return () => {
      window.removeEventListener('pagehide', flush);
      subscription.unsubscribe();
    };
  }, []);

  return children;
}
