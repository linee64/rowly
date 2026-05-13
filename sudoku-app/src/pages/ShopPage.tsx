import React from 'react';
import { Card, cn } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useStatsStore } from '../store/statsStore';
import { Coins, Palette, Award, CheckCircle2, ShoppingBag, Briefcase, Gem, Crown, Zap, Shield, Flame } from 'lucide-react';
import type { ShopItem } from '../types';
import { SkinPreview } from '../components/SkinPreview';
import { Link } from 'react-router-dom';

const SHOP_ITEMS: ShopItem[] = [
  // Board Skins
  { id: 'classic', name: 'Classic Slate', description: 'The original minimalist look', price: 0, type: 'skin' },
  { id: 'royal', name: 'Royal Gold', description: 'Elegant gold accents and dark obsidian', price: 500, type: 'skin' },
  { id: 'emerald', name: 'Emerald Forest', description: 'Calming green hues and deep forest tones', price: 750, type: 'skin' },
  { id: 'cyber', name: 'Cyber Neon', description: 'Vibrant purple and neon blue glow', price: 1000, type: 'skin' },
  
  // Titles
  { id: 't1', name: 'Grandmaster', description: 'Show everyone your true skill', price: 2000, type: 'title' },
  { id: 't2', name: 'Sudoku Ninja', description: 'Fast as light, sharp as a blade', price: 1500, type: 'title' },
  { id: 't3', name: 'Logic King', description: 'The absolute ruler of the board', price: 1200, type: 'title' },
  { id: 't4', name: 'Daily Hero', description: 'A title for the dedicated players', price: 500, type: 'title' },
];

const TITLE_ICONS: Record<string, any> = {
  'Grandmaster': Crown,
  'Sudoku Ninja': Zap,
  'Logic King': Shield,
  'Daily Hero': Flame,
};

export const ShopPage: React.FC = () => {
  const { coins, ownedSkins, activeSkin, ownedTitles, activeTitle, buyItem, selectSkin, selectTitle } = useStatsStore();

  const handlePurchase = (item: ShopItem) => {
    if (buyItem(item)) {
      // Success feedback could be added here
    } else {
      alert('Not enough coins!');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 pb-20">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black mb-2">Artisan Shop</h1>
          <p className="text-tx-secondary">Customize your experience with exclusive skins and titles.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-surface border border-gold/20 px-6 py-3 rounded-2xl flex items-center shadow-lg shadow-gold/5">
            <Coins className="w-6 h-6 text-gold mr-3 fill-current" />
            <span className="text-2xl font-mono font-bold text-gold">{coins}</span>
          </div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center px-2 md:px-0">
          <Palette className="w-6 h-6 mr-3 text-gold" />
          Board Skins
        </h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 pb-6 md:pb-0 px-2 md:px-0 no-scrollbar snap-x snap-mandatory">
          {SHOP_ITEMS.filter(i => i.type === 'skin').map(item => {
            const isOwned = ownedSkins.includes(item.id);
            const isActive = activeSkin === item.id;
            
            return (
              <Card key={item.id} className={`flex-shrink-0 w-[280px] md:w-full snap-center p-5 flex flex-col transition-all duration-300 ${isActive ? 'border-gold shadow-2xl shadow-gold/10 scale-[1.02]' : 'hover:border-gold/30'}`}>
                <div className={`aspect-square rounded-xl mb-4 bg-surface border border-border flex items-center justify-center overflow-hidden p-2`}>
                   <SkinPreview skinId={item.id} />
                </div>
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-xs text-tx-muted mb-6 flex-1">{item.description}</p>
                
                {isOwned ? (
                  <Button 
                    variant={isActive ? 'gold' : 'secondary'} 
                    className="w-full py-4 rounded-xl"
                    onClick={() => selectSkin(item.id)}
                  >
                    {isActive ? <CheckCircle2 className="w-5 h-5 mr-2" /> : null}
                    {isActive ? 'Active' : 'Equip Skin'}
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full border-gold/30 text-gold py-4 rounded-xl group" onClick={() => handlePurchase(item)}>
                    <Coins className="w-5 h-5 mr-2 fill-current group-hover:scale-110 transition-transform" />
                    {item.price}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mb-12 px-2 md:px-0">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Award className="w-6 h-6 mr-3 text-gold" />
          Prestige Titles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SHOP_ITEMS.filter(i => i.type === 'title').map(item => {
            const isOwned = ownedTitles.includes(item.name);
            const isActive = activeTitle === item.name;
            const TitleIcon = TITLE_ICONS[item.name] || Award;

            return (
              <Card key={item.id} className={`p-6 flex items-center justify-between ${isActive ? 'border-gold' : ''}`}>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mr-4 text-gold">
                    <TitleIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-tx-muted">{item.description}</p>
                  </div>
                </div>

                {isOwned ? (
                  <Button 
                    variant={isActive ? 'gold' : 'secondary'} 
                    size="sm"
                    onClick={() => selectTitle(isActive ? null : item.name)}
                  >
                    {isActive ? 'Active' : 'Equip'}
                  </Button>
                ) : (
                  <Button variant="secondary" size="sm" className="border-gold/30 text-gold" onClick={() => handlePurchase(item)}>
                    <Coins className="w-4 h-4 mr-2" />
                    {item.price}
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-16 mb-10 px-2 md:px-0">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Coins className="w-6 h-6 mr-3 text-gold fill-current" />
          Buy Coins
        </h2>
        <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-6 pb-6 md:pb-0 no-scrollbar snap-x snap-mandatory">
          {[
            { amount: 500, price: 500, label: 'Starter Pack', icon: ShoppingBag, color: 'text-info' },
            { amount: 2000, price: 1500, label: 'Value Pack', icon: Briefcase, color: 'text-gold', popular: true },
            { amount: 10000, price: 5000, label: 'Grand Pack', icon: Gem, color: 'text-purple-500' },
          ].map((pack) => (
            <Card key={pack.amount} className={`flex-shrink-0 w-[280px] md:w-full snap-center p-6 flex flex-col items-center relative overflow-hidden transition-all duration-300 ${pack.popular ? 'border-gold shadow-2xl shadow-gold/5 md:scale-105 z-10' : 'hover:border-gold/20'}`}>
              {pack.popular && (
                <div className="absolute top-0 right-0 bg-gold text-primary text-[10px] font-black px-4 py-1.5 uppercase tracking-tighter rounded-bl-xl shadow-lg">
                  Popular
                </div>
              )}
              <div className={cn("w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-4 shadow-inner", pack.color)}>
                <pack.icon className="w-8 h-8" />
              </div>
              <h3 className="text-tx-muted text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{pack.label}</h3>
              <div className="flex items-center text-gold mb-6">
                <Coins className="w-8 h-8 mr-2 fill-current" />
                <span className="text-4xl font-black">{pack.amount.toLocaleString()}</span>
              </div>
              <Link 
                to="/dashboard/payment" 
                state={{ pack: { amount: pack.amount, price: pack.price, label: pack.label } }}
                className="w-full"
              >
                <Button 
                  variant={pack.popular ? 'gold' : 'secondary'} 
                  className="w-full py-5 text-xl font-black rounded-2xl shadow-lg transition-transform active:scale-95"
                >
                  {pack.price} ₸
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
