// src/components/FormationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../common/Button';
import ModalBase from '../../common/Modal';
import { useAuth } from '../../../context/AuthContext';

const FormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, accessToken } = useAuth();
  const [formation, setFormation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refTransaction, setRefTransaction] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFormationDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8000/api/formation/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFormation(data);
        } else {
          throw new Error('Erreur lors de la récupération des détails de la formation');
        }
      } catch (err) {
        setError('Impossible de charger les détails de la formation');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!loading) {
      fetchFormationDetail();
    }
  }, [id, loading]);

  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refTransaction.trim()) {
      setFormError('Veuillez entrer la référence de transaction');
      return;
    }

    console.log('Auth State:', { user, loading, accessToken });

    if (!user || loading || !accessToken) {
      setFormError('Utilisateur non connecté ou token invalide. Veuillez vous reconnecter.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const dataToSend = {
        user_id: user.id,
        lastname: user.lastname,
        formation_id: formation.id,
        price: formation.parametre_formation_id.price,
        ref_transaction: refTransaction,
      };
      console.log("data sennnnddd:", dataToSend)
      const response = await fetch('http://localhost:8000/api/formationByUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log('Inscription response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Erreur lors de la création de l\'inscription');
      }

      setIsModalOpen(false);
      setRefTransaction('');
      alert('Inscription et paiement enregistrés avec succès !');
    } catch (err) {
      setFormError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <p className="text-xl">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <p className="text-xl text-red-300">{error}</p>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="h-full flex items-center justify-center text-white">
        <p className="text-xl">Aucune formation trouvée</p>
      </div>
    );
  }

  return (
    <section className="h-full rounded-2xl flex flex-col items-center shadow-xl bg-gradient-to-br from-blue-700 to-violet-600 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={() => navigate('/user/otherFormation')}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} />
            Retour aux formations
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            disabled={!user || !accessToken}
          >
            S'inscrire
          </Button>
        </div>

        <div className="bg-white/10 rounded-3xl shadow-2xl p-6">
          <h1 className="text-3xl font-semibold mb-4">{formation.title}</h1>
          <span className="bg-white h-0.5 w-full block mb-6"></span>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-200">{formation.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Détails</h2>
              <p><strong>Domaine :</strong> {formation.formation_domaine.name}</p>
              <p><strong>Prix :</strong> {formation.parametre_formation_id.price} Ar</p>
              <p><strong>Durée :</strong> {formation.parametre_formation_id.duration}</p>
              <p><strong>Statut :</strong> {formation.status.name}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Formateur</h2>
              <p><strong>Nom :</strong> {formation.prof_id.first_name} {formation.prof_id.last_name}</p>
              <p><strong>Téléphone :</strong> {formation.prof_id.telephone}</p>
              <p><strong>Fonction :</strong> {formation.prof_id.fonction}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Chapitres</h2>
            {formation.chapters.length > 0 ? (
              <div className="space-y-4">
                {formation.chapters.map((chapter: any) => (
                  <div
                    key={chapter.id}
                    className="w-full rounded-3xl bg-white/5 p-4 shadow-xl"
                  >
                    <h3 className="text-lg font-medium">
                      {chapter.chapter_name} (Chapitre {chapter.chapter_number})
                    </h3>
                    <p className="text-gray-200">{chapter.description}</p>
                    {chapter.videos.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Vidéos :</h4>
                        <ul className="list-disc list-inside text-gray-300">
                          {chapter.videos.map((video: any) => (
                            <li key={video.id}>{video.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200">Aucun chapitre disponible</p>
            )}
          </div>
        </div>
      </div>

      <ModalBase
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setFormError(null);
          setRefTransaction('');
        }}
        title="Inscription à la formation"
        size="md"
        footerContent={
          <>
            <Button
              onClick={() => {
                setIsModalOpen(false);
                setFormError(null);
                setRefTransaction('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Annuler
            </Button>
            <Button
              onClick={handleInscription}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Envoi...' : 'Confirmer l\'inscription'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleInscription} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de l'étudiant</label>
            <input
              type="text"
              value={user?.lastname || 'Utilisateur'}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Formation</label>
            <input
              type="text"
              value={formation?.title || ''}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Prix</label>
            <input
              type="text"
              value={`${formation?.parametre_formation_id?.price || 0} Ar`}
              disabled
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700"
            />
          </div>
          <div>
            <p className="text-sm text-gray-700">
              Veuillez envoyer via Mvola par le numéro suivant : <strong>0345929075</strong>
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Référence de transaction</label>
            <input
              type="text"
              value={refTransaction}
              onChange={(e) => setRefTransaction(e.target.value)}
              placeholder="Entrez la référence de transaction Mvola"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
              required
            />
          </div>
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
        </form>
      </ModalBase>
    </section>
  );
};

export default FormationDetail;