import { API_ENDPOINTS } from '../../../config/api';

export async function POST(request) {
  try {
    const cookies = request.headers.get('cookie');
    const body = await request.text();

    const backendResponse = await fetch(API_ENDPOINTS.messages.send, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies || '',
      },
      body,
    });

    const text = await backendResponse.text();
    return new Response(text, {
      status: backendResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message || 'خطا در ارتباط با سرور' },
      { status: 500 }
    );
  }
}
