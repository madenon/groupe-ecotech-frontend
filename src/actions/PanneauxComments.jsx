import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { SendHorizontal, Trash2, MoreHorizontal, Edit3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";

const PanneauxComments = ({ post, createComment, refetchPost }) => {
  const { authUser } = useAuth();
  const [editingpanneauCommentId, setEditingpanneauCommentId] = useState(null);
  const [formData, setFormData] = useState({
    commentContent: "",
    editingContent: "",
    replyContent: {},
  });

  // État pour la gestion de la visibilité des réponses et des champs de réponse
  const [repliesState, setRepliesState] = useState({});

  const refetchAndReset = () => {
    refetchPost?.();
    setFormData((prev) => ({ ...prev, commentContent: "", editingContent: "", replyContent: {} }));
  };

  // Soumission de commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.commentContent.trim()) return;

    try {
      await createComment(formData.commentContent);
      toast.success("Commentaire ajouté !");
      refetchAndReset();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'ajout du commentaire.");
    }
  };

  // Modification de commentaire
  const handleEditSubmit = async (panneauCommentId) => {
    try {
      await axiosInstance.put(`/panneau/${post._id}/comments/${panneauCommentId}`, {
        content: formData.editingContent,
      });
      toast.success("Commentaire modifié");
      setEditingpanneauCommentId(null);
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification");
    }
  };

  // Suppression de commentaire
  const handleDelete = async (panneauCommentId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;

    try {
      await axiosInstance.delete(`/panneau/${post._id}/comments/${panneauCommentId}`);
      toast.success("Commentaire supprimé");
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  // Soumission de réponse
  const handleReplySubmit = async (panneauCommentId) => {
    const replyContent = formData.replyContent[panneauCommentId];
    if (!replyContent || !replyContent.trim()) {
      toast.error("Le contenu de la réponse est requis");
      return;
    }

    try {
      await axiosInstance.post(`/panneau/${post._id}/comments/${panneauCommentId}/replies`, {
        content: replyContent,
      });
      toast.success("Réponse ajoutée !");
      refetchAndReset();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  // Affichage/fermeture des réponses
  const handleToggleReplies = (panneauCommentId) => {
    setRepliesState((prev) => ({
      ...prev,
      [panneauCommentId]: {
        ...prev[panneauCommentId],
        visible: !prev[panneauCommentId]?.visible, // Toggle la visibilité des réponses
      },
    }));
  };

  // Affichage du champ de réponse
  const handleShowReplyField = (panneauCommentId) => {
    setRepliesState((prev) => ({
      ...prev,
      [panneauCommentId]: { ...prev[panneauCommentId], replying: !prev[panneauCommentId]?.replying }, // Toggle le champ de réponse
    }));
  };

  // Suppression d'une réponse
  const handleDeleteReply = async (panneauCommentId, replyId) => {
    try {
      await axiosInstance.delete(`/panneau/${post._id}/comments/${panneauCommentId}/replies/${replyId}`);
      toast.success("Réponse supprimée !");
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de la réponse");
    }
  };

  if (!post || !Array.isArray(post.comments)) {
    return <div>Aucun commentaire disponible</div>;
  }

  return (
    <div className="mt-4 border-t w-full bg-gray-50 border-gray-200 pt-2 px-0">
      <div className="space-y-3 mb-4">
        {post.comments.map((comment) => {
          const isOwner = comment.user?._id === authUser._id || post.user?._id === authUser._id;
          const showReplies = repliesState[comment._id]?.visible;
          const showReplyField = repliesState[comment._id]?.replying;

          return (
            <div key={comment._id} className="bg-gray-50/10 p-2 rounded-md">
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
                          onClick={() =>
                            setEditingpanneauCommentId(
                              editingpanneauCommentId === comment._id ? null : comment._id
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {editingpanneauCommentId === comment._id && (
                          <div className="absolute right-0 -mt-24 w-32 bg-white border rounded-md shadow-md z-10">
                            <button
                              onClick={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  editingContent: comment.content,
                                }));
                                setEditingpanneauCommentId(comment._id);
                              }}
                              className="flex items-center gap-1 px-2 py-2 w-full text-sm hover:bg-gray-100"
                            >
                              <Edit3 size={16} /> Modifier
                            </button>
                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="flex items-center gap-1 px-2 py-1 w-full text-sm text-red-600 hover:bg-gray-100"
                            >
                              <Trash2 size={16} /> Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {editingpanneauCommentId === comment._id ? (
                    <div className="mt-1">
                      <input
                        value={formData.editingContent}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, editingContent: e.target.value }))
                        }
                        className="w-full bg-gray-200 outline-none rounded-md border px-2 py-1 text-sm"
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleEditSubmit(comment._id)}
                          className="text-blue-600 text-sm bg-gray-100"
                        >
                          Sauvegarder
                        </button>
                        <button
                          onClick={() => setEditingpanneauCommentId(null)}
                          className="text-sm text-yellow-700 bg-gray-100"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  )}

                  {/* Affichage des réponses aux commentaires */}
                  {comment.repliescommente && comment.repliescommente.length > 0 && (
                    <div className="mt-2">
                      <button
                        onClick={() => handleToggleReplies(comment._id)}
                        className="text-xs text-blue-600"
                      >
                        {showReplies ? "Fermer les réponses" : "Voir les réponses"}
                      </button>

                      {showReplies &&
                        comment.repliescommente.map((reply) => {
                          return (
                            <div key={reply._id} className="bg-gray-100 p-2 rounded-md">
                              <div className="flex items-start gap-3">
                                <img
                                  src={reply.user?.profilePicture || "/avatar.png"}
                                  alt={reply.user?.name || "Répondeur"}
                                  className="size-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold">{reply.user?.name || "Nom inconnu"}</p>
                                  <p className="text-sm text-gray-700">
  <span className="text-blue-600 font-semibold">
    @{comment.user?.name || "utilisateur"}
  </span>{" "}
  {reply.content}
</p>
                                  {reply.user?._id === authUser._id && (
                                    <button
                                      onClick={() => handleDeleteReply(comment._id, reply._id)}
                                      className="text-red-600 text-xs mt-1"
                                    >
                                      Supprimer
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  {/* Formulaire de réponse */}
                  {showReplyField && (
                    <div className="mt-2">
                      <input
                        value={formData.replyContent[comment._id] || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            replyContent: { ...prev.replyContent, [comment._id]: e.target.value },
                          }))
                        }
                        className="w-full bg-gray-200 outline-none rounded-md border px-2 py-1 text-sm"
                        placeholder="Répondre..."
                      />
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => handleReplySubmit(comment._id)}
                          className="text-blue-600 text-sm bg-gray-100"
                        >
                         Répondre
                        </button>
                        <button
                          onClick={() => handleShowReplyField(comment._id)}
                          className="text-sm text-yellow-700 bg-gray-100"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => handleShowReplyField(comment._id)}
                    className="text-xs text-blue-600 mt-1"
                  >
                    {showReplyField ? "Annuler la réponse" : "↩ Répondre"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulaire d’ajout de commentaire */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <img
          src={authUser.profilePicture || "/avatar.png"}
          alt="avatar"
          className="size-8 rounded-full"
        />
        <input
          type="text"
          placeholder="Ajouter un commentaire..."
          value={formData.commentContent}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, commentContent: e.target.value }))
          }
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!formData.commentContent.trim()}
          className="text-blue-600 hover:text-blue-800"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
};

export default PanneauxComments;
