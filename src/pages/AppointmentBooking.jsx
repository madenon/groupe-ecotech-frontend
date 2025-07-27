import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

// Fonction pour vérifier la disponibilité des créneaux
const checkAvailability = async (startDate, endDate) => {
  const response = await axiosInstance.get("/rendezvous/check-availability", {
    params: { startDate, endDate },
  });
  return response.data;
};

// Fonction pour réserver un créneau
export const reserveAppointment = async (slotData) => {
  const response = await axiosInstance.post("/rendezvous/reserve", slotData);
  return response.data;
};

// Fonction pour récupérer la date actuelle au format YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Fonction pour obtenir la date + 2 jours au format ISO
const getDatePlusTwoDays = () => {
  const today = new Date();
  today.setDate(today.getDate() + 2);
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AppointmentBooking = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState(""); // Champ pour la raison
  const [startDate, setStartDate] = useState("2025-07-01");
  const [endDate, setEndDate] = useState("2025-08-31");

  // Utilisation de React Query pour récupérer les créneaux réservés
  const { data: reservedSlots, isLoading, isError, error } = useQuery({
    queryKey: ["reservedSlots", startDate, endDate],
    queryFn: () => checkAvailability(startDate, endDate),
    enabled: !!startDate && !!endDate,
  });

  // Loggez la réponse de l'API pour le debug
  useEffect(() => {
    console.log("reservedSlots:", reservedSlots);
  }, [reservedSlots]);

  // Mutation pour la réservation
  const reserveSlotMutation = useMutation({
    mutationFn: reserveAppointment,
    onSuccess: () => {
      toast.success("Créneau réservé avec succès.");
      setReason(""); // Réinitialiser le champ "motif" après une réservation réussie
      setSelectedDate(null); // Réinitialiser la date
      setSelectedSlot(null); // Réinitialiser l'heure
    },
    onError: (error) => {
      console.error("Erreur lors de la réservation:", error);
      const errorMessage = error.response?.data?.message || "Une erreur inconnue est survenue.";
      toast.error(`Erreur lors de la réservation: ${errorMessage}`);
    },
  });

  // Gérer la sélection du créneau horaire
  const handleSlotClick = (time) => {
    setSelectedSlot(time);
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot || !reason) {
      toast.error("Veuillez sélectionner une date, une heure et entrer une raison.");
      return;
    }

    // Créer la dateTime au format ISO
    const dateTime = `${selectedDate}T${selectedSlot}`;

    // Vérifier si la date est valide
    if (isNaN(Date.parse(dateTime))) {
      toast.error("La date et l'heure sont invalides.");
      return;
    }

    // Vérification préalable pour vérifier que le créneau n'est pas réservé
    const isSlotReserved = Array.isArray(reservedSlots) && reservedSlots.some(slot => slot.scheduledAt === dateTime);
    if (isSlotReserved) {
      toast.error("Ce créneau est déjà réservé.");
      return;
    }

    const slotData = {
      date: selectedDate,
      time: selectedSlot,
      notes: reason,
    };

    try {
      await reserveSlotMutation.mutateAsync(slotData);
    } catch (error) {
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Réservez un rendez-vous</h2>

      {/* Sélectionner la date du rendez-vous */}
      <div className="mb-6">
        <label htmlFor="date" className="block text-lg font-semibold">Choisissez une date :</label>
        <input
          type="date"
          id="date"
          value={selectedDate || ""}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-gray-300 p-2 mt-2 border rounded-md"
          min={getDatePlusTwoDays()} // Grise les dates jusqu'à +2 jours
        />
      </div>

      {/* Choisir l'heure du rendez-vous */}
      <div className="mb-6">
        <label htmlFor="time" className="block text-lg font-semibold">Choisissez l'heure :</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"].map((time) => {
            // Vérifie si le créneau est réservé
            const isReserved = Array.isArray(reservedSlots) && reservedSlots.some(slot => slot.scheduledAt === `${selectedDate}T${time}:00`);
            return (
              <div key={time} className="relative">
                <button
                  onClick={() => !isReserved && handleSlotClick(time)}
                  className={`border p-2 rounded-md text-center ${isReserved ? "bg-gray-300 cursor-not-allowed" : selectedSlot === time ? "bg-blue-500 text-white" : "bg-white"}`}
                  disabled={isReserved}
                >
                  {time}
                </button>
                {/* Message indiquant si le créneau est réservé */}
                {isReserved && (
                  <span className="absolute top-0 right-0 text-red-500 text-xs">Réservé</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Champ de texte pour la raison du rendez-vous */}
      <div className="mb-6">
        <label htmlFor="reason" className="block text-lg font-semibold">Raison du rendez-vous :</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full bg-white p-2 text-black mt-2 border rounded-md"
          placeholder="Entrez le motif de votre rendez-vous"
        />
      </div>

      {/* Formulaire de soumission */}
      <div className="mt-6 text-center">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
        >
          Réserver le créneau
        </button>
      </div>

      {/* Affichage des messages d'erreur et de chargement */}
      {isLoading && <p>Chargement des créneaux...</p>}
      {isError && <p className="text-red-500">Erreur lors du chargement des créneaux.</p>}
    </div>
  );
};

export default AppointmentBooking;
