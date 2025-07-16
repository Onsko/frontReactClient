import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null); // aperçu image nouvelle sélection
  const [currentImageUrl, setCurrentImageUrl] = useState(null); // image actuelle

  // Charger catégories
  useEffect(() => {
    fetch("http://localhost:4000/api/categories")
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error("Erreur chargement catégories", err);
        setError("Impossible de charger les catégories.");
      });
  }, []);

  // Charger produit
  useEffect(() => {
    fetch(`http://localhost:4000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category?._id || "",
          stock: data.stock || "",
          image: null, // pas d'image chargée dans le form (fichier)
        });
        if (data.imageUrl) {
          setCurrentImageUrl(`http://localhost:4000/product-images/${data.imageUrl}`);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement produit", err);
        setError("Erreur lors du chargement du produit.");
        setLoading(false);
      });
  }, [id]);

  // Changement champs texte/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Changement image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  // Soumettre formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const res = await fetch(`http://localhost:4000/api/products/${id}`, {
        method: "PUT",
        body: formDataToSend,
        credentials: "include",
      });

      if (!res.ok) throw new Error("Échec de la mise à jour");

      await Swal.fire({
        icon: "success",
        title: "Produit mis à jour avec succès !",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/products");
    } catch (err) {
      console.error("Erreur mise à jour produit", err);
      Swal.fire({
        icon: "error",
        title: "Erreur lors de la mise à jour",
        text: err.message || "Une erreur est survenue",
      });
    }
  };

  if (loading) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Modifier le produit</h2>

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <InputField label="Nom" name="name" value={formData.name} onChange={handleChange} />
        <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange} />
        <InputField
          label="Prix (€)"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          min="0"
          step="0.01"
        />
        <SelectField
          label="Catégorie"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
        />
        <InputField
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock}
          onChange={handleChange}
          min="0"
        />

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
          {/* Affiche image actuelle */}
          {currentImageUrl && !preview && (
            <img
              src={currentImageUrl}
              alt="Image actuelle"
              className="mt-2 max-h-48 object-contain"
            />
          )}
          {/* Aperçu nouvelle image sélectionnée */}
          {preview && (
            <img
              src={preview}
              alt="Nouvelle image sélectionnée"
              className="mt-2 max-h-48 object-contain"
            />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

// Composants réutilisables (même que dans AddProduct)
const InputField = ({ label, name, ...props }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <input id={name} name={name} required className="w-full border px-3 py-2 rounded" {...props} />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border px-3 py-2 rounded"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border px-3 py-2 rounded"
    >
      <option value="">-- Sélectionner une catégorie --</option>
      {options.map(opt => (
        <option key={opt._id} value={opt._id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

export default EditProduct;
