
import React from 'react';
import {BellIcon, Cog6ToothIcon,Bars3Icon} from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid'; // Pour l'avatar
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  onLogout: () => void; // Fonction de déconnexion
  // currentSectionTitle: string; // Titre de la section actuelle
  onToggleSidebar: () => void; // Pour ouvrir/fermer la sidebar sur mobile
  // onAddClick:() => void;
  onOpenProfModal: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout, onToggleSidebar,onOpenProfModal, }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminEmail'); // Supprime les données de session
    onLogout(); // Appelle la fonction onLogout passée en prop
    navigate('/'); // Redirige vers la page de connexion
  };
  return (
    <header className="bg-slate-100 sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left side: Burger menu (mobile) & Search bar */}
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            {onOpenProfModal && (
              <div className="ml-4 hidden md:block"> {/* Ajustez le placement/styling si nécessaire */}
                <button
                  onClick={onOpenProfModal}
                  className="bg-blue-200 hover:bg-blue-300 text-sm text-blue-900 font-semibold flex items-center px-4 py-2 rounded-lg shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Gérer les Profs {/* Ou "Ajouter Prof", selon ce qui est le plus pertinent */}
                </button>
              </div>
            )}
          </div>

          {/* Right side: Icons and User */}
          <div className="flex items-center space-x-4">
            {/* <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              <span className="sr-only">Settings</span>
              <Cog6ToothIcon className="h-6 w-6" />
            </button> */}

            <div className="relative">
              {/* Menu déroulant pour l'utilisateur - logique à ajouter */}
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <UserCircleIcon className="h-9 w-9 text-gray-400" /> {/* Ou une vraie image */}
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-700">MIKAIA David</div>
                  <div className="text-xs text-gray-500">Administrateur</div>
                </div>
              </button>
              {/* Dropdown menu ici si besoin */}
            </div>
             <button onClick={handleLogout} className="ml-2 text-sm text-red-700 hover:bg-red-200 p-3 bg-red-100 rounded-lg font-medium">Déconnexion</button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;