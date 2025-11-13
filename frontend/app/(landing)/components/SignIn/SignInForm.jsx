"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import GlassInputWrapper from "./GlassInputWrapper";
import GoogleIcon from "./GoogleIcon";

export default function SignInForm({
  title = <span className="font-light text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with me",
  onCreateAccount,
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white">{title}</h1>
      <p className="animate-element animate-delay-200 text-white/90">{description}</p>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm animate-element animate-delay-300">
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="animate-element animate-delay-300">
          <label className="text-sm font-medium text-white/80">Email Address</label>
          <GlassInputWrapper>
            <input name="email" type="email" placeholder="Enter your email address" className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
          </GlassInputWrapper>
        </div>

        <div className="animate-element animate-delay-400">
          <label className="text-sm font-medium text-white/80">Password</label>
          <GlassInputWrapper>
            <div className="relative">
              <input name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/60" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center">
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                ) : (
                  <Eye className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                )}
              </button>
            </div>
          </GlassInputWrapper>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="animate-element animate-delay-700 relative flex items-center justify-center">
        <span className="w-full border-t border-white/20"></span>
        <span className="px-4 text-sm text-white/70 bg-transparent absolute">Or continue with</span>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-white/20 rounded-2xl py-4 hover:bg-white/10 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <p className="animate-element animate-delay-900 text-center text-sm text-white/80">
        New to our platform? <button type="button" onClick={onCreateAccount} className="text-white hover:underline transition-colors">Create Account</button>
      </p>
    </div>
  );
}

