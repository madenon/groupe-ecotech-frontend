import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useCreateNotreMission = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/notremission/create", data);
      return res.data;
    },
    onSuccess: (data, variables, context) => {
      toast.success("Mission créé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["notremissions"] });

      if (options.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Erreur lors de la création de la mission.");
      if (options.onError) options.onError(err);
    },
  });
};

export default useCreateNotreMission;