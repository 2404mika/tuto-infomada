import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './UserSidebar';
import UserHeader from './UserHeader';
import FormationDetail from './FormationDetail';

// import AdminFormationsPage from '../formations/AdminFormationPage';
const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Pour le mobile
  const location = useLocation();


  const getSectionTitle = (pathname: string): string => {
    // if (pathname.startsWith('/admin/Formations')) return 'Formations';
    // if (pathname.startsWith('/admin/students')) return 'Étudiants';
    // if (pathname.startsWith('/admin/blog')) return 'Blog';
    // if (pathname.startsWith('/admin/settings')) return 'Settings';
    if (pathname === '/user') return 'Acceuil'; // La page d'index de l'admin
    return 'user';
  };

  const handleLogout = () => {
    console.log('Logout action');
    // Implémentez votre logique de déconnexion ici
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-full">
      <Sidebar /> 
      <div className="flex w-full p-2 bg-primary-admin-sidebar-bg min-h-3.5">
      <div className="flex-1 flex flex-col bg-primary-admin-content-bg rounded-3xl">
        <UserHeader
          onLogout={handleLogout}
          currentSectionTitle={getSectionTitle(location.pathname)}
          onToggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-3">
          <div className="bg-admin-card-bg p-1 rounded-2xl shadow-main min-h-[calc(100vh-5rem)]">
            <Outlet /> 
          </div>
        </main>
      </div>
      </div>
      
    </div>
    
  );
};

export default UserLayout;