import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Charger les produits
  const fetchProducts = () => {
    axios.get("http://localhost:4000/api/products")
      .then(res => {
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else if (Array.isArray(res.data.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
          console.warn("La réponse API ne contient pas de tableau de produits.");
        }
      })
      .catch(err => console.error("Erreur chargement produits :", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Toggle visibilité
  const toggleVisibility = (id, currentVisibility) => {
    axios.patch(`http://localhost:4000/api/products/${id}/visibility`, { visibility: !currentVisibility })
      .then(() => fetchProducts())
      .catch(err => console.error("Erreur changement visibilité :", err));
  };

  // Supprimer un produit
  const deleteProduct = (id) => {
    if (window.confirm("Confirmer la suppression de ce produit ?")) {
      axios.delete(`http://localhost:4000/api/products/${id}`)
        .then(() => fetchProducts())
        .catch(err => console.error("Erreur suppression produit :", err));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Liste des produits</h2>

      {/* ✅ Bouton Ajouter un produit */}
      <button
        onClick={() => navigate("/admin/products/add")}
        className="mb-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        + Ajouter un produit
      </button>

      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Prix</th>
            <th className="p-2 border">Visible</th>
            <th className="p-2 border">Créé le</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(prod => (
            <tr key={prod._id} className="text-center">
              <td className="p-2 border">{prod.name}</td>
              <td className="p-2 border">{prod.price} €</td>
              <td className="p-2 border">
                <button
                  onClick={() => toggleVisibility(prod._id, prod.visibility)}
                  className={`px-3 py-1 rounded ${prod.visibility ? 'bg-green-500' : 'bg-red-500'} text-white`}
                >
                  {prod.visibility ? "Oui" : "Non"}
                </button>
              </td>
              <td className="p-2 border">{new Date(prod.createdAt).toLocaleDateString()}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button
                  onClick={() => navigate(`/admin/products/edit/${prod._id}`)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteProduct(prod._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
