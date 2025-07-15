import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-100 pt-10 pb-6 px-6 sm:px-20 mt-20">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Section 1 : À propos */}
        <div>
          <h4 className="text-lg font-semibold mb-4">À propos</h4>
          <p className="text-sm text-gray-400">
            Bienvenue sur notre boutique ! Qualité, style, et service au rendez-vous.
          </p>
        </div>

        {/* Section 2 : Liens rapides */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="/">Accueil</a></li>
            <li><a href="/login">Connexion</a></li>
            <li><a href="/register">Créer un compte</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Section 3 : Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
          <form className="flex flex-col space-y-2">
            <input
              type="email"
              placeholder="Votre email"
              className="px-4 py-2 rounded bg-gray-800 text-sm text-white border border-gray-700"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded transition"
            >
              S’abonner
            </button>
          </form>
        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} IOX Shop. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
