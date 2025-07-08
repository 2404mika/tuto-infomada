import React from "react"
// import Button from "../../common/Button";
import { PlusIcon } from '@heroicons/react/24/solid';
import { Formation } from "../../types";
interface FormationsListColumnProps{
    formations: Formation[];
    nombreFormations?: number;
    onAddClick:() => void;
}

const FormationDisplayColumn: React.FC<FormationsListColumnProps> =({
    formations,
    nombreFormations = 0,
    onAddClick,
}) =>{
    
//   const [isLoading] = useState(false);
    return(
        <div className="flex flex-col bg-gray-100 p-5 rounded-xl shadow-lg border border-dashed h-full w-full">
            <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Liste des formations</h2>
            <div className="flex-grow bg-white p-3 rounded-lg border border-dashed overflow-scroll h-52">
                {formations.length > 0 ? (
                    <div className="sapce-y-2 opacity-80">
                        {formations.map((formation) =>
                             <div className="flex items-center p-3 my-1.5 rounded-lg border border-dashed bg-gray-50">
                             <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center  bg-gray-200 rounded-full mr-3 text-gray-400 text-sm font-semibold">{formation.id}</div>
                             <div className=" rounded w-3/4 text-slate-900 font-medium">{formation.title}</div>
                         </div>
                        )}
                       
                    </div>
                ): (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-400">Aucune formation à afficher</p>
                    </div>
                )}
            </div>
            </div>
            
            <div className="flex items-center justify-between w-full mt-10">
                <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-400 rounded text-gray-600 font-semibold text-sm">
                    {nombreFormations}
                </div>
                <button onClick={onAddClick} className="bg-blue-900 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-4 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <PlusIcon className="w-5 h-5 mr-1.5" />
                    Ajouter
                </button>
            </div>
        </div>
    );
};
export default FormationDisplayColumn;