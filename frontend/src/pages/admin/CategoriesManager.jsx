import { useState, useEffect } from 'react';
import api from '../../services/api';
import CategoryForm from '../../components/admin/CategoryForm';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des catégories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      try {
        await api.delete(`/categories/${id}`);
        setCategories(categories.filter(category => category.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de la catégorie');
        console.error(err);
      }
    }
  };
  
  const handleFormSubmit = async (categoryData) => {
    try {
      if (editingCategory) {
        // Mise à jour d'une catégorie existante
        await api.put(`/categories/${editingCategory.id}`, categoryData);
      } else {
        // Création d'une nouvelle catégorie
        await api.post('/categories', categoryData);
      }
      
      // Rafraîchir la liste des catégories
      fetchCategories();
      
      // Fermer le formulaire
      setIsFormOpen(false);
      setEditingCategory(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de la catégorie');
      console.error(err);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Catégories</h1>
        <button 
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
        >
          Ajouter une catégorie
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isFormOpen ? (
        <CategoryForm 
          category={editingCategory} 
          onSubmit={handleFormSubmit} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingCategory(null);
          }}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de produits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4">{category.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{category.productsCount || 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(category)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoriesManager;