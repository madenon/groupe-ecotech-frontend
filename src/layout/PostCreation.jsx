import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { Image, Loader, Video } from "lucide-react";
import toast from "react-hot-toast";

const PostCreation = ({ user }) => {
  const [content, setContent] = useState(""); // Contenu du post
  const [images, setImages] = useState([]); // Liste des images
  const [video, setVideo] = useState(null); // Vidéo associée
  const [imagePreview, setImagePreview] = useState(null); // Prévisualisation de l'image
  const [isUploading, setIsUploading] = useState(false); // État de l'upload en cours
  const queryClient = useQueryClient();

  // Mutation pour créer un post
  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    },
    onSuccess: (res) => {
      resetForm();
      toast.success(res.message || "Post créé avec succès");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur de création de post");
    },
  });

  // Fonction de création du post
  const handlePostCreation = async (e) => {
    e.preventDefault();

    // Validation du contenu (plus de 5 mots)
    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount <= 3) {
      toast.error("Le contenu doit comporter plus de 3 mots.");
      return;
    }

    // Validation des fichiers (image et vidéo ne peuvent pas être combinés)
    if (images.length > 0 && video) {
      toast.error("Vous ne pouvez pas sélectionner à la fois une image et une vidéo.");
      return;
    }

    // Soumettre le formulaire
    try {
      setIsUploading(true); // Marquer le début de l'upload
      const formData = new FormData();
      formData.append('content', content); // Contenu du post

      // Ajouter les images si présentes
      if (images.length > 0) {
        images.forEach((image) => formData.append("images", image));
      }

      // Ajouter la vidéo si présente
      if (video) {
        formData.append("video", video);
      }

      // Effectuer la mutation pour créer le post
      createPostMutation(formData);
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
    } finally {
      setIsUploading(false); // Fin de l'upload
    }
  };

  // Réinitialisation du formulaire
  const resetForm = () => {
    setContent("");
    setImages([]);
    setVideo(null);
    setImagePreview(null);
  };

  // Gestion de la modification des images (sélection multiple)
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      // Validation du type et taille des fichiers
      for (let file of files) {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          toast.error("Seules les images JPG et PNG sont autorisées.");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error("L'image est trop volumineuse. Taille maximale : 10 Mo.");
          return;
        }
      }

      // Mettre à jour l'état des images
      setImages(Array.from(files));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  // Gestion du changement de fichier (image ou vidéo)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0]; // Ex: 'image', 'video'
      const maxSize = 10 * 1024 * 1024; // 10 MB max

      // Validation de la taille du fichier
      if (file.size > maxSize) {
        toast.error("Le fichier est trop volumineux. La taille maximale est de 10 Mo.");
        return;
      }

      // Si c'est une image
      if (fileType === "image") {
        if (video) {
          toast.error("Vous ne pouvez pas ajouter une image et une vidéo ensemble.");
          return;
        }
        setImages([file]);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
      // Si c'est une vidéo
      else if (fileType === "video") {
        if (images.length > 0) {
          toast.error("Vous ne pouvez pas ajouter une image et une vidéo ensemble.");
          return;
        }
        setVideo(file);
        setImagePreview(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="size-12 rounded-full"
        />
        <textarea
          placeholder="Quoi de neuf ?"
          className="w-full p-3 rounded-lg bg-[#F3F2EF] focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Prévisualisation de l'image */}
      {imagePreview && (
        <div className="mt-4">
          <img src={imagePreview} alt="Aperçu" className="w-full h-auto rounded-lg" />
        </div>
      )}

      {/* Prévisualisation de la vidéo */}
      {video && !imagePreview && (
        <div className="mt-4">
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Boutons pour ajouter des fichiers */}
      <div className="flex justify-between  gap-1 items-center mt-4">
        <div className="flex space-x-16">
          <label className="flex items-center text-[#5E5E5E] hover:text-[#5E5E5E]-dark transition-colors duration-200 cursor-pointer">
            <Image className="mr-2" size={20} />
            <span>Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
          </label>
          <label className="flex items-center text-[#5E5E5E] hover:text-[#5E5E5E]-dark transition-colors duration-200 cursor-pointer">
            <Video className="mr-2" size={20} />
            <span>Vidéo</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          className="bg-[#0A66C2] text-white py-2 px-4 rounded-md hover:bg-[#0A66C2]-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending || isUploading}
        >
          {isUploading || isPending ? <Loader className="size-5 animate-spin" /> : "Publier"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
