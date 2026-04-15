import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

const REDIRECT_FALLBACK_CODES = new Set([
  "auth/popup-blocked",
  "auth/popup-cancelled-by-user",
  "auth/cancelled-popup-request",
  "auth/operation-not-supported-in-this-environment",
  "auth/web-storage-unsupported",
]);

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code ?? "";
    if (REDIRECT_FALLBACK_CODES.has(code)) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw err;
  }
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
