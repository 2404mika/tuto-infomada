import React from 'react';
import AuthLayout from '../components/auth/AuthLayout';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Rejoingnez notre communauté d'apprenants"
      subtitle="Créer votre compte pour créer nos cours"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;