"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function GatePage() {
  const { user, profile, isLoadingAuth, isLoadingProfile } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (isLoadingAuth || isLoadingProfile) return;

    if (!user) {
      router.replace("/auth");
      return;
    }

    if (!profile?.setupComplete) {
      router.replace("/setup");
      return;
    }

    if (!profile?.coverSelected) {
      router.replace("/cover");
      return;
    }

    router.replace("/calendar");
  }, [user, profile, isLoadingAuth, isLoadingProfile, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <LoadingSpinner />
    </div>
  );
}
