import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-200';
  };
  
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Connecté en tant que {user.email}</p>
      </div>
      
      <nav className="mt-6">
        <ul>
          <li>
            <Link 
              to="/admin" 
              className={`flex items-center px-6 py-3 ${isActive('/admin')}`}
            >
              <span className="mr-3">📊</span>
              Tableau de bord
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/products" 
              className={`flex items-center px-6 py-3 ${isActive('/admin/products')}`}
            >
              <span className="mr-3">📦</span>
              Produits
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/categories" 
              className={`flex items-center px-6 py-3 ${isActive('/admin/categories')}`}
            >
              <span className="mr-3">📂</span>
              Catégories
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/orders" 
              className={`flex items-center px-6 py-3 ${isActive('/admin/orders')}`}
            >
              <span className="mr-3">🛒</span>
              Commandes
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 border-t p-4">
        <button 
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;