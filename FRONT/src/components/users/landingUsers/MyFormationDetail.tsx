// src/components/MyFormationDetail.tsx
// src/components/MyFormationDetail.tsx
// src/components/MyFormationDetail.tsx
// src/components/MyFormationDetail.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// import Button from '../../common/Button';
import { ArrowLeft, SkipForward, SkipBack } from 'lucide-react'; // Import des icônes
import { FaWhatsapp } from "react-icons/fa";

const MyFormationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, accessToken } = useAuth();
  const [formation, setFormation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isNextVisible, setIsNextVisible] = useState(false); // Nouvel état pour le bouton "Suivant"

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
          console.log("ny dataa fona ehhhh:", data)
          setFormation(data);
          if (data.chapters.length > 0) setSelectedChapterId(data.chapters[0].id);
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

  // Passer à la vidéo suivante
  const handleNextVideo = () => {
    const currentChapter = formation.chapters.find((chap: any) => chap.id === selectedChapterId);
    if (currentChapter && currentVideoIndex < currentChapter.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setIsNextVisible(false); // Réinitialise la visibilité après avoir cliqué
    }
  };

  // Revenir à la vidéo précédente
  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  // Mettre à jour la vidéo affichée (sans auto-play)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Recharge la vidéo sans jouer automatiquement
      setIsNextVisible(false); // Réinitialise la visibilité au changement de vidéo
    }
  }, [currentVideoIndex, selectedChapterId]);

  // Gérer la fin de la vidéo
  const handleVideoEnded = () => {
    const currentChapter = formation.chapters.find((chap: any) => chap.id === selectedChapterId);
    if (currentChapter && currentVideoIndex < currentChapter.videos.length - 1) {
      setIsNextVisible(true); // Affiche le bouton "Suivant" uniquement à la fin
    }
  };

  const handleBack = () => {
    navigate('/user/Myformation', { replace: true });
  };

  const mediaBaseUrl = 'http://localhost:8000/media/';
  const getVideoUrl = (videoFile: string) => `${mediaBaseUrl}${videoFile.startsWith('/') ? '' : '/'}${videoFile}`;

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

  const selectedChapter = formation.chapters.find((chap: any) => chap.id === selectedChapterId);
  const currentVideo = selectedChapter?.videos[currentVideoIndex];

  return (
    <div>
      <div className='flex w-full justify-between'>
      <button
          onClick={handleBack}
          className=" text-blue-700 font-medium px-4 py-2 rounded-t-xl ml-6 bg-gray-100"
        >
          <ArrowLeft size={16} className="inline mr-2" />
          Retour
        </button>
        
        <div className='text-blue-700 font-medium px-4 py-2 rounded-t-xl mr-6 bg-gray-100 flex gap-1'><p className='mr-2'>Contactez votre Professeur:</p><a className='flex gap-1' href={`https://wa.me/${formation.prof_id.telephone}`} target="_blank"><FaWhatsapp size={20}/><span className='underline'>{formation.prof_id.telephone}</span></a></div>
      </div>
      
      <div className="min-h-screen bg-gray-100 p-6 flex flex-col md:flex-row gap-6 rounded-2xl">
      

{/* Section vidéo à gauche */}
    <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">{formation.title}</h1>
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        {currentVideo ? (
          <video
            ref={videoRef}
            controls
            className="w-full h-64 bg-black"
            onEnded={handleVideoEnded} // Déclenche la visibilité du bouton "Suivant"
            src={getVideoUrl(currentVideo.file)}
          >
            Votre navigateur ne supporte pas la lecture de cette vidéo.
          </video>
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            Aucune vidéo disponible
          </div>
        )}
        <p className="text-gray-600 mt-4 ml-2">{currentVideo?.name || 'Aucun titre'}</p>
        <div className="mt-2 flex space-x-2">
          {currentVideoIndex > 0 && (
            <button
              onClick={handlePrevVideo}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <SkipBack size={16} className="mr-2" />
              Précédent
            </button>
          )}
          {isNextVisible && selectedChapter?.videos.length > 1 && currentVideoIndex < selectedChapter.videos.length - 1 && (
            <button
              onClick={handleNextVideo}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
            >
              <SkipForward size={16} className="mr-2" />
              Suivant
            </button>
          )}
        </div>
      </div>
    </div>

    {/* Liste des chapitres à droite */}
    <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Chapitres de la formation</h2>
        
      </div>
      <div className="space-y-2">
        {formation.chapters.map((chapter: any) => (
          <button
            key={chapter.id}
            onClick={() => {
              setSelectedChapterId(chapter.id);
              setCurrentVideoIndex(0); // Réinitialise l'index au changement de chapitre
              setIsNextVisible(false); // Réinitialise la visibilité
            }}
            className={`w-full text-left p-2 rounded ${selectedChapterId === chapter.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} transition-colors`}
          >
            {chapter.chapter_name}
          </button>
        ))}
      </div>
    </div>
</div>
</div>
    
  );
};

