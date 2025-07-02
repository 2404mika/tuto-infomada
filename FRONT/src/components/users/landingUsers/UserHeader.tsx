// src/components/users/landingUsers/UserHeader.tsx
import React from 'react';
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  onToggleSidebar: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Efface les tokens et l'utilisateur dans le contexte
    navigate('/login'); // Redirige vers la page de login
  };

  return (
    <header className="bg-admin-card-bg sticky top-0 z-20 shadow-sm">
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block w-96">
              {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div> */}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <UserCircleIcon className="h-9 w-9 text-gray-400" />
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-medium text-gray-700">
                    {user?.lastname || 'Utilisateur'}
                  </div>
                  <div className="text-xs text-gray-500">Etudiant</div>
                </div>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 text-sm text-red-700 hover:bg-red-200 p-3 bg-red-100 rounded-lg font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default UserHeader;