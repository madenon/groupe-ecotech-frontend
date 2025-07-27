import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Check, Clock, UserCheck, X } from "lucide-react";
import { axiosInstance } from "../lib/axios";


const RecommendedUsers = ({ user }) => {
  const queryClient = useQueryClient();

  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user?._id],
    queryFn: () => axiosInstance.get(`/connections/status/${user?._id}`),
  });
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Demande de connection envoyé");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user._id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors de l'envoi de la demande de connection"
      );
    },
  });

  const { mutate: accepRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection accepté");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user?._id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error,
        "Erreur lors de l'acceptation de la demande de connection"
      );
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection rejetée");
      queryClient.invalidateQueries({
        queryKey: ["connectionStatus", user?._id],
      });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.error,
        "Erreur lors de la rejet de la demande de connection"
      );
    },
  });

  const renderButton = () => {
    if (isLoading) {
      return (
        <button className="px-3 py-1 rounded-full  bg-gray-200 text-gray-50 items-center">
          Chargement ...
        </button>
      );
    }
    switch (connectionStatus?.data?.status) {
      case "pending":
        return (
          <button
            className="px-1 py-1 rounded-field -mt-7 bg-yellow-500 text-white flex items-center"
            disabled
          >
            <Clock size={16} className="mr-1"  />
            en attente
          </button>
        );
      case "received":
        return (
          <div className="flex gap-1 justify-center">
            <button
              onClick={() => accepRequest(connectionStatus?.data?.requestId)}
              className={`rounded-full p-1 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white`}
            >
              <Check size={16} />
            </button>
            <button
              className={`rounded-full p-1 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white`}
              onClick={() => rejectRequest(connectionStatus?.data?.requestId)}
            >
              <X size={16} />
            </button>
          </div>
        );
      case "connected":
        return (
          <button
            className=" py-1 rounded-full  bg-green-500 text-white flex items-center"
            disabled
          >
            <UserCheck size={16} className="mr-1" />
            connecté
          </button>
        );
      default:
        return (
          <button
            className="px-1 py-1  rounded-full mt-3 text-sm border border-[#0A66C2] text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white flex items-center transition-colors duration-200 whitespace-nowrap"
            onClick={handleConnect}
          >
            <UserCheck size={12} className="gap-2 " />
            Se connecter
          </button>
        );
    }
  };

  const handleConnect = () => {
    if (connectionStatus?.data?.status === "not_connected") {
      sendConnectionRequest(user?._id);
    }
  };
  return (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3 flex-1">
      <img
        src={user?.profilePicture || "/avatar.png"}
        alt={user?.name}
        className="w-12 h-12 shadow rounded-full"
      />
      <div>
        <Link
          to={`/profile/${user?.username}`}
          className="font-semibold text-lg hover:underline"
        >
          {user?.name}
        </Link>
        <p className="text-sm -mb-1 text-[#5E5E5E]">{user?.headline}</p>
      </div>
    </div>

    <div className="ml-2">{renderButton()}</div>
  </div>
);
};

export default RecommendedUsers;
