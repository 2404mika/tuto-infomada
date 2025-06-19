import React from 'react';
import ModalBase from '../../common/Modal';
import ListProf from './ListProf';
import AddProf from './AddProf';
import { Prof } from '../../types';

interface ProfModalProps {
  isOpen: boolean;
  onClose: () => void;
  profs: Prof[];
  isLoadingProfs: boolean;
  profError: string | null;
  onProfAdded: (newProf: Prof) => void;
  fetchProfs?: () => Promise<void>;
}

const ProfModal: React.FC<ProfModalProps> = ({
  isOpen,
  onClose,
  profs,
  isLoadingProfs,
  profError,
  onProfAdded,
  fetchProfs,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Gestion des Professeurs">
      <div className="p-4 sm:p-6">
        {profError && !isLoadingProfs && profs.length === 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erreur:</strong>
            <span className="block sm:inline"> {profError}</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            <ListProf profs={profs} isLoading={isLoadingProfs && profs.length === 0} />
          </div>
          <div className="">
            <AddProf onProfAdded={onProfAdded} fetchProfs={fetchProfs} />
          </div>
        </div>
      </div>
    </ModalBase>
  );
};

export default ProfModal;