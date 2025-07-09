// src/components/FormationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
// import Button from '../common/Button';
// import ModalBase from '../../common/Modal';
import { useAuth } from '../context/AuthContext';
import { BanknoteIcon, Clock, UserIcon,PhoneCall } from 'lucide-react';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
// import { toast } from 'react-toastify';

const FormationDetailLanding: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, loading, accessToken } = useAuth();
  const [formation, setFormation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [refTransaction, setRefTransaction] = useState('');
//   const [formError, setFormError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

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

//   const handleInscription = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!refTransaction.trim()) {
//       setFormError('Veuillez entrer la référence de transaction');
//       return;
//     }

//     console.log('Auth State:', { user, loading, accessToken });

//     if (!user || loading || !accessToken) {
//       setFormError('Utilisateur non connecté ou token invalide. Veuillez vous reconnecter.');
//       return;
//     }

//     setIsSubmitting(true);
//     setFormError(null);
//     const afficherToast = () => {
//       toast.success("Opération réussie !");
//       toast.error("Une erreur est survenue !");
//       toast.info("Voici une information.");
//       toast.warn("Attention !");
//     };

//     try {
//       const dataToSend = {
//         user_id: user.id,
//         lastname: user.lastname,
//         formation_id: formation.id,
//         price: formation.parametre_formation_id.price,
//         ref_transaction: refTransaction,
//       };
//       console.log("data sennnnddd:", dataToSend)
//       const response = await fetch('http://localhost:8000/api/formationByUser/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(dataToSend),
//       });

//       const result = await response.json();
//       console.log('Inscription response:', result);

//       if (!response.ok) {
//         throw new Error(result.message || 'Erreur lors de la création de l\'inscription');
//       }

//       setIsModalOpen(false);
//       setRefTransaction('');
//       // alert('Inscription et paiement enregistrés avec succès !');
//       toast.success("Inscription et paiement enregistrés avec succès !")
//     } catch (err) {
//       setFormError('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
//       console.error(err);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

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
    <section className="h-full rounded-2xl flex flex-col items-center shadow-xl bg-gray-200 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center  text-blue-800 border border-blue-800 px-4 py-2 rounded-lg hover:bg-blue-800 hover:text-white"
          >
            <ArrowLeft size={20} className=''/>
          </button>
          <button
            onClick={() => navigate("/login")}
            className=" hover:bg-blue-700  px-4 py-2 rounded-lg bg-blue-800 font-medium text-white"
            // disabled={!user || !accessToken}
          >
            S'inscrire
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 text-blue-900 ">
          <h1 className="text-3xl font-thin mb-4 text-center">{formation.title}</h1>

          <div className="mb-6">
            <h2 className="text-xl font-medium text-gray-800">Description</h2>
            <p className=" font-light text-gray-600">{formation.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className='font-light'>
              <h2 className="text-xl font-medium mb-1 text-gray-800">Détails</h2>
              <p className='mb-2 text-gray-600'>{formation.formation_domaine.name}</p>
              <p className='flex gap-1 mb-1 text-gray-600'> <BanknoteIcon/> {formation.parametre_formation_id.price} Ar</p>
              <p className='flex gap-1 mb-1 text-gray-600'> <Clock className='h-5'/> {formation.parametre_formation_id.duration}</p>
              {/* <p><strong>Statut :</strong> {formation.status.name}</p> */}
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1 text-gray-800">Formateur</h2>
              <p className='flex font-light mb-2 text-gray-600'><UserIcon className='h-5'/>{formation.prof_id.first_name} {formation.prof_id.last_name}</p>
              <p className='flex font-light mb-1 text-gray-600'><PhoneCall className='h-4 mt-1'/>{formation.prof_id.telephone}</p>
              <p className='flex font-light mb-1 gap-1 text-gray-600'><AcademicCapIcon className='h-5'/> {formation.prof_id.fonction}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Chapitres</h2>
            {formation.chapters.length > 0 ? (
              <div className="space-y-4">
                {formation.chapters.map((chapter: any) => (
                  <div
                    key={chapter.id}
                    className="w-full rounded-3xl bg-white/5 p-4 border border-separate"
                  >
                    <h3 className="text-lg font-medium text-gray-700">
                      {chapter.chapter_number}. {chapter.chapter_name}
                    </h3>
                    <p className="text-gray-600">{chapter.description}</p>
                    {/* {chapter.videos.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Vidéos :</h4>
                        <ul className="list-disc list-inside text-gray-300">
                          {chapter.videos.map((video: any) => (
                            <li key={video.id}>{video.name}</li>
                          ))}
                        </ul>
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-200">Aucun chapitre disponible</p>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default FormationDetailLanding;