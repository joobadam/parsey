"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import GlassInputWrapper from "./GlassInputWrapper";
import GoogleIcon from "./GoogleIcon";
import { NotificationsList } from "@/components/ui/animated-list";
import { cn } from "@/lib/utils";

export default function SignInPage({
  title = <span className="font-light text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with us",
  heroImageSrc,
  onSignIn,
  onGoogleSignIn,
  onResetPassword,
  onCreateAccount,
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw] relative z-10">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight text-white">{title}</h1>
            <p className="animate-element animate-delay-200 text-white/90">{description}</p>

            <form className="space-y-5" onSubmit={onSignIn}>
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

              <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" name="rememberMe" className="custom-checkbox" />
                  <span className="text-white/90">Keep me signed in</span>
                </label>
                <a href="#" onClick={(e) => { e.preventDefault(); onResetPassword?.(); }} className="hover:underline text-white transition-colors">Reset password</a>
              </div>

              <button type="submit" className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </form>

            <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-white/20"></span>
              <span className="px-4 text-sm text-white/70 bg-transparent absolute">Or continue with</span>
            </div>

            <button onClick={onGoogleSignIn} className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-white/20 rounded-2xl py-4 hover:bg-white/10 transition-colors text-white">
              <GoogleIcon />
              Continue with Google
            </button>

            <p className="animate-element animate-delay-900 text-center text-sm text-white/80">
              New to our platform? <a href="#" onClick={(e) => { e.preventDefault(); onCreateAccount?.(); }} className="text-white hover:underline transition-colors">Create Account</a>
            </p>
          </div>
        </div>
      </section>

      {heroImageSrc && (
   <section className="hidden md:block flex-1 relative p-4">
   <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
    <div className="absolute inset-4 pointer-events-none">
      <div className="absolute left-6 top-6 max-w-md">
        <div className="flex items-center gap-3">
          <Upload className="w-8 h-8 md:w-10 md:h-10 text-black" />
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight text-black tracking-tighter">
            Parsey
          </h2>
        </div>
        <p className="mt-2 text-sm md:text-base font-light text-black leading-relaxed max-w-xs">
          Smart Expense Tracking with AI Receipt Recognition. Upload receipts and let AI handle the rest
        </p>
      </div>
    </div>
   <div className="absolute left-4 top-4 bottom-4 right-2 flex items-end justify-end">
     <NotificationsList className="w-full max-w-sm" />
   </div>
 </section>
      )}
    </div>
  );
}
