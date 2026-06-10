'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/** هدایت به پروفایل فروشگاه در داشبورد */
export default function GoodsStoreRegisterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard?tab=merchant-edit');
  }, [router]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-gray-500">
      در حال انتقال به پروفایل فروشگاه…
    </div>
  );
}
