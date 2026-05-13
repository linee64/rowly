import { Link } from 'react-router-dom';
import { X, Instagram, Linkedin, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-landing-obsidian-3 border-t border-landing-brown-dark/30 pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-display font-bold text-landing-gold mb-6 block">
              Rowly
            </Link>
            <p className="text-landing-cream/50 text-sm leading-relaxed mb-6">
              The world's most premium Sudoku experience. Designed for those who appreciate the art of logic.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-landing-cream/40 hover:text-landing-gold transition-colors"><X size={20} /></a>
              <a href="#" className="text-landing-cream/40 hover:text-landing-gold transition-colors"><Github size={20} /></a>
              <a href="#" className="text-landing-cream/40 hover:text-landing-gold transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-landing-cream/40 hover:text-landing-gold transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-landing-gold-light font-display font-semibold mb-6 uppercase text-xs tracking-widest">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Daily Puzzles</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Difficulty Levels</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Achievements</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-landing-gold-light font-display font-semibold mb-6 uppercase text-xs tracking-widest">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">About Us</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Contact</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-landing-cream/60 hover:text-landing-gold transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-landing-gold-light font-display font-semibold mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
            <p className="text-landing-cream/50 text-xs mb-4">Get the weekly puzzle challenge in your inbox.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-landing-obsidian border border-landing-brown-dark px-4 py-2 text-xs focus:outline-none focus:border-landing-gold w-full"
              />
              <button className="bg-landing-gold text-landing-obsidian px-4 py-2 text-xs font-bold uppercase hover:bg-landing-gold-light transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-landing-brown-dark/20 text-center">
          <p className="text-landing-cream/30 text-[10px] uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Rowly. Built with precision for the analytical mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
