import React from 'react';
import { Prof } from '../../types';
import { UserCircleIcon, BriefcaseIcon, AtSymbolIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface ListProfProps {
  profs: Prof[];
  isLoading?: boolean;
}

const ListProf: React.FC<ListProfProps> = ({ profs, isLoading }) => {
  console.log('Profs reçus dans ListProf:', profs);
  if (isLoading) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste des Professeurs</h2>
        <p className="text-gray-500">Chargement des professeurs...</p>
      </div>
    );
  }

  return (
    <div className="p-2 border border-gray-200 rounded-lg shadow-sm h-full w-full overflow-hidden">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Liste des Professeurs ({profs.length})</h2>
      <div className="overflow-y-auto max-h-[400px]">
        {profs.length > 0 ? (
          <ul className="space-y-3">
            {profs.map((prof) => (
              <li
                key={prof.id}
                className="p-3 bg-gray-50 overflow-hidden rounded-md border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800">{prof.first_name} {prof.last_name}</p>
                    <p className="text-sm text-gray-600 flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-1 text-gray-500" />{prof.fonction}
                      
                    </p>
                  </div>
                </div>
                <div className="mt-2 pl-11 text-xs space-y-1">
                  <p className="text-gray-500 flex items-center">
                    <AtSymbolIcon className="h-3 w-3 mr-1.5 text-gray-400" /> {prof.email}
                  </p>
                  <p className="text-gray-500 flex items-center">
                    <PhoneIcon className="h-3 w-3 mr-1.5 text-gray-400" /> {prof.telephone}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full py-10">
            <p className="text-gray-500">Aucun Professeur à afficher pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(ListProf);