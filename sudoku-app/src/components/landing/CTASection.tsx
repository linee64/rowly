import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="py-20 sm:py-24 md:py-32 relative overflow-hidden">
      {/* Decorative background Sudoku pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <div className="grid grid-cols-9 gap-4 transform rotate-12 scale-150">
          {Array.from({ length: 81 }).map((_, i) => (
            <div key={i} className="w-20 h-20 border-2 border-landing-gold flex items-center justify-center text-4xl font-display font-bold text-landing-gold">
              {i % 9 + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-[clamp(1.875rem,7vw,3.5rem)] sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 sm:mb-8 md:mb-10 leading-[1.08] text-landing-cream px-1">
            Ready to Master <span className="text-landing-gold italic">Rowly?</span>
          </h2>
          <p className="text-landing-cream/65 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            Join thousands of players and elevate your analytical skills today.
            The grid is waiting for your first move.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link to="/register" className="btn-primary px-12 py-4 text-lg w-full sm:w-auto">
              Start Free Today
            </Link>
            <p className="text-landing-cream/40 text-sm italic">No credit card required. Pure logic only.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
