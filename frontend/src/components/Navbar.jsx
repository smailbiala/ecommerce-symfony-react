import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { filterProducts } from '../store/slices/productsSlice';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, user} = useSelector((state) => state.auth);
  console.log("isAuthenticated:",isAuthenticated)
  console.log("user:",user)
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  console.log("admin: ",isAdmin)



  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(filterProducts({ searchTerm }));
      navigate('/search-results');
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">E-Commerce</Link>
          
          <div className="flex-1 mx-10">
            <form onSubmit={handleSearch} className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full py-2 px-4 rounded-full text-gray-800 focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 rounded-r-full bg-secondary hover:bg-secondary-dark"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="hover:text-secondary-light relative">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-secondary-light flex items-center">
                  {user?.firstName || 'Account'}
                  <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Admin Dashboard</Link>
                  )}
                  <Link to="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Orders</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="hover:text-secondary-light">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;