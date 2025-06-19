// src/components/MyFormationDetail.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button'; // Ajuste l'import selon ton composant Button
import { ArrowLeft } from 'lucide-react'; // Ajuste l'import si nécessaire

const MyFormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {  loading, accessToken } = useAuth();
  const [formation, setFormation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormationDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:8000/api/formation/${id}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
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
  }, [id, loading, accessToken]);

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

  const handleBack = () => {
    navigate('/user/Myformation', { replace: true }); // Recharge la page MyFormation
  };

  // Construire l'URL de la vidéo en utilisant MEDIA_URL
  const mediaBaseUrl = 'http://localhost:8000/media/'; // Correspond à ton serveur Django en dev
  const getVideoUrl = (videoFile: string) => `${mediaBaseUrl}${videoFile.startsWith('/') ? '' : '/'}${videoFile}`;
  console.log("liennn:",getVideoUrl)

  return (
    <section className="h-full rounded-2xl flex flex-col items-center shadow-xl bg-gradient-to-br from-blue-700 to-violet-600 text-white p-8">
      <div className="max-w-4xl w-full">
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleBack}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg"
          >
            <ArrowLeft size={20} />
            Retour aux formations suivies
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
              <div className="space-y-6">
                {formation.chapters.map((chapter: any) => (
                  <div
                    key={chapter.id}
                    className="w-full rounded-3xl bg-white/5 p-4 shadow-xl"
                  >
                    <h3 className="text-lg font-medium">
                      {chapter.chapter_name} (Chapitre {chapter.chapter_number})
                    </h3>
                    <p className="text-gray-200 mb-4">{chapter.description}</p>
                    {chapter.videos.length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Vidéos :</h4>
                        {chapter.videos.map((video: any) => (
                          <div key={video.id} className="mb-4">
                            <video
                              controls
                              className="w-full max-w-2xl rounded-lg shadow-lg"
                              src={getVideoUrl(video.file)}
                            >
                              Votre navigateur ne supporte pas la lecture de cette vidéo.
                            </video>
                            <p className="text-gray-300 mt-2">{video.name}</p>
                          </div>
                        ))}
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
    </section>
  );
};

export default MyFormationDetail;