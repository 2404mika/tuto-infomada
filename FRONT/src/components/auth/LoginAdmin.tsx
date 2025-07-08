import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const LoginAdmin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/admin-login/', {
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

      navigate('/admin/Dashboard/');
      const data = await response.json();
      console.log("data admin diaaaaaaaaa", data)
      localStorage.setItem('adminEmail', data.email);
      // alert("Metyiiiii")
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-mono text-gray-800 mb-6 text-center">Administrateur</h2>
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

export default LoginAdmin;



//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------



// // src/components/LoginAdmin.tsx
// import React, { useState } from 'react';
// import { Mail, Lock } from 'lucide-react';
// import FormInput from '../common/FormInput';
// import Button from '../common/Button';
// // import { Link } from '../common/Link';
// import { useNavigate } from 'react-router-dom';

// const LoginAdmin: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Logique statique pour l'instant (à remplacer par une API plus tard)
//     if (email === 'admin@example.com' && password === 'Admin123!') {
//       setError(null);
//       navigate('/admin/'); // Redirige vers le tableau de bord admin après connexion
//     } else {
//       setError('Email ou mot de passe incorrect');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
//         <h2 className="text-2xl font-mono text-gray-800 mb-6 text-center">Administrateur</h2>
//         <form onSubmit={handleSubmit}>
//           <FormInput
//             label="Email"
//             type="email"
//             name="email"
//             placeholder="admin@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             error={error}
//             icon={<Mail size={18} />}
//           />
//           <FormInput
//             label="Mot de passe"
//             type="password"
//             name="password"
//             placeholder="••••••••"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             error={error}
//             icon={<Lock size={18} />}
//           />
//           {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
//           <Button type="submit" fullWidth>
//             Se connecter
//           </Button>
//           <div className="relative flex items-center justify-center mt-6 mb-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//           </div>
//           {/* <p className="mt-6 text-center text-gray-600 text-sm">
//             Mot de passe oublié ?{' '}
//             <Link href="/admin/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
//               Réinitialiser
//             </Link>
//           </p> */}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginAdmin;