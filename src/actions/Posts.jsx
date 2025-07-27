import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MessageCircle,
  Share2,
  ThumbsUp,
  Trash2,
  Edit3,
  MoreVertical,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import PostContent from "./PostContent";
import { platformShareUrls } from "./sharedConfig";
import PostAction from "./PostAction";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../lib/axios";
import PostMediaAction from "./PostMediaAction ";
import PostComments from "./PostComments";
import { platformIcons } from './SocialShared';
const Posts = ({ post }) => {
  const { postId } = useParams();
  const { authUser } = useAuth();
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedImage, setEditedImage] = useState(null);
  const [showPostActions, setShowPostActions] = useState(false);
  const postActionsRef = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [editedImagePreview, setEditedImagePreview] = useState(post.image || null);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser?._id === post?.author?._id;
  const isLiked = post?.likes?.includes(authUser?._id);
  const shareMenuRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: shareData, isLoading: isLoadingShares } = useQuery({
    queryKey: ["shares", post._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/shared/post/${post._id}`);
      return res.data;
    },
    enabled: !!post?._id,
  });

  const { mutate: sharePost } = useMutation({
    mutationFn: async (platform) => {
      return axiosInstance.post(`/shared/${post._id}`, { platform });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shares", post._id] });
    },
    onError: () => {
      toast.error("Erreur lors du partage");
    },
  });

  const handleShare = (platform) => {
    const urlToShare = `${window.location.origin}/post/${post._id}`;
    const shareUrl = platformShareUrls[platform]?.(urlToShare);

    if (!shareUrl) return;

    sharePost(platform);
    window.open(shareUrl, "_blank");
    setShowShareOptions(false);

    toast.success(`Post partagé sur ${platform}`);
  };

  // --- Delete Post
  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/${post?._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post supprimé avec succès", { duration: 2000 });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Une erreur est survenue");
      throw err;
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;
    deletePost();
  };

  // --- Like Post
  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Impossible d'ajouter un like"
      );
      throw error;
    },
  });

  const handleLikePost = () => {
    if (isLikingPost) return;
    likePost();
  };
  

  // --- Commentaire création
  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Commentaire ajouté avec succès");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Impossible d'ajouter un commentaire"
      );
      throw error;
    },
  });

  // --- Edition: Mutation update post (PUT) avec FormData (image + contenu)
  const { mutate: updatePost, isPending: isUpdatingPost } = useMutation({
    mutationFn: async (formData) => {
      return axiosInstance.put(`/posts/${post._id}`, formData);
    },
    onSuccess: (res) => {
      const updatedPost = res.data.post;
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", post._id] });

      toast.success("Post mis à jour avec succès");

      setEditedImagePreview(updatedPost.image);
      post.image = updatedPost.image;
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Erreur updatePost:", error);
      toast.error("Erreur lors de la mise à jour du post");
    },
  });

  const handleUpdatePost = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", editedContent);

    if (editedImage) {
      formData.append("image", editedImage); 
    }

    formData.append("removeMedia", removeImage ? "true" : "false");

    updatePost(formData);
  };

  // --- Gestion preview image sélectionnée lors édition
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEditedImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setEditedImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setEditedImagePreview(null);
    }
  };

  // --- Contenu à afficher avec gestion "Voir plus" / "Voir moins"
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        shareMenuRef.current &&
        !shareMenuRef.current.contains(event.target)
      ) {
        setShowShareOptions(false);
      }
    };
    if (showShareOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showShareOptions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        postActionsRef.current &&
        !postActionsRef.current.contains(event.target)
      ) {
        setShowPostActions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment(""); // Réinitialiser le champ de commentaire

      setComments((prevComments) => [
        ...prevComments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            username: authUser.username,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 w-full max-w-full overflow-hidden">
      <div className="p-2">
        <div className="flex items-center justify-between mb-4">
          <div className="w-full overflow-auto flex items-center gap-3">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post?.author?.profilePicture || "/lg.jpg"}
                alt={post?.author?.name}
                className="size-10 shadow-md rounded-full"
              />
            </Link>
            <div>
              <Link to={`/profile/${post?.author?.name}`}>
                <h3 className="font-semibold text-xl">{post?.author?.name}</h3>
              </Link>
              <p className="text-xs text-[#5E5E5E]">{post?.author?.headline}</p>
              <p className="text-xs text-[#5E5E5E]">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </p>
            </div>
          </div>
          {isOwner && !isEditing && (
            <div className="relative" ref={postActionsRef}>
              <button
                onClick={() => setShowPostActions((prev) => !prev)}
                className="p-2 text-blue-700 hover:bg-gray-100 rounded-full"
                aria-label="Actions du post"
              >
                <MoreVertical size={20} />
              </button>

              {showPostActions && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-20">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setEditedContent(post.content);
                      setEditedImage(null);
                      setEditedImagePreview(post.image || null);
                      setShowPostActions(false);
                    }}
                    className="w-full flex items-center gap-2 text-blue-500 text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <Edit3 size={16} /> Modifier
                  </button>
                  <button
                    onClick={() => {
                      setShowPostActions(false);
                      handleDeletePost();
                    }}
                    aria-label="Supprimer ce post"
                    className="w-full flex items-center gap-2 text-left  px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- Mode édition */}
        {isEditing ? (
          <form onSubmit={handleUpdatePost} className="mb-4">
            <textarea
              className="w-full p-3 rounded-lg bg-[#F3F2EF] resize-none min-h-[100px]"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              required
              maxLength={5000}
            />

            {editedImagePreview && (
              <div className="mt-4 space-y-2">
                <img
                  src={editedImagePreview}
                  alt="Prévisualisation"
                  className="max-w-full h-auto rounded-md border border-gray-200"
                  style={{ maxHeight: "400px" }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setRemoveImage(true);
                    setEditedImage(null);
                    setEditedImagePreview(null);
                  }}
                  className="text-sm text-red-500 underline hover:text-red-700"
                >
                  Supprimer l'image
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPost}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                >
                  {isUpdatingPost ? "Mise à jour..." : "Enregistrer"}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <>
            <PostContent post={post} createComment={handleAddComment} />
            <PostMediaAction post={post} />

            <div className="flex justify-around items-center text-sm text-gray-600 mt-2 px-2 gap-1">
              <PostAction
                icon={
                  <ThumbsUp
                    size={16}
                    className={isLiked ? "text-blue-500 fill-blue-500" : ""}
                  />
                }
                text={
                  <p className="whitespace-nowrap">
                    <span className="hidden sm:inline">J'aime</span>{" "}
                    {post?.likes?.length}
                  </p>
                }
                onClick={handleLikePost}
              />

              <PostAction
                icon={<MessageCircle size={16} />}
                text={
                  <p className="whitespace-nowrap">
                    <span className="hidden sm:inline">Commenter</span>{" "}
                    {comments?.length}
                  </p>
                }
                onClick={() => setShowComments(!showComments)}
              />

              <div className="relative">
                <PostAction
                  icon={<Share2 size={16} />}
                  text={
                    <p className="whitespace-nowrap">
                      <span className="hidden sm:inline">Partager</span>{" "}
                      {shareData?.count ?? 0}
                    </p>
                  }
                  onClick={() => setShowShareOptions((prev) => !prev)}
                />
                {showShareOptions && (
                  <div
                    ref={shareMenuRef}
                    className="absolute right-0 bottom-full mb-2 w-36 bg-white border border-gray-200 rounded-lg shadow-md z-[9999]"
                  >
                    <ul className="flex flex-row flex-wrap p-2 space-x-2">
                      {["whatsapp", "facebook", "linkedin", "email"].map(
                        (platform) => (
                          <button
                            key={platform}
                            onClick={() => handleShare(platform)}
                            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded"
                          >
                            {platformIcons[platform]}{" "}
                            <span className="capitalize">{platform}</span>
                          </button>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {showComments && (
          <div className="px-4  pb-4">
            <PostComments
              post={post}
              createComment={(content) => {
                createComment(content);
                setComments((prevComments) => [
                  ...prevComments,
                  {
                    content,
                    user: {
                      _id: authUser._id,
                      name: authUser.name,
                      username: authUser.username,
                      profilePicture: authUser.profilePicture,
                    },
                    createdAt: new Date().toISOString(),
                  },
                ]);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
