import { motion } from 'framer-motion';
import { Calendar, Brain, BarChart3, Trophy } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group bg-landing-obsidian-2 border border-landing-brown-dark/25 rounded-xl sm:rounded-none p-6 sm:p-8 hover:border-landing-gold/45 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(207,164,48,0.06)]"
    >
      <div className="w-12 h-12 bg-brown-dark/20 flex items-center justify-center text-landing-gold mb-6 group-hover:scale-110 group-hover:bg-landing-gold/10 transition-all duration-500">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-display font-semibold mb-4 group-hover:text-landing-gold transition-colors">{title}</h3>
      <p className="text-landing-cream/60 text-sm sm:text-[15px] leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: Calendar,
      title: "Daily Challenges",
      description: "A hand-crafted masterpiece delivered to your grid every single day. Keep your mind sharp and your streak alive.",
      delay: 0.1
    },
    {
      icon: Brain,
      title: "5 Difficulty Levels",
      description: "From 'Gentle' to 'Impossible'. Whether you're a novice or a grandmaster, we have the perfect mental workout.",
      delay: 0.2
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Deep analytics on your solving speed, accuracy, and logic patterns. Visualize your growth with beautiful heatmaps.",
      delay: 0.3
    },
    {
      icon: Trophy,
      title: "Global Leaderboard",
      description: "Compete with the world's finest analytical minds. Rise through the ranks and claim your place among the elite.",
      delay: 0.4
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-landing-obsidian">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4 sm:mb-6 text-landing-cream tracking-tight">
            Built for Serious Players
          </h2>
          <p className="text-landing-cream/60 text-base sm:text-lg leading-relaxed px-2">
            Every feature is meticulously designed to provide the ultimate solving experience.
          </p>
          <div className="w-16 sm:w-20 h-1 bg-landing-gold mx-auto mt-6 sm:mt-8 opacity-50 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
