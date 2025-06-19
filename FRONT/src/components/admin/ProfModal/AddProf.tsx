import React, { useState } from "react";
import FormInput from "../../common/FormInput";
import { Mail, User, Phone, Lock } from 'lucide-react';
import Button from "../../common/Button";
import { Prof } from "../../types";

interface AddProfProps {
  onProfAdded: (newProf: Prof) => void;
  fetchProfs?: () => Promise<void>;
}

const AddProf: React.FC<AddProfProps> = ({ onProfAdded, fetchProfs }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    fonction: '',
    email: '',
    password: '',
    telephone: '',
  });
  const [errors, setErrors] = useState({
    name: '',
    lastname: '',
    fonction: '',
    email: '',
    password: '',
    telephone: '',
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
      });
    }
  };

  const ValidateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    if (!formData.name.trim()) {
      newErrors.name = "Nom requis";
      isValid = false;
    }
    if (!formData.name.trim()) {
      newErrors.name = "Prénom requis";
      isValid = false;
    }
    if (!formData.fonction.trim()) {
      newErrors.fonction = "Fonction requise";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
      isValid = false;
    }
    if (!formData.telephone) {
      newErrors.telephone = "Numéro de téléphone requis";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ValidateForm()) {
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:8000/api/prof/', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            first_name: formData.name,
            last_name: formData.name,
            fonction: formData.fonction,
            email: formData.email,
            password: formData.password,
            telephone: formData.telephone,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Insertion réussie !");
          console.log('Nouveau professeur:', data);
          onProfAdded(data as Prof);
          if (fetchProfs) {
            await fetchProfs();
          }
          setFormData({
            name: '',
            lastname: '',
            fonction: '',
            email: '',
            password: '',
            telephone: '',
          });
        } else {
          setErrors((prev) => ({
            ...prev,
            // Gérer les erreurs spécifiques du serveur si nécessaire
          }));
        }
      } catch (error) {
        alert("Erreur lors de l'ajout du professeur");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className=" border p-2 rounded-xl h-[60vh]">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Ajouter un nouveau </h2>
      <div className="">
      <form onSubmit={handleSubmit} className="">
        <div className="overflow-y-auto">
          <FormInput
            label="Nom"
            type="text"
            name="name"
            placeholder="Antoine"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<User size={18} />}
          />
          <FormInput
            label="Prénom"
            type="text"
            name="lastname"
            placeholder="Emmanuel"
            value={formData.lastname}
            onChange={handleChange}
            error={errors.lastname}
            icon={<User size={18} />}
          />
          <FormInput
            label="Fonction"
            type="text"
            name="fonction"
            placeholder=""
            value={formData.fonction}
            onChange={handleChange}
            error={errors.fonction}
            icon={<User size={18} />}
          />
          <FormInput
            label="Email"
            type="email"
            name="email"
            placeholder=""
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={18} />}
          />
          <FormInput
            label="Numéro de téléphone"
            type="tel"
            name="telephone"
            placeholder="Antoine"
            value={formData.telephone}
            onChange={handleChange}
            error={errors.telephone}
            icon={<Phone size={18} />}
          />
          <FormInput
            label="Mot de passe"
            type="password"
            name="password"
            placeholder="....."
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<Lock size={18} />}
          />
        </div>
        <Button type="submit" isLoading={isLoading} fullWidth>
          Ajouter
        </Button>
      </form>
      </div>
      
    </div>
  );
};

export default AddProf;