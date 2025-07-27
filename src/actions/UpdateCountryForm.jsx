import { useState } from "react";
import useUpdateCountry from "./useUpdateCountry";

const UpdateCountryForm = ({ country, onClose }) => {
  const [formData, setFormData] = useState({ ...country });

  const { mutate: updateCountry, isPending } = useUpdateCountry();

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
    updateCountry({ id: country._id, data: formData }, { onSuccess: onClose });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border rounded shadow space-y-4">
      <h2 className="text-lg font-bold">Modifier {country.name}</h2>
      <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 bg-gray-300 border rounded" />
      <input type="text" name="code" value={formData.code} onChange={handleChange} className="w-full p-2 bg-gray-300 border rounded" />
      <input type="text" name="continent" value={formData.continent} onChange={handleChange} className="w-full bg-gray-300 p-2 border rounded" />
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {formData.flagUrl && <img src={formData.flagUrl} alt="Flag" className="h-16 object-contain" />}
      <div className="space-x-2">
        <button type="submit" disabled={isPending} className="bg-blue-600 text-white px-4 py-2 rounded">
          {isPending ? "Mise à jour..." : "Mettre à jour"}
        </button>
        <button type="button" onClick={onClose} className="text-gray-600 underline">Annuler</button>
      </div>
    </form>
  );
};

export default UpdateCountryForm;
