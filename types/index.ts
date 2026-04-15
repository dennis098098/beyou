export type CalendarType = "funny" | "positive";

export type AvatarId = "shiba" | "cat" | "fox" | "rabbit" | "bear" | "deer" | "koala" | "penguin";
export type Gender = "male" | "female" | "other" | null;

export type MBTIType =
  | "INTJ" | "INTP" | "ENTJ" | "ENTP"
  | "INFJ" | "INFP" | "ENFJ" | "ENFP"
  | "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ"
  | "ISTP" | "ISFP" | "ESTP" | "ESFP"
  | null;

export interface UserProfile {
  uid: string;
  name: string;
  birthday: string; // "YYYY-MM-DD"
  gender: Gender;
  avatar: AvatarId | null;
  mbti: MBTIType;
  calendarType: CalendarType | null;
  setupComplete: boolean;
  coverSelected: boolean;
  calendarStartDate: string | null; // "YYYY-MM-DD"
  lastTearDate: string | null; // "YYYY-MM-DD" (legacy, kept for compatibility)
  lastTearDates: Record<string, string | null>; // per calendarType: { positive, funny }
  totalPagesTorn: number;
  createdAt: number; // timestamp ms
}

export interface SentenceDoc {
  sentence: string;
  calendarType: CalendarType;
  mbti: MBTIType;
  torn: boolean;
  tornAt: number | null;
  generatedAt: number;
}

export interface GenerateSentenceRequest {
  mbti: MBTIType;
  calendarType: CalendarType;
  dateKey: string; // "YYYY-MM-DD"
  dayOfWeek: string;
  userName: string;
}

export interface GenerateSentenceResponse {
  sentence: string;
}
