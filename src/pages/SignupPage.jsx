import { useState } from "react";
import { Link } from "react-router-dom";
import SignupForm from "../auth/SignupForm";

const SignUpPage = () => {
  const [hasConsented, setHasConsented] = useState(false);
  const [refused, setRefused] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <div className="min-h-screen  bg-white text-black flex flex-col  items-center p-6">
      <div className="w-full max-w-6xl -mb-3 relative ">
        <h2 className="text-center text-xl -mb-5  font-extrabold text-blue-900">
          Rejoignez la plus grande communauté  publication
        </h2>

        <div className="mt-0 bg-white py-10 px-8 shadow-xl rounded-2xl w-full">
          {hasConsented ? (
            <SignupForm />
          ) : refused ? (
            <p className="text-red-600 text-center text-sm">
              Vous devez accepter les conditions pour vous inscrire.
            </p>
          ) : (
            <p className="text-gray-500 text-center text-sm">
              Veuillez accepter les conditions pour créer un compte.
            </p>
          )}

          <div className="mt-6 border-t border-gray-300 pt-4 text-center text-sm text-gray-500">
            Déjà sur la plateforme de publication de contenu ?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Modale de consentement */}
      {!hasConsented && !refused && !showMoreInfo && (
        <div className="fixed inset-0 -mb-10 z-50 bg-white text-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
            <h3 className="text-lg font-semibold mb-2">Conditions d'utilisation</h3>
            <p className="text-sm text-gray-700 mb-4">
              Pour utiliser cette plateforme, vous devez accepter nos conditions
              générales d'utilisation et notre politique de confidentialité.
            </p>

            <button
              onClick={() => setShowMoreInfo(true)}
              className="text-blue-600 underline text-sm mb-4"
              type="button"
            >
              En savoir plus
            </button>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => setHasConsented(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Accepter
              </button>
              <button
                onClick={() => setRefused(true)}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Refuser
              </button>
              <button
                onClick={() => setShowPreferences(true)}
                className="text-blue-600 underline text-sm"
                type="button"
              >
                Personnaliser mes préférences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale "En savoir plus" */}
      {showMoreInfo && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-70 flex items-center justify-center p-6 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto p-8">
            <h3 className="text-xl font-bold mb-4">
              Conditions d'utilisation détaillées
            </h3>
            <Link to="/mentions-legales">
              <p className="text-gray-600 underline text-lg">
                Voir les conditions d'utilisation
              </p>
            </Link>
            <div className="prose max-w-none text-left mb-6">
              <p>Bienvenue</p>
              <h4>Politique de confidentialité</h4>
              <p>
                Nous recueillons, stockons et traitons vos données personnelles
                conformément au RGPD afin d'améliorer votre expérience.
              </p>
              <h4>Utilisation des cookies</h4>
              <p>
                Nous utilisons différents types de cookies essentiels, de
                performance et marketing pour personnaliser votre navigation et
                analyser l'usage du site.
              </p>
              <p>
                Vous pouvez à tout moment modifier vos préférences dans la
                section "Personnaliser mes préférences".
              </p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowMoreInfo(false)}
                className="text-gray-600 underline"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  setHasConsented(true);
                  setShowMoreInfo(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                J'accepte et continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale de préférences */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Personnalisation des conditions</h3>
            <form>
              <label className="block  mb-2">
                <input type="checkbox" className="mr-2" defaultChecked />
                J'accepte les cookies essentiels
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                J'accepte les cookies de performance
              </label>
              <label className="block mb-2">
                <input type="checkbox" className="mr-2" />
                J'accepte les cookies marketing
              </label>

              <div className="mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowPreferences(false)}
                  className="text-sm text-gray-500 underline"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPreferences(false);
                    setHasConsented(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-1 rounded"
                >
                  Enregistrer et continuer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
