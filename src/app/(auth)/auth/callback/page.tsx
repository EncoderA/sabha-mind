"use client";

// This route was used by the old redirect-based Google OAuth flow.
// The app now uses a popup-based flow via @react-oauth/google.
// If someone lands here, redirect them back to login.

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GoogleCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  }, [router]);

  return null;
}
