// src/app/login/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGate, { isEmailApproved } from "@/components/AuthGate";

export default function LoginPage() {
  const router = useRouter();

  // If already logged in, go straight to /dashboard
  useEffect(() => {
    const saved = sessionStorage.getItem("sessionUserEmail");
    if (saved && isEmailApproved(saved)) {
      router.replace("/dashboard");
    }
  }, [router]);

  return (
    <AuthGate
      title="Administrator Log in"
      onAuthed={() => {
        router.replace("/dashboard");
      }}
    />
  );
}
