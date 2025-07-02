// src/components/AdminDashboard.tsx
import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard: React.FC = () => {
  const totalStudents = 20;
  const enrolledStudents = 9;
  const totalFormations = 9;
  const totalDomains = 3;

  const chartData = {
    labels: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi','dimache'],
    datasets: [
      {
        label: 'Inscriptions',
        data: [12, 19, 3, 18, 15, 40,9],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Inscriptions par Jours (2025)' },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Tableau de Bord</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className=" p-6 rounded-3xl bg-gradient-to-br from-blue-200 to-blue-400 shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-blue-800">Étudiants Inscrits</h3>
          <p className="text-3xl font-bold text-gray-700 mt-2">{totalStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-green-200 to-green-400 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-green-800">Étudiants Enrôlés</h3>
          <p className="text-3xl font-bold text-gray-700 mt-2">{enrolledStudents}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-200 to-purple-400 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-purple-600">Formations Totales</h3>
          <p className="text-3xl font-bold text-gray-700 mt-2">{totalFormations}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 p-6 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-yellow-600">Domaines Totales</h3>
          <p className="text-3xl font-bold text-gray-700 mt-2">{totalDomains}</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Statistiques des Inscriptions</h3>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default AdminDashboard;