import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import axios from 'axios';
import './home.css';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  const backendUrl = 'http://localhost:4000';

  const formatName = (name) =>
  name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");

  // Récupérer catégories dynamiques
 const fetchCategories = async () => {
  try {
    const { data } = await axios.get(`${backendUrl}/api/product/distinct-categories`);
    if (data.success) {
      const formattedCategories = data.categories.map((name) => ({
        name,
        imageUrl: `/category-images/${formatName(name)}.png`,
      }));
      setCategories(formattedCategories);
    }
  } catch (err) {
    console.error('Erreur de récupération des catégories:', err.message);
  }
};

  // Récupérer produits paginés
  const fetchProducts = async (page) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product?page=${page}&limit=${productsPerPage}`);
      if (data.success) {
        setProducts(data.products);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Erreur de récupération des produits', error.message);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-[#f9f9f9] text-[#222]">
      <Navbar />

      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenue sur notre boutique élégante</h1>
        <p className="text-lg text-gray-600">Découvrez nos catégories et produits</p>
      </header>

      {/* Catégories dynamiques */}
    <section className="categories flex flex-wrap justify-center gap-10 my-10 px-4">
  {categories.map((cat, idx) => (
    <div key={idx} className="category-circle text-center cursor-pointer group">
      <img
        src={cat.imageUrl}
        alt={cat.name}
        onError={(e) => { e.target.src = "/hhh.png"; }}  // image fallback
        className="w-[120px] h-[120px] object-cover rounded-full"
      />
      <p className="mt-2 text-gray-600 text-sm">{cat.name}</p>
    </div>
  ))}
</section>


      {/* Produits */}
      <section className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-6 py-10">
        {products.map((prod, index) => (
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
            </div>
          </div>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center gap-3 mb-10">
        {[...Array(totalPages)].map((_, idx) => (
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
