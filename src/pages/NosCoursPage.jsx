import React, { useState } from "react";
import useCountries from "../actions/useCountries";
import { axiosInstance } from "../lib/axios";

const getFlag = (code) => {
  if (!code) return "🏳️";
  const codePoints = code
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

const groupByContinent = (countries) => {
  return countries.reduce((acc, country) => {
    const continent = country.continent || "Inconnu";
    if (!acc[continent]) acc[continent] = [];
    acc[continent].push(country);
    return acc;
  }, {});
};

const NosCoursPage = () => {
  const { data: countries = [], isLoading, isError } = useCountries();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [courses, setCourses] = useState([]);
  const [noCoursesMessage, setNoCoursesMessage] = useState("");
  const [expandedCourseId, setExpandedCourseId] = useState(null);

  const countriesByContinent = groupByContinent(countries);

  const truncateContent = (content) => {
    const words = content.split(" ");
    if (words.length > 100) {
      return words.slice(0, 100).join(" ") + "...";
    }
    return content;
  };

  const filterCoursesByCountry = async (countryId) => {
    try {
      const response = await axiosInstance.get("/courses", {
        params: { country: countryId },
      });

      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setNoCoursesMessage("Aucun cours disponible pour ce pays.");
          setCourses([]);
        } else {
          setCourses(response.data);
          setNoCoursesMessage("");
        }
      } else {
        setCourses([]);
        setNoCoursesMessage("Erreur dans les données reçues.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setCourses([]);
        setNoCoursesMessage("Aucun cours trouvé pour ce pays.");
      } else {
        console.error("Erreur lors de la récupération des cours :", error);
        setCourses([]);
        setNoCoursesMessage("Erreur serveur lors de la récupération des cours.");
      }
    }
  };

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
    filterCoursesByCountry(country._id);
  };

  const toggleContent = (courseId) => {
    setExpandedCourseId((prev) => (prev === courseId ? null : courseId));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 px-8 text-black">
      <div className="lg:col-span-3">
        <div className="text-center">
          <h1 className="font-bold shadow-xl text-orange-300 hover:text-orange-600">
            Les Pays et leurs drapeaux
          </h1>
        </div>

        <div className="mt-10 space-y-4 overflow-auto max-h-[calc(100vh-200px)]">
          {isLoading && <p>Chargement...</p>}
          {isError && <p>Erreur de chargement</p>}

          {Object.entries(countriesByContinent).map(
            ([continent, countries]) => (
              <details
                key={continent}
                className="bg-gray-100 rounded-lg shadow p-4"
              >
                <summary className="cursor-pointer font-semibold text-lg text-orange-600">
                  🌍 {continent}
                </summary>
                <div className="mt-4 space-y-3">
                  {countries.map((country) => (
                    <div
                      key={country._id}
                      className="flex items-center gap-3 bg-white rounded p-2 shadow-sm cursor-pointer"
                      onClick={() => handleCountryClick(country)}
                    >
                      {country.flagUrl ? (
                        <img
                          src={country.flagUrl}
                          alt={`Drapeau de ${country.name}`}
                          className="w-8 h-6 rounded object-cover"
                        />
                      ) : (
                        <span className="text-xl">{getFlag(country.code)}</span>
                      )}
                      <span className="font-medium">{country.name}</span>
                    </div>
                  ))}
                </div>
              </details>
            )
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="col-span-1 lg:col-span-9">
        {selectedCountry && (
          <div className="bg-white rounded-lg shadow p-8 text-center mb-6">
            <h2 className="text-2xl font-bold mb-4">
              Cours disponibles en {selectedCountry.name}
            </h2>
            {selectedCountry.flagUrl ? (
              <img
                src={selectedCountry.flagUrl}
                alt={`Drapeau de ${selectedCountry.name}`}
                className="w-12 h-8 rounded object-cover mx-auto"
              />
            ) : (
              <span className="text-3xl">{getFlag(selectedCountry.code)}</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                Aucun cours disponible
              </h2>
              <p className="text-gray-600">{noCoursesMessage}</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow p-4">
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>

                {/* Affichage image ou vidéo */}
                {course.image && (
                  <img
                    src={course.image}
                    alt="Illustration du cours"
                    className="w-full h-auto max-h-64 object-contain rounded mb-4"
                  />
                )}
                {course.videocour && !course.image && (
                  <video
                    src={course.videocour}
                    controls
                    className="w-full max-h-64 object-contain rounded mb-4"
                  />
                )}

                <p className="text-gray-700 whitespace-pre-wrap">
                  {expandedCourseId === course._id
                    ? course.content
                    : truncateContent(course.content)}
                </p>

                {course.content.split(" ").length > 100 && (
                  <button
                    onClick={() => toggleContent(course._id)}
                    className="mt-2 text-blue-500 underline"
                  >
                    {expandedCourseId === course._id
                      ? "Voir moins"
                      : "Voir plus"}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NosCoursPage;
