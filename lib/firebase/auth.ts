import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "auth/popup-blocked" || code === "auth/popup-cancelled-by-user") {
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
