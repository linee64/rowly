import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

// Highlighted cells to show active state
const ACTIVE_IDX = 22;
const SAME_NUM_IDXS = [17, 43]; // cells with same number as active

const SudokuGrid = () => {
  const initialCells = [
    { val: 5, fixed: true }, { val: 3, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 7, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },

    { val: 6, fixed: true }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: 1, fixed: true }, { val: 9, fixed: true }, { val: 5, fixed: true },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },

    { val: null, fixed: false }, { val: 9, fixed: true }, { val: 8, fixed: true },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 6, fixed: true }, { val: null, fixed: false },

    { val: 8, fixed: true }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 6, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: 3, fixed: true },

    { val: 4, fixed: true }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: 8, fixed: true }, { val: null, fixed: false }, { val: 3, fixed: true },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: 1, fixed: true },

    { val: 7, fixed: true }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 2, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: 6, fixed: true },

    { val: null, fixed: false }, { val: 6, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: 2, fixed: true }, { val: 8, fixed: true }, { val: null, fixed: false },

    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: 4, fixed: true }, { val: 1, fixed: true }, { val: 9, fixed: true },
    { val: null, fixed: false }, { val: null, fixed: false }, { val: 5, fixed: true },

    { val: null, fixed: false }, { val: null, fixed: false }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 8, fixed: true }, { val: null, fixed: false },
    { val: null, fixed: false }, { val: 7, fixed: true }, { val: 9, fixed: true }
  ];

  return (
    <div className="relative">
      {/* Outer glow frame */}
      <div className="absolute -inset-3 rounded-sm bg-gradient-to-br from-landing-gold/20 via-transparent to-landing-gold/10 blur-xl pointer-events-none" />
      <div className="absolute -inset-[1px] rounded-sm bg-gradient-to-br from-landing-gold/40 via-landing-gold/10 to-landing-gold/20 pointer-events-none" />

      {/* Grid container */}
      <div
        style={{ width: 'min(360px, calc(100vw - 2.5rem))', height: 'min(360px, calc(100vw - 2.5rem))' }}
        className="relative bg-[#16120a] border-2 border-landing-gold/40 shadow-[0_0_40px_rgba(207,164,48,0.15),inset_0_0_30px_rgba(0,0,0,0.5)] overflow-hidden mx-auto"
      >
        <div className="grid grid-cols-9 w-full h-full">
          {initialCells.map((cell, idx) => {
            const col = idx % 9;
            const row = Math.floor(idx / 9);
            const activeRow = Math.floor(ACTIVE_IDX / 9);
            const activeCol = ACTIVE_IDX % 9;

            const isActive = idx === ACTIVE_IDX;
            const isSameGroup =
              row === activeRow ||
              col === activeCol ||
              (Math.floor(row / 3) === Math.floor(activeRow / 3) &&
                Math.floor(col / 3) === Math.floor(activeCol / 3));
            const isSameNum = SAME_NUM_IDXS.includes(idx);

            // Box border separators
            const borderRight =
              col === 2 || col === 5
                ? 'border-r-[2px] border-r-gold/50'
                : col !== 8
                ? 'border-r border-r-gold/10'
                : '';
            const borderBottom =
              row === 2 || row === 5
                ? 'border-b-[2px] border-b-gold/50'
                : row !== 8
                ? 'border-b border-b-gold/10'
                : '';

            let bgClass = '';
            if (isActive) bgClass = 'bg-landing-gold/20';
            else if (isSameNum) bgClass = 'bg-landing-gold/10';
            else if (isSameGroup) bgClass = 'bg-white/[0.025]';

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.008, duration: 0.25 }}
                className={`flex items-center justify-center ${borderRight} ${borderBottom} ${bgClass} transition-colors duration-200`}
              >
                <span
                  className={`text-sm font-semibold leading-none select-none ${
                    isActive
                      ? 'text-landing-gold drop-shadow-[0_0_6px_rgba(207,164,48,0.8)]'
                      : isSameNum
                      ? 'text-landing-gold/90'
                      : cell.fixed
                      ? 'text-[#e8d5a0]'
                      : 'text-landing-gold/40'
                  }`}
                >
                  {cell.val ?? ''}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Overlay scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(207,164,48,0.04) 40px)',
          }}
        />
      </div>

      {/* Floating label */}
      <div className="flex items-center justify-between mt-3 px-1">
        <span className="text-landing-gold/40 text-[10px] uppercase tracking-[0.2em] font-semibold">Expert · Puzzle #1</span>
        <span className="text-landing-gold/40 text-[10px] font-mono">04:27</span>
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[100dvh] flex items-center pt-[max(5.5rem,env(safe-area-inset-top)+4rem)] pb-16 sm:pb-20 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-landing-gold/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-landing-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-landing-gold uppercase tracking-[0.3em] text-[11px] sm:text-xs font-semibold block mb-3 sm:mb-4">
              The Art of Logic
            </span>
            <h1 className="text-[clamp(2.25rem,9vw,4.5rem)] sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold leading-[1.05] mb-4 sm:mb-6">
              Rowly, <br />
              <span className="text-landing-gold italic">Elevated.</span>
            </h1>
            <p className="text-landing-cream/70 text-base sm:text-lg md:text-xl max-w-xl font-light leading-relaxed">
              Experience the timeless puzzle refined for the modern age. 
              Master the grid with high-fidelity design and precision-crafted challenges.
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link to="/register" className="btn-primary flex items-center gap-2">
              Start Playing Free
            </Link>
          </motion.div>

          <motion.div 
            className="flex items-center gap-6 pt-4 border-t border-landing-brown-dark/20 max-w-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-obsidian bg-landing-obsidian-3 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                </div>
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1 text-landing-gold">
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <Star size={12} fill="currentColor" />
                <span className="text-landing-cream text-xs ml-2 font-semibold">4.9★</span>
              </div>
              <p className="text-landing-cream/40 text-[10px] uppercase tracking-wider">10,000+ Solvers worldwide</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <SudokuGrid />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
