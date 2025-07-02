// src/components/users/landingUsers/UserLayout.tsx
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './UserSidebar';
import UserHeader from './UserHeader';

const UserLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Pour le mobile
  const location = useLocation();

  const getSectionTitle = (pathname: string): string => {
    if (pathname === '/user') return 'Acceuil';
    return 'user';
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen border">
      <Sidebar />
      <div className="flex w-full p-2 bg-primary-admin-sidebar-bg min-h-3.5">
        <div className="flex-1 flex flex-col bg-primary-admin-content-bg h-full overflow-hidden rounded-3xl">
          <UserHeader onToggleSidebar={toggleSidebar} />
          <main className="overflow-y-auto">
            <div className="flex-1 lg:p-3 overflow-y-auto bg-primary-admin-content-bg">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;