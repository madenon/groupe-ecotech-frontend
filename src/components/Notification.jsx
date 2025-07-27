import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {
  ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import SideBar from "../pages/SideBar";
const truncateText = (text, wordLimit) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;
  return words.slice(0, wordLimit).join(" ") + "...";
};

const NotificationPage = () => {
  const queryClient = useQueryClient();
  const [expandedPosts, setExpandedPosts] = useState({});

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) return null;
        toast.error(error.response?.data?.message || "Une erreur est survenue");
      }
    },
  });

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axiosInstance.get("/notifications");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast.success("Notification supprimée");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Échec de la suppression");
    },
  });

  const renderNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp size={18} className="text-blue-500" />;
      case "comment":
        return <MessageSquare size={18} className="text-green-500" />;
      case "connectionAccepted":
        return <UserPlus size={18} className="text-purple-500" />;
      default:
        return null;
    }
  };

  const renderNotificationContent = (notification) => {
    const userName = (
      <span className="font-bold text-black">
        {notification.relatedUser?.name}
      </span>
    );

    switch (notification.type) {
      case "like":
        return <>{userName} a aimé votre publication</>;
      case "comment":
        return (
          <Link to={`/profile/${notification.relatedUser?.username}`}>
            {userName} a commenté votre publication
          </Link>
        );
      case "connectionAccepted":
        return (
          <Link
            to={`/profile/${notification.relatedUser?.username}`}
            className="hover:underline"
          >
            {userName} a accepté votre demande de connexion
          </Link>
        );
      default:
        return null;
    }
  };

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null;

    const isExpanded = expandedPosts[relatedPost._id];
    const toggleExpanded = () =>
      setExpandedPosts((prev) => ({
        ...prev,
        [relatedPost._id]: !prev[relatedPost._id],
      }));

    return (
      <div className="mt-2 p-2 bg-gray-300 rounded-md relative flex flex-col gap-2">
        <p className="text-sm text-gray-800">
          {isExpanded
            ? relatedPost.content
            : truncateText(relatedPost.content, 10)}
        </p>
        {relatedPost.content.split(" ").length > 10 && (
          <button
            onClick={toggleExpanded}
            className="text-blue-600 text-sm hover:underline self-start"
          >
            {isExpanded ? "Voir moins" : "Voir plus"}
          </button>
        )}
        <Link
          to={`/post/${relatedPost._id}`}
          className="flex items-center gap-2 mt-2"
        >
          {relatedPost.image && (
            <img
              src={relatedPost.image}
              alt={relatedPost.title}
              className="w-12 h-12 object-cover rounded-md"
            />
          )}
          <ExternalLink
            size={16}
            className="text-gray-500 hover:text-gray-700"
          />
        </Link>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1">
        <SideBar user={authUser} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl text-blue-900 font-semibold mb-6">
            Notifications
          </h1>

          {isLoading ? (
            <p>Chargement...</p>
          ) : notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`border rounded-lg m-3 p-4 transition-all hover:shadow-md ${
                    notification.read
                      ? "border-blue-500 bg-gray-400"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {/* Profil */}
                  <Link to={`/profile/${notification.relatedUser?.username}`}>
                    <img
                      className="w-12 h-12 rounded-full object-cover border border-gray-300 mb-2"
                      src={
                        notification.relatedUser?.profilePicture ||
                        "/avatar.png"
                      }
                      alt={notification.relatedUser?.name}
                    />
                  </Link>

                  {/* Ligne : icône + texte + boutons */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-green-100 rounded-full">
                        {renderNotificationIcon(notification.type)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {renderNotificationContent(notification)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsReadMutation(notification._id)}
                          className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      <button
                        onClick={() =>
                          deleteNotificationMutation(notification._id)
                        }
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>

                  {/* Post lié */}
                  {renderRelatedPost(notification.relatedPost)}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune notification</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
