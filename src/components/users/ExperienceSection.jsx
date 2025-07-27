import { Briefcase, X } from "lucide-react";
import { useState } from "react";
import { formatDate } from "../../actions/dateUtils";

const ExperienceSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData?.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  // Ajoute une expérience en vérifiant les champs obligatoires.
  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      const experienceToAdd = {
        ...newExperience,
        _id: Date.now().toString(), // Génère un identifiant unique temporaire.
      };

      const updatedExperiences = [...experiences, experienceToAdd];
      setExperiences(updatedExperiences);
      
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  };

  // Correction : il faut mettre à jour "experiences" et non newExperience.
  const handleDeleteExperience = (id) => {
    const updated = experiences.filter((exp) => exp._id !== id);
    setExperiences(updated);
  };

  // Met à jour le champ "currentlyWorking" et vide le champ "endDate" si coché.
  const handleCurrentlyWorkingChange = (e) => {
    const checked = e.target.checked;
    setNewExperience((prev) => ({
      ...prev,
      currentlyWorking: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };
  // Enregistre la liste des expériences et quitte le mode édition.
  const handleSave = () => {
    onSave({experience: experiences});
    console.log("experiences expériences expériences", experiences);
    setIsEditing(false);
  };
  return (
    <div className="bg-white shadow text-black rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">Expériences</h2>
      
      {experiences.map((expe) => (
        <div
          key={expe?._id}
          className="mb-4 flex justify-between items-start"
        >
          <div className="flex items-start">
            <Briefcase size={20} className="mr-2 mt-1" />
            <div>
              <h3 className="font-semibold">{expe?.title}</h3>
              <p className="text-gray-600">{expe?.company}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(expe?.startDate)} -
                {expe?.endDate ? formatDate(expe?.endDate) : "  Présent"}
              </p>
              <p className="text-gray-700">{expe?.description}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteExperience(expe?._id)}
              className="flex items-center gap-2 bg-gray-200 rounded-t-lg hover:bg-gray-600 py-2 px-4"
            >
              <X size={20} className="text-red-500 hover:text-red-600" />
              <span className="text-gray-400 text-xl">Supprimer</span>
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Titre"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 bg-gray-300 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Nom de l'entreprise"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 bg-gray-300 border rounded mb-2"
          />
          <label className="block text-sm text-gray-600 mb-1">
            Date de début
          </label>
          <input
            type="date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({ ...newExperience, startDate: e.target.value })
            }
            className="w-full p-2 bg-gray-300 border rounded mb-2"
          />

          <div className="flex items-center mb-2">
            <label
              className="flex items-center cursor-pointer relative"
              htmlFor="currentlyWorking"
            >
              <div className="relative">
                <input
                  id="currentlyWorking"
                  type="checkbox"
                  checked={newExperience.currentlyWorking}
                  onChange={handleCurrentlyWorkingChange}
                  className="appearance-none w-5 h-5 bg-gray-300 checked:bg-[#0A66C2] border border-gray-400 rounded-sm"
                />
                {newExperience.currentlyWorking && (
                  <span className="absolute inset-0 flex items-center justify-center text-white text-sm pointer-events-none">
                    ✓
                  </span>
                )}
              </div>
              <span className="ml-2 text-gray-600">
                Je travaille actuellement ici
              </span>
            </label>
          </div>

          {/* Le champ de date de fin est toujours visible si le mode non "En cours" */}
          {!newExperience.currentlyWorking && (
            <input
              type="date"
              placeholder="Date de fin"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({
                  ...newExperience,
                  endDate: e.target.value,
                })
              }
              className="w-full p-2 bg-gray-300 border rounded mb-2"
            />
          )}
          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 bg-gray-300 border rounded mb-2"
          />
          <button
            onClick={handleAddExperience}
            className="bg-[#0A66C2] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Ajouter une expérience
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-[#0A66C2] text-white mt-4 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Enregistrer
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#0A66C2] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Modifier
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
