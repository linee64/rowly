import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import GoogleAuthButton from './GoogleAuthButton';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordStrength = useMemo(() => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  }, [password]);

  const strengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const strengthLabel = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Medium';
    if (passwordStrength <= 75) return 'Strong';
    return 'Excellent';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            username: username,
            player_name: username, // Also set player_name for compatibility
          }
        }
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          throw new Error('Пользователь с такой почтой уже существует.');
        }
        throw signUpError;
      }
      
      setSuccess(true);
      console.log('Registration successful:', data);
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-2 rounded-sm text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] p-2 rounded-sm text-center">
          Регистрация успешна! Пожалуйста, проверьте почту для подтверждения.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="username">
            Username
          </label>
          <input 
            id="username"
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="logic_master"
            className="input-field py-2 text-sm"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="email">
            Email Address
          </label>
          <input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="input-field py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input 
            id="password"
            type={showPassword ? 'text' : 'password'} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field py-2 text-sm pr-12"
            required
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-landing-cream/30 hover:text-landing-gold transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        
        {/* Strength Indicator */}
        {password && (
          <div className="pt-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] uppercase tracking-wider text-landing-cream/40">Strength: {strengthLabel()}</span>
              <span className="text-[9px] text-landing-cream/40">{passwordStrength}%</span>
            </div>
            <div className="h-0.5 w-full bg-landing-obsidian-3 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${strengthColor()}`} 
                style={{ width: `${passwordStrength}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase tracking-widest font-semibold text-landing-gold-light" htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input 
          id="confirmPassword"
          type="password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          className={`input-field py-2 text-sm ${confirmPassword && confirmPassword !== password ? 'border-red-500/50' : ''}`}
          required
        />
      </div>

      <div className="flex items-start gap-2 py-1">
        <div className="relative flex items-center h-4">
          <input
            id="terms"
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-3.5 h-3.5 rounded-sm border-landing-brown-dark bg-landing-obsidian-3 text-landing-gold focus:ring-gold"
            required
          />
        </div>
        <label htmlFor="terms" className="text-[10px] text-landing-cream/50 leading-tight cursor-pointer">
          I agree to the <a href="#" className="text-landing-gold hover:underline">Terms</a> and <a href="#" className="text-landing-gold hover:underline">Privacy Policy</a>
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isLoading || !agreed}
        className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm"
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : 'Create Account'}
      </button>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-landing-brown-dark/30"></div>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
          <span className="bg-landing-obsidian px-3 text-landing-cream/30">or</span>
        </div>
      </div>

      <GoogleAuthButton label="Sign up with Google" />

      <p className="text-center text-landing-cream/50 text-xs pt-1">
        Already have an account?{' '}
        <Link to="/login" className="text-landing-gold hover:text-landing-gold-light font-medium transition-colors">
          Sign In
        </Link>
      </p>
    </form>
  );
};

export default RegisterForm;
