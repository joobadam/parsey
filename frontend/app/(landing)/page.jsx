"use client";

import { SignInPage } from "@/components/ui/sign-in";
import GrainBackground from "@/components/ui/grain-background";

export default function LandingPage() {
  const handleSignIn = (event) => {
    event.preventDefault();
  };

  const handleGoogleSignIn = () => {};
  const handleResetPassword = () => {};
  const handleCreateAccount = () => {};

  return (
    <main className="relative min-h-screen">
      <GrainBackground />
      <SignInPage
        heroImageSrc="/img/img1.png"
        onSignIn={handleSignIn}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />
    </main>
  );
}

