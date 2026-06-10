import { Suspense } from "react";
import AuthFlow from "../components/auth/AuthFlow";

function AuthFallback() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal-600 border-t-transparent" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthFlow />
    </Suspense>
  );
}
