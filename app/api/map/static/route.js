import { NextResponse } from 'next/server';

export async function GET(request) {
  const key = process.env.NESHAN_SERVICE_KEY;
  if (!key) {
    return NextResponse.json({ error: 'NESHAN_SERVICE_KEY is not configured' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('zoom') || '13';
  const width = searchParams.get('width') || '960';
  const height = searchParams.get('height') || '448';

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
  }

  const url = new URL('https://api.neshan.org/v5/static');
  url.searchParams.set('key', key);
  url.searchParams.set('style', 'light');
  url.searchParams.set('width', width);
  url.searchParams.set('height', height);
  url.searchParams.set('zoom', zoom);
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lng);

  try {
    const res = await fetch(url.toString(), {
      headers: { 'Api-Key': key },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: 'Neshan static map failed', detail: text }, { status: res.status });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'image/png';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
