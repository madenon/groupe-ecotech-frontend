import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const EmailVerificationForm = ({ onSubmit, isLoading, error }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [localError, setLocalError] = useState(null);

  // Gérer les changements par touche ou coller
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Limite à un seul caractère numérique
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Gérer le déplacement clavier (← → Backspace)
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (code[index] === "") {
        if (index > 0) inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Gérer le coller (paste)
  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;

    const chars = paste.slice(0, 6).split("");
    setCode(chars);
    inputRefs.current[5]?.focus();
  };

  // Soumission manuelle
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCode = code.join("");
    if (finalCode.length !== 6) {
      setLocalError("Veuillez entrer les 6 chiffres.");
      return;
    }
    setLocalError(null);
    onSubmit(finalCode);
  };

  // Soumission automatique si les 6 chiffres sont remplis
  useEffect(() => {
    if (code.every((digit) => digit.length === 1)) {
      onSubmit(code.join(""));
    }
  }, [code]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between gap-2">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center font-bold text-white bg-gray-700 border-2 border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        ))}
      </div>

      {(localError || error) && (
        <p className="text-red-500 text-center mt-4 text-sm">
          {localError || error}
        </p>
      )}

      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:from-green-600 hover:to-emerald-700 focus:outline-none disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? "Vérification en cours..." : "Vérifier mon email"}
      </motion.button>
    </form>
  );
};

export default EmailVerificationForm;
