"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { subscribeToUser, createUser, updateUser } from "@/lib/firebase/firestore";
import { UserProfile } from "@/types";

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    const unsubscribe = subscribeToUser(user.uid, async (data) => {
      if (!data) {
        // First time: create the user document
        await createUser(user.uid, { uid: user.uid });
      } else {
        setProfile(data);
      }
      setIsLoadingProfile(false);
    });

    return unsubscribe;
  }, [user]);

  async function updateProfile(data: Partial<UserProfile>) {
    if (!user) return;
    await updateUser(user.uid, data);
  }

  return { profile, isLoadingProfile, updateProfile };
}
