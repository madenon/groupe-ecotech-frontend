import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const AboutPage = () => {
  const { authUser } = useAuth();

  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    content: "",
    contenu: "",
    objectif: "",
    date: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axiosInstance.get("/notremission");
        const mission = res.data[0];
        if (mission) {
          setSection(mission);
          setFormData({
            content: mission.content,
            contenu: mission.contenu,
            objectif: mission.objectif,
            date: mission.date?.slice(0, 10) || "",
          });
        }
      } catch (error) {
        alert("Erreur lors du chargement de la mission.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const res = await axiosInstance.put(`/notremission/${section._id}`, formData);
      setSection(res.data.mission);
      setEditMode(false);
    } catch (error) {
      alert("Erreur lors de la mise à jour.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Confirmer la suppression ?")) {
      try {
        await axiosInstance.delete(`/notremission/${section._id}`);
        setSection(null);
      } catch {
        alert("Erreur lors de la suppression.");
      }
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (!section) return <p>Aucune mission trouvée.</p>;

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto text-black">
      <h1 className="text-3xl font-bold text-center mb-8">Notre mission</h1>

      {editMode ? (
        <div className="space-y-4 bg-white text-black p-6 rounded shadow max-w-3xl mx-auto">
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white border text-black p-2 rounded"
            placeholder="Notre Mission"
          />
          <textarea
            name="contenu"
            value={formData.contenu}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white text-black border p-2 rounded"
            placeholder="Ce que nous faisons"
          />
          <textarea
            name="objectif"
            value={formData.objectif}
            onChange={handleChange}
            rows={4}
            className="w-full bg-white text-black border p-2 rounded"
            placeholder="Notre Vision"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border bg-white text-black p-2 rounded w-full"
          />
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleUpdate}
              disabled={isSaving}
              className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
            >
              {isSaving ? "Sauvegarde..." : "Enregistrer"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-400 text-white px-6 py-2 rounded"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
           <div>
             <div className="bg-white p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold mb-2">Ce que nous faisons</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap opacity-80">{section.contenu}</p>
            </div>
           </div>
           <div>
            <div className="bg-white p-6 rounded-lg shadow text-center">
               <h2 className="text-xl font-semibold mb-2">Notre Mission</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{section.content}</p>
           </div>
            </div>
            <div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
              <h2 className="text-xl font-semibold mb-2">Notre Vision</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{section.objectif}</p>
            </div>
            </div>
          </div>

          {authUser?.isSuperAdmin && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded"
              >
                Modifier
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded"
              >
                Supprimer
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AboutPage;
