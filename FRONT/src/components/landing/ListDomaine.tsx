import React, { useEffect, useState } from 'react';

// Interface pour les domaines
interface Domaine {
  id: number;
  name: string;
  image?: string;
}

const AllDomains: React.FC = () => {
  const [domains, setDomains] = useState<Domaine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les domaines depuis l'API
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/domaine/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDomains(data);
        } else {
          throw new Error('Erreur lors de la récupération des domaines');
        }
      } catch (err) {
        setError('Impossible de charger les domaines');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomains();
  }, []);

  // Fonction pour obtenir l'URL de l'image
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return 'https://via.placeholder.com/250x150';
    return imagePath.startsWith('http') ? imagePath : `http://localhost:8000${imagePath}`;
  };

  if (isLoading) return <p className="text-center py-8">Chargement...</p>;
  if (error) return <p className="text-center py-8 text-red-300">{error}</p>;
  if (domains.length === 0) return <p className="text-center py-8">Aucun domaine disponible</p>;

  return (
    <section className="min-h-[85vh] mt-16 flex flex-col items-center bg-gradient-to-br from-blue-700 to-violet-600 text-white p-8">
      <h1 className="font-semibold text-3xl mb-6">Tous les domaines disponibles</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="w-full flex-shrink-0 rounded-3xl bg-no-repeat bg-cover bg-center overflow-hidden h-52 shadow-2xl cursor-pointer"
            style={{ backgroundImage: `url(${getImageUrl(domain.image)})` }}
            onClick={() => window.location.href = `/domaine/${domain.id}`}
          >
            <div className="inset-0 bg-blue-900/20 h-full flex items-end">
              <div className="h-28 bg-gradient-to-t from-blue-900/100 to-transparent w-full flex items-center justify-center">
                <p className="text-m text-stone-200 font-semibold text-center px-4 mt-6">
                  {domain.name}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllDomains;