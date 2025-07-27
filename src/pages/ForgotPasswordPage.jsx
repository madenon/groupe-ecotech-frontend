import { useState } from "react";
import { motion } from "framer-motion";
import ForgotPasswordForm from "../auth/ForgotPasswordForm";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
const ForgotPasswordPage = () => {
  const [submittedEmail, setSubmittedEmail] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-900 to-emerald-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Mot de passe oublié
        </h2>

        {!submittedEmail ? (
          <ForgotPasswordForm onSuccess={(email) => setSubmittedEmail(email)} />
        ) : (
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
            >
              <Mail className="w-8 h-8 text-white" />
            </motion.div>
            <p className="text-white">
              Si un compte existe pour <strong>{submittedEmail}</strong>, vous recevrez un lien de réinitialisation.
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <Link to="/login" className="text-green-400 hover:underline flex items-center justify-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
