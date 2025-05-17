import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const SearchResultsPage = () => {
  const { items, status, error } = useSelector((state) => state.products);
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('q') || '';

  const products = Array.isArray(items) ? items : [];

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Search Results</h1>
      {searchTerm && (
        <p className="text-center text-gray-600 mb-8">
          Showing results for "{searchTerm}"
        </p>
      )}
      
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;