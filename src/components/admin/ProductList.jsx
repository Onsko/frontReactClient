import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const location = useLocation();

  const pageSize = 5; // nombre d'items par page

  // Récupération de la page dans l'URL query params pour persistance de la pagination
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const page = parseInt(queryParams.get("page")) || 1;
    setCurrentPage(page);
  }, [location.search]);

  const fetchProducts = async (page = 1) => {
    try {
      setError(null);
      const res = await axios.get(`http://localhost:4000/api/products?page=${page}&limit=${pageSize}`);
      const { products: fetchedProducts, totalPages: fetchedTotalPages } = res.data;

      setProducts(fetchedProducts || []);
      setTotalPages(fetchedTotalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setError("Erreur réseau, impossible de charger les produits.");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/products/${id}/visibility`);
      Swal.fire({
        icon: "success",
        title: "Visibilité mise à jour",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Erreur changement visibilité :", err);
      Swal.fire({
        icon: "error",
        title: "Erreur lors du changement de visibilité",
      });
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Confirmer la suppression de ce produit ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        Swal.fire({
          icon: "success",
          title: "Produit supprimé",
          timer: 1500,
          showConfirmButton: false,
        });
        fetchProducts(currentPage);
      } catch (err) {
        console.error("Erreur suppression produit :", err);
        Swal.fire({
          icon: "error",
          title: "Erreur lors de la suppression du produit",
        });
      }
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      navigate(`/admin/products?page=${page}`);
      // Le useEffect sur location.search s’occupera de charger la bonne page
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6"> Gestion des Produits</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={() => navigate("/admin/products/add")}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        + Ajouter un produit
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Nom</th>
              <th className="p-2 border">Prix (€)</th>
              <th className="p-2 border">Catégorie</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Visible</th>
              <th className="p-2 border">Créé le</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && !error && (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-600">
                  Aucun produit
                </td>
              </tr>
            )}
            {products.map((prod) => (
              <tr key={prod._id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">
                  {prod.imageUrl ? (
                    <img
                      src={`http://localhost:4000${prod.imageUrl}`}
                      alt={prod.name}
                      className="h-12 mx-auto object-contain"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-2 border">{prod.name}</td>
                <td className="p-2 border">{prod.price.toFixed(2)}</td>
                <td className="p-2 border">{prod.category}</td>
                <td className="p-2 border">{prod.stock}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => toggleVisibility(prod._id)}
                    className={`px-3 py-1 rounded font-semibold ${
                      prod.isVisible ? "bg-green-500" : "bg-red-500"
                    } text-white`}
                  >
                    {prod.isVisible ? "Oui" : "Non"}
                  </button>
                </td>
                <td className="p-2 border">
                  {new Date(prod.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${prod._id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteProduct(prod._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Précédent
        </button>

        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded border bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ProductList;
