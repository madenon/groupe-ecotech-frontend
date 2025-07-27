import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Edit3, Trash2 } from "react-feather";
import { axiosInstance } from "../lib/axios";

const PostComment = ({
  comment,
  authUser,
  handleDeleteComment,
  setComments,
}) => {
  const isOwner = comment.user?._id === authUser._id;
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fonction pour soumettre une réponse
  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    setLoading(true);
    try {
      const { data } = await axiosInstance.post(
        `/posts/${comment.postId}/comments/${comment._id}/replies`,
        { replyContent }
      );
      setComments((prevComments) =>
        prevComments.map((c) =>
          c._id === comment._id ? { ...c, replies: [...c.replies, data] } : c
        )
      );
      setReplyContent(""); // Réinitialiser le champ de texte après soumission
    } catch (error) {
      console.error("Erreur lors de l'ajout de la réponse", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Suppression du commentaire avec axiosInstance
      const { data } = await axiosInstance.delete(`/posts/${comment.postId}/comments/${commentId}`);
      
      // Mise à jour de l'état des commentaires après suppression
      setComments((prevComments) =>
        prevComments.filter((c) => c._id !== commentId)
      );
      console.log("Commentaire supprimé", data);
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire", error);
    }
  };
  return (
    <div className="comment bg-gray-50/10 p-2 rounded-md mb-2">
      <div className="flex items-start gap-3">
        <img
          src={comment.user?.profilePicture || "/avatar.png"}
          alt={comment.user?.name || "Auteur"}
          className="size-8 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">{comment.user?.name || "Nom inconnu"}</p>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </span>
            </div>
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => handleDeleteComment(comment?._id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreHorizontal size={16} />
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-700">{comment.content}</p>

          {/* Affichage des réponses */}
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-gray-500 mt-2"
          >
            {showReplies ? "Cacher les réponses" : "Voir les réponses"}
          </button>

          {showReplies && (
            <div className="mt-4">
              {comment.replies?.length ? (
                comment.replies.map((reply) => (
                  <div key={reply._id} className="bg-gray-100 p-2 rounded-md flex items-start gap-3 mb-2">
                    <img
                      src={reply.user?.profilePicture || "/avatar.png"}
                      alt={reply.user?.name || "Répondant"}
                      className="size-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex gap-2 items-center">
                        <p className="font-semibold">{reply.user?.name || "Répondant inconnu"}</p>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(reply.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{reply.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">Aucune réponse</p>
              )}
            </div>
          )}

          {/* Formulaire pour ajouter une réponse */}
          <div className="mt-4 flex gap-2 items-center">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Écrire une réponse..."
              className="w-full p-2 text-sm text-gray-700 border rounded-md"
            />
            <button
              onClick={handleReplySubmit}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              {loading ? "Envoi..." : "Répondre"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
