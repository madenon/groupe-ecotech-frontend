import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import EmailVerificationForm from "../auth/EmailVerificationForm";
import { axiosInstance } from "../lib/axios";

const verifyEmailRequest = async (code) => {
  const res = await axiosInstance.post("/auth/verify-email", { code });
  return res.data;
};

const EmailVerificationPage = () => {
  const navigate = useNavigate();

  const {
    mutate: verifyEmail,
    isPending: isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: verifyEmailRequest,
    onSuccess: () => {
      toast.success("Email vérifié avec succès !");
      navigate("/");
    },
    onError: () => {
      toast.error("Code invalide ou expiré");
    },
  });

  const handleVerification = (code) => {
    verifyEmail(code);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-200 px-4">
      <div className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Vérification Email
          </h2>
          <p className="text-white text-sm mb-4 text-center">
            Entrez le code à 6 chiffres envoyé à votre adresse email.
          </p>

          <EmailVerificationForm
            onSubmit={handleVerification}
            isLoading={isLoading}
            error={isError ? error?.response?.data?.message || "Une erreur est survenue" : null}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
