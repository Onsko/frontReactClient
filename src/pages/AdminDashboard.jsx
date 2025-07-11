import React, { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  useEffect(() => {
    console.log('[AdminDashboard] Page AdminDashboard affichée');
  }, []);

  return (
    <div className="flex min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center text-white">
      <AdminSidebar />
      <div className="flex-1 p-10">
<h1 className="text-4xl font-extrabold text-[#0c1b4d] mb-6 drop-shadow-sm">
  BIENVENUE DANS LE DASHBOARD ADMIN
</h1>

        <p>Tu peux gérer les utilisateurs et les produits à gauche.</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
