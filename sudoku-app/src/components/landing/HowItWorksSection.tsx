import { UserPlus, LayoutGrid, Zap } from 'lucide-react';

const Step = ({ number, icon: Icon, title, description, isLast }: { number: string, icon: any, title: string, description: string, isLast?: boolean }) => {
  return (
    <div className="flex-1 relative w-full max-w-sm mx-auto lg:max-w-none">
      <div className="flex flex-col items-center text-center">
        {/* Numbered circle — slightly smaller on phone for better balance with text */}
        <div className="relative z-10 w-[4.5rem] h-[4.5rem] sm:w-[5rem] sm:h-[5rem] md:w-20 md:h-20 bg-landing-obsidian-3 border-2 border-landing-gold/70 sm:border-landing-gold rounded-full flex items-center justify-center mb-5 sm:mb-6 shadow-[0_0_24px_rgba(207,164,48,0.12)]">
          <Icon className="text-landing-gold w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={1.35} />
          <div className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 min-w-[1.75rem] h-7 px-1 sm:w-8 sm:h-8 bg-landing-gold text-landing-obsidian text-[11px] sm:text-xs font-bold rounded-full flex items-center justify-center tabular-nums shadow-md">
            {number}
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl md:text-[1.65rem] font-display font-semibold text-landing-cream mb-2.5 sm:mb-3 tracking-tight">
          {title}
        </h3>
        <p className="text-landing-cream/65 text-[15px] sm:text-base leading-relaxed max-w-[19rem] sm:max-w-xs mx-auto font-medium">
          {description}
        </p>
      </div>

      {!isLast && (
        <div className="hidden lg:block absolute top-[2.25rem] md:top-10 left-[calc(50%+3.25rem)] w-[calc(100%-6.5rem)] h-px bg-gradient-to-r from-landing-gold/45 to-transparent" />
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
    <section id="how-it-works" className="py-16 sm:py-20 md:py-24 bg-landing-obsidian-2 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <div className="grid grid-cols-10 h-full w-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="border border-landing-gold aspect-square"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-3 sm:mb-5 text-landing-cream tracking-tight">
            Three Steps to Mastery
          </h2>
          <p className="text-landing-cream/60 text-base sm:text-lg leading-relaxed px-1">
            Your path from logic enthusiast to Rowly grandmaster starts here.
          </p>
        </div>

        <div className="flex flex-col gap-12 sm:gap-14 lg:flex-row lg:gap-6 xl:gap-10 items-start justify-between max-w-6xl mx-auto">
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
