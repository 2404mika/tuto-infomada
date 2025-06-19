import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../common/Button';
import { Formation } from '../../types';

const OtherFormation: React.FC = () => {
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
          // console.log('Données reçues de l\'API :', data);
          setFormations(data);
        } else {
          throw new Error('Erreur lors de la récupération des domaines');
        }
      } catch (err) {
        setError('Impossible de charger les formations');
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/user/formation/${id}`);
  };

  return (
    <section className="min-h-[85vh] mt-16 rounded-2xl flex flex-col items-center shadow-xl bg-gradient-to-br from-blue-700 to-violet-600 text-white p-8">
      <h1 className="font-semibold text-3xl mb-2">Nos formations disponibles</h1>
      <span className="bg-white h-0.5 w-96 mb-6"></span>

      <div className="relative w-full">
        <button onClick={scrollLeft} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-blue-800 p-2 rounded-full z-10">
          <ChevronLeft className="text-white" />
        </button>

        <div ref={sliderRef} className="flex gap-6 overflow-x-auto hide-scrollbar px-12">
          {isLoading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p className="text-red-300">{error}</p>
          ) : formations.length === 0 ? (
            <p>Aucun domaine disponible</p>
          ) : (
            formations.map((formation) => (
              <div
                key={formation.id}
                className="w-[250px] flex-shrink-0 rounded-3xl bg-no-repeat mt-16 bg-cover bg-center overflow-hidden h-52 shadow-2xl cursor-pointer"
                onClick={() => handleCardClick(formation.id)}
              >
                <div className="inset-0 bg-blue-900/20 h-full flex items-end">
                  <div className="h-28 bg-gradient-to-t from-blue-900/100 to-transparent w-full flex items-center justify-center">
                    <p className="text-m text-stone-200 font-semibold text-center px-4 mt-6">
                      {formation.title}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button onClick={scrollRight} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-800 p-2 rounded-full z-10">
          <ChevronRight className="text-white" />
        </button>
      </div>
      <div className="mt-6">
        <Button onClick={() => navigate('/Alldomain')}>Voir tout</Button>
      </div>
    </section>
  );
};

export default OtherFormation;