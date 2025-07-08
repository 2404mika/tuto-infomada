import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalBase from '../../common/Modal';
import Button from '../../common/Button';
import FormInput from '../../common/FormInput';
import { FaEdit, FaCheckCircle } from 'react-icons/fa';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';

interface Formation {
  id: number;
  title: string;
  description: string;
  formation_domaine: { id: number; name: string };
  prof_id: { id: number; first_name: string; last_name: string };
  parametre_formation_id: { price: number; duration: string };
  chapters: { id: number; chapter_name: string; description: string; chapter_number: number; videos: { id: number; file: string; name: string }[] }[];
  status: { value: number; name: string };
  inscrits: number; // Nouveau champ pour le nombre d'inscrits
}

const EditFormation: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [chapters, setChapters] = useState<Formation['chapters']>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/formation/', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Erreur lors de la récupération des formations');
        const data = await response.json();
        console.log('Formations reçues:', data); // Log pour débogage
        setFormations(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchFormations();
  }, []);

  useEffect(() => {
    if (selectedFormation) {
      setTitle(selectedFormation.title);
      setDescription(selectedFormation.description);
      setPrice(selectedFormation.parametre_formation_id.price.toString());
      setDuration(selectedFormation.parametre_formation_id.duration);
      setChapters(selectedFormation.chapters);
    } else {
      setTitle('');
      setDescription('');
      setPrice('');
      setDuration('');
      setChapters([]);
    }
  }, [selectedFormation]);

  const handlePublish = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/formation/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publish: true }),
      });
      if (!response.ok) throw new Error('Erreur lors de la publication');
      setFormations(formations.map((f) => (f.id === id ? { ...f, status: { value: 1, name: 'Published' } } : f)));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleUpdate = async (updatedFormation: Formation) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('parametre_formation_id[price]', price);
      formData.append('parametre_formation_id[duration]', duration);
      chapters.forEach((chapter, index) => {
        formData.append(`chapters_write[${index}][chapter_name]`, chapter.chapter_name);
        formData.append(`chapters_write[${index}][description]`, chapter.description);
        formData.append(`chapters_write[${index}][chapter_number]`, chapter.chapter_number.toString());
        chapter.videos.forEach((video, videoIndex) => {
          if (video.file) formData.append(`chapters_write[${index}][videos][${videoIndex}][file]`, video.file);
          formData.append(`chapters_write[${index}][videos][${videoIndex}][name]`, video.name);
        });
      });

      const response = await fetch(`http://localhost:8000/api/formation/${selectedFormation?.id}/`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      const data = await response.json();
      console.log('Formation mise à jour:', data);
      setFormations(formations.map((f) => (f.id === data.id ? data : f)));
      setSelectedFormation(null);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 ml-14 text-gray-900">Gestion des Formations</h2>
      <div className="flex flex-wrap gap-6 justify-center">
        {formations.map((formation) => (
          <div key={formation.id} className="bg-white rounded-3xl p-4 shadow-md w-64 hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-lg font-semibold text-blue-800">{formation.title}</h3>
            <p className="text-gray-600 text-sm mt-2 line-clamp-3">{formation.description}</p>
            <p className="text-gray-500 text-xs mt-2">Domaine: {formation.formation_domaine.name}</p>
            <p className="text-gray-500 text-xs">Professeur: {formation.prof_id.first_name} {formation.prof_id.last_name}</p>
            {formation.status?.value === 1 ? (
              <div className="mt-4 flex justify-between items-center">
                <p className="text-green-500 font-medium">Publiée</p>
                <p className="text-gray-500 text-xs text-center">Inscrits: {formation.inscrits}</p>
              </div>
            ) : (
              <div className="mt-10 flex justify-around">
                <button
                  onClick={() => {
                    console.log('Opening modal for formation:', formation.id);
                    setSelectedFormation(formation);
                  }}
                  className="hover:bg-blue-200 text-blue-800 border px-3 py-1 rounded-xl flex items-center"
                >
                  <FaEdit className="w-3 h-4 mr-1" /> Modifier
                </button>
                <button
                  onClick={() => handlePublish(formation.id)}
                  className="bg-blue-800 hover:bg-blue-200 hover:text-blue-800 text-white px-3 py-1 rounded-xl flex items-center"
                >
                  <FaCheckCircle className="w-3 h-4 mr-1" /> Publier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ModalBase
        isOpen={!!selectedFormation}
        onClose={() => {
          console.log('Closing modal');
          setSelectedFormation(null);
        }}
        title={`Modifier la formation: ${selectedFormation?.title || ''}`}
      >
        {selectedFormation && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdate({
                  ...selectedFormation,
                  title,
                  description,
                  parametre_formation_id: { price: parseInt(price), duration },
                  chapters,
                });
              }}
            >
              <FormInput
                label="Titre de la formation"
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <FormInput
                label="Description"
                type="textarea"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <FormInput
                label="Prix en Ariary (Ar)"
                type="number"
                name="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <FormInput
                label="Durée (jours heures:minutes:secondes)"
                type="text"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />

              {/* Gestion des chapitres */}
              {chapters.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="mb-6 p-4 border rounded relative">
                  <h4 className="text-md font-semibold mb-2">Chapitre {chapter.chapter_number}</h4>
                  <FormInput
                    label="Nom du chapitre"
                    type="text"
                    name={`chapterName-${chapterIndex}`}
                    value={chapter.chapter_name}
                    onChange={(e) => {
                      const newChapters = chapters.map((c, i) =>
                        i === chapterIndex ? { ...c, chapter_name: e.target.value } : c
                      );
                      setChapters(newChapters);
                    }}
                  />
                  <FormInput
                    label="Description du chapitre"
                    type="textarea"
                    name={`chapterDescription-${chapterIndex}`}
                    value={chapter.description}
                    onChange={(e) => {
                      const newChapters = chapters.map((c, i) =>
                        i === chapterIndex ? { ...c, description: e.target.value } : c
                      );
                      setChapters(newChapters);
                    }}
                  />
                  <FormInput
                    label="Numéro du chapitre"
                    type="number"
                    name={`chapterNumber-${chapterIndex}`}
                    value={chapter.chapter_number}
                    onChange={(e) => {
                      const newChapters = chapters.map((c, i) =>
                        i === chapterIndex ? { ...c, chapter_number: parseInt(e.target.value) || 1 } : c
                      );
                      setChapters(newChapters);
                    }}
                  />

                  {/* Gestion des vidéos */}
                  {chapter.videos.map((video, videoIndex) => (
                    <div key={video.id} className="mt-2">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files ? e.target.files[0] : null;
                          const newChapters = chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  videos: c.videos.map((v, j) =>
                                    j === videoIndex ? { ...v, file, name: file ? file.name : v.name } : v
                                  ),
                                }
                              : c
                          );
                          setChapters(newChapters);
                        }}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                      />
                      <input
                        type="text"
                        value={video.name}
                        onChange={(e) => {
                          const newChapters = chapters.map((c, i) =>
                            i === chapterIndex
                              ? {
                                  ...c,
                                  videos: c.videos.map((v, j) =>
                                    j === videoIndex ? { ...v, name: e.target.value } : v
                                  ),
                                }
                              : c
                          );
                          setChapters(newChapters);
                        }}
                        placeholder="Nom personnalisé"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newChapters = chapters.map((c, i) =>
                            i === chapterIndex
                              ? { ...c, videos: c.videos.filter((_, j) => j !== videoIndex) }
                              : c
                          );
                          setChapters(newChapters);
                        }}
                        className="mt-2 text-red-500"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newChapters = chapters.map((c, i) =>
                        i === chapterIndex
                          ? { ...c, videos: [...c.videos, { id: Date.now() + Math.random(), file: null, name: '' }] }
                          : c
                      );
                      setChapters(newChapters);
                    }}
                    className="mt-2 bg-blue-500 text-white px-2 py-1 rounded flex items-center"
                  >
                    <PlusIcon className="w-5 h-5 mr-2" /> Ajouter une vidéo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newChapters = chapters.filter((_, i) => i !== chapterIndex);
                      setChapters(newChapters);
                    }}
                    className="mt-2 text-red-500 absolute top-2 right-2"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setChapters([
                    ...chapters,
                    {
                      id: Date.now() + Math.random(),
                      chapter_name: '',
                      description: '',
                      chapter_number: chapters.length + 1,
                      videos: [{ id: Date.now() + Math.random(), file: null, name: '' }],
                    },
                  ]);
                }}
                className="mt-4 bg-blue-900 hover:bg-blue-700 text-white font-medium flex justify-center items-center px-4 py-2.5 rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="w-5 h-5 mr-1.5" /> Ajouter un chapitre
              </button>
              <div className="mt-6 flex justify-end gap-4">
                <Button
                  type="button"
                  onClick={() => setSelectedFormation(null)}
                >
                  Annuler
                </Button>
                <Button type="submit" isLoading={false}>
                  Valider
                </Button>
              </div>
            </form>
          </div>
        )}
      </ModalBase>
    </div>
  );
};

export default EditFormation;