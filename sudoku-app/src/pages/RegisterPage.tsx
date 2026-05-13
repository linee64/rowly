import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join the elite circle of Rowly masters today."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
