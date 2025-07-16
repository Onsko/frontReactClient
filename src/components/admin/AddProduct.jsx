import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  // Récupérer les catégories au montage
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error("Erreur lors du chargement des catégories :", err);
        setError("Impossible de charger les catégories.");
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key]) formDataToSend.append(key, formData[key]);
      }

      await axios.post("http://localhost:4000/api/products", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      await Swal.fire({
        icon: "success",
        title: "Produit ajouté avec succès !",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/admin/products");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Erreur lors de l'ajout",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Ajouter un produit</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <InputField label="Nom" name="name" value={formData.name} onChange={handleChange} />
        <TextareaField label="Description" name="description" value={formData.description} onChange={handleChange} />
        <InputField label="Prix (€)" name="price" type="number" value={formData.price} onChange={handleChange} min="0" step="0.01" />
        <SelectField label="Catégorie" name="category" value={formData.category} onChange={handleChange} options={categories} />
        <InputField label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} min="0" />
        
        <div>
          <label className="block mb-1 font-semibold" htmlFor="image">Image :</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="w-full" />
          {preview && <img src={preview} alt="Preview" className="mt-2 max-h-48 object-contain" />}
        </div>

        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">Ajouter</button>
      </form>
    </div>
  );
};

// Composants réutilisables
const InputField = ({ label, name, ...props }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <input id={name} name={name} required className="w-full border px-3 py-2 rounded" {...props} />
  </div>
);

const TextareaField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <textarea id={name} name={name} value={value} onChange={onChange} required className="w-full border px-3 py-2 rounded" />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block mb-1 font-semibold" htmlFor={name}>{label} :</label>
    <select id={name} name={name} value={value} onChange={onChange} required className="w-full border px-3 py-2 rounded">
      <option value="">-- Sélectionner une catégorie --</option>
      {options.map(opt => (
        <option key={opt._id} value={opt._id}>{opt.name}</option>
      ))}
    </select>
  </div>
);

export default AddProduct;
