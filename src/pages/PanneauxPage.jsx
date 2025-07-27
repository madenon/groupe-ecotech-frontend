import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Users } from "lucide-react";
import Panneaux from "./Panneaux";
import AppointmentBooking from "./AppointmentBooking";

const PanneauxPage = () => {
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
      const res = await axiosInstance.get(
        `/panneau/get?page=${page}&limit=${limit}`
      );
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
      <div className="hidden lg:block lg:col-span-5">
        <div className="text-black shadow-2xl font-bold">
          <h1> Prise de rendez-vous</h1>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloribus
          <div className="flex items-center gap-x-3 rounded-lg p-3 bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="w-full">
              <input
                type="text"
                id="id"
                name="name"
                placeholder="placeholder"
                className="w-full outline-none bg-transparent text-sm font-medium"
                disabled
              />
            </div>
          </div>
          <p className="text-xl text-orange-300">
            Pourquoi prendre rendez-vous ? Notre équipe est bien{" "}
            <span className="font-semibold">
              {" "}
              préparée pour étudier vos besoins
            </span>{" "}
            en termes de rentabilité et vous aidera à assurer un meilleur suivi
          </p>
          <AppointmentBooking />
        </div>
      </div>

      {/* Posts - 7 colonnes */}
      <div className="col-span-1 lg:col-span-6 lg:order-none">
        <h1 className="text-2xl font-bold text-center text-black">
          Liste des panneaux
        </h1>
        <div className="col-span-1 lg:col-span-7 lg:order-none">
          {isLoadingPosts ? (
            <div className="text-center">Chargement des posts...</div>
          ) : isErrorPosts ? (
            <div className="text-center">
              Erreur lors du chargement des posts
            </div>
          ) : postData?.panneaux?.length > 0 ? (
            postData.panneaux.map((panneau) => (
              <Panneaux key={panneau._id} post={panneau} />
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Pas de panneau encore</h2>
              <p className="text-gray-600 mb-6">
                Connectez-vous avec d'autres pour commencer à voir les
                publications dans vos flux.
              </p>
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Précédent
          </button>
          <button
            onClick={() => setPage((prevPage) => prevPage + 1)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanneauxPage;
