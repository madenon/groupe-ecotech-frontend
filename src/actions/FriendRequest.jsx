import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const FriendRequest = ({ request }) => {
  const queryClient = useQueryClient();
  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection accepté");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: () =>
      toast.error("Erreur lors de l'acceptation de la demande de connection"),
  });

  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection refusée");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: () =>
      toast.error("Erreur lors de la refus de la demande de connection"),
  });
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex  items-center gap-4">
        <Link to={`/profile/${request?.sender.username}`}>
          <img
            src={request.sender.profilePicture || "/avatar.png"}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${request?.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>
      <div className="space-x-2">
        <button
          className="bg-blue-300 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accepté
        </button>
        <button
          className="bg-gray-300 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          onClick={() => rejectConnectionRequest(request._id)}
        >
          Refusé
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
