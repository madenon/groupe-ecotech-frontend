import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import React from "react";
import toast from "react-hot-toast";

// Fonction pour récupérer tous les rendez-vous
const getAllAppointments = async () => {
  const response = await axiosInstance.get("/rendezvous/all");
  console.log("Réponse de l'API:", response.data); 
  return response.data.appointments || [];
};

const Listerendezvous = () => {
  const queryClient = useQueryClient();
  const { data: appointments, isLoading, isError, error } = useQuery({
    queryKey: ["allAppointments"],
    queryFn: getAllAppointments,
  });

  // Fonction d'annulation
const handleCancel = async (appointmentId) => {
  const previousAppointments = queryClient.getQueryData(["allAppointments"]);

  queryClient.setQueryData(["allAppointments"], (old) =>
    old.map((appointment) =>
      appointment._id === appointmentId
        ? { ...appointment, status: "cancelled" }
        : appointment
    )
  );

  try {
    const response = await axiosInstance.patch(`/rendezvous/cancel/${appointmentId}`);
    toast.success(response.data.message);  // Affichage du message retourné par l'API
  } catch (error) {
    if (error.response && error.response.status === 403) {
      toast.error("Vous n'êtes pas autorisé à annuler ce rendez-vous.");
    } else {
      toast.error("Erreur lors de l'annulation.");
    }
    queryClient.setQueryData(["allAppointments"], previousAppointments); // Rétablir la liste précédente en cas d'erreur
  }
};


  if (isLoading) {
    return <div className="text-black">Chargement des rendez-vous...</div>;
  }

  if (isError) {
    return <div>Erreur : {error.message}</div>;
  }

  // Vérifier si appointments est un tableau avant de tenter de l'itérer
  if (!Array.isArray(appointments)) {
    return <div>Erreur : Les données des rendez-vous sont invalides.</div>;
  }

  return (
    <div className="p-6 bg-white text-black">
      <h2 className="text-2xl font-bold mb-4">Liste des Rendez-vous</h2>

      {/* Vérifier si la liste des rendez-vous est vide */}
      {appointments.length === 0 ? (
        <p>Aucun rendez-vous trouvé.</p>
      ) : (
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Utilisateur</th>
              <th className="px-4 py-2 border">Date et Heure</th>
              <th className="px-4 py-2 border">Raison</th>
              <th className="px-4 py-2 border">Statut</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr
                key={appointment._id}
                className={appointment.status === "cancelled" ? "bg-red-100" : ""}
              >
                <td className="px-4 py-2 border">
                  {appointment.user.name} ({appointment.user.email})
                </td>
                <td className="px-4 py-2 border">
                  {new Date(appointment.scheduledAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 border">{appointment.notes}</td>
                <td className="px-4 py-2 border">
                  {appointment.status === "cancelled" ? (
                    <span className="text-red-500">Rendez-vous annulé</span>
                  ) : (
                    <span className="text-green-500">Actif</span>
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {/* Désactiver ou masquer le bouton si le rendez-vous est annulé */}
                  {appointment.status !== "cancelled" ? (
                    <button
                      onClick={() => handleCancel(appointment._id)}
                      className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                      Annuler
                    </button>
                  ) : (
                    <span className="text-gray-500">Rendez-vous annulé</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Listerendezvous;
