import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import useDeleteCountry from "./useDeleteCountry";
import UpdateCountryForm from "./UpdateCountryForm";

const CountryList = () => {
  const [editingCountry, setEditingCountry] = useState(null);
  const { data: countries, isLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () =>
      axiosInstance.get("/country").then((res) => res.data),
  });

  const { mutate: deleteCountry } = useDeleteCountry();

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="space-y-6">
      {editingCountry && (
        <UpdateCountryForm country={editingCountry} onClose={() => setEditingCountry(null)} />
      )}
      <ul className="space-y-4">
        {countries?.map((country) => (
          <li key={country._id} className="bg-white shadow p-4 rounded flex justify-between items-center">
            <div>
              <p className="font-semibold">{country.name} ({country.code})</p>
              <p>{country.continent}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setEditingCountry(country)}
                className="text-blue-600 hover:underline"
              >
                Modifier
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Supprimer ce pays ?")) {
                    deleteCountry(country._id);
                  }
                }}
                className="text-red-600 hover:underline"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CountryList;
