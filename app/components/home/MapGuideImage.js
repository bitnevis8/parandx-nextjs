'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PhotoIcon } from '@heroicons/react/24/outline';

export default function MapGuideImage({ src, alt, caption }) {
  const [missing, setMissing] = useState(false);
  const fileName = src?.split('/').pop() || 'image.png';

  if (missing) {
    return (
      <figure className="overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/90">
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
          <PhotoIcon className="h-10 w-10 text-gray-300" aria-hidden />
          <p className="text-xs font-semibold text-gray-600">جای تصویر راهنما</p>
          <p className="font-mono text-[11px] text-gray-500" dir="ltr">
            public/images/map-guide/{fileName}
          </p>
          {caption ? (
            <p className="text-[11px] text-gray-400">{caption}</p>
          ) : null}
        </div>
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-sm">
      <div className="relative aspect-[16/10] w-full bg-gray-100">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 640px"
          onError={() => setMissing(true)}
        />
      </div>
      {caption ? (
        <figcaption className="border-t border-gray-100 px-3 py-2 text-center text-[11px] text-gray-500">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
