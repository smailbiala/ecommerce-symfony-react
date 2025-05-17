import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export const AdminRoute = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(()=>{
    console.log(user);
  },[user])
  
  // Vérifier si l'utilisateur est authentifié et a le rôle admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier si l'utilisateur a le rôle admin
  if (!user.roles.includes('ROLE_ADMIN')) {
    return <Navigate to="/" replace />;
  }
  
  // Si l'utilisateur est admin, afficher le contenu protégé
  return <Outlet />;
};