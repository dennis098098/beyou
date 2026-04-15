import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import { UserProfile, SentenceDoc } from "@/types";

// ── User Profile ──────────────────────────────────────────────

export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function createUser(uid: string, data: Partial<UserProfile>): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    name: "",
    birthday: "",
    gender: null,
    avatar: null,
    mbti: null,
    calendarType: null,
    setupComplete: false,
    coverSelected: false,
    calendarStartDate: null,
    lastTearDate: null,
    lastTearDates: { positive: null, funny: null },
    totalPagesTorn: 0,
    createdAt: Date.now(),
    ...data,
  });
}

export async function updateUser(uid: string, data: Partial<UserProfile>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data as Record<string, unknown>);
}

export function subscribeToUser(
  uid: string,
  callback: (profile: UserProfile | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, "users", uid),
    (snap) => { callback(snap.exists() ? (snap.data() as UserProfile) : null); },
    (err) => { onError?.(err); }
  );
}

// ── Sentences ─────────────────────────────────────────────────

export async function getSentence(uid: string, dateKey: string): Promise<SentenceDoc | null> {
  const snap = await getDoc(doc(db, "users", uid, "sentences", dateKey));
  if (!snap.exists()) return null;
  return snap.data() as SentenceDoc;
}

export async function deleteSentence(uid: string, dateKey: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid, "sentences", dateKey));
}

export async function saveSentence(uid: string, dateKey: string, data: SentenceDoc): Promise<void> {
  await setDoc(doc(db, "users", uid, "sentences", dateKey), data);
}

export async function resetUser(uid: string): Promise<void> {
  await setDoc(doc(db, "users", uid), {
    uid,
    name: "",
    birthday: "",
    gender: null,
    avatar: null,
    mbti: null,
    calendarType: null,
    setupComplete: false,
    coverSelected: false,
    calendarStartDate: null,
    lastTearDate: null,
    lastTearDates: { positive: null, funny: null },
    totalPagesTorn: 0,
    createdAt: Date.now(),
  });
}

export async function tearPage(uid: string, dateKey: string, calendarType: string): Promise<void> {
  const batch = writeBatch(db);

  const sentenceKey = `${dateKey}_${calendarType}`;
  batch.set(
    doc(db, "users", uid, "sentences", sentenceKey),
    { torn: true, tornAt: Date.now() },
    { merge: true }
  );

  const currentTotal =
    (await getDoc(doc(db, "users", uid))).data()?.totalPagesTorn ?? 0;
  batch.update(doc(db, "users", uid), {
    lastTearDate: dateKey,
    [`lastTearDates.${calendarType}`]: dateKey,
    totalPagesTorn: currentTotal + 1,
  });

  await batch.commit();
}
