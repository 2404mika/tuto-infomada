import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Bon retour parmis nous"
      subtitle="Connectez-vous pour accéder à vos cours."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;