// src/pages/LoginPage.tsx (ou LoginForm.tsx)
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { Link } from '../common/Link';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import fetchWithAuth from '../utils/fetchWithAuth';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState({
    emailOrPhone: '',
    password: '',
    general: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: '',
        general: '',
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = 'Champ requis';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        console.log('Nettoyage de localStorage avant connexion');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        console.log('Envoi de la requête:', {
          identifiant: formData.emailOrPhone,
          password: formData.password,
        });
        const response = await fetchWithAuth('login/', {
          method: 'POST',
          body: JSON.stringify({
            identifiant: formData.emailOrPhone,
            password: formData.password,
          }),
        });
        const data = await response.json();
        console.log("Réponse de l'API:", data);
        if (response.ok) {
          const userData = {
            id: data.id,
            email: data.email,
            username: data.username,
            lastname: data.lastname || data.username,
          };
          login(userData, data.access_token, data.refresh_token);
          navigate('/user/Myformation');
        } else {
          setErrors({
            ...errors,
            general: data.erreur || data.error || data.detail || 'Erreur de connexion',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la requête:', error);
        setErrors({
          ...errors,
          general: 'Erreur de connexion au serveur',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Email"
          type="text"
          name="emailOrPhone"
          placeholder="votre@gmail.com"
          value={formData.emailOrPhone}
          onChange={handleChange}
          error={errors.emailOrPhone}
          icon={<Mail size={18} />}
        />
        <FormInput
          label="Mot de passe"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock size={18} />}
        />
        {errors.general && (
          <p className="text-red-500 text-sm mb-4">{errors.general}</p>
        )}
        {/* <div className="flex items-center justify-between mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
          </label>
        </div> */}
        <Button type="submit" isLoading={isLoading} fullWidth>
          Se connecter
        </Button>
        <div className="relative flex items-center justify-center mt-6 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>
        <p className="mt-6 text-center text-gray-600 text-sm">
          Pas de compte ?{' '}
          <a onClick={()=> navigate("/register")} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            S'inscrire
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;





// import { useState } from 'react';
// import { Mail, Lock } from 'lucide-react';
// import FormInput from '../common/FormInput';
// import Button from '../common/Button';
// import { Link } from '../common/Link';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import fetchWithAuth from '../utils/fetchWithAuth';

// const LoginForm: React.FC = () => {
//   const navigate = useNavigate();
//   const { login } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     emailOrPhone: '',
//     password: '',
//     rememberMe: false,
//   });
//   const [errors, setErrors] = useState({
//     emailOrPhone: '',
//     password: '',
//     general: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });

//     if (errors[name as keyof typeof errors]) {
//       setErrors({
//         ...errors,
//         [name]: '',
//         general: '',
//       });
//     }
//   };

//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { ...errors };

//     if (!formData.emailOrPhone) {
//       newErrors.emailOrPhone = 'Champ requis';
//       isValid = false;
//     }

//     if (!formData.password) {
//       newErrors.password = 'Mot de passe requis';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setIsLoading(true);
//       try {
//         // Nettoyer localStorage avant la connexion pour éviter les tokens invalides
//         console.log('Nettoyage de localStorage avant connexion');
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('user');

//         console.log('Envoi de la requête:', {
//           identifiant: formData.emailOrPhone,
//           password: formData.password,
//         });
//         const response = await fetchWithAuth('login/', {
//           method: 'POST',
//           body: JSON.stringify({
//             identifiant: formData.emailOrPhone,
//             password: formData.password,
//           }),
//         });
//         const data = await response.json();
//         console.log('Réponse de l\'API:', data);
//         if (response.ok) {
//           login(
//             {
//               email: data.email,
//               username: data.username,
//               lastname: data.lastname || data.username,
//             },
//             data.access_token,
//             data.refresh_token
//           );
//           navigate('/user/Myformation');
//         } else {
//           setErrors({
//             ...errors,
//             general: data.erreur || data.error || data.detail || 'Erreur de connexion',
//           });
//         }
//       } catch (error) {
//         console.error('Erreur lors de la requête:', error);
//         setErrors({
//           ...errors,
//           general: 'Erreur de connexion au serveur',
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-8">
//       <form onSubmit={handleSubmit}>
//         <FormInput
//           label="Email / Téléphone"
//           type="text"
//           name="emailOrPhone"
//           placeholder="votre@gmail.com ou 0345929075"
//           value={formData.emailOrPhone}
//           onChange={handleChange}
//           error={errors.emailOrPhone}
//           icon={<Mail size={18} />}
//         />
//         <FormInput
//           label="Mot de passe"
//           type="password"
//           name="password"
//           placeholder="••••••••"
//           value={formData.password}
//           onChange={handleChange}
//           error={errors.password}
//           icon={<Lock size={18} />}
//         />
//         {errors.general && (
//           <p className="text-red-500 text-sm mb-4">{errors.general}</p>
//         )}
//         <div className="flex items-center justify-between mb-6">
//           <label className="flex items-center">
//             <input
//               type="checkbox"
//               name="rememberMe"
//               checked={formData.rememberMe}
//               onChange={handleChange}
//               className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
//             />
//             <span className="ml-2 text-sm text-gray-600">Se souvenir de moi</span>
//           </label>
//         </div>
//         <Button type="submit" isLoading={isLoading} fullWidth>
//           Se connecter
//         </Button>
//         <div className="relative flex items-center justify-center mt-6 mb-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-gray-300"></div>
//           </div>
//         </div>
//         <p className="mt-6 text-center text-gray-600 text-sm">
//           Pas de compte ?{' '}
//           <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
//             S'inscrire
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;