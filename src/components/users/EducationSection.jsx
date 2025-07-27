import { School, X } from "lucide-react";
import { useState } from "react";

const EducationSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [educations, setEducations] = useState(userData?.education || []);
  const [newEducation, setNewEducation] = useState({
    school: "",
    fieldOfStudy: "",
    startYear: "",
    endYear: "",
  });

  const handleAddEducation = () => {
    if (
      newEducation.school &&
      newEducation.fieldOfStudy &&
      newEducation.startYear
    ) {
      setEducations([...educations, newEducation]);
      setNewEducation({
        school: "",
        fieldOfStudy: "",
        startYear: "",
        endYear: "",
      });
    }
  };

  const handleDeleteEducation = (id) => {
    const updated = educations.filter((edu) => edu?._id !== id);
    setEducations(updated);
  };

  const handleSave = () => {
    onSave({ education: educations }); // clé `education` pour correspondre à `userData.education`
    setIsEditing(false);
  };

  return (
    <div className="bg-white text-black rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4 capitalize">Éducation</h2>

      {educations.map((education, index) => (
        <div
          key={education._id || index}
          className="mb-4 flex justify-between items-start"
        >
          <div className="flex items-start">
            <School size={20} className="mr-2 mt-1" />
            <div>
              <h3 className="font-semibold">{education.fieldOfStudy}</h3>
              <p className="text-gray-600">{education.school}</p>
              <p className="text-gray-500 text-sm">
                {education.startYear} - {education.endYear || "Présent"}
              </p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteEducation(index)}
              className="text-red-500 hover:text-red-700"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="École"
            value={newEducation.school}
            onChange={(e) =>
              setNewEducation({ ...newEducation, school: e.target.value })
            }
            className="w-full bg-gray-300 p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Domaine d'études"
            value={newEducation.fieldOfStudy}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                fieldOfStudy: e.target.value,
              })
            }
            className="w-full bg-gray-300 p-2 border rounded mb-2"
          />

          <input
            type="number"
            placeholder="Année de début"
            value={newEducation.startYear}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                startYear: Number(e.target.value),
              })
            }
            className="w-full bg-gray-300 p-2 border rounded mb-2"
          />

          <input
            type="number"
            placeholder="Année de fin"
            value={newEducation.endYear}
            onChange={(e) =>
              setNewEducation({
                ...newEducation,
                endYear: Number(e.target.value),
              })
            }
            className="w-full p-2 bg-gray-300 border rounded mb-2"
          />

          <button
            onClick={handleAddEducation}
            className="bg-[#0A66CC] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Ajouter une nouvelle éducation
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="mt-4 bg-[#0A66CC]  text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Enregistrer
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-[#0A66CC]  text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Ajouter une nouvelle éducation
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EducationSection;
