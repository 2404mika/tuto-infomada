import { Link, useLocation } from 'react-router-dom';
import React from 'react';
import { AcademicCapIcon, ChartBarIcon } from '@heroicons/react/24/solid';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  currentPath: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, currentPath }) => {
  // Considérer le lien "Autres formations" comme actif pour /user/otherFormation et /user/formation/*
  const isActive =
    label === 'Autres formations'
      ? currentPath.startsWith('/user/otherFormation') || currentPath.startsWith('/user/formation/')
      : currentPath.startsWith(to);

  return (
    <li>
      <Link
        to={to}
        className={`flex items-center space-x-3 px-7 my-2 py-3 rounded-2xl transition-colors duration-200 
          ${isActive
            ? 'bg-primary-admin-sidebar-active-bg text-primary-admin-sidebar-active-text shadow-lg flex items-center'
            : 'text-primary-admin-sidebar-active-text hover:bg-white/10 hover:text-white'
          }`}
      >
        <Icon className="h-6 w-10" />
        <span className="font-bold">{label}</span>
      </Link>
    </li>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navLinks = [
    { to: '/user/Myformation', icon: ChartBarIcon, label: 'Mes formations' },
    { to: '/user/otherFormation', icon: AcademicCapIcon, label: 'Autres formations' },
  ];

  return (
    <aside className="w-72 bg-primary-admin-sidebar-bg text-white flex flex-col inset-y-0 left-0 z-30 shadow-xl transform 
      transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full rounded-r-2xl md:rounded-r-none">
      <div className="flex items-center justify-center h-20 shrink-0 px-4 italic">
        <Link to="/user">
          <span className="text-2xl font-bold text-white">INFOMADA</span>
        </Link>
      </div>
      <nav className="m-4 my-12">
        <ul>
          {navLinks.map((link) => (
            <NavItem key={link.label} {...link} currentPath={currentPath} />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;