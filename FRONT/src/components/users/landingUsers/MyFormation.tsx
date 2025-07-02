// src/components/MyFormation.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

interface Payment {
  id: number;
}

interface FormationByUser {
  id: number;
  user_id: string; // StringRelatedField
  formation_title:string;
  formation_id: number; // ID de la formation (nombre)
  student_name: string;
  created_at?: string; // Si présent
  status: string; // Statut
  payment?: Payment | null; // Payment associé (optionnel, peut être null)
}

interface ApiFormation {
  id: number;
  user_id: string;
  formation_id: number;
  student_name: string;
  created_at?: string;
  status: string;
  payment?: Payment | null; // Structure de payment dans la réponse
}

const MyFormation: React.FC = () => {
  const { user, loading, accessToken } = useAuth();
  const navigate = useNavigate();
  const [formations, setFormations] = useState<FormationByUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      if (loading || !accessToken || !user?.id) {
        console.log('Attente de chargement ou absence de token/user:', { loading, accessToken, user });
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/formationByUserList/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erreur lors de la requête: ${response.statusText}`);
        }

        const data = await response.json();
        setFormations(data);
        console.log('Données reçues:', data); // Pour débogage
      } catch (err) {
        setError('Erreur lors du chargement des formations.');
        console.error(err);
      }
    };

    fetchFormations();
  }, [loading, accessToken, user?.id]);

  const handleFormationClick = (formationId: number, status: string) => {
    if (status === 'Published') {
      navigate(`/user/myformationDetail/${formationId}`);
    } else {
      setError('Cette formation n\'est pas encore approuvée.');
    }
  };

  const handleDownloadReceipt = async (paymentId: number | null | undefined) => {
    if (!paymentId || paymentId === undefined) {
      setError('Aucun paiement associé ou token manquant.');
      return;
    }

    if (!accessToken) {
      setError('Token manquant.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/payment/receipt/${paymentId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du téléchargement du reçu.');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt_payment_${paymentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors du téléchargement du reçu.');
      console.error(err);
    }
  };

  return (
    <div className="mx-auto p-4 max-w-2xl overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">Mes Formations</h2>
      {formations.length === 0 ? (
        <p className="text-gray-500">Aucune formation soumise pour le moment.</p>
      ) : (
        <div className="space-y-4 w-full">
          {formations.map((formation) => (
            <div
              key={formation.id}
              className={`bg-white border flex justify-between border-gray-200 rounded-lg p-4 shadow-md ${formation.status === 'Published' ? 'hover:bg-gray-100 cursor-pointer' : 'cursor-not-allowed'}`}
              onClick={() => handleFormationClick(formation.formation_id, formation.status)}
            >
              <div className=''>
              <h3 className="text-lg font-semibold text-gray-900 mb-5">{formation.formation_title}</h3> {/* Conversion en string pour affichage */}
              {/* <p className="text-gray-700"><strong>Nom de l'étudiant :</strong> {formation.student_name}</p> */}
              {/* <p className="text-gray-700"><strong>Utilisateur :</strong> {formation.user_id}</p> */}
              {formation.created_at && (
                <p className="text-gray-700"><strong>Date :</strong> {formation.created_at}</p>
              )}
              <p className="text-green-700 font-semibold text-sm"><span className={formation.status === 'Not published' ?'text-red-500':'text-green-500'}>{formation.status === 'Not published' ? 'En attente...' : 'Actif'}</span>
                
              </p>
              </div>
              <div className='pt-10'>
              {formation.payment && 'id' in formation.payment && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleDownloadReceipt(formation.payment.id); }}
                  className="mt-2 h-5 flex justify-center items-center w-5 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <ArrowDown className='h-4'/>
                </button>
              )}
              </div>
              
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFormation;