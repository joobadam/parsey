"use client";

import React, { useState } from "react";
import { NotificationsList } from "@/components/ui/animated-list";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { Brain } from 'lucide-react';

export default function SignInPage({
  title = <span className="font-light text-white tracking-tighter">Welcome</span>,
  description = "Access your account and continue your journey with me",
  heroImageSrc,
  onResetPassword,
}) {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row w-[100dvw] relative z-10">
      <section className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {showSignUp ? (
            <SignUpForm onBackToSignIn={() => setShowSignUp(false)} />
          ) : (
            <SignInForm
              title={title}
              description={description}
              onResetPassword={onResetPassword}
              onCreateAccount={() => setShowSignUp(true)}
            />
          )}
        </div>
      </section>

      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 ">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
          <div className="absolute inset-4 pointer-events-none">
            <div className="absolute left-6 top-6 max-w-md bg-black p-4 rounded-2xl text-white shadow-red animate-slide-right animate-delay-300 ">
              <div className="flex items-center gap-4 mb-5">
                <h1 className="text-6xl font-bold text-white" style={{ fontFamily: 'var(--font-permanent-marker), cursive' }}>
                  Parsey
                </h1>
                <Brain className="w-13 h-13 text-white translate-y-2 -translate-x-3" />
              </div>
              <p className="text-sm font-light text-gray-200">
                Smart Expense Tracking with AI Receipt Recognition <br /> Upload receipts and let AI handle the rest
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
