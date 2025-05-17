import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import api from '../services/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        ...product,
        quantity
      }));
      const notification = document.getElementById('notification');
      notification.classList.remove('hidden');
      setTimeout(() => {
        notification.classList.add('hidden');
        navigate('/cart');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error || 'Product not found'}</p>
        </div>
      </div>
    );
  }

  const images = [product.imageUrl, ...product.additionalImages || []];

  return (
    <div className="container mx-auto px-4 py-8">
      <div 
        id="notification" 
        className="hidden fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg"
      >
        Added to cart successfully!
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 relative">
            <img 
              src={images[selectedImage]} 
              alt={product.name} 
              className="w-full h-96 object-cover"
            />
            {images.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-3 h-3 rounded-full ${
                      selectedImage === index ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <div className="mb-6">
              {product.category && (
                <span className="text-sm text-gray-500 mb-2 block">
                  {product.category.name}
                </span>
              )}
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (product.rating || 0) ? 'fill-current' : 'fill-gray-300'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="prose prose-sm text-gray-600 mb-6">
              <p>{product.description}</p>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary-dark">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="ml-2 text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">Quantity:</p>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-l transition-colors"
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 text-center border-t border-b border-gray-200 py-2"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-r transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  product.stock > 0 ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <p className="text-gray-700">
                  {product.stock > 0 
                    ? `${product.stock} units available` 
                    : 'Out of Stock'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.stock < 1}
              className={`w-full py-4 rounded-md font-semibold transition-colors ${
                product.stock < 1 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-dark text-white'
              }`}
            >
              {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">Product Details</h3>
              <div className="space-y-2">
                {product.specifications?.map((spec, index) => (
                  <div key={index} className="flex">
                    <span className="text-gray-600 w-1/3">{spec.name}:</span>
                    <span className="text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;