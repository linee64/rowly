import Navbar from '../components/layout/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import StatsSection from '../components/landing/StatsSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/layout/landing/Footer';

const LandingPage = () => {
  return (
    <div className="landing-body min-h-[100dvh] overflow-x-hidden">
      <Navbar />
      <main className="landing-h">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
