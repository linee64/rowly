import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/themes.css'
import './styles/landing.css'
import App from './App.tsx'
import { supabase } from './lib/supabase'
import { setProfileSyncUserId } from './lib/profileSync'
import { setStatsPersistUserScope } from './lib/statsPersistScope'
import {
  rehydrateStatsStore,
  pullRemoteProfileIntoStore,
} from './store/statsStore'

async function bootstrap() {
  let uid: string | null = null
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    uid = session?.user?.id ?? null
  } catch (e) {
    console.warn('bootstrap getSession:', e)
  }
  setStatsPersistUserScope(uid)
  setProfileSyncUserId(uid)
  await rehydrateStatsStore()
  if (uid) {
    try {
      await pullRemoteProfileIntoStore(uid)
    } catch (e) {
      console.warn('bootstrap pullRemoteProfileIntoStore:', e)
    }
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()