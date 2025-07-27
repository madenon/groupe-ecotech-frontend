


import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { SendHorizontal, Trash2, MoreHorizontal, Edit3 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";

const PostComments = ({ post, createComment, refetchPost }) => {
  const { authUser } = useAuth();
  const [commentContent, setCommentContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [replyContent, setReplyContent] = useState({});
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    await createComment(commentContent);
    setCommentContent("");
    refetchPost?.();
  };

  const handleEditSubmit = async (commentId) => {
    try {
      await axiosInstance.put(`/posts/${post._id}/comments/${commentId}`, {
        content: editingContent,
      });
      toast.success("Commentaire modifié");
      setEditingCommentId(null);
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosInstance.delete(`/posts/${post._id}/comments/${commentId}`);
      toast.success("Commentaire supprimé");
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!replyContent[commentId]?.trim()) return;
    try {
      await axiosInstance.post(`/posts/${post._id}/comments/${commentId}/replies`, {
        content: replyContent[commentId],
      });
      toast.success("Réponse ajoutée !");
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
      setReplyingToCommentId(null);
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await axiosInstance.delete(`/posts/${post._id}/comments/${commentId}/replies/${replyId}`);
      toast.success("Réponse supprimée !");
      refetchPost?.();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression");
    }
  };

  if (!post || !Array.isArray(post.comments)) {
    return <div>Aucun commentaire disponible</div>;
  }

  return (
    <div className="mt-4 border-t w-full bg-gray-50 border-gray-200 pt-2 px-0">
      <div className="space-y-3 mb-4">
        {post.comments.map((comment) => {
          const isOwner =
            comment.user?._id === authUser._id || post.user?._id === authUser._id;

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
                            setEditingCommentId(
                              editingCommentId === comment._id ? null : comment._id
                            )
                          }
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <MoreHorizontal size={16} />
                        </button>

                        {editingCommentId === comment._id && (
                          <div className="absolute right-0 -mt-24 w-32 bg-white border rounded-md shadow-md z-10">
                            <button
                              onClick={() => {
                                setEditingContent(comment.content);
                                setEditingCommentId(comment._id);
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

                  {editingCommentId === comment._id ? (
                    <div className="mt-1">
                      <input
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
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
                          onClick={() => setEditingCommentId(null)}
                          className="text-sm text-yellow-700 bg-gray-100"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  )}

           




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
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={!commentContent.trim()}
          className="text-blue-600 hover:text-blue-800"
        >
          <SendHorizontal size={18} />
        </button>
      </form>
    </div>
  );
};

export default PostComments;

