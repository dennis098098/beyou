"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/contexts/AppContext";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { handleRedirectResult } from "@/lib/firebase/auth";

export const dynamic = "force-dynamic";

export default function AuthPage() {
  const { user, isLoadingAuth } = useAppContext();
  const router = useRouter();

  // Handle iOS redirect result — explicitly navigate on success
  useEffect(() => {
    handleRedirectResult().then((u) => {
      if (u) router.replace("/");
    }).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && user) {
      router.replace("/");
    }
  }, [user, isLoadingAuth, router]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background image */}
      <Image
        src="/login-bg.jpg"
        alt="background"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Spacer pushes button to bottom */}
      <div className="flex-1" />

      {/* Google sign-in button — pinned to bottom */}
      <div className="relative z-10 flex flex-col items-center px-8 pb-16 w-full">
        <GoogleSignInButton />
      </div>
    </div>
  );
}
