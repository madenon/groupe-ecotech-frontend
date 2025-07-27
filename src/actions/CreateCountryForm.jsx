import { useState, useRef } from "react";
import useCreateCountry from "./useCreateCountry";

const CreateCountryForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    continent: "",
    flagUrl: "",
    city: "",
  });

  const fileInputRef = useRef(null);

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      continent: "",
      flagUrl: "",
      city: "",
    });

    // Vider manuellement le champ fichier
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { mutate: createCountry, isPending } = useCreateCountry({
    onSuccess: resetForm,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, flagUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createCountry(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white rounded shadow space-y-4 max-w-lg mx-auto"
    >
      <input
        type="text"
        name="name"
        placeholder="Nom du pays"
        value={formData.name}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-300"
      />
      <input
        type="text"
        name="code"
        placeholder="Code ISO"
        value={formData.code}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-300"
      />
      <input
        type="text"
        name="city"
        placeholder="Ville principale"
        value={formData.city}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-300"
      />

      <select
        name="continent"
        value={formData.continent}
        onChange={handleChange}
        required
        className="w-full p-2 border rounded bg-gray-300"
      >
        <option value="">Sélectionner un continent</option>
        <option value="Afrique">Afrique</option>
        <option value="Europe">Europe</option>
        <option value="Amérique">Amérique</option>
        <option value="Asie">Asie</option>
        <option value="Océanie">Océanie</option>
      </select>

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="w-full"
        ref={fileInputRef}
      />

      {formData.flagUrl && (
        <img
          src={formData.flagUrl}
          alt="Prévisualisation"
          className="h-20 object-contain"
        />
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Création en cours..." : "Créer le pays"}
      </button>
    </form>
  );
};

export default CreateCountryForm;
