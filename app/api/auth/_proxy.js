export async function proxyAuthPost(request, backendUrl) {
  try {
    const body = await request.json();
    const cookies = request.headers.get("cookie");

    const backendResponse = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies || "",
      },
      body: JSON.stringify(body),
    });

    const setCookieHeader = backendResponse.headers.get("set-cookie");
    const data = await backendResponse.json();

    const response = new Response(JSON.stringify(data), {
      status: backendResponse.status,
      headers: { "Content-Type": "application/json" },
    });

    if (setCookieHeader) {
      response.headers.append("Set-Cookie", setCookieHeader);
    }

    return response;
  } catch (error) {
    console.error(`Error proxying auth request to ${backendUrl}:`, error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
