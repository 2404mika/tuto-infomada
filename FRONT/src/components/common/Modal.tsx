import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Button from "./Button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode;
    size?:'sm' | 'md' | 'lg'|'xl';
}

const ModalBase: React.FC<ModalProps> = ({
    isOpen,onClose,title,children,footerContent, size = 'md'
}) => {
    if (!isOpen) return null;
    // let modalWidthClass = 'max-w-md';
    // if (size === 'sm') modalWidthClass = 'max-w-sm';
    // if (size === 'lg') modalWidthClass = 'max-w-lg';
    // if (size === 'xl') modalWidthClass = 'max-w-xl';

    return (
        <div className="fixed inset-0 bg-black w-full bg-opacity-50 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
          <div
            className={`bg-white p-6 rounded-lg shadow-xl transform transition-all w-[1000px] duration-300 ease-in-out scale-100 flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}>
          
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <Button onClick={onClose} variant="icon">
                <XMarkIcon className="w-6 h-6" />
              </Button>
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
                {children}
            </div>
    
            {footerContent && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                {footerContent}
              </div>
            )}
          </div>
        </div>
      );
}
export default ModalBase;