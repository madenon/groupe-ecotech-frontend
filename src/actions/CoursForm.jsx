import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import useCreateCourses from "./useCreateCourses";
import katex from "katex";
import "katex/dist/katex.min.css";



const CoursForm = () => {
  const [formData, setFormData] = useState({
    country: "",
    title: "",
    content: "",
    subject: "",
    videocour: null,
    image: null,
    lastUpdated: "",
    city: "",
  });

  const [previewVideo, setPreviewVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      country: "",
      title: "",
      content: "",
      subject: "",
      videocour: null,
      image: null,
      lastUpdated: "",
      city: "",
    });
    setPreviewImage(null);
    setPreviewVideo(null);
    setError("");
  };

  const { mutate: createCourse, isPending } = useCreateCourses({
    onSuccess: resetForm,
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await axiosInstance.get("/country");
      return res.data;
    },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setError("");

    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
        videocour: null,
      }));
      setPreviewVideo(null);
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else if (name === "videocour") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        videocour: file,
        image: null,
      }));
      setPreviewImage(null);
      setPreviewVideo(file ? URL.createObjectURL(file) : null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddFormula = () => {
    const formula = prompt("Entrez la formule mathématique en LaTeX:");
    if (formula) {
      setFormData((prev) => ({
        ...prev,
        content: prev.content + ` $$${formula}$$ `,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.content.trim()) {
      setError("Le contenu est obligatoire.");
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("title", formData.title);
    formDataToSubmit.append("content", formData.content);
    formDataToSubmit.append("subject", formData.subject);
    formDataToSubmit.append("country", formData.country);
    formDataToSubmit.append("lastUpdated", formData.lastUpdated);
    if (formData.city) formDataToSubmit.append("city", formData.city);
    if (formData.image) formDataToSubmit.append("image", formData.image);
    if (formData.videocour) formDataToSubmit.append("videocour", formData.videocour);

    createCourse(formDataToSubmit);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-xl font-semibold text-gray-700">Créer un cours</h2>

      {/* Pays */}
      <div>
        <label className="block text-gray-700">Pays</label>
        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
        >
          <option value="">Sélectionner un pays</option>
          {countries?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Titre */}
      <div>
        <label className="block text-gray-700">Titre du cours</label>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
        />
      </div>

      {/* Contenu */}
      <div>
        <label className="block text-gray-700">Contenu (avec formules LaTeX)</label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          required
          className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
        />
        <button
          type="button"
          onClick={handleAddFormula}
          className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-md"
        >
          Ajouter une formule mathématique
        </button>
      </div>

      {/* Matière & Ville */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700">Matière</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-gray-700">Ville (facultatif)</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
          />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-gray-700">Date de mise à jour</label>
        <input
          type="date"
          name="lastUpdated"
          value={formData.lastUpdated}
          onChange={handleChange}
          required
          className="w-full p-3 border rounded-md mt-2 text-black bg-gray-100"
        />
      </div>

      {/* Image upload */}
      <div>
        <label className="block text-gray-700">Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          disabled={!!formData.videocour}
          className="w-full p-2 border rounded bg-gray-100"
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-2 max-h-64 mx-auto rounded shadow"
          />
        )}
      </div>

      {/* Vidéo upload */}
      <div>
        <label className="block text-gray-700">Vidéo</label>
        <input
          type="file"
          name="videocour"
          accept="video/*"
          onChange={handleChange}
          disabled={!!formData.image}
          className="w-full p-2 border rounded bg-gray-100"
        />
        {previewVideo && (
          <video
            src={previewVideo}
            controls
            className="mt-2 max-h-64 mx-auto rounded shadow"
          />
        )}
      </div>

      {/* Erreur */}
      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {/* Submit */}
      <div className="text-center">
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Création..." : "Créer le cours"}
        </button>
      </div>
    </form>
  );
};

export default CoursForm;
