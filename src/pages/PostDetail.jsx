import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const PostDetail = () => {
  const { postId } = useParams();
  // Récupération des données du post via useQuery
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["postDetail", postId],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/posts/${postId}`);
        console.log(res.data); // Ajoute ce log pour vérifier la réponse
        if (res.data && res.data.post) {
          return res.data.post; // Retourne les données si tout est correct
        } else {
          throw new Error("Post not found"); // Lance une erreur si pas de post trouvé
        }
      } catch (err) {
        console.error(err); // Log l'erreur
        return null; // Retourne null en cas d'erreur
      }
    },
  });

  // Vérifications après l'appel useQuery
  if (isLoading) return <p>Chargement du post...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!post) return <p>Post introuvable</p>;

  // Déstructuration des données du post
  const { author, content, image } = post || {};

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white text-black rounded shadow">
      {author ? (
        <h1 className="text-2xl font-semibold mb-2">{author.name}</h1>
      ) : null}
      <p className="mb-4">{content}</p>
      {image && (
        <img
          src={image}
          alt="Post"
          className="w-full h-64 object-cover rounded"
        />
      )}
    </div>
  );
};

export default PostDetail;
