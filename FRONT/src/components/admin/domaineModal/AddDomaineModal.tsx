import { useState, useEffect } from 'react';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import ModalBase from '../../common/Modal';
import { Domaine } from '../../types';

interface AddDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDomainAdded: (newDomain: Domaine) => void;
}

const AddDomainModal: React.FC<AddDomainModalProps> = ({ isOpen, onClose, onDomainAdded }) => {
  const [domaineNameInput, setDomaineNameInput] = useState('');
  const [domaineImage, setDomaineImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDomaineNameInput('');
      setDomaineImage(null);
      setError(null);
    }
  }, [isOpen]);

  const validateForm = () => {
    if (!domaineNameInput.trim()) {
      setError('Le nom du domaine est requis');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('name', domaineNameInput);
      if (domaineImage) {
        formData.append('image', domaineImage);
      }

      try {
        const response = await fetch('http://localhost:8000/api/domaine/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          // Ajuster pour correspondre à la réponse du backend
          const newDomain: Domaine = { id: data.id, name: data.name, image: data.image || '' };
          onDomainAdded(newDomain);
          onClose();
          alert('Domaine inséré avec succès !');
        } else {
          console.error('Erreur', data);
          setError('Erreur lors de l\'ajout du domaine');
        }
      } catch (error) {
        console.error('Erreur', error);
        alert('Erreur ehhhh');
        setError('Une erreur est survenue');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Ajouter un nouveau domaine">
      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <FormInput
            label="Nom du domaine"
            type="text"
            name="name"
            placeholder="Marketing digital"
            value={domaineNameInput}
            onChange={(e) => setDomaineNameInput(e.target.value)}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Image du domaine</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setDomaineImage(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <Button type="submit" isLoading={isLoading} fullWidth>
            {isLoading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </form>
      </div>
    </ModalBase>
  );
};

export default AddDomainModal;