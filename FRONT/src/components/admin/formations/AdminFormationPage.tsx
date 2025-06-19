// src/pages/admin/AdminFormationsPage.tsx
import React, { useState, useEffect } from "react"; 
import FormationDisplayColumn from "./FormationDisplayColumn"; 
import DomainDisplayColumn from "./DomainDisplayColumn";  
import AddDomainModal from "../domaineModal/AddDomaineModal"; 
import { Domaine, Formation } from "../../types"; 
import AddFormationModal from "../formationModal/AddFormationModal";

const AdminFormationsPage: React.FC = () => {
    const [isAddDomainModalOpen, setIsAddDomainModalOpen] = useState(false);
    const [domaines, setDomaines] = useState<Domaine[]>([]);

    const [isAddFormationModalOpen,setisAddFormationModalOpen] = useState(false)
    const [formations, setFormations] = useState<Formation[]>([])
    

    const handleOpenAddDomainModal = () => {
        setIsAddDomainModalOpen(true);
    };

    const handleCloseAddDomainModal = () => {
        setIsAddDomainModalOpen(false);
    };

    useEffect(() => {
        const fetchInitialDomaines = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/domaine/"); // Assurez-vous que c'est le bon endpoint pour GET all
                if (!response.ok) {
                    throw new Error('Failed to fetch initial domaines');
                }
                const data: Domaine[] = await response.json();
                setDomaines(data.sort(
                    (a, b) => 
                        a.name.localeCompare(b.name))); 
                console.log("Ny domaine diaaaaa: ", data)
            } catch (error) {
                console.error("Erreur lors du chargement initial des domaines :", error);
            }
        };
        fetchInitialDomaines();
    }, []);


    // const handleDomainAdded = async (newDomain: Domaine) => {
    //     setDomaines(prevDomaines => [newDomain, ...prevDomaines].sort((a, b) => a.name.localeCompare(b.name)));
    //     try {
    //         const response = await fetch("http://localhost:8000/api/domaine/");
    //         const data: Domaine[] = await response.json();
    //         setDomaines(data);
    //     } catch (error) {
    //         console.error("Erreur lors du rechargement des domaines :", error);
    //     }
    //     console.log("Nouveau domaine ajouté et liste mise à jour:", newDomain);
    // };
    const handleDomainAdded = (newDomain: Domaine) => {
        // Met à jour l'état local avec le nouveau domaine reçu.
        // L'API a déjà confirmé la création.
        setDomaines(prevDomaines =>
            [newDomain, ...prevDomaines].sort((a, b) => a.name.localeCompare(b.name))
        );
        // La modale se ferme déjà via son propre `onClose` qui est appelé dans `AddDomainModal`
        // handleCloseAddDomainModal(); // Plus nécessaire ici si AddDomainModal gère sa fermeture
        console.log("Nouveau domaine ajouté et liste mise à jour (localement):", newDomain);
    };

    const handleOpenAddFormationModal = () => {
        setisAddFormationModalOpen(true);
    }
    const handleCloseAddFormationModal = () => {
        setisAddFormationModalOpen(false)
    }

    useEffect(() => {
        const fetchInitialFormations = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/formation/"); // Assurez-vous que c'est le bon endpoint pour GET all
                if (!response.ok) {
                    throw new Error('Failed to fetch initial formations');
                }
                const data: Formation[] = await response.json();
                setFormations(data.sort(
                    (a, b) => 
                        a.title.localeCompare(b.title)));
                console.log("Ny formation diaaaa: ",data) // Trier au cas où
            } catch (error) {
                console.error("Erreur lors du chargement initial des domaines :", error);
            }
        };
        fetchInitialFormations();
    }, []);
    const handleFormationAdded = (newFormation: Formation) => {
        setFormations(prevFormation => [newFormation, ...prevFormation].sort((a, b) => a.titre.localeCompare(b.titre)));
        console.log("Nouveau domaine ajouté et liste mise à jour:", newFormation);
    };
    return (
        <div className=" h-96 flex md:flex-row gap-8 p-2">
                <div className="w-full">
                    <FormationDisplayColumn
                    formations={formations}
                    onAddClick={handleOpenAddFormationModal}
                    nombreFormations={formations.length}/>
                </div>
                <div className="w-full">
                    <DomainDisplayColumn
                        domaines={domaines}
                        nombreDomaines={domaines.length}
                        onAddClick={handleOpenAddDomainModal} 
                    />
                </div>
                <AddDomainModal
                isOpen={isAddDomainModalOpen}
                onClose={handleCloseAddDomainModal}
                onDomainAdded={handleDomainAdded}/>
                < AddFormationModal
                isOpen={isAddFormationModalOpen}
                onClose={handleCloseAddFormationModal}
                onFormationAdded={handleFormationAdded}
                />
        </div>
    );
};

export default AdminFormationsPage;