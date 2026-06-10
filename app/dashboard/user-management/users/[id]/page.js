'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** مسیر قدیمی — هدایت به صفحه مشاهده */
export default function UserIdRedirectPage({ params }) {
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      router.replace(`/dashboard/user-management/users/${id}/view`);
    }
  }, [id, router]);

  return (
    <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
      در حال انتقال...
    </div>
  );
}
