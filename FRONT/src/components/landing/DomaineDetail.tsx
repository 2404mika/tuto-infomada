
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface ParametreFormation {
  id: number;
  price: number;
  duration: string;
}

interface Status {
  id: number;
  value: number;
  name: string;
}

interface Prof{
    id: number;
    first_name: string;
    last_name:string;
    fonction: string;
    email: string;
    telephone: string;
    password: string;
}

interface Chapter {
  id: number;
  chapter_name: string;
  description: string;
  chapter_number: number;
}

interface Formation {
  id: number;
  title: string;
  description: string;
  starting_date: string;
  closing_date: string;
  parametre_formation_id: ParametreFormation;
  prof_id: Prof;
  status: Status;
  chapters: Chapter[];
}

interface Domaine {
  id: number;
  name: string;
  image?: string;
  formations?: Formation[];
}

const DomaineDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [domaine, setDomaine] = useState<Domaine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const handleCardClick = (id: number) => {
    navigate(`/formation/${id}`);
  };

  useEffect(() => {
    const fetchDomaine = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/domaine/${id}/`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        console.log('Données reçues de l\'API :', data);
        if (data.formations === undefined) {
          console.warn('Avertissement : "formations" est undefined dans les données API');
          data.formations = []; 
        }
        else{
            console.log("Mety ehhhhhhhhhh")
        }
        setDomaine(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        console.error('Erreur lors du fetch :', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDomaine();
  }, [id]);

  if (isLoading) return <p className="text-white">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!domaine) return <p>Domaine non trouvé</p>;

  return (
    <section className="min-h-[85vh] p-8 bg-gradient-to-br from-blue-700 to-violet-600 text-white">
      <h1 className="font-semibold text-3xl mb-4">Formations dans {domaine.name}</h1>
      <span className="bg-white h-0.5 w-96 mb-6 block"></span>

      {(!domaine.formations || domaine.formations.length === 0) ? (
        <p>Aucune formation disponible pour ce domaine.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domaine.formations.map((formation) => (
            <div
              key={formation.id}
              className="p-4 bg-white/10 rounded-lg shadow-lg cursor-pointer"
              onClick={() => handleCardClick(formation.id)}
            >
              <h2 className="text-xl font-semibold">{formation.title}</h2>
              <p className="text-sm text-gray-200">{formation.description}</p>
              <p className="text-sm">Professeur : {formation.prof_id.first_name} {formation.prof_id.last_name}, {formation.prof_id.fonction}</p>
              <p className="text-sm">Prix : {formation.parametre_formation_id.price} Ariary</p>
              <p className="text-sm">Durée : {formation.parametre_formation_id.duration}</p>
              {/* {formation.chapters.length > 0 && (
                <p className="text-sm">Nombre de chapitres : {formation.chapters.length}</p>
              )} */}
            </div>
          ))}
        </div>
      )}
      <div className="mt-6">
        <Button onClick={() => navigate(-1)}>Retour</Button>
      </div>
    </section>
  );
};

export default DomaineDetail;