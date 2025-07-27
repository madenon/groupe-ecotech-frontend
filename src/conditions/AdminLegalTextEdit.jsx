import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const AdminLegalTextEdit = () => {
  const { type } = useParams();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(null); // initialement null

  const { data, isLoading, isError } = useQuery({
    queryKey: ["legalText", type],
    queryFn: async () => {
      const res = await axiosInstance.get(`/legalText/${type}`);
      return res.data;
    },
    onError: () => toast.error("Erreur lors du chargement du texte"),
  });

  // Dès que data est dispo, on met à jour form
  useEffect(() => {
    if (data && data.title && data.content) {
      setForm({ title: data.title, content: data.content });
    }
  }, [data]);

  const { mutate, isLoading: isSaving } = useMutation({
    mutationFn: async () => axiosInstance.put(`/legalText/${type}`, form),
    onSuccess: () => {
      toast.success("Texte mis à jour !");
      queryClient.invalidateQueries({ queryKey: ["legalText", type] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate();
  };

  if (isLoading) return <p>Chargement...</p>;
  if (isError) return <p>Erreur lors du chargement du texte.</p>;
  if (!form) return <p>Chargement du formulaire...</p>; // On attend que form soit rempli

  return (
    <div className="p-6 max-w-2xl text-black mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Modifier {type}</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="border bg-gray-300 p-2 w-full mb-4"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Titre"
        />
        <textarea
          className="border bg-gray-300 p-2 w-full h-60"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Contenu"
        />
        <button
          type="submit"
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
        >
          {isSaving ? "Enregistrement..." : "Mettre à jour"}
        </button>
      </form>
    </div>
  );
};

export default AdminLegalTextEdit;
