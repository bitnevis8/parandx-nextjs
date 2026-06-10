import { redirect } from "next/navigation";

export default async function LoginRedirect({ searchParams }) {
  const params = await searchParams;
  const qs = new URLSearchParams();
  if (params?.redirect) qs.set("redirect", params.redirect);
  const query = qs.toString();
  redirect(query ? `/auth?${query}` : "/auth");
}
