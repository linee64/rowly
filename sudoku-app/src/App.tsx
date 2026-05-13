import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { GamePage } from './pages/GamePage';
import { PuzzlesPage } from './pages/PuzzlesPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { StatsPage } from './pages/StatsPage';
import { SettingsPage } from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { PlayMenuPage } from './pages/PlayMenuPage';
import { ShopPage } from './pages/ShopPage';
import { ProfilePage } from './pages/ProfilePage';
import { PaymentPage } from './pages/PaymentPage';
import { LearnModePage } from './pages/LearnModePage';
import { AuthProfileProvider } from './components/AuthProfileProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProfileProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="play" element={<PlayMenuPage />} />
          <Route path="game" element={<GamePage />} />
          <Route path="learn" element={<LearnModePage />} />
          <Route path="puzzles" element={<PuzzlesPage />} />
          <Route path="shop" element={<ShopPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="stats" element={<StatsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="payment" element={<PaymentPage />} />
        </Route>

        {/* Redirects for old top-level routes to new nested dashboard routes */}
        <Route path="/play" element={<Navigate to="/dashboard/play" replace />} />
        <Route path="/puzzles" element={<Navigate to="/dashboard/puzzles" replace />} />
        <Route path="/leaderboard" element={<Navigate to="/dashboard/leaderboard" replace />} />
        <Route path="/stats" element={<Navigate to="/dashboard/stats" replace />} />
        <Route path="/settings" element={<Navigate to="/dashboard/settings" replace />} />
        <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/dashboard-home" element={<Navigate to="/dashboard" replace />} />
        <Route path="/game" element={<Navigate to="/dashboard/game" replace />} />
        <Route path="/learn" element={<Navigate to="/dashboard/learn" replace />} />

        {/* Catch-all redirect to home or landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </AuthProfileProvider>
    </BrowserRouter>
  );
}

export default App;
