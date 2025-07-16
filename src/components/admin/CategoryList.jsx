// components/admin/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:4000/api/categories') // change le port selon ton backend
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));
  }, []);

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
            <div key={cat._id} className="border p-4 rounded shadow flex flex-col items-center">
              <img
                src={`http://localhost:4000/category-images/${cat.imageUrl}`}
                alt={cat.name}
                className="h-24 w-24 object-cover mb-4 rounded"
              />
              <p className="text-lg font-semibold">{cat.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryList;
