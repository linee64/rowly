import { motion } from 'framer-motion';

const StatItem = ({ number, label }: { number: string, label: string }) => {
  return (
    <div className="text-center">
      <motion.h4 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-5xl md:text-6xl font-display font-bold text-landing-gold mb-2"
      >
        {number}
      </motion.h4>
      <p className="text-landing-cream/40 uppercase tracking-[0.2em] text-[10px] md:text-xs font-semibold">
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
    <section className="py-20 bg-landing-obsidian-3 border-y border-landing-brown-dark/20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
