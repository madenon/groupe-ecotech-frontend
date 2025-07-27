import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios'; // Assure-toi d'avoir configuré axios

const Dashboard = () => {
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/user-data"); // Exemple d'API pour récupérer des données utilisateur
      return res.data;
    },
  });

  if (isLoading) return <div>Chargement des données...</div>;
  if (error) return <div>Une erreur est survenue lors du chargement des données.</div>;

  return (
    <div className="dashboard-container p-6">
      <h1 className="text-2xl font-bold">Bienvenue sur le Dashboard</h1>
      
      <div className="user-info mt-4">
        <h2 className="text-xl">Détails de l'utilisateur :</h2>
        <p><strong>Nom :</strong> {userData.name}</p>
        <p><strong>Email :</strong> {userData.email}</p>
        <p><strong>Rôle :</strong> {userData.role}</p>
      </div>

      <div className="admin-links mt-6">
        <h2 className="text-xl">Gestion des utilisateurs :</h2>
        <ul className="list-disc pl-4">
          <li><a href="/admin/users" className="text-blue-600 hover:underline">Voir les utilisateurs</a></li>
          <li><a href="/admin/posts" className="text-blue-600 hover:underline">Gérer les posts</a></li>
          <li><a href="/admin/settings" className="text-blue-600 hover:underline">Paramètres</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
