import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import Input from "../components/Input";
import { axiosInstance } from "../lib/axios";

// ──────────────────────────────────────────────────────────
// Composant
// ──────────────────────────────────────────────────────────
const ForgotPasswordForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");

  const mutation = useMutation({
    // Le paramètre « variables » sera l'email transmis à mutate()
    mutationFn: (variables) =>
      axiosInstance.post("/auth/forgot-password", { email: variables }),

    // On renvoie l'email saisi au parent (animation de confirmation, etc.)
    onSuccess: (_, variables) => onSuccess?.(variables),
  });

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(email); // ← « email » devient « variables » ci‑dessus
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-gray-300 text-center">
        Entrez votre email pour recevoir un lien de réinitialisation.
      </p>

      {mutation.isError && (
        <div className="bg-red-500 text-white text-sm rounded-md p-2 text-center">
          {mutation.error?.response?.data?.message ??
            "Une erreur est survenue."}
        </div>
      )}

      <Input
        icon={Mail}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white font-bold px-4 py-3 rounded-md shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        {mutation.isLoading ? (
          <Loader className="w-6 h-6 animate-spin mx-auto" />
        ) : (
          "Envoyer"
        )}
      </motion.button>
    </form>
  );
};

export default ForgotPasswordForm;
