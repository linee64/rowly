import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode, title: string, subtitle: string }) => {
  return (
    <div className="landing-body min-h-[100dvh] flex bg-landing-obsidian overflow-y-auto overflow-x-hidden">
      {/* LEFT PANEL - Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[40%] bg-landing-obsidian-2 relative flex-col justify-center items-center p-12 overflow-hidden border-r border-landing-brown-dark/30">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <div className="grid grid-cols-9 h-full w-full">
            {Array.from({ length: 81 }).map((_, i) => (
              <div key={i} className="border border-landing-gold"></div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-center">
          <Link to="/" className="text-4xl font-display font-bold text-landing-gold mb-8 block">
            Rowly
          </Link>
          
          <div className="max-w-[250px] mx-auto mb-8">
            <div className="grid grid-cols-3 gap-2 opacity-40">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ 
                    opacity: [0.2, 0.6, 0.2],
                    borderColor: ['rgba(207,164,48,0.2)', 'rgba(207,164,48,0.8)', 'rgba(207,164,48,0.2)']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: i * 0.2 
                  }}
                  className="aspect-square border border-landing-gold flex items-center justify-center text-landing-gold text-xl"
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>
          </div>

          <blockquote className="text-xl font-display italic text-landing-cream/70 leading-relaxed">
            "Logic is the beginning of wisdom, not the end."
          </blockquote>
          <p className="mt-4 text-landing-gold uppercase tracking-[0.2em] text-[10px] font-semibold">Master the grid</p>
        </div>

        {/* Floating golden orb decoration */}
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-landing-gold/10 blur-[100px] rounded-full"></div>
      </div>

      {/* RIGHT PANEL - Form Area */}
      <div className="w-full lg:w-[60%] flex flex-col justify-center items-center px-4 pt-[max(5rem,env(safe-area-inset-top)+3rem)] pb-10 sm:py-8 md:p-8 relative min-h-0">
        <div className="absolute top-[max(1rem,env(safe-area-inset-top))] left-4 lg:hidden">
          <Link to="/" className="text-2xl font-display font-bold text-landing-gold">
            Rowly
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">{title}</h2>
            <p className="text-landing-cream/50 text-sm">{subtitle}</p>
          </div>

          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
