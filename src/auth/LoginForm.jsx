import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader, Lock, User } from "lucide-react";
import { toast } from "react-hot-toast";

import Input from "../components/Input";
import FloatingShape from "../components/FloatingShape";
import { axiosInstance } from "../lib/axios";

const LoginForm = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isLoading } = useMutation({
    mutationFn: async ({ identifier, password }) => {
      const res = await axiosInstance.post("/auth/login", { identifier, password });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("Connexion réussie !");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Échec de la connexion.");
    },
  });

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation({ identifier, password });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-700 via-gray-400 to-emerald-500 px-6 sm:px-16 overflow-auto">
      {/* Animations décoratives */}
      <FloatingShape color="bg-blue-900" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-900" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-900" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      <div className="max-w-6xl w-full flex flex-col sm:flex-row gap-6 items-start pt-1 sm:pt-2">
        {/* Formulaire de connexion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-3/5 bg-gray-800 bg-opacity-40 backdrop-blur-xl rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-bold mb-6 text-center bg-gradient-to-tr from-gray-400 to-emerald-500 text-transparent bg-clip-text">
            Connectez-vous à votre espace
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              icon={User}
              type="text"
              placeholder="Email ou nom d'utilisateur"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <Input
              icon={Lock}
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="text-right text-sm mb-4">
              <Link to="/forgot-password" className="text-blue-300 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-gradient-to-tr from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Se connecter"}
            </motion.button>
          </form>

          <div className="text-sm text-gray-200 text-center mt-6">
            Vous n'avez pas encore de compte ?{" "}
            <Link to="/signup" className="text-green-400 hover:underline">
              S'inscrire
            </Link>
          </div>
        </motion.div>

        {/* Colonne droite vide ou personnalisable */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden sm:block w-full  mt sm:w-3/5 bg-white bg-opacity-20 backdrop-blur-xl rounded-2xl shadow-md p-6 text-white text-center"
        >
          <div className="mb-52">
            <h3 className="text-lg font-semibold ">Rejoignez notre communauté</h3>
          <p>
            Bénéficiez d'un accès complet à nos services et des avantages exclusifs
          </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
