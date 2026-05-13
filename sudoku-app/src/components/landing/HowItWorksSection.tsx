import { UserPlus, LayoutGrid, Zap } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description, isLast }: { number: string, icon: any, title: string, description: string, isLast?: boolean }) => {
  return (
    <div className="flex-1 relative">
      <div className="flex flex-col items-center text-center">
        {/* Numbered Circle */}
        <div className="relative z-10 w-20 h-20 bg-landing-obsidian-3 border-2 border-landing-gold rounded-full flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(207,164,48,0.1)]">
          <Icon className="text-landing-gold" size={32} />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-landing-gold text-landing-obsidian text-sm font-bold rounded-full flex items-center justify-center">
            {number}
          </div>
        </div>
        
        <h3 className="text-2xl font-display font-semibold mb-4">{title}</h3>
        <p className="text-landing-cream/50 text-sm max-w-[250px]">{description}</p>
      </div>
      
      {!isLast && (
        <div className="hidden lg:block absolute top-10 left-[calc(50%+60px)] w-[calc(100%-120px)] h-[1px] bg-gradient-to-r from-landing-gold/50 to-transparent"></div>
      )}
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create Account",
      description: "Join our global community and start tracking your journey to Rowly mastery."
    },
    {
      number: "02",
      icon: LayoutGrid,
      title: "Choose Your Level",
      description: "Select from five difficulty settings, from gentle warm-ups to world-class challenges."
    },
    {
      number: "03",
      icon: Zap,
      title: "Solve & Compete",
      description: "Hone your logic, beat the clock, and rise through the ranks of our global leaderboard."
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-landing-obsidian-2 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="grid grid-cols-10 h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-landing-gold aspect-square"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Three Steps to Mastery</h2>
          <p className="text-landing-cream/50 text-lg">Your path from logic enthusiast to Rowly grandmaster starts here.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-start justify-between">
          {steps.map((step, index) => (
            <Step 
              key={index} 
              {...step} 
              isLast={index === steps.length - 1} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
