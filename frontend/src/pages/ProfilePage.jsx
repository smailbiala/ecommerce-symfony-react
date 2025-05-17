import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../store/slices/authSlice';
import api from '../services/api';

const ProfilePage = () => {
  const { user, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  
  useEffect(() => {
    if (!user) {
      dispatch(fetchUserProfile());
    } else {
      setFormData({
        ...formData,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
      });
    }
  }, [dispatch, user]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setUpdateStatus({ loading: true, success: false, error: null });
      
      await api.put('/profile', {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      
      dispatch(fetchUserProfile());
      setUpdateStatus({ loading: false, success: true, error: null });
      
      setTimeout(() => {
        setUpdateStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setUpdateStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to update profile',
      });
    }
  };
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setUpdateStatus({
        loading: false,
        success: false,
        error: 'New passwords do not match',
      });
      return;
    }
    
    try {
      setUpdateStatus({ loading: true, success: false, error: null });
      
      await api.put('/profile/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setUpdateStatus({ loading: false, success: true, error: null });
      
      setTimeout(() => {
        setUpdateStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (err) {
      setUpdateStatus({
        loading: false,
        success: false,
        error: err.response?.data?.message || 'Failed to update password',
      });
    }
  };
  
  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
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
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>
      
      <div className="max-w-2xl mx-auto">
        {updateStatus.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <p>{updateStatus.error}</p>
          </div>
        )}
        
        {updateStatus.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p>Your changes have been saved successfully!</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 focus:outline-none"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              
              <button
                type="submit"
                disabled={updateStatus.loading}
                className={`py-2 px-4 rounded font-semibold ${
                  updateStatus.loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {updateStatus.loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            
            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-4">
                <label htmlFor="currentPassword" className="block text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength="6"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                  minLength="6"
                />
              </div>
              
              <button
                type="submit"
                disabled={updateStatus.loading}
                className={`py-2 px-4 rounded font-semibold ${
                  updateStatus.loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-dark text-white'
                }`}
              >
                {updateStatus.loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;