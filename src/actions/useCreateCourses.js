import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCreateCourses = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/courses/create", data, {
        headers: {
          "Content-Type": "multipart/form-data", // Permet de gérer les fichiers
        },
      });
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success("Cours créé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["courses"] });

      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Erreur lors de la création.");
      if (options.onError) options.onError(err);
    },
  });
};

export default useCreateCourses;