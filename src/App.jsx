import React, { useEffect, useContext, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import AdminDashboard from './pages/AdminDashboard';

import { ToastContainer } from 'react-toastify';
import { AppContent } from './context/AppContext';
import axios from 'axios';

const App = () => {
  const { backendUrl, setIsLoggedIn, setUserData, userData, isLoggedIn } = useContext(AppContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('[App] Début fetchUserData...');
        const res = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        console.log('[App] Réponse user data:', res.data);

        if (res.data.success) {
          setUserData(res.data.userData);
          setIsLoggedIn(true);
          console.log('[App] User set:', res.data.userData);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
          console.log('[App] Pas de user connecté');
        }
      } catch (err) {
        console.log('[App] Erreur fetchUserData:', err.message);
        setIsLoggedIn(false);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [backendUrl, setIsLoggedIn, setUserData]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  // Protection des routes
  const RequireAuth = ({ children }) => {
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin : tout ce qui commence par /admin est géré dans AdminDashboard.jsx */}
        <Route
          path="/admin/*"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
