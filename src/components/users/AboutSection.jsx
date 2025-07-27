import React, { useState } from "react";

const AboutSection = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData?.about || "");

  const handleSave = () => {
    onSave({ about });
    setIsEditing(false);
  };

  return (
    <div className="bg-white text-black p-6 shadow rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">À propos</h2>

      {isEditing ? (
        <>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="À propos de vous"
            className="w-full p-2 bg-gray-100 text-gray-700 font-bold rounded"
            rows="4"
          />
          <button
            onClick={handleSave}
            className="mt-2 bg-[#0a66C2] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Enregistrer
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-700">{userData?.about || "Aucune information."}</p>
          {isOwnProfile && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 text-[#0a66C2] hover:text-blue-600 transition duration-300"
            >
              Modifier
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default AboutSection;
