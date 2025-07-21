import React, { useEffect, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CategoryEdit from './components/admin/CategoryEdit.jsx';

import MyOrdersPage from './pages/MyOrders.jsx';

import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext';
import { CartProvider } from './context/CartContext';

import axios from 'axios';

const App = () => {
  const { backendUrl, setIsLoggedIn, setUserData, isLoggedIn } = useContext(AppContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });

        if (res.data.success) {
          setUserData(res.data.userData);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (err) {
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendUrl, setIsLoggedIn, setUserData]);

  if (loading) return <div>Chargement...</div>;

  const RequireAuth = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <>
      <ToastContainer />
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Page Mes Commandes, protégée */}
          <Route
            path="/mes-commandes"
            element={
              <RequireAuth>
                <MyOrdersPage />
              </RequireAuth>
            }
          />

          {/* Dashboard Admin général */}
          <Route
            path="/admin/*"
            element={
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            }
          />

          {/* Édition catégorie (route hors AdminDashboard) */}
          <Route
            path="/admin/categories/edit/:id"
            element={
              <RequireAuth>
                <CategoryEdit />
              </RequireAuth>
            }
          />
        </Routes>
      </CartProvider>
    </>
  );
};

export default App;
