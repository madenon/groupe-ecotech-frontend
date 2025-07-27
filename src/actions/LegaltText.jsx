import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios"; // adapte le chemin
import toast from "react-hot-toast";

const LegalTextForm = () => {
  const { type } = useParams();

  // États pour formulaire
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Soumission formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Envoi POST vers backend, endpoint selon type (ex: /admin/mentions)
      const response = await axiosInstance.post(`/legalText/${type}`, {
        title,
        content,
      });

      setSuccess(true);
      setTitle("");
      setContent("");
      toast.success("Texte légal enregistré.");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xl text-black mx-auto">
      <h1 className="text-2xl font-bold mb-4">Créer un texte légal : {type}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border bg-gray-300 border-gray-300 rounded px-3 py-2"
          required
        />

        <textarea
          placeholder="Contenu"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="border border-gray-300 bg-gray-300 rounded px-3 py-2 resize-none"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Enregistrer"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
        {success && <p className="text-green-600">Texte enregistré avec succès !</p>}
      </form>
    </div>
  );
};

export default LegalTextForm;
