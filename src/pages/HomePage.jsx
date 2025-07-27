import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import RecommendedUsers from "../components/RecommenderUers";
import PostCreation from "../layout/PostCreation";
import { axiosInstance } from "../lib/axios";
import { Users } from "lucide-react";
import Posts from "../actions/Posts";
import SideBar from "./SideBar";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) return null;
        toast.error(
          err.response?.data?.message || "Erreur lors de l’authentification."
        );
      }
    },
  });

  const {
    data: postData,
    isLoading: isLoadingPosts,
    isFetching: isFetchingPosts,
    isError: isErrorPosts,
  } = useQuery({
    queryKey: ["posts", page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
      return res.data;
    },
    keepPreviousData: true,
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Erreur lors du chargement des posts"
      );
    },
  });

  const {
    data: recommendedUsers,
    isLoading: isLoadingSuggestions,
    isError: isErrorSuggestions,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/users/suggestions");
      return res.data;
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Erreur lors du chargement des suggestions"
      );
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-4 text-black">
      <div className="hidden lg:block lg:col-span-2">
        <SideBar user={authUser} />
      </div>

      {/* Posts - 7 colonnes */}
      <div className="col-span-1 lg:col-span-7 lg:order-none">
        <PostCreation user={authUser} />

        {postData?.posts?.length > 0 ? (
          postData.posts.map((post) => <Posts key={post._id} post={post} />)
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Pas de post encore</h2>
            <p className="text-gray-600 mb-6">
              Connectez-vous avec d'autres pour commencer à voir les
              publications dans vos flux.
            </p>
          </div>
        )}
      </div>

      {/* Suggestions - 3 colonnes */}
      {recommendedUsers?.length > 0 && (
        <div className="hidden lg:block lg:col-span-3">
          <div className="space-y-6 sticky top-2">
            <div className="bg-white rounded-lg shadow px-4 py-2">
              <h2 className="text-lg font-bold mb-4">
                Les gens que vous connaissez peut-être
              </h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUsers key={user._id} user={user} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
