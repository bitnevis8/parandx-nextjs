"use client";

import { useAuth } from '../context/AuthContext';

export function useRole() {
  const { user } = useAuth();

  // Debug log
  console.log("useRole - User object:", user);
  console.log("useRole - User roles:", user?.userRoles);

  const hasRole = (roleName) => {
    if (!user || !user.userRoles) {
      console.log(`hasRole(${roleName}): No user or userRoles`);
      return false;
    }
    const result = user.userRoles.some(role => role.name === roleName);
    console.log(`hasRole(${roleName}):`, result);
    return result;
  };

  const hasAnyRole = (roleNames) => {
    if (!user || !user.userRoles) return false;
    return user.userRoles.some(role => roleNames.includes(role.name));
  };

  const isAdmin = () => hasRole('admin');
  const isModerator = () => hasRole('moderator');
  const isExpert = () => hasRole('expert');
  const isCustomer = () => hasRole('customer');
  const isGuest = () => hasRole('guest');

  const canAccessAdmin = () => hasAnyRole(['admin', 'moderator']);
  const canAccessExpert = () => hasAnyRole(['admin', 'moderator', 'expert']);
  const canAccessCustomer = () => hasAnyRole(['admin', 'moderator', 'expert', 'customer']);

  const getUserRoles = () => {
    if (!user || !user.userRoles) return [];
    return user.userRoles.map(role => role.name);
  };

  const getPrimaryRole = () => {
    if (!user || !user.userRoles) return 'guest';
    
    // اولویت نقش‌ها
    const rolePriority = ['admin', 'moderator', 'expert', 'customer', 'guest'];
    
    for (const role of rolePriority) {
      if (hasRole(role)) {
        return role;
      }
    }
    
    return 'guest';
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isModerator,
    isExpert,
    isCustomer,
    isGuest,
    canAccessAdmin,
    canAccessExpert,
    canAccessCustomer,
    getUserRoles,
    getPrimaryRole
  };
}
