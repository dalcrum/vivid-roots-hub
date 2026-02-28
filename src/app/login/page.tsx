"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🌱</span>
            <span className="text-2xl font-bold text-gray-900">
              Vivid Roots
            </span>
          </Link>
          <p className="text-gray-500 mt-2">Team Portal</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          {sent ? (
            /* Success state */
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Check your email!
              </h2>
              <p className="text-gray-600 mb-4">
                We sent a magic link to <strong>{email}</strong>. Click the link
                in your email to sign in.
              </p>
              <p className="text-sm text-gray-400">
                Don&apos;t see it? Check your spam folder.
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setEmail("");
                }}
                className="mt-6 text-sm text-emerald-600 hover:underline"
              >
                Try a different email
              </button>
            </div>
          ) : (
            /* Login form */
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Sign in to your account
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter your email and we&apos;ll send you a magic link.
              </p>

              <form onSubmit={handleLogin}>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@vividroots.org"
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />

                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full mt-4 bg-emerald-600 text-white font-medium py-3 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Magic Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/" className="hover:text-emerald-600">
            Back to public site
          </Link>
        </p>
      </div>
    </div>
  );
}
