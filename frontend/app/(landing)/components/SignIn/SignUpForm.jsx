"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import GlassInputWrapper from "./GlassInputWrapper";
import GoogleIcon from "./GoogleIcon";
import { Button } from "@/components/ui/Button";

export default function SignUpForm({ onBackToSignIn }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-white mb-2 animate-element animate-delay-100">Create Account</h2>
      <p className="text-white/70 text-sm mb-6 animate-element animate-delay-200">Join Parsey to track your expenses</p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm animate-element animate-delay-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="animate-element animate-delay-300">
          <label className="text-sm font-medium text-white/80">Full Name</label>
          <GlassInputWrapper>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
            />
          </GlassInputWrapper>
        </div>

        <div className="animate-element animate-delay-400">
          <label className="text-sm font-medium text-white/80">Email Address</label>
          <GlassInputWrapper>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
            />
          </GlassInputWrapper>
        </div>

        <div className="animate-element animate-delay-500">
          <label className="text-sm font-medium text-white/80">Password</label>
          <GlassInputWrapper>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (min 8 characters)"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                ) : (
                  <Eye className="w-5 h-5 text-white/80 hover:text-white transition-colors" />
                )}
              </button>
            </div>
          </GlassInputWrapper>
        </div>

        <div className="animate-element animate-delay-600">
          <label className="text-sm font-medium text-white/80">Confirm Password</label>
          <GlassInputWrapper>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none text-white placeholder:text-white/60"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showConfirmPassword ? (
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
          className="animate-element animate-delay-700 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="animate-element animate-delay-800 relative flex items-center justify-center my-6">
        <span className="w-full border-t border-white/20"></span>
        <span className="px-4 text-sm text-white/70 bg-transparent absolute">Or continue with</span>
      </div>

      <button
        onClick={handleGoogleSignUp}
        disabled={isLoading}
        className="animate-element animate-delay-900 w-full flex items-center justify-center gap-3 border border-white/20 rounded-2xl py-4 hover:bg-white/10 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <GoogleIcon />
        Sign Up with Google
      </button>

      <p className="animate-element animate-delay-1000 text-center text-sm text-white/80 mt-6">
        Already have an account?{" "}
        <button type="button" onClick={onBackToSignIn} className="text-white hover:underline font-semibold transition-colors">
          Sign In
        </button>
      </p>
    </div>
  );
}

