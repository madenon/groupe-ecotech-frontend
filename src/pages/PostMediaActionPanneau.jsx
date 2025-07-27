import { useRef, useState } from "react";
import { FileText } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const PostMediaActionPanneau = ({ post, debug = false }) => {
  const videoRef = useRef(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Extraction des médias du post
  const media = post?.media || [];
  const hasFallbackVideo = !media.length && post?.videoFile;
  const hasFallbackImage = !media.length && post?.image;

  // Recherche des types de médias (vidéo, pdf, images)
  const video = media.find((m) => m.type === "video");
  const pdf = media.find((m) => m.type === "pdf");
  const images = media.filter((m) => m.type === "image");

  if (debug) {
    console.log("Media dans PostMediaActionPanneau:", {
      media,
      videoFile: post?.videoFile,
      image: post?.image,
    });
  }

  // Affichage de la vidéo (fallback si aucune vidéo dans media)
  if (hasFallbackVideo) {
    return (
      <div className="w-full max-w-full">
        <video
          ref={videoRef}
          controls
          className="w-full max-w-full rounded-md object-cover"
          onError={() => {
            setVideoError(true);
            setVideoLoading(false);
          }}
          onLoadStart={() => setVideoLoading(true)}
          onLoadedData={() => setVideoLoading(false)}
          aria-label="Vidéo du post"
        >
          <source src={post.videoFile} type="video/mp4" />
          Votre navigateur ne supporte pas la vidéo.
        </video>

        {videoLoading && !videoError && (
          <p className="text-sm text-gray-500 mt-2 animate-pulse">Chargement de la vidéo...</p>
        )}
        {videoError && (
          <p className="text-sm text-red-500 mt-2">
            Impossible de lire la vidéo. Essayez plus tard.
          </p>
        )}
        <span className="text-xs text-gray-500 block mt-1">🎥 Vidéo jointe</span>
      </div>
    );
  }

  // Affichage d'une image en fallback
  if (hasFallbackImage) {
    return (
      <img
        src={post.image}
        alt="Image du post"
        className="w-full max-w-full max-h-[560px] rounded-md object-cover"
        loading="lazy"
      />
    );
  }

  // Si aucun média n'est disponible (pas de vidéo, pas de PDF, pas d'images)
  if (!video && !pdf && images.length === 0) {
    return (
      <div className="text-sm text-gray-500 italic mt-2">
        Aucun média attaché à ce post.
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {/* Affichage de la vidéo */}
      {video && (
        <div className="w-full">
          <video
            ref={videoRef}
            controls
            className="w-full max-w-full max-h-[680px] rounded-md object-cover"
            onError={() => {
              setVideoError(true);
              setVideoLoading(false);
            }}
            onLoadStart={() => setVideoLoading(true)}
            onLoadedData={() => setVideoLoading(false)}
            aria-label="Vidéo du post"
          >
            <source src={video.url} type="video/mp4" />
            Votre navigateur ne supporte pas la vidéo.
          </video>

          {videoLoading && !videoError && (
            <p className="text-sm text-gray-500 mt-2 animate-pulse">Chargement de la vidéo...</p>
          )}
          {videoError && (
            <p className="text-sm text-red-500 mt-2">
              Impossible de lire la vidéo. Essayez plus tard.
            </p>
          )}
          <span className="text-xs text-gray-500 block mt-1">🎥 Vidéo jointe</span>
        </div>
      )}

      {/* Affichage du PDF */}
      {/* {} */}
 {pdf && (
  <div className="mt-4 w-full">
    <div className="flex items-center gap-2 mb-2">
      <FileText size={20} />
      <span className="text-sm text-gray-700">Document PDF</span>
    </div>
    
    {/* Affichage du PDF en iframe */}
    <iframe
      src={`${pdf.url}?format=pdf&pdf-embed=1`} // Utilisation de l'URL du PDF Cloudinary avec l'option pour l'embedder dans une iframe
      className="w-full h-[600px] rounded-md border"
      title="Visualiseur PDF du post"
      loading="lazy"
    />
    
    {/* Si l'iframe ne s'affiche pas, offre un lien pour ouvrir le PDF dans un nouvel onglet */}
    <p className="text-xs text-gray-500 mt-1">
      Si le PDF ne s'affiche pas,{" "}
      <a
        href={pdf.url} // Lien direct vers Cloudinary pour ouvrir le PDF
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        cliquez ici pour l’ouvrir
      </a>
      .
    </p>

    {/* Lien de téléchargement forcé */}
    <p className="mt-2 text-xs text-gray-500">
      Vous pouvez aussi <a
        href={pdf.url} // Lien direct pour télécharger depuis Cloudinary
        download={pdf.name} // Force le téléchargement avec le nom du fichier
        className="text-blue-600 underline hover:text-blue-800"
      >
        télécharger le PDF
      </a>.
    </p>
  </div>
)}


      {/* Affichage des images */}
     {images.length > 0 && (
  <div className="mt-4">
    <p className="text-xl font-bold text-blue-400 mb-2">Il y a {images.length >1 ? `${images.length} images Faites défiler pour voir toutes les images` : `${images.length} image`} .</p>
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
    >
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={img.url}
            alt={`Image ${index + 1} du post`}
            className="w-full h-auto rounded-md object-cover"
            loading="lazy"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  </div>
)}

    </div>
  );
};

export default PostMediaActionPanneau;
