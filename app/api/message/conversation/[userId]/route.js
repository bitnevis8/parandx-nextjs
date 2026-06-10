import { API_ENDPOINTS } from '../../../../config/api';

export async function GET(request, context) {
  try {
    const { userId } = await context.params;
    const cookies = request.headers.get('cookie');
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    const backendResponse = await fetch(
      `${API_ENDPOINTS.messages.conversation(userId)}${query ? `?${query}` : ''}`,
      {
        headers: {
          Cookie: cookies || '',
        },
      }
    );

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
