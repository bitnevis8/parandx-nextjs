"use client";

import { useState, useEffect } from 'react';
import { useRole } from '../hooks/useRole';
import Link from 'next/link';

export default function DashboardPage() {
  const userRole = useRole();
  const { user, getPrimaryRole } = userRole;
  const [activeTab, setActiveTab] = useState('profile');

  // اطمینان از اینکه صفحه در بالای صفحه می‌ماند
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">دسترسی غیرمجاز</h1>
          <p className="text-gray-600">لطفا ابتدا وارد شوید</p>
        </div>
      </div>
    );
  }

  const primaryRole = getPrimaryRole();
  const userRoles = userRole.getUserRoles();

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin': return 'مدیر کل';
      case 'moderator': return 'ناظر';
      case 'expert': return 'متخصص';
      case 'customer': return 'مشتری';
      default: return role;
    }
  };


 
}