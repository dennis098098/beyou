import { AvatarId } from "@/types";

export const AVATARS: { id: AvatarId; src: string; label: string; bg: string }[] = [
  { id: "shiba",   src: "/avatars/shiba.png",   label: "柴犬",   bg: "#FEE9D1" },
  { id: "cat",     src: "/avatars/cat.png",     label: "貓咪",   bg: "#EEEEF6" },
  { id: "fox",     src: "/avatars/fox.png",     label: "狐狸",   bg: "#FEE8D6" },
  { id: "rabbit",  src: "/avatars/rabbit.png",  label: "兔子",   bg: "#FDEDF3" },
  { id: "bear",    src: "/avatars/bear.png",    label: "熊熊",   bg: "#F2E8DC" },
  { id: "deer",    src: "/avatars/deer.png",    label: "小鹿",   bg: "#F0EDE0" },
  { id: "koala",   src: "/avatars/koala.png",   label: "無尾熊", bg: "#DFF0EF" },
  { id: "penguin", src: "/avatars/penguin.png", label: "企鵝",   bg: "#E8EEF6" },
];

export function getAvatar(id: AvatarId | null) {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0];
}
