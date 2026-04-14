import { ProfileSetupModal } from "@/components/setup/ProfileSetupModal";

export const dynamic = "force-dynamic";

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <ProfileSetupModal />
    </div>
  );
}
