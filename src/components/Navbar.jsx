import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, Link } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);
  const { items } = useCart(); // corrigé : nom "items" et pas "cartItems"
console.log(userData)
  // Envoie OTP de vérification email
  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Déconnexion utilisateur
  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate('/login');
        toast.success("Déconnexion réussie !");
      } else {
        toast.error("Erreur lors de la déconnexion");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 bg-white shadow fixed top-0 z-50">
      {/* Logo cliquable */}
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="w-28 sm:w-32 cursor-pointer" />
      </Link>

      <div className="flex items-center gap-4">
        {/* Icône panier avec badge */}
        <Link to="/cart" className="relative text-xl">
          🛒
          {items && items.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-1 rounded-full">
              {items.length}
            </span>
          )}
        </Link>

        {/* Utilisateur connecté */}
        {userData && userData.name ? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group cursor-pointer">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm shadow">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Vérifier mon email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                >
                  Se déconnecter
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100"
          >
            Login
            <img src={assets.arrow_icon} alt="arrow" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
