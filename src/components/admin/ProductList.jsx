import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      setError(null);
      const res = await axios.get("http://localhost:4000/api/products");
      const data = res.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data.products)) {
        setProducts(data.products);
      } else {
        setProducts([]);
        console.warn("La réponse API ne contient pas de tableau de produits.");
      }
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setError("Erreur réseau, impossible de charger les produits.");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleVisibility = async (id) => {
    try {
      await axios.patch(`http://localhost:4000/api/products/${id}/visibility`);
      fetchProducts();  // rafraîchir la liste
    } catch (err) {
      console.error("Erreur changement visibilité :", err);
      alert("Erreur lors du changement de visibilité");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Confirmer la suppression de ce produit ?")) {
      try {
        await axios.delete(`http://localhost:4000/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Erreur suppression produit :", err);
        alert("Erreur lors de la suppression du produit");
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des produits</h2>

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
    </div>
  );
};

export default ProductList;
