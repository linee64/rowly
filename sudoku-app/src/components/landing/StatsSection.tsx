import { motion } from 'framer-motion';

const StatItem = ({ number, label }: { number: string, label: string }) => {
  return (
    <div className="text-center px-3 sm:px-4 py-2 min-w-0 flex flex-col items-center justify-center">
      <motion.h4
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[clamp(1.75rem,8vw,2.75rem)] sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-landing-gold mb-2 sm:mb-2.5 tracking-tight tabular-nums leading-none"
      >
        {number}
      </motion.h4>
      <p className="text-landing-cream/55 uppercase tracking-[0.14em] sm:tracking-[0.18em] text-[10px] sm:text-[11px] md:text-xs font-semibold leading-snug max-w-[11rem] mx-auto">
        {label}
      </p>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { number: "10,000+", label: "Active Players" },
    { number: "500,000+", label: "Puzzles Solved" },
    { number: "50+", label: "Countries" },
    { number: "4.9★", label: "Average Rating" }
  ];

  return (
    <section className="py-14 sm:py-16 md:py-20 bg-landing-obsidian-3 border-y border-landing-brown-dark/25">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-11 md:gap-x-10 md:gap-y-8 max-w-md sm:max-w-2xl md:max-w-none mx-auto items-start">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
