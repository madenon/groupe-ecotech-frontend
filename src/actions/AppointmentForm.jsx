import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

// Fonction pour récupérer les créneaux disponibles
const fetchAvailableSlots = async (day) => {
  try {
    const response = await axiosInstance.get(`/rendezvous/appointments/available-slots?day=${day}`);
    return response.data; // La réponse contiendra les créneaux disponibles
  } catch (error) {
    throw new Error("Erreur lors de la récupération des créneaux disponibles.");
  }
};

// Fonction pour créer un rendez-vous
const createAppointment = async (appointmentData) => {
  try {
    // Pas besoin d'envoyer explicitement le token puisque le cookie est envoyé automatiquement
    const response = await axiosInstance.post("/rendezvous/create", appointmentData);
    return response.data;
  } catch (error) {
    throw new Error("Erreur lors de la création du rendez-vous.");
  }
};

const AppointmentForm = () => {
  const { authUser, isLoading: isAuthLoading } = useAuth(); // Récupérer authUser et isLoading depuis useAuth()
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userId, setUserId] = useState(""); // Assure-toi d'avoir l'ID de l'utilisateur connecté
  const [errorMessage, setErrorMessage] = useState("");

  // Les heures disponibles par défaut
  const defaultSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
  ];

  // Utilisation de React Query pour récupérer les créneaux disponibles
  const { data: availableSlots, isLoading, isError, error } = useQuery({
    queryKey: ["availableSlots", selectedDay],
    queryFn: () => fetchAvailableSlots(selectedDay),
    enabled: selectedDay !== "",
    retry: false,
  });

  // Utilisation de React Query pour créer un rendez-vous
  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      toast.success("Rendez-vous créé avec succès.");
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue.");
    },
  });

  // Gérer la sélection du jour
  const handleDayChange = (e) => {
    const day = e.target.value;
    setSelectedDay(day);
    setErrorMessage(""); // Réinitialise les erreurs
  };

  // Gérer la sélection du créneau horaire
  const handleSlotChange = (e) => {
    setSelectedSlot(e.target.value);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedSlot || !selectedDay) {
      setErrorMessage("Veuillez sélectionner un jour et un créneau horaire.");
      return;
    }

    // Construire la date à partir de la sélection du jour et du créneau
    const [startHour, startMinute] = selectedSlot.split(" - ")[0].split(":");
    const selectedDate = new Date(selectedDay);
    selectedDate.setHours(parseInt(startHour));
    selectedDate.setMinutes(parseInt(startMinute));

    // Préparer les données pour la soumission
    const appointmentData = {
      scheduledAt: selectedDate.toISOString(), // Format ISO pour l'API
      type: "installation", // Tu peux ajuster cela selon la logique de ton formulaire
      userId: userId, // Assure-toi d'avoir l'ID de l'utilisateur connecté
    };

    if (!authUser || !authUser.token) {
      setErrorMessage("Token d'authentification non trouvé.");
      return;
    }

    try {
      // Envoie la requête pour créer un rendez-vous
      const response = await createAppointmentMutation.mutateAsync(appointmentData);
      console.log(response); // Traitement de la réponse
      toast.success("Rendez-vous créé avec succès.");
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.message || "Une erreur est survenue.");
    }
  };

  if (isAuthLoading) {
    return <div>Chargement...</div>; // Optionnel : afficher un loader pendant que l'authentification se charge
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="day" className="block text-gray-700">Sélectionner le jour</label>
        <select
          id="day"
          value={selectedDay}
          onChange={handleDayChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Sélectionner un jour</option>
          <option value="2023-07-24">Lundi</option>
          <option value="2023-07-25">Mardi</option>
          <option value="2023-07-26">Mercredi</option>
          <option value="2023-07-27">Jeudi</option>
          <option value="2023-07-28">Vendredi</option>
        </select>
      </div>

      {/* Affichage des créneaux horaires */}
      <div className="mb-4">
        <label className="block text-gray-700">Sélectionner l'heure</label>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {defaultSlots.map((slot, index) => {
            const isSlotAvailable = availableSlots ? availableSlots.includes(slot) : true;
            return (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`slot-${index}`}
                  name="selectedSlot"
                  value={slot}
                  onChange={handleSlotChange}
                  className="mr-2"
                  disabled={!isSlotAvailable}
                />
                <label htmlFor={`slot-${index}`} className={`text-gray-700 ${!isSlotAvailable ? "line-through" : ""}`}>
                  {slot}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Affichage des erreurs */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isError && <p className="text-red-500">{error.message}</p>}

      {/* Bouton de soumission */}
      <div className="mb-4">
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
          disabled={isLoading || !selectedSlot}
        >
          {isLoading ? "Chargement..." : "Confirmer le rendez-vous"}
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
