import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formation } from '../types';

const FormationCard: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/formation/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Données reçues de l\'API :', data);
          // Filtrer les formations pour ne garder que celles avec status.value = 1
          const publishedFormations = data.filter((formation: Formation) => formation.status.value === 1);
          console.log('Formations publiées après filtrage:', publishedFormations);
          setFormations(publishedFormations);
        } else {
          throw new Error('Erreur lors de la récupération des formations');
        }
      } catch (err) {
        setError('Impossible de charger les formations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const handleCardClick = (id: number) => {
    navigate(`/formation/${id}`);
  };

  return (
    <section className="min-h-[85vh] mt-16 rounded-2xl flex flex-col items-center shadow-xl bg-slate-100 border border-blue-700 border-dashed text-white p-8">
      <h1 className="font-semibold text-2xl text-blue-950 bg-blue-500/10 pl-6 pr-6 pb-3 pt-3 rounded-full border border-dashed">Nos formations disponibles</h1>

      <div className="relative w-full">
        <div className="flex gap-6 flex-wrap hide-scrollbar px-20">
          {isLoading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : formations.length === 0 ? (
            <p>Aucune formation disponible</p>
          ) : (
            formations.map((formation) => (
              <div
                key={formation.id}
                className="w-[250px] flex flex-col justify-between rounded-3xl bg-white mt-16 bg-center h-72 p-2 shadow-xl cursor-pointer"
                onClick={() => handleCardClick(formation.id)}
              >
                <div className="flex flex-col">
                  <div className="w-full p-1">
                    <p className="text-m text-blue-700 font-semibold px-4 mb-5">
                      {formation.title}
                    </p>
                    <p className="text-gray-600 text-sm mt-2 px-4">{formation.description}</p>
                  </div>
                </div>
                <div className="flex justify-end p-3">
                  <button className="bg-blue-800 p-2 rounded-xl w-full">S'inscrire</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FormationCard;









// import React, { useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { ChevronLeft, ChevronRight } from 'lucide-react';
// // import Button from '../common/Button';
// import { Formation } from '../types';

// // interface Domaine {
// //   id: number;
// //   name: string;
// //   image?: string;}

// const FormationCard: React.FC = () => {
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
//     navigate(`/formation/${id}`);
//   };

//   // const getImageUrl = (imagePath?: string) => {
//   //   if (!imagePath) return 'https://via.placeholder.com/250x150';
//   //   return imagePath.startsWith('http') ? imagePath : `http://localhost:8000${imagePath}`;
//   // };

//   return (
//     <section className="min-h-[85vh] mt-16 rounded-2xl flex flex-col items-center shadow-xl bg-slate-100 border border-blue-700 border-dashed text-white p-8">
//       <h1 className="font-semibol d text-2xl text-blue-950 bg-blue-500/10 pl-6 pr-6 pb-3 pt-3 rounded-full border border-dashed">Nos formations disponibles</h1>
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
//                     <p className="text-m text-blue-700 font-semibold px-4 mb-5">
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

// export default FormationCard;







// import React, { useRef, useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { ChevronLeft, ChevronRight } from 'lucide-react';
// // import Button from '../common/Button';
// import { Formation } from '../types';

// // interface Domaine {
// //   id: number;
// //   name: string;
// //   image?: string;}

// const FormationCard: React.FC = () => {
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
//     navigate(`/formation/${id}`);
//   };

//   // const getImageUrl = (imagePath?: string) => {
//   //   if (!imagePath) return 'https://via.placeholder.com/250x150';
//   //   return imagePath.startsWith('http') ? imagePath : `http://localhost:8000${imagePath}`;
//   // };

//   return (
//     <section className="min-h-[85vh] mt-16 rounded-2xl flex flex-col items-center shadow-xl bg-slate-200 border border-blue-100 text-white p-8">
//       <h1 className="font-semibold text-3xl text-blue-800">Nos formations disponibles</h1>
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
//                     <p className="text-m text-blue-700 font-semibold px-4 mb-5">
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

// export default FormationCard;