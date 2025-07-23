import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import './home.css';
import { useCart } from '../context/CartContext';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);

  const backendUrl = 'http://localhost:4000';
  const { addToCart } = useCart();

  useEffect(() => {
    fetchCategories();
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);
      setCategories(data);
    } catch (err) {
      console.error('Erreur de récupération des catégories:', err.message);
    }
  };

  const fetchProducts = async (page) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/products?page=${page}&limit=8`);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Erreur de récupération des produits', error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      addToCart(product);
      setNotif(`${product.name} ajouté au panier ✅`);
    } else {
      setNotif(`${product.name} est en rupture de stock ❌`);
    }
    setTimeout(() => setNotif(null), 3000);
  };

  return (
    <div className="bg-[#f9f9f9] text-[#222]">
      <Navbar />

      {notif && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {notif}
        </div>
      )}

      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur notre boutique élégante</h1>
        <p className="text-lg text-gray-600">Découvrez nos catégories et produits</p>
      </header>

      {/* Catégories */}
      <section className="flex flex-wrap justify-center gap-10 my-10 px-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="text-center cursor-pointer"
              title={cat.name}
            >
              <img
                src={cat.imageUrl ? `${backendUrl}/category-images/${cat.imageUrl}` : '/hhh.png'}
                alt={cat.name}
                className="w-[120px] h-[120px] object-cover rounded-full"
                onError={(e) => (e.target.src = '/hhh.png')}
              />
              <p className="mt-2 text-gray-600 text-sm">{cat.name}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Aucune catégorie disponible.</p>
        )}
      </section>

      {/* Produits */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-10">
        {loading ? (
          <p className="text-center col-span-full">Chargement des produits...</p>
        ) : products.length > 0 ? (
          products.map((prod) => (
            <div
              key={prod._id}
              className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform hover:-translate-y-1 relative flex flex-col"
            >
              <img
                src={prod.imageUrl ? `${backendUrl}/uploads/${prod.imageUrl}` : '/default-product.png'}
                alt={prod.name}
                className="w-full h-48 object-cover"
              />

              {/* Badge promo */}
              {prod.isOnPromotion && (
                <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full z-10">
                  Promo
                </span>
              )}

              {/* Badge stock */}
              {prod.stock <= 0 && (
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                  Rupture de stock
                </span>
              )}

              <div className="p-4 flex flex-col flex-grow">
                <h4 className="text-lg font-semibold">{prod.name}</h4>
                <p className="text-sm text-gray-500 line-clamp-3">{prod.description}</p>

                {prod.isOnPromotion ? (
                  <p className="text-md font-bold mt-2 text-red-600">
                    <span className="line-through mr-2 text-gray-500">
                      {prod.originalPrice} DT
                    </span>
                    {prod.price} DT
                  </p>
                ) : (
                  <p className="text-md font-bold mt-2 text-gray-700">{prod.price} DT</p>
                )}

                <button
                  onClick={() => handleAddToCart(prod)}
                  disabled={prod.stock <= 0}
                  className={`mt-auto w-full py-2 rounded transition ${
                    prod.stock > 0
                      ? 'bg-black text-white hover:bg-gray-800'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  {prod.stock > 0 ? 'Ajouter au panier' : 'Indisponible'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center col-span-full text-gray-400">Aucun produit trouvé.</p>
        )}
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mb-10">
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`px-4 py-2 rounded-full ${
              currentPage === idx + 1
                ? 'bg-black text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-black hover:text-white transition`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
