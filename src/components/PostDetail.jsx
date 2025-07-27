import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

const PostDetail = () => {
  const { id } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["postDetail", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/preview/${id}`);
      return res.data.post;
    },
  });

  if (isLoading) return <p>Chargement du post...</p>;
  if (error) return <p>Erreur : {error.message}</p>;
  if (!post) return <p>Post introuvable</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-2">{post.author?.name}</h1>
      <p className="mb-4">{post.content}</p>
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          className="w-full h-64 object-cover rounded"
        />
      )}
    </div>
  );
};

export default PostDetail;
