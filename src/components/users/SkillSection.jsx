import { X } from "lucide-react";
import { useState } from "react";

const SkillSection = ({ onSave, isOwnProfile, userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState( userData?.skills || []);
  const [newSkills, setNewSkills] = useState("");

  const handleAddSkill = () => {
    if (newSkills.trim() && !skills.includes(newSkills.trim())) {
      setSkills([...skills, newSkills.trim()]);
      setNewSkills("");
    }
  };

  const handleDeleteSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave({ skills });
  };
  return (
    <div className="bg-white text-black shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Compétence </h2>
      <div className="flex flex-wrap gap-2">
        {skills?.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-200 text-gray-700 font-bold rounded text-sm px-3 py-1 mb-2 flex items-center"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => handleDeleteSkill(skill)}
                className="ml-2 text-red-500"
              >
                <X size={16} />
              </button>
            )}
          </span>
        ))}
      </div>
      {isEditing && (
        <div className="mt-4 flex">
          <input
            type="text"
            value={newSkills}
            placeholder="Ajouter une nouvelle competence"
            onChange={(e) => setNewSkills(e.target.value)}
            className="flex-grow p-2 bg-gray-300 border rounded-l"
          />
          <button
            onClick={handleAddSkill}
            className="bg-[#0A66C2] text-white py-2 px-4 rounded-r hover:bg-blue-600 transition duration-300"
          >
            Ajouter une compétence
          </button>
        </div>
      )}
      {isOwnProfile && (
        <>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 mr-4 bg-[#0A66C2] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
            >
              Ajouter une compétence
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleSave}
              className="mt-4  text-blue-600 rounded hover:bg-blue-600 transition duration-300"
            >
              Enregistrer
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SkillSection;
