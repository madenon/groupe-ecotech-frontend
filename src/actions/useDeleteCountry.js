// hooks/useDeleteCountry.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      axiosInstance.delete(`/country/${id}`).then((res) => res.data),
    onSuccess: () => {
      toast.success("Pays supprimé !");
      queryClient.invalidateQueries(["countries"]);
    },
    onError: () => {
      toast.error("Erreur lors de la suppression.");
    },
  });
};

export default useDeleteCountry;
