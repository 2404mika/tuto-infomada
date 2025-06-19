import React from 'react';
import { Link } from '../common/Link'; 

const NavLink: React.FC<{ href: string; children: React.ReactNode; isExternal?: boolean }> = ({ href, children, isExternal }) => {
  if (isExternal || href.startsWith('#')) {
    return (
      <a
        href={href}
        className="text-neutral-800 hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md text-md font-light"
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      className="text-neutral-700 hover:text-primary transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium"
    >
      {children}
    </Link>
  );
};

const Header: React.FC = () => {
  return (
    <header className=' rounded-xl shadow-2xl backdrop-blur-lg bg-white/80 z-50 relative'>
      <div className="container mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              {/* <img className="h-8 w-auto" src="/logo-infomada.png" alt="INFOMADA Logo" /> */}
              <h1 className='italic text-2xl font-bold text-primary-admin-sidebar-bg'>INFOMADA</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-4">
            <NavLink href="#formations-disponibles">Accueil</NavLink>
            <NavLink href="#avantages">Formations</NavLink>
            <NavLink href="#about">A propos</NavLink>
            <Link
              href="/register"
              className="bg-blue-900 text-white hover:bg-blue-700 transition-colors duration-300 px-4 py-2 rounded-md text-sm font-medium shadow-sm"
            >
              S'inscrire
            </Link>
            <Link href="/login"
              className="bg-transparent text-blue-900 border border-blue-900 transition-colors duration-300 px-4 py-2 rounded-md text-sm font-light shadow-sm"
            >
              Se connecter
            </Link>
          </nav>
          <div className="md:hidden">
            {/* Bouton burger pour mobile - logique à ajouter */}
            <button className="text-neutral-600 hover:text-primary p-2 rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-3.75 5.25h16.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Menu mobile - à afficher/cacher avec JS */}
      {/* <div className="md:hidden"> ... </div> */}
    </header>
  );
};

export default Header;