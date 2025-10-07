// components/AuthGate.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

export function isEmailApproved(email: string | null | undefined) {
  if (!email) return false;
  return APPROVED_USERS.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

type User = { email: string; password: string };

const APPROVED_USERS: User[] = [
  { email: "garvit.kachhwah@iaisolution.com", password: "garvit@123" },
  { email: "himpreet.bhalla@iaisolution.com", password: "himpreet@123" },
  { email: "shamil.p@iaisolution.com", password: "shamil@123" },
 
];

function checkLogin(email: string, password: string) {
  return APPROVED_USERS.some(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password
  );
}

export default function AuthGate({
  onAuthed,
  title = "Administrator Log in",
}: {
  onAuthed: (email: string) => void;
  title?: string;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const ok = checkLogin(email, password);
      setLoading(false);
      if (ok) {
        sessionStorage.setItem("sessionUserEmail", email.trim());
        onAuthed(email.trim());
      } else {
        setError("Invalid email or password.");
      }
    }, 200);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center px-4 font-satoshi gradient4"
      style={{ fontFamily: "Satoshi, sans-serif" }}
    >
      <section
        className="flex flex-col items-center justify-center rounded-[12px] border border-white/40 bg-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.05)] backdrop-blur-lg w-full"
        style={{ padding: "40px 32px", maxWidth: 400 }}
      >
        <h1 className="text-[22px] sm:text-2xl font-semibold tracking-tight text-black text-center mb-6">
          {title}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4 items-center justify-center">
          {error && (
            <div className="w-full mb-2 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <input
            ref={emailRef}
            type="email"
            placeholder="Email*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            style={{ height: 52 }} 
            className="w-full rounded-[6px] bg-white px-3 text-[16px] font-normal text-[#333] placeholder:text-[#777] outline-none focus:ring-2 focus:ring-[#3B61F6] transition"
          />

          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            style={{ height: 52 }} 
            className="w-full rounded-[6px] bg-white px-3 text-[16px] font-normal text-[#333] placeholder:text-[#777] outline-none focus:ring-2 focus:ring-[#3B61F6] transition"
          />

          <button
            type="submit"
            disabled={loading}
            style={{ height: 52, background: "linear-gradient(135deg, #6C63FF, #3B61F6)" }} // ↑ increased height
            className="w-full rounded-full flex items-center justify-center text-[16px] font-medium text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed"
          >
            {loading ? "Please wait..." : "Log in"}
          </button>
        </form>
      </section>
    </div>
  );
}
