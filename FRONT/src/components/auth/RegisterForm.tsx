import { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import FormInput from '../common/FormInput';
import Button from '../common/Button';
import { Link } from '../common/Link';
import { useNavigate } from 'react-router-dom';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    full_name:'',
    telephone:'',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    full_name:'',
    telephone:'',
    confirmPassword: '',
    agreeTerms: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!formData.name.trim()) {
      newErrors.name = 'Prénom requis';
      isValid = false;
    }
    if(!formData.full_name.trim()){
      newErrors.full_name = "Nom complet requis";
      isValid=false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email requis';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valide';
      isValid = false;
    }
    if(!formData.telephone){
      newErrors.telephone = "Numero téléphone recquis"
      isValid = false;
    }else if (formData.telephone.length < 10 && formData.telephone.length > 10){
      newErrors.telephone = "Numéro Invalide";
    }
    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit avoir au moins 8 caractères';
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vous devez accépter les Conditions d'utilisation et la Politique de confidentialité";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()){
      setIsLoading(true);

      try{
        const response = await fetch('http://localhost:8000/api/register/',{
          method: 'POST',
          headers: {
            'Content-type':'application/json',
          },
          body: JSON.stringify({
            lastname: formData.name,
            email: formData.email,
            full_name: formData.full_name,
            telephone: formData.telephone,
            password: formData.password,
          }),
        })
        if (response.ok){
          alert("Insertion reussie ! Verifiez dans le console");
          navigate("/login");
          setFormData({
            name: '',
            email: '',
            password: '',
            full_name:'',
            telephone:'',
            confirmPassword: '',
            agreeTerms: false
          });
        }
        else{
          const data = await response.json();
          setErrors(prev => ({
            ...prev,
            ...data
          }));
        }
      }
      catch (error){
        alert("Erreur lti aaaaaaa");
        console.error(error);
      }
      finally{setIsLoading(false);

      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <form onSubmit={handleSubmit}>
        <FormInput
          label="Prenom"
          type="text"
          name="name"
          placeholder="Antoine"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={<User size={18} />}
        />
        
        <FormInput
          label="Nom"
          type="text"
          name="full_name"
          placeholder="Emmanuel"
          value={formData.full_name}
          onChange={handleChange}
          error={errors.full_name}
          icon={<User size={18} />}
        />


        <FormInput
          label="Email"
          type="email"
          name="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={18} />}
        />
        
        <FormInput
          label="Votre numéro téléphone"
          type="tel"
          name="telephone"
          placeholder="0345929075"
          value={formData.telephone}
          onChange={handleChange}
          error={errors.telephone}
          icon={<Phone size={18} />}
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
        
        <FormInput
          label="Confirmez votre mot de passe"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={<Lock size={18} />}
        />
        
        <div className="mb-6">
          <label className="flex items-start">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="rounded text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
            />
            <span className="ml-2 text-sm text-gray-600">
              J'accepte les{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                Conditions d'utilisations
              </Link>
              {' '}et la {' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-800">
                Politique de confidentialité
              </Link>
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeTerms}</p>
          )}
        </div>
        
        <Button type="submit" isLoading={isLoading} fullWidth>
          S'inscrire
        </Button>
        
        <div className="relative flex items-center justify-center mt-2 mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
        </div>
        
        <p className="mt-2 text-center text-gray-600 text-sm">
          Vous avez déjà un compte ?{' '}
          <a onClick={()=> navigate("/login")} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;