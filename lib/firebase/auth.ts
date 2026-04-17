import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function signInWithGoogle() {
  // iOS (including Telegram/Line SFSafariViewController) — use redirect
  if (isIOS()) {
    await signInWithRedirect(auth, provider);
    return null;
  }
  // Desktop / Android — use popup with redirect fallback
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? "";
    if (code === "auth/user-cancelled") throw err;
    await signInWithRedirect(auth, provider);
    return null;
  }
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