export default MyFormationDetail;







// // src/components/MyFormationDetail.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../../context/AuthContext';
// import Button from '../../common/Button'; // Ajuste l'import selon ton composant Button
// import { ArrowLeft } from 'lucide-react'; // Ajuste l'import si nécessaire

// const MyFormationDetail: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const {  loading, accessToken } = useAuth();
//   const [formation, setFormation] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchFormationDetail = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const response = await fetch(`http://localhost:8000/api/formation/${id}/`, {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${accessToken}`,
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setFormation(data);
//         } else {
//           throw new Error('Erreur lors de la récupération des détails de la formation');
//         }
//       } catch (err) {
//         setError('Impossible de charger les détails de la formation');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (!loading) {
//       fetchFormationDetail();
//     }
//   }, [id, loading, accessToken]);

//   if (isLoading || loading) {
//     return (
//       <div className="h-full flex items-center justify-center text-white">
//         <p className="text-xl">Chargement...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="h-full flex items-center justify-center text-white">
//         <p className="text-xl text-red-300">{error}</p>
//       </div>
//     );
//   }

//   if (!formation) {
//     return (
//       <div className="h-full flex items-center justify-center text-white">
//         <p className="text-xl">Aucune formation trouvée</p>
//       </div>
//     );
//   }

//   const handleBack = () => {
//     navigate('/user/Myformation', { replace: true }); // Recharge la page MyFormation
//   };

//   // Construire l'URL de la vidéo en utilisant MEDIA_URL
//   const mediaBaseUrl = 'http://localhost:8000/media/'; // Correspond à ton serveur Django en dev
//   const getVideoUrl = (videoFile: string) => `${mediaBaseUrl}${videoFile.startsWith('/') ? '' : '/'}${videoFile}`;
//   console.log("liennn:",getVideoUrl)

//   return (
//     <section className="h-full rounded-2xl flex flex-col items-center shadow-xl bg-gradient-to-br from-blue-700 to-violet-600 text-white p-8">
//       <div className="max-w-4xl w-full">
//         <div className="flex justify-between items-center mb-6">
//           <Button
//             onClick={handleBack}
//           >
//             <ArrowLeft size={20} />
//             Retour aux formations suivies
//           </Button>
//         </div>

//         <div className="bg-white/10 rounded-3xl shadow-2xl p-6">
//           <h1 className="text-3xl font-semibold mb-4">{formation.title}</h1>
//           <span className="bg-white h-0.5 w-full block mb-6"></span>

//           <div className="mb-6">
//             <h2 className="text-xl font-semibold mb-2">Description</h2>
//             <p className="text-gray-200">{formation.description}</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Détails</h2>
//               <p><strong>Domaine :</strong> {formation.formation_domaine.name}</p>
//               <p><strong>Prix :</strong> {formation.parametre_formation_id.price} Ar</p>
//               <p><strong>Durée :</strong> {formation.parametre_formation_id.duration}</p>
//               <p><strong>Statut :</strong> {formation.status.name}</p>
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold mb-2">Formateur</h2>
//               <p><strong>Nom :</strong> {formation.prof_id.first_name} {formation.prof_id.last_name}</p>
//               <p><strong>Téléphone :</strong> {formation.prof_id.telephone}</p>
//               <p><strong>Fonction :</strong> {formation.prof_id.fonction}</p>
//             </div>
//           </div>

//           <div>
//             <h2 className="text-xl font-semibold mb-4">Chapitres</h2>
//             {formation.chapters.length > 0 ? (
//               <div className="space-y-6">
//                 {formation.chapters.map((chapter: any) => (
//                   <div
//                     key={chapter.id}
//                     className="w-full rounded-3xl bg-white/5 p-4 shadow-xl"
//                   >
//                     <h3 className="text-lg font-medium">
//                       {chapter.chapter_name} (Chapitre {chapter.chapter_number})
//                     </h3>
//                     <p className="text-gray-200 mb-4">{chapter.description}</p>
//                     {chapter.videos.length > 0 && (
//                       <div className="mt-2">
//                         <h4 className="text-sm font-medium mb-2">Vidéos :</h4>
//                         {chapter.videos.map((video: any) => (
//                           <div key={video.id} className="mb-4">
//                             <video
//                               controls
//                               className="w-full max-w-2xl rounded-lg shadow-lg"
//                               src={getVideoUrl(video.file)}
//                             >
//                               Votre navigateur ne supporte pas la lecture de cette vidéo.
//                             </video>
//                             <p className="text-gray-300 mt-2">{video.name}</p>
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-200">Aucun chapitre disponible</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default MyFormationDetail;