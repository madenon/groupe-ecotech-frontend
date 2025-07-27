import  { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";

const Condition = () => {
  const [legalText, setLegalText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLegalText = async () => {
      try {
        const res = await axiosInstance.get("/legalText/conditions"); // appel à l'API
        setLegalText(res.data);
      } catch (err) {
        setError("Erreur lors du chargement du texte légal.");
      } finally {
        setLoading(false);
      }
    };

    fetchLegalText();
  }, []);

  if (loading) return <p className="text-center py-8">Chargement...</p>;
  if (error) return <p className="text-center text-red-500 py-8">{error}</p>;

  return (
    <div className="flex justify-center bg-gray-100 text-gray-800 px-4 py-12">
      <div className="w-full max-w-3xl">
        <h1 className="text-xl font-semibold mb-6 text-center">{legalText?.title}</h1>
        <p className="text-sm leading-relaxed text-justify whitespace-pre-wrap">
          {legalText?.content}
        </p>
      </div>
    </div>
  );
};

export default Condition;
