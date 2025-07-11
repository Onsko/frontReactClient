import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Users, Package } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // Bonus : Tu peux supprimer le token ou appeler ton API de logout ici
    navigate('/');
  };

  // Fonction utilitaire pour styliser le bouton actif
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 min-h-screen bg-[#0c1b4d] text-white p-6 shadow-xl flex flex-col justify-between">
      {/* Logo / Titre */}
      <div>
        <h2 className="text-2xl font-bold mb-10 text-center tracking-wide">
          Admin Panel
        </h2>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          <SidebarButton
            label="Gestion des utilisateurs"
            icon={<Users size={18} />}
            onClick={() => navigate('/admin/users')}
            active={isActive('/admin/users')}
          />
          <SidebarButton
            label="Gestion des produits"
            icon={<Package size={18} />}
            onClick={() => navigate('/admin/products')}
            active={isActive('/admin/products')}
          />
        </nav>
      </div>

      {/* Bouton de logout */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 font-medium"
        >
          <LogOut size={18} className="transition-transform group-hover:rotate-180" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// Composant réutilisable pour les boutons de la sidebar
const SidebarButton = ({ label, icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-medium text-left border 
      ${active ? 'bg-white text-[#0c1b4d] border-white' : 'border-white hover:bg-white hover:text-[#0c1b4d]'}`}
  >
    {icon}
    {label}
  </button>
);

export default AdminSidebar;
