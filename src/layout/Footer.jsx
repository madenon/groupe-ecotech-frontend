import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-orange-400 text-white mt-8 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Section Légale */}
        <div>
          <h3 className="text-lg text-black font-semibold mb-4">Informations légales</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/mentions-legales" className="hover:underline">Mentions légales</Link></li>
            <li><Link to="/cookies" className="hover:underline">Cookies</Link></li>
            <li><Link to="/conditions-generales" className="hover:underline">Conditions générales</Link></li>
          </ul>
        </div>

        {/* Section À propos */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-black">À propos</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/a-propos" className="hover:underline">À propos de nous</Link></li>
            <li><Link to="/equipe" className="hover:underline">Notre équipe</Link></li>
          </ul>
        </div>

        {/* Section Contact */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Nous contacter</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/contact" className="hover:underline">Formulaire de contact</Link></li>
            <li><a href="mailto:support@monapp.com" className="hover:underline">support@monapp.com</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-xs text-white pb-4">
        © {new Date().getFullYear()} MonApp. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
