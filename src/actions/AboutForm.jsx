import React, { useState } from "react";
import useCreateNotreMission from "./useCreateNotreMission";

const AboutForm = () => {
  const [formData, setFormData] = useState({
    content: "",
    contenu: "",
    objectif: "",
    date: "",
  });

  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({ content: "", date: "", contenu: "", objectif: "" });
    setError("");
  };

  const { mutate: createNotreMission, isPending } = useCreateNotreMission({
    onSuccess: resetForm,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setError("Le content est obligatoire.");
      return;
    }
    if (!formData.contenu.trim()) {
      setError("Le contenu est obligatoire.");
      return;
    }
    if (!formData.objectif.trim()) {
      setError("L' objectif est obligatoire.");
      return;
    }

    createNotreMission(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-700">
        Ajouter une mission
      </h2>

      {/* Contenu */}
      <div>
        <label className="block text-gray-700 mb-2">La mission</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
          className="w-full p-3 border rounded-md text-black bg-gray-100 resize-none"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">L'objectif </label>
        <textarea
          name="objectif"
          value={formData.objectif}
          onChange={handleChange}
          rows={6}
          required
          className="w-full p-3 border rounded-md text-black bg-gray-100 resize-none"
        />
      </div>
      <div>
        <label className="block text-gray-700 mb-2">Le Contenu</label>
        <textarea
          name="contenu"
          value={formData.contenu}
          onChange={handleChange}
          rows={6}
          required
          className="w-full p-3 border rounded-md text-black bg-gray-100 resize-none"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-gray-700 mb-2">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-3 border rounded-md text-black bg-gray-100"
        />
      </div>

      {/* Erreur */}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Bouton */}
      <div className="text-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Création..." : "Créer la mission"}
        </button>
      </div>
    </form>
  );
};

export default AboutForm;
