import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Briefcase,
  Camera,
  Check,
  Clock,
  MapPin,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import { axiosInstance } from "../../lib/axios";

const ProfileHeader = ({ userData, onSave, isOwnProfile,authUser  }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  // const { data: authUser } = useQuery({
  //   queryKey: ["authUser"],
  //   queryFn: async () => {
  //     const res = await axiosInstance.get("/auth/me");
  //     return res.data;
  //   },
  //   retry: false,
  //   refetchOnWindowFocus: false,
  // });

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery(
    {
      queryKey: ["connectionStatus", userData?._id],
      queryFn: async () => {
        const res = await axiosInstance.get(
          `/connections/status/${userData?._id}`
        );
        return res.data;
      },
      enabled: !isOwnProfile && !!userData?._id, // 👈 empêcher la requête si userData est encore vide
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  const isConnected = userData?.connections?.some(
    (connection) => connection?._id === authUser?._id
  );

  
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) =>
      axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Demande de connection envoyée");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Une erreur est survenue..."
      );
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection acceptée");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Une erreur est survenue..."
      );
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Demande de connection refusée");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Une erreur est survenue..."
      );
    },
  });
  const { mutate: removeConnection } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection supprimée");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Une erreur est survenue..."
      );
    },
  });
  const getConnectionState = () => {
    if (isConnected) return "connected";
    return connectionStatus?.status || "not_connected";
  };

  const renderConnectionButton = () => {
    if (isOwnProfile) return null
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionState()) {
      case "connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connecté
            </div>
            <button
              className={`${baseClass} bg-gray-200 text-red-200  hover:bg-gray-400`}
              onClick={() => {
                console.log("Trying to remove:", userData?._id);

                removeConnection(userData?._id);
              }}
            >
              <X size={20} className="mr-2" />
              Se désabonner
            </button>
          </div>
        );
      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" /> en attente
          </button>
        );
      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
              onClick={() => acceptRequest(connectionStatus?.requestId)}
            >
              <Check size={20} className="mr-2" />
              Accepter
            </button>
            <button
              className={`${baseClass} bg-gray-500 hover:bg-gray-600`}
              onClick={() => rejectRequest(connectionStatus?.requestId)}
            >
              Refuser
            </button>
          </div>
        );
      default:
        return (
          <button
            className={`${baseClass} bg-[#0A66C2] hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center`}
            onClick={() => sendConnectionRequest(userData?._id)}
          >
            <UserPlus size={20} className="mr-2" />
            Connexion
          </button>
        );
    }
  };
  useEffect(() => {
    if (isEditing) {
      setEditedData({
        name: userData?.name || "",
        headline: userData?.headline || "",
        location: userData?.location || "",
      });
    }
  }, [isEditing]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({
          ...prev,
          [event.target.name]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };
  return (
    <div className="bg-white text-black shadow rounded-lg mb-6 ">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center bg-red-200"
        style={{
          backgroundImage: `url(${
            editedData?.bannerImg || userData?.bannerImg || "/banner.png"
          })`,
          backgroundColor: "red",
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-gray-300 p-2 rounded-full shadow cursor-pointer">
            <Camera size={20} />
            <input
              type="file"
              accept="image/*"
              name="bannerImg"
              onChange={handleImageChange}
              className="hidden bg-[F3F2EF]"
            />
          </label>
        )}
      </div>

      <div className="p-4 bg-gray-300 text-gray-400">
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={
              editedData?.profilePicture ||
              userData?.profilePicture ||
              "/avatar.png"
            }
            alt={userData?.name}
          />
          {isEditing && (
            <label className="absolute bottom-0 right-1/2 translate-x-16 transform bg-gray-600 p-2 rounded-full shadow cursor-pointer">
              <Camera size={20} />

              <input
                type="file"
                accept="image/*"
                name="profilePicture"
                onChange={handleImageChange}
                className="hidden "
              />
            </label>
          )}
        </div>
        <div className="text-center mb-4">
          {isEditing ? (
            <div className="mb-2">
              <label className="block text-gray-500 text-sm mb-1">
                Nom et prénom
              </label>
              <input
                type="text"
                value={editedData?.name ?? userData?.name}
                onChange={(e) =>
                  setEditedData({ ...editedData, name: e.target.value })
                }
                className="text-2xl font-bold text-gray-600 bg-[#F3F2EF] text-center w-full"
              />
            </div>
          ) : (
            <div className="text-xl text-gray-400 font-semibold mb-2">
              Nom et prénom :{" "}
              <span className="font-bold text-gray-700 text-2xl">
                {userData?.name}
              </span>
            </div>
          )}

         {isEditing ? (
  <div className="flex mt-2 justify-center items-start gap-2">
    <Briefcase size={20} className="mt-1 font-bold text-gray-600" />
    <div className="flex flex-col">
      <label className="text-gray-500 text-sm mb-1">Profession</label>
      <input
        type="text"
        value={editedData?.headline ?? userData?.headline}
        onChange={(e) =>
          setEditedData({ ...editedData, headline: e.target.value })
        }
        className="text-sm w-full text-gray-600 bg-[#F3F2EF]"
      />
    </div>
  </div>
) : (
  <p className="text-sm text-gray-600 mb-2 flex justify-center items-center gap-2">
    <Briefcase size={20} className="text-gray-500" />
    Profession : {userData?.headline}
  </p>
)}


         <div className="flex mt-2 justify-center items-start gap-2">
  <MapPin size={20} className="mt-1 font-bold text-gray-600" />
  {isEditing ? (
    <div className="flex flex-col">
      <label className="text-gray-500 text-sm mb-1">Pays</label>
      <input
        type="text"
        value={editedData?.location ?? userData?.location}
        onChange={(e) =>
          setEditedData({ ...editedData, location: e.target.value })
        }
        className="text-sm w-full text-gray-600 bg-[#F3F2EF]"
      />
    </div>
  ) : (
    <span className="text-gray-600">Pays : {userData?.location}</span>
  )}
</div>

        </div>
       {isOwnProfile ? (
  isEditing ? (
    <div className="flex flex-col gap-2 mt-4">
      <button
        onClick={handleSave}
        className="w-full bg-green-600 text-white py-2 px-4 rounded-full hover:bg-green-700 transition duration-300"
      >
        Enregistrer
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="w-full bg-gray-400 text-white py-2 px-4 rounded-full hover:bg-gray-500 transition duration-300"
      >
        Annuler
      </button>
    </div>
  ) : (
    <button
      className="w-full bg-[#0A66C2] text-white py-2 px-4 rounded-full hover:bg-blue-600 transition duration-300"
      onClick={() => setIsEditing(true)}
    >
      Modifier le profil
    </button>
  )
) : (
  <div className="flex justify-center">{renderConnectionButton()}</div>
)}

      </div>
    </div>
  );
};

export default ProfileHeader;
