import React from 'react';
import AuthLayout from '../auth/AuthLayout';
import LoginForm from '../auth/LoginForm';

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