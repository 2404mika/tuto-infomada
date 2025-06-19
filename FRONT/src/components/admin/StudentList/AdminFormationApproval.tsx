// src/components/AdminFormationApproval.tsx
import React, { useState, useEffect } from 'react';

interface Payment {
  id: number;
  paid_amount: string;
  ref_transaction: string;
}

interface FormationByUser {
  id: number;
  user_id: string; // username
  formation_title: string; // title
  status: string;
  payment?: Payment;
  student_name: string;
}

const AdminFormationApproval: React.FC = () => {
  const [formations, setFormations] = useState<FormationByUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formationToDelete, setFormationToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/formation_by_user_get/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        setFormations(data);
      } catch (err) {
        setError(`Impossible de charger les formations: ${err.message}`);
        console.error(err);
      }
    };

    fetchFormations();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/formation_by_user_get/${id}/approve/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const updatedFormation = await response.json();
      setFormations(formations.map(f => f.id === id ? { ...f, status: 'Published' } : f));
    } catch (err) {
      setError(`Échec de l'approbation: ${err.message}`);
      console.error(err);
    }
  };

  const handleRefuse = (id: number) => {
    setFormationToDelete(id);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (formationToDelete) {
      try {
        const response = await fetch(`http://localhost:8000/api/formation_by_user_get/${formationToDelete}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setFormations(formations.filter(f => f.id !== formationToDelete));
          setIsModalOpen(false);
          setFormationToDelete(null);
        } else {
          throw new Error('Erreur lors de la suppression.');
        }
      } catch (err) {
        setError('Échec de la suppression.');
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setFormationToDelete(null);
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h2 className="text-2xl font-bold mb-4">Approbation des Formations</h2>
      {formations.length === 0 ? (
        <p className="text-gray-500">Aucune formation en attente.</p>
      ) : (
        <div className="space-y-4">
          {formations.map((formation) => {
            const statusValue = formation.status.toLowerCase();
            const isNotPublished = statusValue === 'not published';

            return (
              <div
                key={formation.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-md"
              >
                <p><strong>Nom de l'étudiant :</strong> {formation.student_name}</p>
                <p><strong>Titre de la formation :</strong> {formation.formation_title}</p>
                <p><strong>Statut :</strong> <span className={isNotPublished ? 'text-red-500' : 'text-green-500'}>
                  {isNotPublished ? 'Not Published' : 'Actif'}
                </span></p>
                <p><strong>Référence de transaction :</strong> {formation.payment?.ref_transaction || 'N/A'}</p>
                <p><strong>Montant payé :</strong> {formation.payment?.paid_amount || 'N/A'}</p>
                {isNotPublished && (
                  <div className="mt-4 space-x-2">
                    <button
                      onClick={() => handleApprove(formation.id)}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Approuver
                    </button>
                    <button
                      onClick={() => handleRefuse(formation.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Refuser
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="mb-4">Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.</p>
            <div className="space-x-2">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirmer
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFormationApproval;