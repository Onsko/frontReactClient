// pages/AdminDashboard.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminUsers from './AdminUsers';
import AdminProducts from '../components/admin/ProductList';
import EditProduct from '../components/admin/EditProduct';
import AddProduct from '../components/admin/AddProduct';

import CategoryList from '../components/admin/CategoryList';
import AddCategory from '../components/admin/AddCategory';

const AdminDashboard = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[url('/bg_img.png')] bg-cover bg-center text-white">
      <AdminSidebar />

      <div className="flex-1 p-10 bg-white text-black rounded-lg shadow">
        {location.pathname === '/admin' && (
          <>
            <h1 className="text-4xl font-extrabold text-[#0c1b4d] mb-6 drop-shadow-sm">
              BIENVENUE DANS LE DASHBOARD ADMIN
            </h1>
            <p>Tu peux gérer les utilisateurs, produits et catégories à gauche.</p>
          </>
        )}

        <Routes>
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="products/add" element={<AddProduct />} />

          {/* Categories routes */}
          <Route path="categories" element={<CategoryList />} />
          <Route path="categories/add" element={<AddCategory />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
