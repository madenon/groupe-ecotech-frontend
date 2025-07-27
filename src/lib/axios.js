import axios from "axios";

 // Valeur par défaut si la variable est undefined

export const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
    "Content-Type": "application/json"
  }
});


// Ajouter un intercepteur pour ajouter un token d'authentification (si nécessaire)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ou utiliser un cookie/session
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les réponses d'erreur globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Logique pour rediriger vers la page de login
    }
    return Promise.reject(error);
  }
);

// Fonction pour récupérer les informations de l'utilisateur connecté
export const fetchMe = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return null; // Utilisateur non authentifié
    }
    throw err;  // Laisse React Query gérer les autres erreurs
  }
};

// Fonction pour créer un rendez-vous
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axiosInstance.post("/rendezvous/create", appointmentData);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la création du rendez-vous.");
  }
};
