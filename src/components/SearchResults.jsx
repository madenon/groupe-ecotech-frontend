import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const { data, isLoading, error } = useQuery({
  queryKey: ["searchPosts", query],
  queryFn: async () => {
    try {
      const res = await axiosInstance.get(`/posts?search=${query}`);
      if (res.data && res.data.posts) {
        return res.data.posts;  // Assure-toi que les posts existent
      } else {
        throw new Error("Aucun post trouvé");
      }
    } catch (err) {
      console.error(err);
      throw new Error("Erreur de récupération des posts");
    }
  },
  enabled: !!query,
});

if (isLoading) return <p className="text-black text-center text-3xl">Chargement...</p>;
if (error) return <p>Erreur : {error.message}</p>;
if (!data || data.length === 0) return <p className="text-black text-center text-3xl">Aucun résultat trouvé</p>;


  return (
    <div className="max-w-3xl text-black mx-auto mt-4 px-4">
      <h2 className="text-lg font-semibold mb-4">
        Résultats pour : "{query}"
      </h2>
      {data.map((post) => (
        <Link
          key={post._id}
           to={`/post/preview/${post._id}`}

          className="block border p-3 rounded-md mb-3 bg-white text-black hover:bg-gray-50 transition"
        >
          <p className="font-bold mb-1">{post.author?.name}</p>
          <p className="mb-2">{post.content.slice(0, 100)}...</p>
          {post.image && (
            <img
              src={post.image}
              alt="illustration"
              className="w-full h-48 object-cover text-black rounded-md"
            />
          )}
        </Link>
      ))}
    </div>
  );
};

export default SearchResults;
