import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../store/uiStore';
import { useStatsStore } from '../store/statsStore';
import { useGameStore } from '../store/gameStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Moon, Sun, Trash2, ArrowLeft } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useUiStore();
  const { resetStats } = useStatsStore();
  const { clearGame } = useGameStore();
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleResetData = () => {
    resetStats();
    clearGame();
    setIsConfirmOpen(false);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-2 -ml-2 text-tx-secondary hover:text-tx-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <header>
        <h1 className="text-3xl font-bold text-tx-primary">Settings</h1>
        <p className="text-tx-secondary mt-1">Manage your app preferences and data.</p>
      </header>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          {theme === 'dark' ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
          Appearance
        </h3>
        
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div>
            <p className="font-medium text-tx-primary">Theme</p>
            <p className="text-sm text-tx-secondary">Switch between dark and light mode</p>
          </div>
          <Button variant="outline" onClick={toggleTheme}>
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center text-error">
          <Trash2 className="w-5 h-5 mr-2" />
          Danger Zone
        </h3>
        
        <div className="flex items-center justify-between py-4 border-b border-border/50">
          <div>
            <p className="font-medium text-tx-primary">Reset All Data</p>
            <p className="text-sm text-tx-secondary">This will permanently delete your stats, history, and active games.</p>
          </div>
          <Button variant="outline" className="border-error text-error hover:bg-error/10" onClick={() => setIsConfirmOpen(true)}>
            Reset Data
          </Button>
        </div>
      </Card>

      <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="Reset All Data?">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-error/10 text-error flex items-center justify-center rounded-full mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Are you absolutely sure?</h3>
          <p className="text-tx-secondary mb-6">
            This action cannot be undone. All your game history, achievements, best times, and current games will be permanently deleted from your browser.
          </p>
          <div className="flex space-x-3">
            <Button variant="secondary" className="flex-1" onClick={() => setIsConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="flex-1 bg-error border-error text-white hover:bg-error/90" onClick={handleResetData}>
              Yes, Reset Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const AlertTriangle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);
