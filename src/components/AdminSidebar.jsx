import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Users, Package } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer les cookies côté client (si tu utilises des cookies pour le login)
    // Sinon, juste réinitialiser et rediriger
    // Tu peux aussi faire appel à une route backend de logout si nécessaire
    navigate('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-[#0c1b4d] text-white p-6 shadow-xl flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-10 text-center text-white tracking-wide">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-4">
          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white hover:bg-white hover:text-[#0c1b4d] transition-all duration-300 font-medium text-left"
          >
            <Users size={18} /> Gestion des utilisateurs
          </button>

          <button
            className="flex items-center gap-3 px-4 py-3 rounded-lg border border-white hover:bg-white hover:text-[#0c1b4d] transition-all duration-300 font-medium text-left"
          >
            <Package size={18} /> Gestion des produits
          </button>
        </nav>
      </div>

      <div className="mt-10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
