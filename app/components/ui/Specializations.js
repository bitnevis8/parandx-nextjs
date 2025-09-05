"use client";

import { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { API_ENDPOINTS } from '../../config/api';

export default function Specializations({ targetUserId }) {
  const [specializations, setSpecializations] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [groupedCategories, setGroupedCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({});
  const [targetUser, setTargetUser] = useState(null);
  const userRole = useRole();

  useEffect(() => {
    if (targetUserId) {
      fetchUserData(targetUserId);
    }
    fetchData();
  }, [targetUserId]);

  useEffect(() => {
    // جستجو در تخصص‌ها و نمایش نتایج در بالای لیست
    if (searchTerm.trim()) {
      const results = [];
      groupedCategories.forEach(group => {
        group.subcategories.forEach(subcategory => {
          if (subcategory.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            results.push({
              ...subcategory,
              parentGroup: {
                id: group.id,
                title: group.title,
                icon: group.icon
              }
            });
          }
        });
      });
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, groupedCategories]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(API_ENDPOINTS.users.getById(userId), {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userData = await response.json();
        if (userData.success) {
          setTargetUser(userData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // دریافت تخصص‌های فعلی متخصص
      let specializationsUrl = API_ENDPOINTS.experts.getSpecializations;
      if (targetUserId) {
        specializationsUrl = `${API_ENDPOINTS.experts.getUserSpecializations}?userId=${targetUserId}`;
      }
      
      const specializationsResponse = await fetch(specializationsUrl, {
        credentials: 'include'
      });
      
      if (specializationsResponse.ok) {
        const specializationsResult = await specializationsResponse.json();
        if (specializationsResult.success) {
          setSpecializations(specializationsResult.data || []);
        } else {
          console.error('❌ Specializations API error:', specializationsResult.message);
        }
      } else {
        const errorText = await specializationsResponse.text();
        console.error('❌ Specializations response error:', specializationsResponse.status, errorText);
      }

      // دریافت تمام دسته‌بندی‌ها
      const categoriesResponse = await fetch(API_ENDPOINTS.categories.getAll, {
        credentials: 'include'
      });
      
      if (categoriesResponse.ok) {
        const categoriesResult = await categoriesResponse.json();
        if (categoriesResult.success) {
          // گروه‌بندی دسته‌ها بر اساس دسته اصلی
          const grouped = categoriesResult.data.filter(category => 
            category.subcategories && category.subcategories.length > 0
          );
          setGroupedCategories(grouped);
          
          // برای سازگاری با کد قبلی، زیردسته‌ها را هم ذخیره می‌کنیم
          const subcategories = [];
          grouped.forEach(category => {
            subcategories.push(...category.subcategories);
          });
          setAvailableCategories(subcategories);
        } else {
          console.error('❌ Categories API error:', categoriesResult.message);
        }
      } else {
        const errorText = await categoriesResponse.text();
        console.error('❌ Categories response error:', categoriesResponse.status, errorText);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpecialization = async (categoryId) => {
    try {
      setSaving(true);
      
      const requestBody = { categoryId };
      if (targetUserId) {
        requestBody.userId = targetUserId;
      }
      
      const response = await fetch(API_ENDPOINTS.experts.addSpecialization, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('تخصص با موفقیت اضافه شد');
          fetchData(); // Refresh data
        } else {
          alert('خطا در اضافه کردن تخصص: ' + result.message);
        }
      } else {
        const errorResult = await response.json();
        alert('خطا در اضافه کردن تخصص: ' + (errorResult.message || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error adding specialization:', error);
      alert('خطا در اضافه کردن تخصص');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSpecialization = async (categoryId, categoryTitle) => {
    const userName = targetUser ? `${targetUser.firstName} ${targetUser.lastName}` : 'این کاربر';
    const confirmMessage = `آیا می‌خواهید تخصص "${categoryTitle}" را از لیست تخصص‌های ${targetUserId ? userName : 'خود'} حذف کنید؟`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setSaving(true);
      
      let removeUrl = API_ENDPOINTS.experts.removeSpecialization(categoryId);
      if (targetUserId) {
        removeUrl += `?userId=${targetUserId}`;
      }
      
      const response = await fetch(removeUrl, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('تخصص با موفقیت حذف شد');
          fetchData(); // Refresh data
        } else {
          alert('خطا در حذف تخصص: ' + result.message);
        }
      } else {
        const errorResult = await response.json();
        alert('خطا در حذف تخصص: ' + (errorResult.message || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error removing specialization:', error);
      alert('خطا در حذف تخصص');
    } finally {
      setSaving(false);
    }
  };

  const isSpecializationAdded = (categoryId) => {
    return specializations.some(spec => spec.id === categoryId);
  };

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => {
      // اگر گروه فعلی باز است، آن را ببند
      if (prev[groupId]) {
        return { [groupId]: false };
      }
      // اگر گروه فعلی بسته است، همه را ببند و فقط این یکی را باز کن
      return { [groupId]: true };
    });
  };

  const toggleAllGroups = () => {
    const allExpanded = Object.values(expandedGroups).some(expanded => expanded);
    
    if (allExpanded) {
      // اگر حداقل یک گروه باز است، همه را ببند
      setExpandedGroups({});
    } else {
      // اگر همه بسته هستند، همه را باز کن
      const newExpandedGroups = {};
      groupedCategories.forEach(group => {
        newExpandedGroups[group.id] = true;
      });
      setExpandedGroups(newExpandedGroups);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {targetUserId ? (
              targetUser ? 
                `تخصص‌های ${targetUser.firstName} ${targetUser.lastName} (ID: ${targetUserId})` :
                `تخصص‌های کاربر (ID: ${targetUserId})`
            ) : 'تخصص‌های من'}
          </h1>
        </div>
        
        {/* تخصص‌های فعلی */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">تخصص‌های فعلی</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {specializations.length > 0 ? (
              specializations.map((spec) => (
                <div key={spec.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{spec.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{spec.title}</h3>
                      <p className="text-sm text-gray-600">تخصص {spec.title}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleRemoveSpecialization(spec.id, spec.title)}
                    disabled={saving}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <span className="text-lg">×</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <span className="text-4xl mb-2 block">🎯</span>
                <p>هنوز تخصصی اضافه نکرده‌اید</p>
              </div>
            )}
          </div>
        </div>
        
        {/* افزودن تخصص جدید */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">افزودن تخصص جدید</h2>
          
          {/* جستجو و کنترل‌ها */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder="جستجو در تخصص‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            
            {groupedCategories.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {groupedCategories.length} دسته‌بندی
                  {searchResults.length > 0 && (
                    <span className="mr-2 text-blue-600">
                      • {searchResults.length} نتیجه جستجو
                    </span>
                  )}
                </span>
                <button
                  onClick={toggleAllGroups}
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  {Object.values(expandedGroups).some(expanded => expanded) ? 'بستن همه' : 'باز کردن همه'}
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {/* نتایج جستجو */}
            {searchResults.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  نتایج جستجو ({searchResults.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((result) => {
                    const isAdded = isSpecializationAdded(result.id);
                    return (
                      <div key={result.id} className={`border rounded-lg p-4 transition-colors ${
                        isAdded 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}>
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="text-2xl">{result.icon}</span>
                          <div>
                            <h4 className="font-medium text-gray-900">{result.title}</h4>
                            <p className="text-sm text-gray-600">
                              از دسته {result.parentGroup.title}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => isAdded ? handleRemoveSpecialization(result.id, result.title) : handleAddSpecialization(result.id)}
                          disabled={saving}
                          className={`w-full py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                            isAdded
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isAdded ? 'حذف از تخصص‌ها' : 'افزودن تخصص'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* لیست اصلی گروه‌ها */}
            {groupedCategories.map((group) => (
              <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Header گروه */}
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{group.icon}</span>
                    <div className="text-right">
                      <h3 className="font-semibold text-gray-900">{group.title}</h3>
                      <p className="text-sm text-gray-600">{group.subcategories.length} تخصص</p>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      expandedGroups[group.id] ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* محتوای گروه */}
                {expandedGroups[group.id] && (
                  <div className="p-4 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.subcategories.map((subcategory) => {
                        const isAdded = isSpecializationAdded(subcategory.id);
                        return (
                          <div key={subcategory.id} className={`border rounded-lg p-4 transition-colors ${
                            isAdded 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}>
                            <div className="flex items-center space-x-3 mb-3">
                              <span className="text-2xl">{subcategory.icon}</span>
                              <div>
                                <h4 className="font-medium text-gray-900">{subcategory.title}</h4>
                                <p className="text-sm text-gray-600">تخصص {subcategory.title}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => isAdded ? handleRemoveSpecialization(subcategory.id, subcategory.title) : handleAddSpecialization(subcategory.id)}
                              disabled={saving}
                              className={`w-full py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                                isAdded
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {isAdded ? 'حذف از تخصص‌ها' : 'افزودن تخصص'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {searchResults.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🔍</span>
              <p>هیچ تخصصی با این نام یافت نشد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
