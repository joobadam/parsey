"use client";

import { SignInPage } from "@/components/ui/sign-in";
import GrainBackground from "@/components/ui/grain-background";

export default function LandingPage() {
  const handleResetPassword = () => {};

  return (
    <main className="relative min-h-screen">
      <GrainBackground />
      <SignInPage
        heroImageSrc="/img/img1.png"
        onResetPassword={handleResetPassword}
      />
    </main>
  );
}

