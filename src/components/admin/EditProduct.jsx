import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const { id } = useParams(); // Récupérer l'id produit depuis l'URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,       // pour le nouveau fichier sélectionné
  });

  const [existingImage, setExistingImage] = useState(null); // URL de l'image actuelle du produit
  const [preview, setPreview] = useState(null);            // Prévisualisation de la nouvelle image
  const [error, setError] = useState(null);

  // Charger les données actuelles du produit au chargement du composant
  useEffect(() => {
    axios.get(`http://localhost:4000/api/products/${id}`)
      .then(res => {
        const product = res.data.product || res.data; // selon ta réponse backend
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          image: null,  // pas encore changé
        });
        setExistingImage(product.imageUrl); // image actuelle
      })
      .catch(err => setError("Erreur lors du chargement du produit"));
  }, [id]);

  // Quand on choisit une nouvelle image, mettre à jour la preview et le fichier
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Générer une URL locale pour prévisualisation
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  // Gérer les autres champs texte
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Soumettre la modification
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      await axios.put(`http://localhost:4000/api/products/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      alert("Produit modifié avec succès !");
      navigate("/admin/products"); // redirection vers la liste des produits (à adapter)
    } catch (err) {
      alert("Erreur lors de la modification : " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Modifier le produit</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

        <div>
          <label className="block mb-1 font-semibold" htmlFor="name">Nom :</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="description">Description :</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="price">Prix (€) :</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="category">Catégorie :</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="stock">Stock :</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold" htmlFor="image">Image :</label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
          {/* Affichage de la prévisualisation ou de l'image existante */}
          {preview ? (
            <img src={preview} alt="Preview" className="mt-2 max-h-48 object-contain" />
          ) : existingImage ? (
            <img src={`http://localhost:4000${existingImage}`} alt="Produit" className="mt-2 max-h-48 object-contain" />
          ) : null}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Modifier
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
