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
      if (data && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Erreur de récupération des produits', error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setNotif(`${product.name} ajouté au panier ✅`);
    setTimeout(() => setNotif(null), 3000); // cache la notif après 3 sec
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-[#f9f9f9] text-[#222]">
      <Navbar />

      {/* Notification */}
      {notif && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {notif}
        </div>
      )}

      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur notre boutique élégante</h1>
        <p className="text-lg text-gray-600">Découvrez nos catégories et produits</p>
      </header>

      {/* Catégories dynamiques */}
      <section className="categories flex flex-wrap justify-center gap-10 my-10 px-4">
        {categories && categories.length > 0 ? (
          categories.map((cat) => (
            <div key={cat._id} className="category-circle text-center cursor-pointer group">
              <img
                src={cat.imageUrl ? `${backendUrl}/category-images/${cat.imageUrl}` : "/hhh.png"}
                alt={cat.name}
                onError={(e) => { e.target.src = "/hhh.png"; }}
                className="w-[120px] h-[120px] object-cover rounded-full"
              />
              <p className="mt-2 text-gray-600 text-sm">{cat.name}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">Aucune catégorie disponible.</p>
        )}
      </section>

      {/* Produits */}
      <section className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-10">
        {loading ? (
          <p className="text-center col-span-full">Chargement des produits...</p>
        ) : products && products.length > 0 ? (
          products.map((prod, index) => (
            <div
              key={index}
              className="product-card bg-white rounded-2xl overflow-hidden shadow hover:shadow-lg transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={prod.imageUrl ? `${backendUrl}/uploads/${prod.imageUrl}` : '/default-product.png'}
                alt={prod.name}
                className="w-full h-48 object-cover"
              />
              <div className="info p-4">
                <h4 className="text-lg font-semibold">{prod.name}</h4>
                <p className="text-sm text-gray-500">{prod.description}</p>
                <p className="text-md font-bold mt-2 text-gray-700">{prod.price} DT</p>
                <button
                  onClick={() => handleAddToCart(prod)}
                  className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                >
                  Ajouter au panier
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
              currentPage === idx + 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'
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
