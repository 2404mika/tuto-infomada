// src/components/OtherFormation.tsx
// import React, { useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ChevronLeft, ChevronRight } from 'lucide-react';
// import Button from '../../common/Button';
// import { Formation } from '../../types';

// const OtherFormation: React.FC = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [formations, setFormations] = useState<Formation[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchFormations = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/formation/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           setFormations(data);
//         } else {
//           throw new Error('Erreur lors de la récupération des domaines');
//         }
//       } catch (err) {
//         setError('Impossible de charger les formations');
//         console.log(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFormations();
//   }, []);

//   const scrollLeft = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (sliderRef.current) {
//       sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//     }
//   };

//   const handleCardClick = (id: number) => {
//     navigate(`/user/formation/${id}`);
//   };

//   return (
//     <section className="min-h-[85vh] mt-16 rounded-2xl flex flex-col items-center bg-slate-200 p-6 shadow-lg">
//       <h1 className="font-semibold text-3xl text-blue-800 mb-4">Nos formations disponibles</h1>
//       <div className="w-full relative">
//         <div className="flex items-center justify-between mb-4">
//           <div className="h-0.5 w-48 bg-blue-800"></div>
//           <Button
//             onClick={() => navigate('/Alldomain')}
//             // className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             Voir tout
//           </Button>
//         </div>

//         <div className="relative">
//           <button
//             onClick={scrollLeft}
//             className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-600 p-2 rounded-full z-10 hover:bg-blue-700 transition-colors"
//             aria-label="Défilement gauche"
//           >
//             <ChevronLeft className="text-white" size={20} />
//           </button>

//           <div
//             ref={sliderRef}
//             className="flex gap-6 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200 px-4 py-2"
//             style={{ scrollBehavior: 'smooth' }}
//           >
//             {isLoading ? (
//               <p className="text-gray-600">Chargement...</p>
//             ) : error ? (
//               <p className="text-red-500">{error}</p>
//             ) : formations.length === 0 ? (
//               <p className="text-gray-600">Aucune formation disponible</p>
//             ) : (
//               formations.map((formation) => (
//                 <div
//                   key={formation.id}
//                   className="w-[250px] flex-shrink-0 rounded-xl bg-white border border-gray-200 overflow-hidden h-64 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
//                   onClick={() => handleCardClick(formation.id)}
//                   style={{
//                     backgroundImage: `url(${formation.image || 'https://via.placeholder.com/250x200'})`, // Remplace par une image par défaut si nécessaire
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                   }}
//                 >
//                   <div className="h-full flex items-end bg-gradient-to-t from-black/70 to-transparent">
//                     <div className="w-full p-4 text-center">
//                       <p className="text-white font-semibold text-lg truncate">
//                         {formation.title}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           <button
//             onClick={scrollRight}
//             className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-600 p-2 rounded-full z-10 hover:bg-blue-700 transition-colors"
//             aria-label="Défilement droite"
//           >
//             <ChevronRight className="text-white" size={20} />
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OtherFormation;

//--------------------------------Tsy izy le ambony--------------------------------------------


//----------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------

// import React, { useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { ChevronLeft, ChevronRight } from 'lucide-react';
// // import Button from '../common/Button';
// import { Formation } from '../../types';

// // interface Domaine {
// //   id: number;
// //   name: string;
// //   image?: string;}

// const OtherFormation: React.FC = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [formations, setFormations] = useState<Formation[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//    useEffect(() => {
//     const fetchFormations = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/api/formation/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Données reçues de l\'API :', data);
//           setFormations(data);
//         } else {
//           throw new Error('Erreur lors de la récupération des domaines');
//         }
//       } catch (err) {
//         setError('Impossible de charger les domaines');
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchFormations();
//   }, []);

//   // const scrollLeft = () => {
//   //   if (sliderRef.current) {
//   //     sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
//   //   }
//   // };

//   // const scrollRight = () => {
//   //   if (sliderRef.current) {
//   //     sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
//   //   }
//   // };

//   const handleCardClick = (id: number) => {
//     navigate(`/user/formation/${id}`);
//   };

//   // const getImageUrl = (imagePath?: string) => {
//   //   if (!imagePath) return 'https://via.placeholder.com/250x150';
//   //   return imagePath.startsWith('http') ? imagePath : `http://localhost:8000${imagePath}`;
//   // };

//   return (
//     <section className="min-h-[85vh] rounded-2xl flex flex-col items-center shadow-xl bg-slate-200 border border-blue-100 text-white p-8">
//       <h1 className="font-semibold text-3xl text-gray-800">Nos formations disponibles</h1>
//       {/* <span className="bg-black h-0.5 w-96"></span> */}

//       <div className="relative w-full">
//         {/* <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-800 p-2 rounded-full z-10">
//           <ChevronLeft className="text-white" />
//         </button> */}

