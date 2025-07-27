import { useState, useEffect, useRef } from "react";
import { axiosInstance } from "../lib/axios"; // Supposons que axiosInstance est configuré pour tes requêtes API.

const PostMediaAction = ({ post }) => {
  const [videoError, setVideoError] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const videoRef = useRef(null);

  // Réinitialisation des erreurs vidéo à chaque nouvelle vidéo
  useEffect(() => {
    if (post?.videoFile) {
      setVideoError(false);
      setVideoLoading(true);
    }
  }, [post]);

  // Fonction pour gérer les erreurs liées à la vidéo
  const handleVideoError = () => {
    setVideoError(true);
    setVideoLoading(false);
    console.error("Erreur de chargement de la vidéo.");
  };

  // Fonction pour récupérer une vidéo via Axios (si nécessaire)
  const fetchVideo = async (videoUrl) => {
    try {
      const response = await axiosInstance.get(videoUrl, {
        responseType: "blob", // Récupérer le fichier vidéo en blob
      });
      const videoObjectURL = URL.createObjectURL(response.data);
      if (videoRef.current) {
        videoRef.current.src = videoObjectURL; // Met à jour la source de la vidéo
      }
    } catch (error) {
      setVideoError(true);
      console.error("Erreur lors du téléchargement de la vidéo:", error);
    } finally {
      setVideoLoading(false);
    }
  };

  // Si une image est présente, on l'affiche
  if (post?.image) {
    return (
      <div className="w-full max-w-full aspect-video overflow-hidden rounded-md">
  <img
    src={post.image}
    className="w-full h-full object-contain"
    alt="Image jointe au post"
  />
</div>

    );
  }

  // Si une vidéo est présente, on la charge
  if (post?.videoFile) {
    const videoUrl = post.videoFile;

    return (
      <div className="w-full max-w-full">
        <video
          ref={videoRef}
          controls
          className="w-full max-w-full rounded-md object-cover"
          aria-label="Vidéo jointe au post"
          onError={handleVideoError}
          onLoadStart={() => setVideoLoading(true)} // Lancement du loader lors du début du chargement
          onLoadedData={() => setVideoLoading(false)} // Arrêt du loader une fois que la vidéo est prête
        >
          <source src={videoUrl} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>

        {/* Affichage du loader pendant le chargement */}
        {videoLoading && !videoError && (
          <div className="text-center mt-2">
            <p className="text-sm text-gray-500">Chargement de la vidéo...</p>
          </div>
        )}

        {/* Affichage d'une erreur en cas de problème */}
        {videoError && (
          <div className="text-center mt-2">
            <p className="text-sm text-red-500">Impossible de charger la vidéo. Essayez plus tard.</p>
          </div>
        )}

        {/* Légende */}
        <span className="text-xs text-gray-500 block mt-1">🎥 Vidéo jointe</span>
      </div>
    );
  }

  return null;
};

export default PostMediaAction;
