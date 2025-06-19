// import { useState, useEffect } from "react";
// import FormInput from "../../common/FormInput";
// import ModalBase from "../../common/Modal";
// import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
// import Button from "../../common/Button";

// // Définir les interfaces manquantes
// interface Domaine {
//   id: number;
//   name: string;
//   status: string;
//   image?: string;
// }

// interface Prof {
//   id: number;
//   first_name: string;
//   last_name: string;
// }

// interface Chapter {
//   chapter_name: string;
//   description: string;
//   chapter_number: number;
//   videos: { file: File | null; name: string }[];
// }

// interface Formation {
//   id: number;
//   title: string;
//   description: string;
//   formation_domaine: Domaine;
//   prof_id: Prof;
// }


// interface AddFormationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onFormationAdded: (newFormation: Formation) => void;
// }

// const AddFormationModal: React.FC<AddFormationModalProps> = ({ isOpen, onClose, onFormationAdded }) => {
//   const [formationDomaineInput, setFormationDomaineInput] = useState('');
//   const [formationTitreInput, setFormationTitreInput] = useState('');
//   const [formationDescriptionInput, setFormationDescriptionInput] = useState('');
//   const [formationPriceInput, setFormationPriceInput] = useState('');
//   const [formationDurationInput, setFormationDurationInput] = useState('30 00:00:00');
//   const [formationProfInput, setFormationProfInput] = useState('');
//   const [chapters, setChapters] = useState<Chapter[]>([{ chapter_name: '', description: '', chapter_number: 1, videos: [{ file: null, name: '' }] }]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [domains, setDomains] = useState<Domaine[]>([]);
//   const [profs, setProfs] = useState<Prof[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const domainsResponse = await fetch('http://localhost:8000/api/domaine/', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (domainsResponse.ok) {
//           const domainsData = await domainsResponse.json();
//           setDomains(domainsData);
//         } else {
//           throw new Error('Erreur lors de la récupération des domaines');
//         }

//         const profsResponse = await fetch('http://localhost:8000/api/prof/', {
//           method: 'GET',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (profsResponse.ok) {
//           const profsData = await profsResponse.json();
//           setProfs(profsData);
//         } else {
//           throw new Error('Erreur lors de la récupération des professeurs');
//         }
//       } catch (err) {
//         console.error(err);
//         setError('Erreur lors du chargement des données');
//       }
//     };

//     if (isOpen) {
//       fetchData();
//       setFormationDomaineInput('');
//       setFormationTitreInput('');
//       setFormationDescriptionInput('');
//       setFormationPriceInput('');
//       setFormationDurationInput('30 00:00:00');
//       setFormationProfInput('');
//       setChapters([{ chapter_name: '', description: '', chapter_number: 1, videos: [{ file: null, name: '' }] }]);
//       setError(null);
//     }
//   }, [isOpen]);

//   const validateForm = () => {
//     if (
//       !formationDomaineInput.trim() ||
//       !formationTitreInput.trim() ||
//       !formationDescriptionInput.trim() ||
//       !formationPriceInput.trim() ||
//       !formationDurationInput.trim() ||
//       !formationProfInput.trim()
//     ) {
//       setError("Tous les champs principaux sont requis");
//       return false;
//     }
//     if (chapters.some(chapter => !chapter.chapter_name.trim() || !chapter.description.trim() || !chapter.chapter_number)) {
//       setError("Les noms, descriptions et numéros des chapitres sont requis");
//       return false;
//     }
//     setError(null);
//     return true;
//   };

//   const addChapter = () => {
//     setChapters([...chapters, { chapter_name: '', description: '', chapter_number: chapters.length + 1, videos: [{ file: null, name: '' }] }]);
//   };

//   const removeChapter = (index: number) => {
//     setChapters(chapters.filter((_, i) => i !== index));
//   };

//   const addVideo = (chapterIndex: number) => {
//     const newChapters = [...chapters];
//     newChapters[chapterIndex].videos.push({ file: null, name: '' });
//     setChapters(newChapters);
//   };

