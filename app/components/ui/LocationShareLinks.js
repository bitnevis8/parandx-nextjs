'use client';

import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { MAP_SHARE_PROVIDERS, buildMapShareLinks } from '../../utils/mapShareLinks';

export default function LocationShareLinks({ lat, lng, label = '', className = '' }) {
  const links = buildMapShareLinks(lat, lng, label);
  if (!links) return null;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {MAP_SHARE_PROVIDERS.map((provider) => (
        <a
          key={provider.id}
          href={links[provider.id]}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${provider.color}`}
        >
          {provider.label}
          <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5 opacity-70" aria-hidden />
        </a>
      ))}
    </div>
  );
}
