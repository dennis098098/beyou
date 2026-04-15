"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";
import { ProfileSetupModal } from "@/components/setup/ProfileSetupModal";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  const { profile } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    if (profile?.setupComplete) {
      router.replace(profile.coverSelected ? "/calendar" : "/cover");
    }
  }, [profile, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <ProfileSetupModal />
    </div>
  );
}
