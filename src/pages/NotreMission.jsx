import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext"; // ← Import du contexte

const NotreMission = () => {
  const { authUser } = useAuth(); // ← Récupère l'utilisateur connecté

  const [contenu, setContenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ content: "", date: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await axiosInstance.get("/missionpanneau");
        const missions = res.data;
        if (missions.length > 0) {
          const latest = missions[0];
          setContenu(latest);
          setFormData({ content: latest.content, date: latest.date?.slice(0, 10) || "" });
        } else {
          setContenu(null);
        }
      } catch (err) {
        setError("Erreur lors du chargement du contenu de la mission.");
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, []);

  const handleEdit = () => setEditMode(true);

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({ content: contenu.content, date: contenu.date?.slice(0, 10) || "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setIsSaving(true);
      const res = await axiosInstance.put(`/missionpanneau/${contenu._id}`, formData);
      setContenu(res.data.mission);
      setEditMode(false);
    } catch (err) {
      alert("Erreur lors de la mise à jour de la mission.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cette mission ?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/missionpanneau/delete/${contenu._id}`);
      setContenu(null);
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  if (loading) return <p className="text-center py-8">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;
  if (!contenu) return <p className="text-center py-8">Aucune mission trouvée.</p>;

  return (
    <div className="flex justify-center bg-gray-100 text-gray-800 px-4 py-12">
      <div className="w-full max-w-3xl space-y-4">
        {editMode ? (
          <div className="space-y-4">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={6}
              className="w-full p-3 border rounded bg-white"
              placeholder="Contenu de la mission"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="p-2 border rounded"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {isSaving ? "Sauvegarde..." : "Mettre à jour"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm leading-relaxed text-justify whitespace-pre-wrap">
              {contenu.content}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Dernière mise à jour : {new Date(contenu.date || contenu.createdAt).toLocaleDateString()}
            </p>

            {/* ✅ Seul le superAdmin peut voir les boutons */}
            {authUser?.isSuperAdmin && (
              <div className="flex gap-4 mt-4">
                <button onClick={handleEdit} className="bg-blue-600 text-white px-4 py-2 rounded">
                  Modifier
                </button>
                <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
                  Supprimer
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotreMission;