//   const removeVideo = (chapterIndex: number, videoIndex: number) => {
//     const newChapters = [...chapters];
//     newChapters[chapterIndex].videos = newChapters[chapterIndex].videos.filter((_, i) => i !== videoIndex);
//     setChapters(newChapters);
//   };


// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   // La validation du formulaire (vous pouvez garder votre logique originale)
//   if (!validateForm()) {
//       return;
//   }

//   setIsLoading(true);
//   setError(null);

//   const formData = new FormData();

//   // 1. Ajout des données principales de la formation
//   formData.append('title', formationTitreInput);
//   formData.append('description', formationDescriptionInput);
//   formData.append('parametre_formation_id[price]', formationPriceInput);
//   formData.append('parametre_formation_id[duration]', formationDurationInput); // Correction de la variable
//   formData.append('formation_domaine', formationDomaineInput);
//   formData.append('prof_id', formationProfInput);

//   // 2. Traitement des chapitres et de leurs vidéos
//   chapters.forEach((chapter, chapterIndex) => {
//       // Ajout des données textuelles du chapitre
//       formData.append(`chapters[${chapterIndex}][chapter_name]`, chapter.chapter_name);
//       formData.append(`chapters[${chapterIndex}][description]`, chapter.description);
//       formData.append(`chapters[${chapterIndex}][chapter_number]`, chapter.chapter_number.toString());

//       // On ne traite que les vidéos qui ont un fichier sélectionné.
//       // C'est la seule information pertinente pour le backend.
//       const videosToUpload = chapter.videos.filter(video => video.file !== null);

//       // On boucle sur cette liste filtrée pour ajouter les fichiers au FormData.
//       // Si la liste est vide, cette boucle ne s'exécutera pas, et c'est le comportement souhaité.
//       videosToUpload.forEach((video, videoIndex) => {
//           // On peut utiliser "!" (non-null assertion) car on a déjà filtré les `null`.
//           const file = video.file!; 
          
//           // C'est la structure de clé qui résout l'erreur de l'API.
//           // Elle indique : "Pour le chapitre N, dans sa liste de vidéos, à l'index M, voici le champ 'file' et le champ 'name'".
//           formData.append(`chapters[${chapterIndex}][videos][${videoIndex}][file]`, file);
//           formData.append(`chapters[${chapterIndex}][videos][${videoIndex}][name]`, video.name || file.name);
//       });
//   });

//   // Pour le débogage : affiche ce qui sera réellement envoyé
//   console.log("------ Contenu final du FormData qui sera envoyé ------");
//   for (const pair of formData.entries()) {
//       console.log(`${pair[0]}:`, pair[1]);
//   }

//   // 3. Envoi de la requête
//   try {
//       const response = await fetch('http://localhost:8000/api/formation/', {
//           method: 'POST',
//           body: formData, // Le navigateur gère le Content-Type pour FormData
          
//       });

//       const data = await response.json();

//       if (response.ok) {
//           alert("Formation ajoutée avec succès !");
//           onFormationAdded(data);
//           onClose();
//       } else {
//           // Affiche l'erreur exacte du backend pour faciliter le débogage
//           console.log("Erreur retournée par l'API :", data);
//           setError(`Erreur lors de l'ajout : ${JSON.stringify(data)}`);
//       }
//   } catch (err) {
//       console.log("Erreur réseau ou de script :", err);
//       setError('Une erreur réseau est survenue. Vérifiez votre connexion et la console.');
//   } finally {
//       setIsLoading(false);
//   }
// };

