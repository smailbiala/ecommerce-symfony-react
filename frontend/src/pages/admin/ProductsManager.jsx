import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../../services/api';
import ProductForm from '../../components/admin/ProductForm';

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des produits');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await api.delete(`/products/${id}`);
        setProducts(products.filter(product => product.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression du produit');
        console.error(err);
      }
    }
  };
  
  const handleFormSubmit = async (productData) => {
    try {
      if (editingProduct) {
        // Mise à jour d'un produit existant
        await api.put(`/products/${editingProduct.id}`, productData);
      } else {
        // Création d'un nouveau produit
        await api.post('/products', productData);
      }
      
      // Rafraîchir la liste des produits
      fetchProducts();
      
      // Fermer le formulaire
      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du produit');
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
        <h1 className="text-2xl font-bold">Gestion des Produits</h1>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded"
        >
          Ajouter un produit
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {isFormOpen ? (
        <ProductForm 
          product={editingProduct} 
          onSubmit={handleFormSubmit} 
          onCancel={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="h-10 w-10 rounded-full" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.price} €</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.category?.name || 'Non catégorisé'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
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

export default ProductsManager;