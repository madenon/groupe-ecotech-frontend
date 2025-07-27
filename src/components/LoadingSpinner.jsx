import { motion } from "framer-motion";
const LoadingSpinner = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-r from-gray-900 via-green-900 to-emerald-900 flex items-center
         justify-center relative overflow-hidden"
    >
      {/* Simple loading spiner */}
      <motion.div
        className="w-full border-4 border-t-gray-500 border-green-500  rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      ></motion.div>
    </div>
  );
};

export default LoadingSpinner;
 