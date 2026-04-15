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
    const unsubscribe = subscribeToUser(
      user.uid,
      async (data) => {
        if (!data) {
          try {
            await createUser(user.uid, { uid: user.uid });
          } catch (err) {
            console.error("createUser error:", err);
            setIsLoadingProfile(false);
          }
        } else {
          setProfile(data);
          setIsLoadingProfile(false);
        }
      },
      (err) => {
        console.error("subscribeToUser error:", err);
        setIsLoadingProfile(false);
      }
    );

    return unsubscribe;
  }, [user]);

  async function updateProfile(data: Partial<UserProfile>) {
    if (!user) return;
    await updateUser(user.uid, data);
  }

  return { profile, isLoadingProfile, updateProfile };
}
