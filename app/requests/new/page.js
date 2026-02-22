"use client";

import { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../../config/api';

export default function NewRequestPage() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    location: '',
    deadline: '',
    media: null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.categories.getAll);
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({ ...prev, categoryId, subCategoryId: '' }));
    if (categoryId) {
      const category = categories.find(cat => cat.id == categoryId);
      setSubCategories(category?.subcategories || []);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form data:', formData);
  };

  if (loading) return <div className="p-4 sm:p-8 text-center min-h-[200px] flex items-center justify-center">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-white w-full max-w-[100vw] overflow-x-hidden">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-4xl w-full box-border">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8">درخواست خدمات جدید</h1>
          
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* عنوان */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عنوان درخواست
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="مثال: نیاز به نقاش ساختمان"
                required
              />
            </div>

            {/* دسته‌بندی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                دسته‌بندی اصلی
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              >
                <option value="">انتخاب کنید</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                زیردسته
              </label>
              <select
                value={formData.subCategoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, subCategoryId: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                disabled={!formData.categoryId}
              >
                <option value="">انتخاب کنید</option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.icon} {subCategory.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* توضیحات */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[100px]"
              placeholder="جزئیات درخواست خود را شرح دهید..."
              required
            />
          </div>

          {/* موقعیت و مهلت */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                موقعیت
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                placeholder="آدرس یا منطقه"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مهلت
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                required
              />
            </div>
          </div>

          {/* آپلود فایل */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              فایل‌های مرتبط (اختیاری)
            </label>
            <input
              type="file"
              multiple
              onChange={(e) => setFormData(prev => ({ ...prev, media: e.target.files }))}
              className="w-full px-2 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm file:mr-2 file:py-2 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              می‌توانید عکس، ویدیو یا فایل‌های متنی آپلود کنید
            </p>
          </div>

          {/* دکمه ارسال */}
          <div className="text-center pt-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              ارسال درخواست
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
