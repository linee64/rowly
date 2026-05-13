import React from 'react';
import { Flame } from 'lucide-react';
import { Card } from '../ui/Card';
import { useStatsStore } from '../../store/statsStore';

export const StatsBar: React.FC = () => {
  const { currentStreak } = useStatsStore();

  return (
    <div className="mb-6 sm:mb-8">
      <Card className="p-4 sm:p-5 flex items-center gap-4 bg-gradient-to-br from-surface to-gold/[0.04] border-gold/15 w-full sm:w-auto sm:min-w-[220px] shadow-sm">
        <div className="p-3 bg-error/10 text-error rounded-lg">
          <Flame className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-tx-secondary">Daily Streak</p>
          <p className="text-xl font-bold">{currentStreak} <span className="text-sm font-normal text-tx-muted">days</span></p>
        </div>
      </Card>
    </div>
  );
};
