import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import Input from "../components/Input";
import FloatingShape from "../components/FloatingShape";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { axiosInstance } from "../lib/axios";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [dialCode, setDialCode] = useState("+225");
  const [localPhone, setLocalPhone] = useState("");
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [phoneError, setPhoneError] = useState("");
  const [hasConsented, setHasConsented] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const normalizePhone = (fullPhone) => {
    const cleaned = fullPhone.replace(/\s+/g, "").replace(/[^+\d]/g, "");
    const phone = cleaned.startsWith("+") ? cleaned : "+" + cleaned;

    try {
      const parsed = parsePhoneNumberFromString(phone);
      if (!parsed) return null;

      if (parsed.country === "CI") {
        const match = phone.match(/^\+225(\d{2})(\d{8})$/);
        const ivoirienValidPrefixes = ["01", "05", "07", "09", "25", "27"];
        if (!match || !ivoirienValidPrefixes.includes(match[1])) return null;
        return phone;
      }

      return parsed.isValid() ? parsed.number : null;
    } catch {
      return null;
    }
  };

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res.message || "Inscription réussie !");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/verify-email");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Erreur d'inscription.");
    },
  });

  const handleSignup = (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }

    if (!hasConsented) {
      toast.error("Vous devez accepter les conditions.");
      return;
    }

    let finalPhone = null;
    if (phoneInput) {
      finalPhone = normalizePhone(phoneInput);
    } else if (localPhone && dialCode) {
      finalPhone = normalizePhone(`${dialCode}${localPhone}`);
    }

    if (!finalPhone) {
      setPhoneError("Numéro invalide. Exemple : +2250707070707");
      return;
    }

    setPhoneError("");
    signUpMutation({
      name,
      username,
      email,
      password,
      confirmPassword,
      phone: finalPhone,
    });
  };

  return (
    <div className="min-h-screen flex bg-red-500 flex-col bg-gradient-to-br from-blue-700 via-gray-400 to-emerald-500 px-6 sm:px-16 overflow-auto">
      {/* Animations décoratives */}
      <FloatingShape color="bg-blue-900" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-emerald-900" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-lime-900" size="w-32 h-32" top="40%" left="-10%" delay={2} />

<div className="max-w-6xl w-full flex flex-col sm:flex-row gap-6 items-start pt-2 sm:pt-4">
        {/* Formulaire d'inscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-4/5 bg-gray-800 bg-opacity-40 -mb-5  backdrop-blur-xl rounded-2xl shadow-xl p-3 flex flex-col"
        >
          <h2 className="text-xl font-bold mb-5 text-center bg-gradient-to-tr from-gray-400 to-emerald-500 text-transparent bg-clip-text">
            La 1ʳᵉ plateforme dédiée aux panneaux solaires, à la formation et à l'échange communautaire.
          </h2>

          <form onSubmit={handleSignup} className="flex flex-col flex-grow">
            <Input icon={User} type="text" placeholder="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
            <Input icon={User} type="text" placeholder="Nom utilisateur" value={username} onChange={(e) => setUserName(e.target.value)} />
            <Input icon={Mail} type="email" placeholder="Adresse email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              icon={Lock}
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordsMatch(e.target.value === confirmPassword);
              }}
            />
            <Input
              icon={ShieldCheck}
              type="password"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPasswordTouched(true);
                setPasswordsMatch(e.target.value === password);
              }}
            />

            {!passwordsMatch && confirmPasswordTouched && (
              <p className="text-red-600 text-sm mt-2">Les mots de passe ne correspondent pas.</p>
            )}

            {/* Téléphone international */}
            <div className="mt-3">
              <label className="block text-white text-sm mb-1">Téléphone avec sélection de pays</label>
              <PhoneInput
                country="ml"
                value={phoneInput}
                onChange={setPhoneInput}
                preferredCountries={["ml", "ci", "ma", "fr"]}
                enableSearch
                inputStyle={{
                  width: "100%",
                  height: "44px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  paddingLeft: "48px",
                  fontSize: "16px",
                  backgroundColor: "#f9f9f9",
                }}
                disabled={!!localPhone}
              />
            </div>

            {/* Téléphone manuel */}
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                value={dialCode}
                onChange={(e) => setDialCode(e.target.value)}
                placeholder="+225"
                className="w-1/3 px-3 py-2 bg-white  border rounded-md"
                disabled={!!phoneInput}
              />
              <input
                type="tel"
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
                placeholder="Numéro local"
                className="w-2/3 px-3 py-2 bg-white border rounded-md"
                disabled={!!phoneInput}
              />
            </div>

            {phoneError && <p className="text-red-600 text-sm mt-1">{phoneError}</p>}

            {/* Consentement */}
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                id="consent"
                checked={hasConsented}
                onChange={() => setHasConsented(!hasConsented)}
                className="checkbox checkbox-sm checkbox-info"
              />
              <label htmlFor="consent" className="text-sm text-gray-300">
                J'accepte les{" "}
                <button
                  type="button"
                  onClick={() => setShowMoreInfo(true)}
                  className="underline text-blue-300 hover:text-blue-100"
                >
                  conditions d'utilisation et la politique de confidentialité
                </button>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || !passwordsMatch}
              className="w-full mt-4 py-2 px-4 bg-gradient-to-tr from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "S'inscrire"}
            </motion.button>
          </form>

          <div className="text-sm text-gray-200 text-center mt-4">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Se connecter
            </Link>
          </div>
        </motion.div>

        {/* Colonne droite avec le Password Meter */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full sm:w-2/5 bg-gray-300 backdrop-blur-lg p-6 sm:p-16 rounded-2xl shadow-md max-h-[90vh] overflow-y-auto"
        >
          <PasswordStrengthMeter password={password} />
        </motion.div>
      </div>

      {/* Modale d'information */}
      {showMoreInfo && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold mb-4">Conditions d'utilisation détaillées</h3>
            <div className="prose max-w-none text-left mb-6 text-sm">
              <p>Incluez ici vos mentions légales, votre politique de confidentialité, etc.</p>
            </div>
            <div className="flex justify-end">
              <button onClick={() => setShowMoreInfo(false)} className="text-gray-600 underline">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupForm;
