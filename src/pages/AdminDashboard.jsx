import React, { useEffect } from 'react';

const AdminDashboard = () => {
  useEffect(() => {
    console.log('[AdminDashboard] Page AdminDashboard affichée');
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-green-500 text-white text-3xl font-bold">
      ✅ BIENVENUE DANS LE VRAI ADMIN DASHBOARD
    </div>
  );
};

export default AdminDashboard;
