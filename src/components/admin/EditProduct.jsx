import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:4000/api/products/${id}`)
      .then(res => {
        setProduct(res.data);
        setError("");
      })
      .catch(err => {
        console.error("Erreur chargement produit :", err);
        setError("Produit introuvable.");
      });
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:4000/api/products/${id}`, product)
      .then(() => navigate("/admin"))
      .catch(err => {
        console.error("Erreur mise à jour produit :", err);
        alert("Erreur lors de la mise à jour.");
      });
  };

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (!product) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Nom</label>
          <input
            type="text"
            name="name"
            value={product.name || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Prix</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={product.price || ""}
            onChange={handleChange}
            className="w-full border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Visible</label>
          <select
            name="visibility"
            value={product.visibility ? "true" : "false"}
            onChange={(e) =>
              setProduct({ ...product, visibility: e.target.value === "true" })
            }
            className="w-full border px-3 py-2"
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sauvegarder
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