//   return (
//     <ModalBase isOpen={isOpen} onClose={onClose} title="Ajouter une nouvelle formation">
//       <div className="bg-white rounded-xl shadow-md p-8">
//         <form onSubmit={handleSubmit}>
//           {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Sélectionner un domaine</label>
//             <select
//               value={formationDomaineInput}
//               onChange={(e) => setFormationDomaineInput(e.target.value)}
//               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//             >
//               <option value="">Choisir un domaine</option>
//               {domains.map((domain) => (
//                 <option key={domain.id} value={domain.id}>
//                   {domain.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <FormInput
//             label="Titre de la formation"
//             type="text"
//             name="titre"
//             value={formationTitreInput}
//             onChange={(e) => setFormationTitreInput(e.target.value)}
//           />
//           <FormInput
//             label="Description"
//             type="textarea"
//             name="description"
//             placeholder="Votre description..."
//             value={formationDescriptionInput}
//             onChange={(e) => setFormationDescriptionInput(e.target.value)}
//           />
//           <label className="block text-sm font-medium text-gray-700 mt-2">Sélectionner un professeur</label>
//           <select
//             value={formationProfInput}
//             onChange={(e) => setFormationProfInput(e.target.value)}
//             className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
//           >
//             <option value="">Choisir un professeur</option>
//             {profs.map((prof) => (
//               <option key={prof.id} value={prof.id}>
//                 {prof.first_name} {prof.last_name}
//               </option>
//             ))}
//           </select>
//           <FormInput
//             label="Prix en Ariary (Ar)"
//             type="number"
//             name="prix"
//             value={formationPriceInput}
//             onChange={(e) => setFormationPriceInput(e.target.value)}
//           />
//           <FormInput
//             label="Durée (jours heures:minutes:secondes)"
//             type="text"
//             name="duration"
//             placeholder="ex: 30 00:00:00"
//             value={formationDurationInput}
//             onChange={(e) => setFormationDurationInput(e.target.value)}
//           />
//           <div className="relative mt-4">
//             <button
//               type="button"
//               className="bg-blue-900 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-4 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 absolute top-4 right-4 z-10"
//               onClick={addChapter}
//             >
//               <PlusIcon className="w-5 h-5 mr-1.5" />
//               Ajouter un chapitre
//             </button>
//             <div
//               className="mt-4 max-h-96 overflow-y-scroll border border-gray-300 rounded p-4"
//               style={{ minHeight: '200px' }}
//             >
//               {chapters.map((chapter, index) => (
//                 <div key={index} className="mb-6 p-4 border rounded relative">
//                   <h3 className="text-lg font-semibold mb-2">Chapitre {index + 1}</h3>
//                   <FormInput
//                     label="Nom du chapitre"
//                     type="text"
//                     name={`chapterName-${index}`}
//                     value={chapter.chapter_name}
//                     onChange={(e) => {
//                       const newChapters = [...chapters];
//                       newChapters[index].chapter_name = e.target.value;
//                       setChapters(newChapters);
//                     }}
//                   />
//                   <FormInput
//                     label="Numéro du chapitre"
//                     type="number"
//                     name={`chapterNumber-${index}`}
//                     value={chapter.chapter_number}
//                     onChange={(e) => {
//                       const newChapters = [...chapters];
//                       newChapters[index].chapter_number = parseInt(e.target.value) || 1;
//                       setChapters(newChapters);
//                     }}
//                   />
//                   <label className="block text-sm font-medium text-gray-700 mt-2">Importer les vidéos</label>
//                   {chapter.videos.map((video, videoIndex) => (
//                     <div key={videoIndex} className="mt-2">
//                       <input
//                         type="file"
//                         accept="video/*"
//                         onChange={(e) => {
//                           const file = e.target.files ? e.target.files[0] : null;
//                           const newChapters = [...chapters];
//                           newChapters[index].videos[videoIndex].file = file;
//                           newChapters[index].videos[videoIndex].name = file ? file.name : '';
//                           setChapters(newChapters);
//                         }}
//                         className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                       />
//                       <input
//                         type="text"
//                         value={video.name}
//                         onChange={(e) => {
//                           const newChapters = [...chapters];
//                           newChapters[index].videos[videoIndex].name = e.target.value;
//                           setChapters(newChapters);
//                         }}
//                         placeholder="Nom personnalisé"
//                         className="mt-1 block w-full border border-gray-300 rounded-md p-2"
//                       />
//                       {chapter.videos.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeVideo(index, videoIndex)}
//                           className="mt-2 text-red-500"
//                         >
//                           <TrashIcon className="w-5 h-5" />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                   <button
//                     type="button"
//                     onClick={() => addVideo(index)}
//                     className="mt-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center"
//                   >
//                     <PlusIcon className="w-5 h-5 mr-2" /> Ajouter une vidéo
//                   </button>
//                   <FormInput
//                     label="Description du chapitre"
//                     type="textarea"
//                     name={`chapterDescription-${index}`}
//                     value={chapter.description}
//                     onChange={(e) => {
//                       const newChapters = [...chapters];
//                       newChapters[index].description = e.target.value;
//                       setChapters(newChapters);
//                     }}
//                   />
//                   {chapters.length > 1 && (
//                     <button
//                       type="button"
//                       onClick={() => removeChapter(index)}
//                       className="mt-2 text-red-500 absolute top-2 right-2"
//                     >
//                       <TrashIcon className="w-5 h-5" />
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//           <Button type="submit" isLoading={isLoading} fullWidth>
//             {isLoading ? 'Ajout...' : 'Ajouter'}
//           </Button>
//         </form>
//       </div>
//     </ModalBase>
//   );
// };

