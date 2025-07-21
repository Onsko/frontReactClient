import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h2m2 2l-7 7-3 1 1-3 7-7z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4m-4 0a1 1 0 00-1 1v1h6V4a1 1 0 00-1-1m-4 0h4"
    />
  </svg>
);

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Format inattendu :", data);
          setCategories([]);
        }
      })
      .catch(err => {
        console.error("Erreur API :", err);
        setCategories([]);
      });
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette catégorie ?")) return;

    try {
      const response = await fetch(`http://localhost:4000/api/categories/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setCategories(categories.filter(cat => cat._id !== id));
      } else {
        toast.error(data.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <h2 className="text-3xl mb-6">Liste des catégories</h2>
      <button
        onClick={() => navigate('/admin/categories/add')}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ajouter une catégorie
      </button>

      {categories.length === 0 ? (
        <p>Aucune catégorie trouvée.</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {categories.map(cat => (
            <div
              key={cat._id}
              className="border p-4 rounded shadow flex flex-col items-center relative"
            >
              <img
                src={`http://localhost:4000/category-images/${cat.imageUrl}`}
                alt={cat.name}
                className="h-24 w-24 object-cover mb-4 rounded"
              />
              <p className="text-lg font-semibold">{cat.name}</p>

              {/* Conteneur des boutons positionné en haut à droite */}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => navigate(`/admin/categories/edit/${cat._id}`)}
                  className="bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600"
                  title="Modifier la catégorie"
                  aria-label="Modifier"
                >
                  <EditIcon />
                </button>

                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
                  title="Supprimer la catégorie"
                  aria-label="Supprimer"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
