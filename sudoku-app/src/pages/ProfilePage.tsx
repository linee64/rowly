import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStatsStore } from '../store/statsStore';
import { User, Camera, Award, Check, AlertCircle, Save, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Aneka&backgroundColor=b6e3f4,c0aede,d1d4f9',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Buddy&backgroundColor=b6e3f4,c0aede,d1d4f9',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Willow&backgroundColor=b6e3f4,c0aede,d1d4f9',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Jasper&backgroundColor=b6e3f4,c0aede,d1d4f9',
  'https://api.dicebear.com/7.x/big-smile/svg?seed=Caspian&backgroundColor=b6e3f4,c0aede,d1d4f9',
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    playerName, 
    avatarUrl, 
    nameChangeCount, 
    ownedTitles, 
    activeTitle, 
    updateProfile,
    selectTitle 
  } = useStatsStore();

  const [newName, setNewName] = useState(playerName);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarUrl || AVATAR_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = () => {
    setError(null);
    setSuccessMsg(null);
    const success = updateProfile({
      playerName: newName,
      avatarUrl: selectedAvatar,
    });

    if (!success) {
      setError('You have reached the maximum number of name changes (3)!');
    } else {
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)} 
        className="mb-4 -ml-2 text-tx-secondary hover:text-tx-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <header className="mb-10">
        <h1 className="text-4xl font-black mb-2">Your Profile</h1>
        <p className="text-tx-secondary text-lg">Manage your identity and prestige in the Rowly world.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar and Identity */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-elevated border-4 border-gold overflow-hidden flex items-center justify-center shadow-2xl shadow-gold/20">
                {selectedAvatar ? (
                  <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-tx-secondary" />
                )}
              </div>
              <div className="absolute bottom-1 right-1 bg-gold text-primary p-2 rounded-full shadow-lg border-2 border-surface">
                <Camera className="w-5 h-5" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-1">{playerName}</h2>
            {activeTitle && (
              <span className="text-xs text-gold font-bold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
                {activeTitle}
              </span>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-tx-muted mb-4">Select Avatar</h3>
            <div className="grid grid-cols-3 gap-3">
              {AVATAR_OPTIONS.map((url) => (
                <button
                  key={url}
                  onClick={() => setSelectedAvatar(url)}
                  className={`aspect-square rounded-xl border-2 transition-all overflow-hidden ${
                    selectedAvatar === url ? 'border-gold scale-105 shadow-lg' : 'border-transparent hover:border-border'
                  }`}
                >
                  <img src={url} alt="Option" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-gold" />
              Account Settings
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-tx-muted mb-2 block">Player Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    disabled={nameChangeCount >= 3 && newName === playerName}
                    className={`w-full bg-surface border rounded-xl px-4 py-3 text-tx-primary focus:outline-none transition-all ${
                      nameChangeCount >= 3 ? 'border-border opacity-60' : 'border-border focus:border-gold'
                    }`}
                    placeholder="Enter your name..."
                  />
                  <div className="mt-2 flex items-center text-[10px] text-tx-muted font-medium">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Name changes used: {nameChangeCount}/3
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-tx-muted mb-3 block">Prestige Title</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => selectTitle(null)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                      activeTitle === null ? 'border-gold bg-gold/5' : 'border-border hover:bg-elevated'
                    }`}
                  >
                    <span className="text-sm font-medium">No Title</span>
                    {activeTitle === null && <Check className="w-4 h-4 text-gold" />}
                  </button>
                  {ownedTitles.map((title) => (
                    <button
                      key={title}
                      onClick={() => selectTitle(title)}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                        activeTitle === title ? 'border-gold bg-gold/5' : 'border-border hover:bg-elevated'
                      }`}
                    >
                      <div className="flex items-center text-gold">
                        <Award className="w-4 h-4 mr-2" />
                        <span className="text-sm font-bold uppercase tracking-wider">{title}</span>
                      </div>
                      {activeTitle === title && <Check className="w-4 h-4 text-gold" />}
                    </button>
                  ))}
                </div>
                {ownedTitles.length === 0 && (
                  <p className="text-xs text-tx-muted mt-3 italic">
                    You haven't unlocked any titles yet. Visit the shop to get some!
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-8 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mt-8 p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center">
                <Check className="w-4 h-4 mr-2" />
                {successMsg}
              </div>
            )}

            <div className="mt-10">
              <Button variant="gold" className="w-full py-4 text-lg" onClick={handleSave}>
                <Save className="w-5 h-5 mr-2" />
                Save Profile
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
