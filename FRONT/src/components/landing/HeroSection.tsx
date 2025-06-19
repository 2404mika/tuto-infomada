import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section
      className="min-h-[85vh] mt-16 rounded-2xl flex items-center  shadow-2xl bg-gradient-to-br from-blue-700 to-violet-600 text-white" // pt-16 pour compenser le header fixe
      role="banner">
    
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
        <h1 className="text-4xl text-slate-100 sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Boostez vos <span className="text-slate-200">compétences</span> avec INFOMADA
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-100 mb-10 font-light">
          Formation en ligne interactive, flexible et certifiante pour atteindre vos objectifs professionnels.
        </p>
        <a
          href="#inscription"
          className="bg-blue-900 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-700
          transition-colors duration-300 transform hover:scale-105"
          role="button"
        >
          Je m'inscris maintenant
        </a>
      </div>
    </section>
  );
};

export default HeroSection;