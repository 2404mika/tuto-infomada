import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import ProfModal from '../ProfModal/ProfModal';
import { Prof } from '../../types';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const [isProfModalOpen, setIsProfModalOpen] = useState(false);
  const [profs, setProfs] = useState<Prof[]>([]);
  const [isLoadingProfs, setIsLoadingProfs] = useState(false);
  const [profError, setProfError] = useState<string | null>(null);

  const handleOpenProfModal = useCallback(() => {
    setIsProfModalOpen(true);
  }, []);

  const handleCloseProfModal = useCallback(() => {
    setIsProfModalOpen(false);
  }, []);

  const fetchProfs = useCallback(async () => {
    setIsLoadingProfs(true);
    setProfError(null);
    try {
      const response = await fetch("http://localhost:8000/api/prof/");
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const data: Prof[] = await response.json();
      setProfs(
        data.sort(
          (a, b) =>
            (a.name || '').localeCompare(b.name || '') ||
            (a.lastname || '').localeCompare(b.lastname || '')
        )
      );
      console.log("Prof recue fona ehhhhh: ",data)
    } catch (err) {
      console.error("Erreur lors du chargement des professeurs:", err);
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue.";
      setProfError(`Impossible de charger les professeurs: ${errorMessage}`);
      setProfs([]);
    } finally {
      setIsLoadingProfs(false);
    }
  }, []);

  useEffect(() => {
    fetchProfs();
  }, [fetchProfs]);

  const handleProfAdded = useCallback((newProf: Prof) => {
    setProfs((prevProfs) => {
      const updatedProfs = [...prevProfs, newProf].sort((a, b) =>
        (a.name || '').localeCompare(b.name || '') || (a.lastname || '').localeCompare(b.lastname || '')
      );
      console.log('Nouveau professeur ajouté:', newProf);
      console.log('Liste des profs mise à jour:', updatedProfs);
      return updatedProfs;
    });
  }, []);

  const getSectionTitle = (pathname: string): string => {
    if (pathname === '/admin') return 'Dashboard';
    return 'admin';
  };

  const handleLogout = () => {
    console.log('Logout action');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="w-full h-full p-2 bg-primary-admin-sidebar-bg">
      <div className="flex-1 flex flex-col overflow-hidden h-full rounded-xl">
        <AdminHeader
          onLogout={handleLogout}
          onToggleSidebar={toggleSidebar}
          onOpenProfModal={handleOpenProfModal}
        />
        <main className="flex-1 lg:p-3 overflow-y-auto bg-primary-admin-content-bg">
          <div className="bg-admin-card-bg rounded-2xl shadow-main min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </main>
      </div>
      <ProfModal
        isOpen={isProfModalOpen}
        onClose={handleCloseProfModal}
        profs={profs}
        isLoadingProfs={isLoadingProfs}
        profError={profError}
        onProfAdded={handleProfAdded}
        fetchProfs={fetchProfs}
      />
      </div>
    </div>
  );
};

export default AdminLayout;