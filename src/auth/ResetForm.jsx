import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Input from "../components/Input";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { axiosInstance } from "../lib/axios";

const ResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { panneaux } = useParams(); // token dans l'URL
  const navigate = useNavigate();

  const resetPassword = async ({ token, password }) => {
    const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
      password,
    });
    return res.data;
  };

  const { mutate, isLoading, error } = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success("Mot de passe réinitialisé !");
      setMessage(data?.message || "Mot de passe modifié.");
      setTimeout(() => navigate("/login"), 1000);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur de réinitialisation");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    mutate({ token: panneaux, password });
  };

  return (
    <div className="max-w-5xl w-full flex flex-col sm:flex-row gap-6 items-center justify-center">
      {/* Formulaire de réinitialisation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:w-2/5 bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Réinitialiser le mot de passe
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}
        {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
          </motion.button>
        </form>
      </motion.div>

      {/* Indicateur de sécurité */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full sm:w-2/5 bg-gray-300 bg-opacity-60 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-md"
      >
        <PasswordStrengthMeter password={password} />
      </motion.div>
    </div>
  );
};

export default ResetForm;
