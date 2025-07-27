import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCreateCountry = (options = {}) => {  // <== options en paramètre avec valeur par défaut
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/country", data);
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success("Pays créé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["countries"] });

      // Appelle la fonction passée en options si elle existe
      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Erreur lors de la création du pays.");

      // Si tu veux gérer aussi l'erreur côté composant via options
      if (options.onError) options.onError(err);
    },
  });
};

export default useCreateCountry;
