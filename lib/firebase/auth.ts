import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "./config";

const provider = new GoogleAuthProvider();

function isMobile() {
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export async function signInWithGoogle() {
  if (isMobile()) {
    await signInWithRedirect(auth, provider);
    return null;
  }
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function handleRedirectResult() {
  const result = await getRedirectResult(auth);
  return result?.user ?? null;
}

export async function signOut() {
  await firebaseSignOut(auth);
}
