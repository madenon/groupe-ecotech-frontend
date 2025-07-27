import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me"); // protégée par protectRoutes
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) {
          return null; // Pas connecté = valeur authUser null (normal)
        }
        throw error; // Les autres erreurs doivent être remontées
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  return (
    <AuthContext.Provider value={{ authUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
