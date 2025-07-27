import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const MessagesSection = ({ userData, targetUserId, isOwnProfile }) => {
  const queryClient = useQueryClient();

  // Récupération des messages et des conversations
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["messages", targetUserId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/messagerie/${targetUserId}/messages`);
        console.log("Réponse de l'API:", res); // Vérification de la structure de la réponse
        return Array.isArray(res.data.conversations) ? res.data.conversations : [];
      } catch (err) {
        console.error("Erreur lors de la récupération des conversations : ", err);
        toast.error("Une erreur s'est produite en récupérant les conversations.");
        throw err;
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Mutation pour envoyer un message
  const { mutate: sendMessage } = useMutation({
    mutationFn: async (newMessage) => {
      const res = await axiosInstance.post("/messagerie", newMessage);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Message envoyé avec succès");
      queryClient.invalidateQueries(["messages", targetUserId]); // Invalider la clé de cache pour la conversation
    },
    onError: (err) => {
      console.error("Erreur lors de l'envoi du message :", err);
      toast.error("Une erreur est survenue lors de l'envoi du message.");
    },
  });

  // Vérification si une conversation existe entre l'utilisateur connecté et le profil visité
  const existingConversation = Array.isArray(data)
    ? data.find((conversation) =>
        conversation.participants.some((p) => p._id === targetUserId)
      )
    : null;

  const [newMessage, setNewMessage] = useState("");
  const [replyToMessageId, setReplyToMessageId] = useState(null); // ID du message auquel on répond
  const [replyToMessageContent, setReplyToMessageContent] = useState(null); // Contenu du message auquel on répond
  const [messageSent, setMessageSent] = useState(false); // Nouvel état pour le retour visuel

  // Gestion de l'envoi d'un message
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        receiverId: targetUserId,
      };

      // Si une conversation existe déjà, ajouter l'ID de la conversation
      if (existingConversation?._id) {
        messageData.conversationId = existingConversation._id;
      }

      // Si on répond à un message spécifique, ajouter la référence du message
      if (replyToMessageId) {
        messageData.replyToMessageId = replyToMessageId;
      }

      sendMessage(messageData); 
      setNewMessage(""); // Réinitialiser le champ de message
      setReplyToMessageId(null); // Réinitialiser la réponse au message
      setReplyToMessageContent(null); // Réinitialiser le contenu du message

      // Affichage du retour visuel
      setMessageSent(true);
      setTimeout(() => setMessageSent(false), 3000); // Le retour visuel disparaît après 3 secondes
    } else {
      toast.error("Le message ne peut pas être vide !");
    }
  };

  // Gérer la réponse à un message spécifique
  const handleReplyToMessage = (messageId, content) => {
    setReplyToMessageId(messageId);
    setReplyToMessageContent(content);
    setNewMessage(`Répondre à: ${content}`); // Pré-remplir le message avec une référence
  };

  // Si les données sont en train de se charger
  if (isLoading) return <p>Chargement...</p>;

  // Vérification de la structure de data avant d'utiliser .map()
  if (isError || !Array.isArray(data)) {
    return <p>Erreur : Les conversations ne sont pas disponibles.</p>;
  }

  return (
    <div className="bg-white text-black rounded-lg shadow m-7">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>

      {/* Afficher les conversations si c'est l'utilisateur connecté */}
      {isOwnProfile ? (
        <>
          {data.length === 0 ? (
            <p>Aucune conversation. Vous pouvez commencer une conversation avec quelqu'un.</p>
          ) : (
            data.map((conversation) => (
              <div key={conversation._id} className="mb-4 p-4 rounded-lg bg-gray-100">
                <h3 className="font-semibold mb-2">Messages</h3>
                {conversation.messages?.length > 0 ? (
                  conversation.messages.map((message) => (
                    <div
                      key={message._id}
                      className={`mb-4 p-4 rounded-lg ${message.isDeleted ? "bg-gray-200" : "bg-gray-100"}`}
                    >
                      {/* Affichage de l'émetteur */}
                      <div className="flex items-center mb-2">
                        <img
                          src={message.sender?.profileImage || message.sender?.profilePicture || "/default-avatar.png"}
                          alt={message.sender?.username || "Utilisateur"}
                          className="w-10 h-10 rounded-full mr-2"
                        />
                        <span className="font-semibold">{message.sender?.username}</span>
                      </div>

                      {/* Affichage du contenu du message */}
                      <p>{message.content}</p>

                      {/* Afficher un bouton pour répondre */}
                      {/* {!message.isDeleted && (
                        <button
                          onClick={() => handleReplyToMessage(message._id, message.content)}
                          className="text-blue-500 mt-2"
                        >
                          Répondre
                        </button>
                      )} */}
                    </div>
                  ))
                ) : (
                  <p>Aucun message dans cette conversation.</p>
                )}
              </div>
            ))
          )}
        </>
      ) : (
        // Si c'est un autre profil, afficher la possibilité d'envoyer un message
        <>
          <p>Envoyez un message à cette personne</p>
          <div className="mt-4">
            {replyToMessageId && replyToMessageContent && (
              <div className="text-gray-500 mb-2">
                Vous répondez à : "{replyToMessageContent}"
              </div>
            )}
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez un message..."
              className="w-full bg-gray-200 p-2 border rounded mb-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Envoyer le message
            </button>

            {/* Afficher le retour visuel si le message a été envoyé */}
            {messageSent && (
              <div className="text-green-500 text-center mb-2 mt-2">
                Message envoyé avec succès !
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MessagesSection;
