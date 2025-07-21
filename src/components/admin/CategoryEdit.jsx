import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const CategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Récupérer la catégorie pour pré-remplir le formulaire
    fetch(`http://localhost:4000/api/categories`)
      .then(res => res.json())
      .then(data => {
        const category = data.find(c => c._id === id);
        if (category) {
          setName(category.name);
          setCurrentImage(`http://localhost:4000/category-images/${category.imageUrl}`);
        } else {
          toast.error("Catégorie non trouvée");
          navigate('/admin/categories');
        }
      })
      .catch(() => {
        toast.error("Erreur de chargement");
        navigate('/admin/categories');
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Le nom est obligatoire");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Catégorie mise à jour avec succès');
        navigate('/admin/categories');
      } else {
        toast.error(data.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-6">Modifier la catégorie</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col">
          Nom de la catégorie :
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </label>

        <label className="flex flex-col">
          Image actuelle :
          {currentImage && (
            <img src={currentImage} alt={name} className="h-24 w-24 object-cover rounded mt-2" />
          )}
        </label>

        <label className="flex flex-col">
          Changer l'image (optionnel) :
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="mt-2"
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Enregistrer
        </button>
      </form>
    </div>
  );
};

export default CategoryEdit;
