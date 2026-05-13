import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';
import { supabase } from '../../lib/supabase';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Clear error when typing
  useEffect(() => {
    if (error) setError('');
  }, [email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Email not confirmed') {
          throw new Error('Пожалуйста, подтвердите вашу почту перед входом.');
        }
        if (signInError.message === 'Invalid login credentials') {
          throw new Error('Неверная почта или пароль.');
        }
        throw signInError;
      }
      
      console.log('Login successful:', data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при входе.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="email">
          Email Address
        </label>
        <input 
          id="email"
          type="email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          className={`input-field ${error ? 'border-red-500/50 focus:border-red-500' : ''}`}
          required
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="password">
            Password
          </label>
          <a href="#" className="text-xs text-landing-gold/60 hover:text-landing-gold transition-colors underline-offset-4 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field pr-12"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-cream/30 hover:text-landing-gold transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="btn-primary w-full py-4 flex items-center justify-center gap-2"
      >
        {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Sign In'}
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-landing-brown-dark/30"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-widest">
          <span className="bg-landing-obsidian px-4 text-landing-cream/30">or</span>
        </div>
      </div>

      <GoogleAuthButton label="Sign in with Google" />

      <p className="text-center text-landing-cream/50 text-sm pt-4">
        Don't have an account?{' '}
        <Link to="/register" className="text-landing-gold hover:text-landing-gold-light font-medium transition-colors">
          Register now
        </Link>
      </p>
    </form>
  );
};

export default LoginForm;
