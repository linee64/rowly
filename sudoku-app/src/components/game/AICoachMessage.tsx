import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GraduationCap, AlertCircle, Info } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export const AICoachMessage: React.FC = () => {
  const { coachMessage, clearCoachMessage } = useGameStore();

  if (!coachMessage) return null;

  const getIcon = () => {
    switch (coachMessage.type) {
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'strategy': return <GraduationCap className="w-5 h-5 text-gold" />;
      default: return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTitle = () => {
    switch (coachMessage.type) {
      case 'error': return 'Ошибка!';
      case 'strategy': return coachMessage.strategyName || 'Совет тренера';
      default: return 'Подсказка';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mt-6 p-4 rounded-2xl bg-elevated border border-border shadow-lg relative overflow-hidden group"
      >
        {/* Background Accent */}
        <div className={`absolute top-0 left-0 w-1 h-full ${
          coachMessage.type === 'error' ? 'bg-red-500' : 
          coachMessage.type === 'strategy' ? 'bg-gold' : 'bg-blue-500'
        }`} />

        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-1 ${
              coachMessage.type === 'error' ? 'text-red-400' : 
              coachMessage.type === 'strategy' ? 'text-gold' : 'text-blue-400'
            }`}>
              {getTitle()}
            </h4>
            <p className="text-sm text-tx-primary leading-relaxed">
              {coachMessage.text}
            </p>
          </div>

          <button 
            onClick={clearCoachMessage}
            className="p-1 hover:bg-surface rounded-lg transition-colors text-tx-secondary hover:text-tx-primary"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
