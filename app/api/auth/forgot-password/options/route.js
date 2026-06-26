import { API_ENDPOINTS } from "../../../../config/api";
import { proxyAuthPost } from "../../_proxy";

export async function POST(request) {
  return proxyAuthPost(request, API_ENDPOINTS.auth.forgotPasswordOptions);
}
