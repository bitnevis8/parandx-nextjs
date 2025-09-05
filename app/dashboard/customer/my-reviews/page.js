"use client";

import { useState, useEffect } from 'react';
import { useRole } from '../../../hooks/useRole';

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = useRole();

  useEffect(() => {
    // TODO: Fetch user reviews from API
    setLoading(false);
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">نظرات من</h1>
        
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{review.expertName}</h3>
                    <p className="text-sm text-gray-600">{review.serviceTitle}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-600 mr-2">({review.rating}/5)</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-3">{review.comment}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>📅 {review.date}</span>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      ویرایش
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      حذف
                    </button>
                  </div>
                </div>
                
                {review.expertReply && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">پاسخ متخصص:</p>
                    <p className="text-gray-700">{review.expertReply}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">💬</span>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">هنوز نظری ارسال نکرده‌اید</h3>
              <p className="text-gray-600">پس از تکمیل پروژه‌ها، می‌توانید نظرات خود را اینجا ارسال کنید.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
