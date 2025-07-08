import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

interface Student {
  id: number;
  full_name: string;
  lastname: string;
  telephone: string;
  email: string;
  formations: { id: number; title: string }[];
}

const ProfStudents: React.FC = () => {
  const { accessToken, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const profId = localStorage.getItem('profId');
      if (!profId) {
        setError('ID du professeur non trouvé. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }
      if (!accessToken) {
        setError('Token d’accès manquant. Veuillez vous reconnecter.');
        setLoading(false);
        logout();
        navigate('/LoginProf');
        return;
      }

      try {
        console.log('Récupération des étudiants pour profId:', profId);
        const response = await fetch(`http://localhost:8000/api/profStudents/${profId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError('Session expirée. Veuillez vous reconnecter.');
            logout();
            navigate('/LoginProf');
            return;
          }
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la récupération des étudiants');
        }

        const data = await response.json();
        console.log('Données reçues:', data);
        setStudents(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Erreur lors de la connexion au serveur');
        console.error('Erreur:', err);
        setLoading(false);
      }
    };

    fetchStudents();
  }, [accessToken, logout, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
          <p className="text-red-500 text-center mb-4">{error}</p>
          <Button onClick={() => navigate('/ProfLogin')} fullWidth>
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-mono text-gray-800 mb-6 text-center">
          Étudiants suivant vos formations
        </h2>
        {students.length === 0 ? (
          <p className="text-gray-600 text-center">Aucun étudiant inscrit à vos formations.</p>
        ) : (
          <div className="grid gap-4">
            {students.map((student) => (
              <div key={student.id} className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {student.full_name} {student.lastname}
                </h3>
                <p className="text-gray-600">Email: {student.email}</p>
                <p className="text-gray-600">Téléphone: {student.telephone}</p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Formations suivies :</h4>
                  <ul className="list-disc pl-5 text-gray-600">
                    {student.formations.map((formation) => (
                      <li key={formation.id}>{formation.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          onClick={() => {
            logout();
            navigate('/LoginProf');
          }}
        //   className="mt-6"
          fullWidth
        >
          Se déconnecter
        </Button>
      </div>
    </div>
  );
};

export default ProfStudents;