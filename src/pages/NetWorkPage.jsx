import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { UserPlus } from "lucide-react";
import UserCard from "../actions/UserCard";
import FriendRequest from "../actions/FriendRequest";
import SideBar from "./SideBar";

const NetworkPage = () => {
  const { data: user } = useQuery({
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

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections/requests");
      return res.data; // Retourne directement un tableau
    },
  });

  const { data: connections } = useQuery({
    queryKey: ["connections"],
    queryFn: async () => {
      const res = await axiosInstance.get("/connections");
      return res.data; // Retourne directement un tableau
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <SideBar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-[#FFFFFF] text-black shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-semibold mb-6">Mes ami(e)s</h1>
          {connectionRequests?.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-4">
                Demandes de connexions
              </h2>
              <div className="space-y-4">
                {connectionRequests.map((request) => (
                  <FriendRequest key={request.id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white text-black rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-400 mc-4" />
              <h3 className="text-xl font-semibold mb-2">
                Aucune demande de connexion en attente
              </h3>
              <p className="text-gray-600 mt-2">
                Explorez les connexions suggérées ci-dessous pour élargir votre
                réseau
              </p>
            </div>
          )}
          {connections?.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Mes amis</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connections.map((connection) => (
                  <UserCard
                    key={connection._id || connection.id}
                    user={connection}
                    isConnection={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
