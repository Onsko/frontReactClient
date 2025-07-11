// pages/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminUsers from './AdminUsers';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center text-white">
      <AdminSidebar />

      <div className="flex-1 p-10 bg-white text-black rounded-lg shadow">
        {/* Afficher le titre seulement si aucune sous-route active */}
        {location.pathname === '/admin' && (
          <>
            <h1 className="text-4xl font-extrabold text-[#0c1b4d] mb-6 drop-shadow-sm">
              BIENVENUE DANS LE DASHBOARD ADMIN
            </h1>
            <p>Tu peux gérer les utilisateurs et les produits à gauche.</p>
          </>
        )}

        {/* Sous-routes à l’intérieur de /admin */}
        <Routes>
          <Route path="users" element={<AdminUsers />} />
          {/* Tu pourras ajouter ici d'autres routes comme <Route path="products" element={<AdminProducts />} /> */}
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
