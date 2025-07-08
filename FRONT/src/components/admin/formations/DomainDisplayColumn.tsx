// src/components/admin/domaines/DomainDisplayColumn.tsx
import React from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';

interface DomainDisplayColumnProps {
    domaines: Domaine[];
    nombreDomaines?: number; 
    onAddClick: () => void; 
}
interface Domaine {
    id: number;
    name: string;
}


const DomainDisplayColumn: React.FC<DomainDisplayColumnProps> = ({
    domaines,
    // nombreDomaines = domaines.length,
    onAddClick}) => {
    // const showPlaceholder = true;
    
    
    return (
        <div className="flex flex-col bg-gray-100 p-5 rounded-xl shadow-lg h-full w-full border border-dashed"> 
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Domaines</h2>
                <div className="flex-grow bg-white p-3 rounded-lg border border-dashed overflow-y-auto h-52 min-h-[200px]">
                    {domaines.length>0 ? (
                        <div className="space-y-2 opacity-80">
                            {domaines.map((domaine) =>
                                <div key={domaine.id} className="flex items-center p-3 my-1.5 rounded-lg border border-dashed border-gray-300 bg-gray-50">
                                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full mr-3 bg-gray-200 text-gray-400 text-sm font-semibold">{domaine.id}</div>
                                    <div className="rounded w-3/4 font-medium text-slate-900">{domaine.name}</div>
                                </div>
                            )}
                            
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-400">Aucun domaine à afficher</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between w-full mt-10">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-400 rounded text-gray-600 font-semibold text-sm">
                    {domaines.length}
                </div>
                <button
                    onClick={onAddClick} 
                    className="bg-blue-900 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-4 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <PlusIcon className="w-5 h-5 mr-1.5" />
                    Ajouter
                </button>
            </div>
        </div>
    );
};
export default DomainDisplayColumn;