"use client";

import { useState } from 'react';

export default function UserAvatar({ 
  user, 
  size = 'md', 
  className = '', 
  showDefault = true 
}) {
  const [imageError, setImageError] = useState(false);

  const getSizeClasses = () => {
    switch (size) {
      case 'xs': return 'w-16 h-16';
      case 'sm': return 'w-20 h-20';
      case 'md': return 'w-64 h-64';
      case 'lg': return 'w-64 h-64';
      case 'xl': return 'w-80 h-80';
      default: return 'w-64 h-64';
    }
  };

  const getDefaultImage = () => {
    if (!showDefault) return null;
    
    if (user?.gender === 'female') {
      return '/images/default/female.png';
    } else if (user?.gender === 'male') {
      return '/images/default/male.png';
    } else {
      // پیش‌فرض برای جنسیت نامشخص: مرد
      return '/images/default/male.png';
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageSrc = () => {
    if (imageError || !user?.avatar) {
      return getDefaultImage();
    }
    return user.avatar;
  };

  return (
    <div className={`${getSizeClasses()} rounded-lg bg-blue-100 p-1 ${className}`}>
      <img
        src={getImageSrc()}
        alt={`${user?.firstName || ''} ${user?.lastName || ''}`}
        className="w-full h-full rounded-lg object-cover"
        onError={handleImageError}
      />
    </div>
  );
}
