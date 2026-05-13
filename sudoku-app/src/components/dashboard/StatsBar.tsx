import React from 'react';
import { Flame } from 'lucide-react';
import { Card } from '../ui/Card';
import { useStatsStore } from '../../store/statsStore';

export const StatsBar: React.FC = () => {
  const { currentStreak } = useStatsStore();

  return (
    <div className="mb-8">
      <Card className="p-4 flex items-center space-x-4 bg-surface/50 w-full md:w-1/4">
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
