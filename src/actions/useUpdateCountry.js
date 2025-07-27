// hooks/useUpdateCountry.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useUpdateCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      axiosInstance.put(`/country/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      toast.success("Pays mis à jour !");
      queryClient.invalidateQueries(["countries"]);
    },
    onError: () => {
      toast.error("Erreur lors de la mise à jour.");
    },
  });
};

export default useUpdateCountry;