//         <div className="flex gap-6 flex-wrap hide-scrollbar px-20">
//           {isLoading ? (
//             <p>Chargement...</p>
//           ) : error ? (
//             <p className="text-red-300">{error}</p>
//           ) : formations.length === 0 ? (
//             <p>Aucun domaine disponible</p>
//           ) : (
//             formations.map((formation) => (
//               <div
//                 key={formation.id}
//                 className="w-[250px] flex flex-col justify-between rounded-3xl bg-gray-100 mt-16 bg-center h-72 p-2 shadow-xl cursor-pointer"
               
//                 onClick={() => handleCardClick(formation.id)}
//               >
//                 <div className=" flex flex-col">
//                   <div className=" w-full p-1">
//                     <p className="text-m text-blue-900 font-semibold px-4 mb-5">
//                       {formation.title}
//                     </p>
//                     <p className='text-gray-600 text-sm mt-2 px-4'>{formation.description}</p>
//                   </div>
                  
                  
//                 </div>
//                 <div className='flex justify-end p-3'>
//                     <button className='bg-blue-800 p-2 rounded-xl w-full'>S'inscrire</button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-800 p-2 rounded-full z-10">
//           <ChevronRight className="text-white" />
//         </button> */}
//       </div>
//       {/* <div className="mt-6">
//         <Button onClick={() => navigate('/Alldomain')}>Voir tout</Button>
//       </div> */}
//     </section>
//   );
// };

// export default OtherFormation;

//-------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// import React, { useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Formation } from '../../types';

// interface MyFormation {
//   id: number; // ID de Formation_by_user
//   formation_id: number; // ID de la formation
//   formation_title: string;
//   status: string; // "Published" ou "Not published"
// }

// const OtherFormation: React.FC = () => {
//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [formations, setFormations] = useState<Formation[]>([]);
//   const [myFormations, setMyFormations] = useState<MyFormation[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
//   const { accessToken, user } = useAuth();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Récupérer toutes les formations
//         console.log('Récupération des formations disponibles');
//         const formationsResponse = await fetch('http://localhost:8000/api/formation/', {
//           method: 'GET',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!formationsResponse.ok) {
//           throw new Error(`Erreur HTTP ${formationsResponse.status}: Récupération des formations échouée`);
//         }

//         const formationsData = await formationsResponse.json();
//         console.log('Formations reçues:', formationsData);
//         setFormations(formationsData);

//         // Récupérer les formations de l'étudiant connecté
//         if (accessToken && user) {
//           console.log('Récupération des formations de l\'étudiant:', user.email);
//           const myFormationsResponse = await fetch('http://localhost:8000/api/formationByUserList/', {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: `Bearer ${accessToken}`,
//             },
//           });

//           if (!myFormationsResponse.ok) {
//             if (myFormationsResponse.status === 401) {
//               setError('Session expirée. Veuillez vous reconnecter.');
//               return;
//             }
//             const errorData = await myFormationsResponse.json();
//             throw new Error(errorData.error || `Erreur HTTP ${myFormationsResponse.status}: Récupération des inscriptions échouée`);
//           }

//           const myFormationsData = await myFormationsResponse.json();
//           console.log('Mes formations reçues:', myFormationsData);
//           setMyFormations(myFormationsData);
//         } else {
//           console.log('Utilisateur non connecté ou token manquant');
//           setMyFormations([]);
//         }

//         setIsLoading(false);
//       } catch (err: any) {
//         setError(err.message || 'Impossible de charger les données');
//         console.error('Erreur:', err);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [accessToken, user]);

//   const handleCardClick = (id: number) => {
//     console.log('Clic sur la formation:', id);
//     navigate(`/user/formation/${id}`);
//   };

//   const handleAccessClick = (formationByUserId: number, formationId: number) => {
//     console.log('Accès à la formation:', formationId, 'formationByUserId:', formationByUserId);
//     navigate(`/user/myformationDetail/${formationId}`, { state: { formationByUserId } });
//   };

//   // const handleInscriptionClick = (formationId: number) => {
//   //   console.log('Inscription à la formation:', formationId);
//   //   navigate(`/user/formation/${formationId}/inscription`);
//   // };

//   const isEnrolled = (formationId: number) => {
//     const enrolled = myFormations.find((myFormation) => myFormation.formation_id === formationId && myFormation.status === 'Published');
//     console.log(`Vérification inscription pour formation ${formationId}:`, enrolled);
//     return enrolled;
//   };

//   return (
//     <section className="min-h-[85vh] rounded-2xl flex flex-col items-center shadow-xl bg-slate-200 border border-blue-100 text-white p-8">
//       <h1 className="font-semibold text-3xl text-gray-800">Nos formations disponibles</h1>

