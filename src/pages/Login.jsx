import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContent } from '../context/AppContext';
import { assets } from '../assets/assets';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, setUserData } = useContext(AppContent);

  const [state, setState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      console.log('[Login] Tentative de connexion avec:', email);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      console.log('[Login] Réponse login:', data);

      if (data.success) {
        const resUser = await axios.get(`${backendUrl}/api/user/data`, { withCredentials: true });
        console.log('[Login] User data reçue:', resUser.data);

        if (resUser.data.success) {
          const user = resUser.data.userData;
          setUserData(user);
          setIsLoggedIn(true);

          console.log('[Login] Objet user:', user);

          if (user.role === "admin") {
            console.log('[Login] Connexion admin détectée, redirection vers /admin');
            navigate("/admin");
          } else {
            console.log('[Login] Connexion user normale, redirection vers /');
            navigate("/");
          }

          toast.success("Connexion réussie");
        } else {
          toast.error("Impossible de récupérer les infos utilisateur");
        }
      } else {
        // Affiche le message spécifique reçu (ex: compte bloqué)
        toast.error(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      console.log('[Login] Erreur login:', error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img
        onClick={() => navigate('/')}
        className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'
        src={assets.logo}
        alt="logo"
      />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center text-sm mb-6'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account'}
        </p>

        <form onSubmit={onSubmitHandler}>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className='text-slate-300 bg-transparent outline-none'
              type="email"
              placeholder='Email'
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className='text-slate-300 bg-transparent outline-none'
              type="password"
              placeholder='Password'
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className='mb-4 text-indigo-500 cursor-pointer'
          >
            Forgot password?
          </p>

          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 hover:from-indigo-900 hover:to-indigo-500 font-semibold text-white text-lg'>
            Login
          </button>
        </form>

        <p
          onClick={() => setState(state === 'Login' ? 'Sign Up' : 'Login')}
          className='mt-4 text-center cursor-pointer text-indigo-500 hover:text-indigo-300'
        >
          {state === 'Login' ? 'Create a new account?' : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default Login;
