import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  const criteria = [
  { label: "Au moins 7 caractères", met: password.length >= 7 },
  {
    label: "Contenir une lettre majuscule",
    met: /[A-Z]/.test(password),
  },
  {
    label: "Contenir une lettre minuscule",
    met: /[a-z]/.test(password),
  },
  {
    label: "Contenir un chiffre",
    met: /\d/.test(password),
  },
  {
    label: "Contenir un caractère spécial",
    met: /[^A-Za-z0-9]/.test(password),
  },
];

  return (
    <div className="mt-2 space-y-1">
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length > 7) strength++;
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++;
    if (pass.match(/\d/)) strength++;
    if (pass.match(/[^a-zA-Z0-9]/)) strength++;

    return strength;
  };

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500";
    if (strength === 1) return "bg-orange-500";
    if (strength === 2) return "bg-yellow-500";
    if (strength === 3) return "bg-green-500";
  };
  const strength = getStrength(password);
  const getStrengthTxt = (strength) => {
    if (strength === 0) return "Faible";
    if (strength === 1) return "Moyenne";
    if (strength === 2) return "Forte";
    if (strength === 3) return "Extra forte";
    return "Extra forte";
  };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Niveau de sécurité du mot de passe</span>

        <span className="text-xs text-gray-400">
          {getStrengthTxt(strength)}
        </span>
      </div>
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
        ${index < strength ? getColor(strength) : "bg-gray-500"}`}
          ></div>
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
};

export default PasswordStrengthMeter;