// export default AddFormationModal;

import { useState, useEffect } from "react";
import FormInput from "../../common/FormInput";
import ModalBase from "../../common/Modal";
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from "../../common/Button";

// Définir les interfaces
interface Domaine {
  id: number;
  name: string;
  status: string;
  image?: string;
}

interface Prof {
  id: number;
  first_name: string;
  last_name: string;
}

interface Chapter {
  chapter_name: string;
  description: string;
  chapter_number: number;
  videos: { file: File | null; name: string }[];
}

interface Formation {
  id: number;
  title: string;
  description: string;
  formation_domaine: Domaine;
  prof_id: Prof;
}

interface AddFormationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormationAdded: (newFormation: Formation) => void;
}

const AddFormationModal: React.FC<AddFormationModalProps> = ({ isOpen, onClose, onFormationAdded }) => {
  const [formationDomaineInput, setFormationDomaineInput] = useState('');
  const [formationTitreInput, setFormationTitreInput] = useState('');
  const [formationDescriptionInput, setFormationDescriptionInput] = useState('');
  const [formationPriceInput, setFormationPriceInput] = useState('');
  const [formationDurationInput, setFormationDurationInput] = useState('30 00:00:00');
  const [formationProfInput, setFormationProfInput] = useState('');
  const [chapters, setChapters] = useState<Chapter[]>([{ chapter_name: '', description: '', chapter_number: 1, videos: [{ file: null, name: '' }] }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<Domaine[]>([]);
  const [profs, setProfs] = useState<Prof[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const domainsResponse = await fetch('http://localhost:8000/api/domaine/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (domainsResponse.ok) {
          const domainsData = await domainsResponse.json();
          setDomains(domainsData);
        } else {
          throw new Error('Erreur lors de la récupération des domaines');
        }

        const profsResponse = await fetch('http://localhost:8000/api/prof/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (profsResponse.ok) {
          const profsData = await profsResponse.json();
          setProfs(profsData);
        } else {
          throw new Error('Erreur lors de la récupération des professeurs');
        }
      } catch (err) {
        console.error(err);
        setError('Erreur lors du chargement des données');
      }
    };

    if (isOpen) {
      fetchData();
      setFormationDomaineInput('');
      setFormationTitreInput('');
      setFormationDescriptionInput('');
      setFormationPriceInput('');
      setFormationDurationInput('30 00:00:00');
      setFormationProfInput('');
      setChapters([{ chapter_name: '', description: '', chapter_number: 1, videos: [{ file: null, name: '' }] }]);
      setError(null);
    }
  }, [isOpen]);

  const validateForm = () => {
    if (
      !formationDomaineInput.trim() ||
      !formationTitreInput.trim() ||
      !formationDescriptionInput.trim() ||
      !formationPriceInput.trim() ||
      !formationDurationInput.trim() ||
      !formationProfInput.trim()
    ) {
      setError("Tous les champs principaux sont requis, y compris le domaine et le professeur");
      return false;
    }
    if (!profs.some(prof => prof.id.toString() === formationProfInput)) {
      setError("Veuillez sélectionner un professeur valide");
      return false;
    }
    if (!domains.some(domain => domain.id.toString() === formationDomaineInput)) {
      setError("Veuillez sélectionner un domaine valide");
      return false;
    }
    if (chapters.some(chapter => !chapter.chapter_name.trim() || !chapter.description.trim() || !chapter.chapter_number)) {
      setError("Les noms, descriptions et numéros des chapitres sont requis");
      return false;
    }
    setError(null);
    return true;
  };

  const addChapter = () => {
    setChapters([...chapters, { chapter_name: '', description: '', chapter_number: chapters.length + 1, videos: [{ file: null, name: '' }] }]);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  const addVideo = (chapterIndex: number) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].videos.push({ file: null, name: '' });
    setChapters(newChapters);
  };

  const removeVideo = (chapterIndex: number, videoIndex: number) => {
    const newChapters = [...chapters];
    newChapters[chapterIndex].videos = newChapters[chapterIndex].videos.filter((_, i) => i !== videoIndex);
    setChapters(newChapters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();

    // Ajout des données principales de la formation
    formData.append('title', formationTitreInput);
    formData.append('description', formationDescriptionInput);
    formData.append('parametre_formation_id[price]', formationPriceInput);
    formData.append('parametre_formation_id[duration]', formationDurationInput);
    formData.append('formation_domaine_write', formationDomaineInput);
    formData.append('prof_id_write', formationProfInput);

    // Traitement des chapitres et de leurs vidéos
    chapters.forEach((chapter, chapterIndex) => {
      formData.append(`chapters_write[${chapterIndex}][chapter_name]`, chapter.chapter_name);
      formData.append(`chapters_write[${chapterIndex}][description]`, chapter.description);
      formData.append(`chapters_write[${chapterIndex}][chapter_number]`, chapter.chapter_number.toString());

      const videosToUpload = chapter.videos.filter(video => video.file !== null);
      videosToUpload.forEach((video, videoIndex) => {
        const file = video.file!;
        formData.append(`chapters_write[${chapterIndex}][videos][${videoIndex}][file]`, file);
        formData.append(`chapters_write[${chapterIndex}][videos][${videoIndex}][name]`, video.name || file.name);
      });
    });

    // Débogage
    console.log("------ Contenu final du FormData qui sera envoyé ------");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const response = await fetch('http://localhost:8000/api/formation/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert("Formation ajoutée avec succès !");
        onFormationAdded(data);
        onClose();
      } else {
        const errorMsg = data.formation_domaine_id?.[0] || data.prof_id_id?.[0] || JSON.stringify(data);
        console.log("Erreur retournée par l'API :", data);
        setError(`Erreur lors de l'ajout : ${errorMsg}`);
      }
    } catch (err) {
      console.log("Erreur réseau ou de script :", err);
      setError('Une erreur réseau est survenue. Vérifiez votre connexion et la console.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalBase isOpen={isOpen} onClose={onClose} title="Ajouter une nouvelle formation">
      <div className="bg-white rounded-xl shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div>
            <label className="block text-sm font-medium text-gray-700">Sélectionner un domaine</label>
            <select
              value={formationDomaineInput}
              onChange={(e) => setFormationDomaineInput(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Choisir un domaine</option>
              {domains.map((domain) => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))}
            </select>
          </div>
          <FormInput
            label="Titre de la formation"
            type="text"
            name="titre"
            value={formationTitreInput}
            onChange={(e) => setFormationTitreInput(e.target.value)}
          />
          <FormInput
            label="Description"
            type="textarea"
            name="description"
            placeholder="Votre description..."
            value={formationDescriptionInput}
            onChange={(e) => setFormationDescriptionInput(e.target.value)}
          />
          <label className="block text-sm font-medium text-gray-700 mt-2">Sélectionner un professeur</label>
          <select
            value={formationProfInput}
            onChange={(e) => setFormationProfInput(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            <option value="">Choisir un professeur</option>
            {profs.map((prof) => (
              <option key={prof.id} value={prof.id}>
                {prof.first_name} {prof.last_name}
              </option>
            ))}
          </select>
          <FormInput
            label="Prix en Ariary (Ar)"
            type="number"
            name="prix"
            value={formationPriceInput}
            onChange={(e) => setFormationPriceInput(e.target.value)}
          />
          <FormInput
            label="Durée (jours heures:minutes:secondes)"
            type="text"
            name="duration"
            placeholder="ex: 30 00:00:00"
            value={formationDurationInput}
            onChange={(e) => setFormationDurationInput(e.target.value)}
          />
          <div className="relative mt-4">
            <button
              type="button"
              className="bg-blue-900 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-4 py-2.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 absolute top-4 right-4 z-10"
              onClick={addChapter}
            >
              <PlusIcon className="w-5 h-5 mr-1.5" />
              Ajouter un chapitre
            </button>
            <div
              className="mt-4 max-h-96 overflow-y-scroll border border-gray-300 rounded p-4"
              style={{ minHeight: '200px' }}
            >
              {chapters.map((chapter, index) => (
                <div key={index} className="mb-6 p-4 border rounded relative">
                  <h3 className="text-lg font-semibold mb-2">Chapitre {index + 1}</h3>
                  <FormInput
                    label="Nom du chapitre"
                    type="text"
                    name={`chapterName-${index}`}
                    value={chapter.chapter_name}
                    onChange={(e) => {
                      const newChapters = [...chapters];
                      newChapters[index].chapter_name = e.target.value;
                      setChapters(newChapters);
                    }}
                  />
                  <FormInput
                    label="Numéro du chapitre"
                    type="number"
                    name={`chapterNumber-${index}`}
                    value={chapter.chapter_number}
                    onChange={(e) => {
                      const newChapters = [...chapters];
                      newChapters[index].chapter_number = parseInt(e.target.value) || 1;
                      setChapters(newChapters);
                    }}
                  />
                  <label className="block text-sm font-medium text-gray-700 mt-2">Importer les vidéos</label>
                  {chapter.videos.map((video, videoIndex) => (
                    <div key={videoIndex} className="mt-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          const newChapters = [...chapters];
                          newChapters[index].videos[videoIndex].file = file;
                          newChapters[index].videos[videoIndex].name = file ? file.name : '';
                          setChapters(newChapters);
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <input
                        type="text"
                        value={video.name}
                        onChange={(e) => {
                          const newChapters = [...chapters];
                          newChapters[index].videos[videoIndex].name = e.target.value;
                          setChapters(newChapters);
                        }}
                        placeholder="Nom personnalisé"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                      {chapter.videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVideo(index, videoIndex)}
                          className="mt-2 text-red-500"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addVideo(index)}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" /> Ajouter une vidéo
                  </button>
                  <FormInput
                    label="Description du chapitre"
                    type="textarea"
                    name={`chapterDescription-${index}`}
                    value={chapter.description}
                    onChange={(e) => {
                      const newChapters = [...chapters];
                      newChapters[index].description = e.target.value;
                      setChapters(newChapters);
                    }}
                  />
                  {chapters.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChapter(index)}
                      className="mt-2 text-red-500 absolute top-2 right-2"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Button type="submit" isLoading={isLoading} fullWidth>
            {isLoading ? 'Ajout...' : 'Ajouter'}
          </Button>
        </form>
      </div>
    </ModalBase>
  );
};

export default AddFormationModal;