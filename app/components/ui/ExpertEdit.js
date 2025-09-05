"use client";

import { useState, useEffect } from 'react';
import { useRole } from '../../hooks/useRole';
import { API_ENDPOINTS } from '../../config/api';

export default function ExpertEdit({ targetUserId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [formData, setFormData] = useState({
    bio: '',
    experience: '',
    education: '',
    certifications: '',
    hourlyRate: '',
    availability: '',
    languages: '',
    location: '',
    website: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  });
  const userRole = useRole();

  useEffect(() => {
    if (targetUserId) {
      fetchUserData(targetUserId);
    }
    fetchProfileData();
  }, [targetUserId]);

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

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      let profileUrl = API_ENDPOINTS.experts.getCurrentProfile;
      if (targetUserId) {
        profileUrl = `${API_ENDPOINTS.experts.getUserProfile}?userId=${targetUserId}`;
      }
      
      const response = await fetch(profileUrl, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setProfile(result.data);
          setFormData({
            bio: result.data.bio || '',
            experience: result.data.experience || '',
            education: result.data.education || '',
            certifications: result.data.certifications || '',
            hourlyRate: result.data.hourlyRate || '',
            availability: result.data.availability || '',
            languages: result.data.languages || '',
            location: result.data.location || '',
            website: result.data.website || '',
            linkedin: result.data.linkedin || '',
            twitter: result.data.twitter || '',
            instagram: result.data.instagram || ''
          });
        }
      } else if (response.status === 404) {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error fetching expert profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      let updateUrl = API_ENDPOINTS.experts.updateCurrentProfile;
      let requestBody = formData;
      
      if (targetUserId) {
        updateUrl = `${API_ENDPOINTS.experts.base}/${targetUserId}`;
        requestBody = {
          ...formData,
          userId: targetUserId
        };
      }
      
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          alert('پروفایل تخصصی با موفقیت بروزرسانی شد');
          fetchProfileData(); // Refresh data
        } else {
          alert('خطا در بروزرسانی پروفایل تخصصی: ' + result.message);
        }
      } else {
        const errorResult = await response.json();
        alert('خطا در بروزرسانی پروفایل تخصصی: ' + (errorResult.message || 'خطای نامشخص'));
      }
    } catch (error) {
      console.error('Error updating expert profile:', error);
      alert('خطا در بروزرسانی پروفایل تخصصی');
    } finally {
      setSaving(false);
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
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {targetUserId ? (
          targetUser ? 
            `ویرایش نمایه تخصصی ${targetUser.firstName} ${targetUser.lastName} (ID: ${targetUserId})` :
            `ویرایش نمایه تخصصی (ID: ${targetUserId})`
        ) : 'ویرایش نمایه تخصصی'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              بیوگرافی
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="درباره خود و تخصص‌هایتان بنویسید"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تجربه کاری
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="تجربیات کاری و پروژه‌های انجام شده"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تحصیلات
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مدرک تحصیلی و دانشگاه"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              گواهینامه‌ها
            </label>
            <input
              type="text"
              name="certifications"
              value={formData.certifications}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="گواهینامه‌های تخصصی"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نرخ ساعتی (تومان)
            </label>
            <input
              type="number"
              name="hourlyRate"
              value={formData.hourlyRate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="نرخ ساعتی خدمات"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              دسترسی
            </label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">انتخاب کنید</option>
              <option value="available">در دسترس</option>
              <option value="busy">مشغول</option>
              <option value="unavailable">غیرقابل دسترس</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              زبان‌ها
            </label>
            <input
              type="text"
              name="languages"
              value={formData.languages}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="زبان‌های مسلط (مثل: فارسی، انگلیسی)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              موقعیت مکانی
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="شهر و استان"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وب‌سایت
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="آدرس وب‌سایت شخصی"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LinkedIn
            </label>
            <input
              type="url"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="آدرس LinkedIn"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Twitter
            </label>
            <input
              type="url"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="آدرس Twitter"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="آدرس Instagram"
            />
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
