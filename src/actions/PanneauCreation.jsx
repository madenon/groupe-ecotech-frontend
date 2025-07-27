import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image, Loader, Video, FileText } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const PanneauCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  if (!user) return <div>Chargement utilisateur...</div>;
  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/panneau/create", postData, {
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

  const handlePostCreation = async (e) => {
    e.preventDefault();

    const wordCount = content.trim().split(/\s+/).length;
    if (wordCount <= 3) {
      toast.error("Le contenu doit comporter plus de 3 mots.");
      return;
    }

    if (
      (images.length > 0 && (video || pdf)) ||
      (video && (images.length > 0 || pdf)) ||
      (pdf && (images.length > 0 || video))
    ) {
      toast.error("Vous ne pouvez pas combiner images, vidéo et PDF dans le même post.");
      return;
    }

    if (images.length > 5) {
      toast.error("Vous pouvez ajouter jusqu'à 5 images maximum.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("content", content);

      if (images.length > 0) {
        images.forEach((image) => formData.append("images", image)); // ✅ Correction ici
      } else if (video) {
        formData.append("video", video); // ✅ Correction ici
      } else if (pdf) {
        formData.append("pdfdoc", pdf); // ✅ Correction ici
      }

      createPostMutation(formData);
    } catch (error) {
      console.error("Erreur lors de la création du post:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setImages([]);
    setVideo(null);
    setPdf(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      for (let file of files) {
        if (!["image/jpeg", "image/png"].includes(file.type)) {
          toast.error("Seules les images JPG et PNG sont autorisées.");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error("L'image est trop volumineuse. Taille max : 10 Mo.");
          return;
        }
      }
      if (video || pdf) {
        toast.error("Vous ne pouvez pas ajouter une image avec une vidéo ou un PDF.");
        return;
      }
      setImages(Array.from(files));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("video")) {
        toast.error("Veuillez sélectionner un fichier vidéo valide.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La vidéo est trop volumineuse. Taille max : 10 Mo.");
        return;
      }
      if (images.length > 0 || pdf) {
        toast.error("Vous ne pouvez pas ajouter une vidéo avec des images ou un PDF.");
        return;
      }
      setVideo(file);
      setImagePreview(null);
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Veuillez sélectionner un fichier PDF valide.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le PDF est trop volumineux. Taille max : 10 Mo.");
        return;
      }
      if (images.length > 0 || video) {
        toast.error("Vous ne pouvez pas ajouter un PDF avec des images ou une vidéo.");
        return;
      }
      setPdf(file);
      setImagePreview(null);
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

      {imagePreview && (
        <div className="mt-4">
          <img src={imagePreview} alt="Aperçu" className="w-full h-auto rounded-lg" />
        </div>
      )}

      {video && !imagePreview && (
        <div className="mt-4">
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full rounded-lg"
          />
        </div>
      )}

    {pdf && (
  <div className="mt-4 flex items-center space-x-2 bg-gray-100 p-3 rounded">
    <FileText size={24} />
    {/* Lien avec téléchargement forcé */}
    <a
      href={URL.createObjectURL(pdf)} // lien local vers le fichier choisi
      download={pdf.name}              // force le téléchargement
      className="text-blue-600 underline hover:text-blue-800"
    >
      {pdf.name}
    </a>
  </div>
)}


      <div className="flex justify-between gap-1 items-center mt-4">
        <div className="flex space-x-6">
          <label className="flex items-center text-[#5E5E5E] cursor-pointer">
            <Image className="mr-2" size={20} />
            <span>Photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleImageChange}
              className="hidden"
              multiple
            />
          </label>
          <label className="flex items-center text-[#5E5E5E] cursor-pointer">
            <Video className="mr-2" size={20} />
            <span>Vidéo</span>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="hidden"
            />
          </label>
          {/* <label className="flex items-center text-[#5E5E5E] cursor-pointer">
            <FileText className="mr-2" size={20} />
            <span>PDF</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="hidden"
            />
          </label> */}
        </div>

        <button
          className="bg-[#0A66C2] text-white py-2 px-4 rounded-md hover:bg-[#004182] transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending || isUploading}
        >
          {isUploading || isPending ? <Loader className="size-5 animate-spin" /> : "Publier"}
        </button>
      </div>
    </div>
  );
};

export default PanneauCreation;
