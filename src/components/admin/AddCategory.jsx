// components/admin/AddCategory.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !imageFile) {
      alert('Merci de remplir tous les champs');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:4000/api/categories', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Erreur lors de la création de la catégorie');

      alert('Catégorie ajoutée avec succès');
      navigate('/admin/categories');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-6">Ajouter une catégorie</h2>
      <form onSubmit={handleSubmit} className="max-w-md">
        <label className="block mb-2 font-semibold" htmlFor="name">
          Nom de la catégorie :
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full border border-gray-400 rounded px-3 py-2 mb-4"
          required
        />

        <label className="block mb-2 font-semibold" htmlFor="image">
          Image de la catégorie :
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-4"
          required
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mb-4 h-40 object-contain border rounded"
          />
        )}

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
