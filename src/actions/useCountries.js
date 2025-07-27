// actions/useCountries.js
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const fetchCountries = async () => {
  const res = await axiosInstance.get("/country");
  return res.data; // Assure-toi que res.data est bien un tableau ici
};

export default function useCountries() {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
  });
}