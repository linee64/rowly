import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Home', href: '/' },
    { name: 'How it Works', href: '#how-it-works' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 pt-[env(safe-area-inset-top,0px)] ${
        isScrolled 
          ? 'bg-landing-obsidian/80 backdrop-blur-md border-b border-landing-gold/20 py-3 sm:py-4' 
          : 'bg-transparent py-4 sm:py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="text-3xl font-display font-bold text-landing-gold tracking-tight">
          Rowly
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className="text-landing-cream/70 hover:text-landing-gold transition-colors text-sm font-medium uppercase letter-spaced"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login" className="text-landing-cream hover:text-landing-gold transition-colors font-medium text-sm">
            Sign In
          </Link>
          <Link to="/register" className="btn-primary py-2 px-6 text-sm">
            Play Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          type="button"
          className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-landing-gold rounded-lg active:scale-95 transition-transform"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-landing-obsidian-2 border-b border-landing-gold/20 animate-fade-in">
          <div className="flex flex-col p-6 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-landing-cream hover:text-landing-gold transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-landing-brown-dark flex flex-col space-y-4">
              <Link to="/login" className="text-landing-cream hover:text-landing-gold" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-center" onClick={() => setIsMobileMenuOpen(false)}>
                Play Free
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
