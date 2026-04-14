"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { User } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { UserProfile } from "@/types";

interface AppContextValue {
  user: User | null;
  profile: UserProfile | null;
  isLoadingAuth: boolean;
  isLoadingProfile: boolean;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { user, isLoadingAuth } = useAuth();
  const { profile, isLoadingProfile, updateProfile } = useUserProfile(user);

  return (
    <AppContext.Provider value={{ user, profile, isLoadingAuth, isLoadingProfile, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
