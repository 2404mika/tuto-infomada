import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Envoi de la requête:', { email, password });
      const response = await fetch('http://localhost:8000/api/prof-login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Email ou mot de passe incorrect');
      }

      const data = await response.json();
      console.log('Réponse API:', data);

      // Créer l'objet user compatible avec AuthContext
      const userData = {
        id: data.id, // ID de ProfRegister
        email: data.email,
        username: data.email.split('@')[0], // Fallback pour username
        lastname: data.last_name || data.email.split('@')[0], // Utilise last_name
      };

      // Stocker dans AuthContext
      login(userData, data.access_token, data.refresh_token);

      // Stocker l'ID de ProfRegister et le rôle du professeur
      localStorage.setItem('profId', data.id.toString());
      localStorage.setItem('isProf', 'true');

      navigate('/prof/');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
      console.error('Erreur:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-mono text-gray-800 mb-6 text-center">Connexion Professeur</h2>
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder="votre@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            icon={<Mail size={18} />}
          />
          <FormInput
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            icon={<Lock size={18} />}
          />
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <Button type="submit" fullWidth>
            Se connecter
          </Button>
          <div className="relative flex items-center justify-center mt-6 mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfLogin;