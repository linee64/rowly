import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';
import { supabase } from '../lib/supabase';

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard');
    });
  }, [navigate]);

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to continue your path to mastery."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