//       <div className="relative w-full">
//         <div className="flex gap-6 flex-wrap hide-scrollbar px-20">
//           {isLoading ? (
//             <p>Chargement...</p>
//           ) : error ? (
//             <p className="text-red-300">{error}</p>
//           ) : formations.length === 0 ? (
//             <p>Aucune formation disponible</p>
//           ) : (
//             formations.map((formation) => {
//               const enrolledFormation = isEnrolled(formation.id);
//               return (
//                 <div
//                   key={formation.id}
//                   className="w-[250px] flex flex-col justify-between rounded-3xl bg-gray-100 mt-16 bg-center h-72 p-2 shadow-xl"
//                   // onClick={() => handleCardClick(formation.id)}
//                 >
//                   <div className="flex flex-col">
//                     <div className="w-full p-1">
//                       <p className="text-m text-blue-900 font-semibold px-4 mb-5">{formation.title}</p>
//                       <p className="text-gray-600 text-sm mt-2 px-4">{formation.description}</p>
//                     </div>
//                   </div>
//                   <div className="flex justify-end p-3">
//                     {enrolledFormation ? (
//                       <button
//                         className="p-2 rounded-xl w-full text-blue-800 font-medium border border-blue-800"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleAccessClick(enrolledFormation.id, formation.id);
//                         }}
//                       >
//                         Accéder
//                       </button>
//                     ) : (
//                       <button
//                         className="bg-blue-800 p-2 rounded-xl w-full text-white"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleCardClick(formation.id);
//                         }}
//                       >
//                         Voir détails
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default OtherFormation;


//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------


import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Formation } from '../../types';

interface MyFormation {
  id: number;
  formation_id: number;
  formation_title: string;
  status: string;
}

const OtherFormation: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [myFormations, setMyFormations] = useState<MyFormation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer toutes les formations
        console.log('Récupération des formations disponibles');
        const formationsResponse = await fetch('http://localhost:8000/api/formation/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!formationsResponse.ok) {
          throw new Error(`Erreur HTTP ${formationsResponse.status}: Récupération des formations échouée`);
        }

        const formationsData = await formationsResponse.json();
        console.log('Formations reçues:', formationsData);
        // Filtrer les formations pour ne garder que celles avec status.value = 1
        const publishedFormations = formationsData.filter((formation: Formation) => formation.status.value === 1);
        setFormations(publishedFormations);

        // Récupérer les formations de l'étudiant connecté
        if (accessToken && user) {
          console.log('Récupération des formations de l\'étudiant:', user.email);
          const myFormationsResponse = await fetch('http://localhost:8000/api/formationByUserList/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (!myFormationsResponse.ok) {
            if (myFormationsResponse.status === 401) {
              setError('Session expirée. Veuillez vous reconnecter.');
              return;
            }
            const errorData = await myFormationsResponse.json();
            throw new Error(errorData.error || `Erreur HTTP ${myFormationsResponse.status}: Récupération des inscriptions échouée`);
          }

          const myFormationsData = await myFormationsResponse.json();
          console.log('Mes formations reçues:', myFormationsData);
          setMyFormations(myFormationsData);
        } else {
          console.log('Utilisateur non connecté ou token manquant');
          setMyFormations([]);
        }

        setIsLoading(false);
      } catch (err: any) {
        setError(err.message || 'Impossible de charger les données');
        console.error('Erreur:', err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [accessToken, user]);

  const handleCardClick = (id: number) => {
    console.log('Clic sur la formation:', id);
    navigate(`/user/formation/${id}`);
  };

  const handleAccessClick = (formationByUserId: number, formationId: number) => {
    console.log('Accès à la formation:', formationId, 'formationByUserId:', formationByUserId);
    navigate(`/user/myformationDetail/${formationId}`, { state: { formationByUserId } });
  };

  const isEnrolled = (formationId: number) => {
    const enrolled = myFormations.find((myFormation) => myFormation.formation_id === formationId && myFormation.status === 'Published');
    console.log(`Vérification inscription pour formation ${formationId}:`, enrolled);
  return enrolled;
  };

  return (
    <section className="min-h-[85vh] rounded-2xl flex flex-col items-center shadow-xl bg-slate-200 border border-blue-100 text-white p-8">
      <h1 className="font-semibold text-3xl text-gray-800">Nos formations disponibles</h1>

      <div className="relative w-full">
        <div className="flex gap-6 flex-wrap hide-scrollbar px-20">
          {isLoading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : formations.length === 0 ? (
            <p>Aucune formation disponible</p>
          ) : (
            formations.map((formation) => {
              const enrolledFormation = isEnrolled(formation.id);
              return (
                <div
                  key={formation.id}
                  className="w-[250px] flex flex-col justify-between rounded-3xl bg-gray-100 mt-16 bg-center h-72 p-2 shadow-xl"
                >
                  <div className="flex flex-col">
                    <div className="w-full p-1">
                      <p className="text-m text-blue-900 font-semibold px-4 mb-5">{formation.title}</p>
                      <p className="text-gray-600 text-sm mt-2 px-4">{formation.description}</p>
                    </div>
                  </div>
                  <div className="flex justify-end p-3">
                    {enrolledFormation ? (
                      <button
                        className="p-2 rounded-xl w-full text-blue-800 font-medium border border-blue-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccessClick(enrolledFormation.id, formation.id);
                        }}
                      >
                        Accéder
                      </button>
                    ) : (
                      <button
                        className="bg-blue-800 p-2 rounded-xl w-full text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(formation.id);
                        }}
                      >
                        Voir détails
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default OtherFormation;



