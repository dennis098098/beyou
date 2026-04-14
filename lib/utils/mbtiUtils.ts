import { MBTIType } from "@/types";

const MBTI_CONTEXT: Record<string, string> = {
  INTJ: "是個策略思考者，獨立、有遠見，有時候會把自己的計畫想得太完美",
  INTP: "邏輯分析能力強，充滿好奇心，常常沉浸在自己的思維世界裡停不下來",
  ENTJ: "天生的領導者，果斷有效率，偶爾會忘記放鬆是一種必要的技能",
  ENTP: "思維靈活、喜歡辯論，腦子裡永遠有七八個計畫在同時運行",
  INFJ: "深刻、有同理心，追求意義，是那種默默把所有人都看透了但不說的類型",
  INFP: "浪漫、理想主義，內心世界豐富到可以自給自足，偶爾也會跟現實打架",
  ENFJ: "溫暖、有感染力，天生想要幫助每一個人，有時候忘了自己也需要被照顧",
  ENFP: "充滿熱情、天馬行空，每天都有新想法，執行力嘛……明天再說",
  ISTJ: "可靠、務實、重視傳統，是那種說到做到、從不食言的穩定力量",
  ISFJ: "體貼、盡責，默默付出卻不求回報，偶爾需要有人提醒：你也值得被關心",
  ESTJ: "組織能力強、重視秩序，是讓事情真正落地執行的那個人",
  ESFJ: "熱心、關懷他人，很在意人際關係的和諧，有時候太照顧別人而累了自己",
  ISTP: "冷靜、實用，喜歡動手解決問題，不喜歡廢話，直接給你答案",
  ISFP: "溫柔、敏感、活在當下，用行動而不是言語表達對世界的愛",
  ESTP: "行動力強、適應力好，享受當下的刺激，計畫這種東西太無聊了",
  ESFP: "活潑、愛玩、充滿魅力，走到哪裡都能帶來歡樂氣氛",
};

export function getMbtiBlock(mbti: MBTIType): string {
  if (!mbti) return "這個人的個性獨特，不需要標籤來定義。";
  const context = MBTI_CONTEXT[mbti];
  if (!context) return "這個人有著獨特的個性。";
  return `這個人的 MBTI 是 ${mbti}：${context}。`;
}

export const MBTI_OPTIONS: { value: string; label: string }[] = [
  { value: "INTJ", label: "INTJ — 建築師" },
  { value: "INTP", label: "INTP — 邏輯學家" },
  { value: "ENTJ", label: "ENTJ — 指揮官" },
  { value: "ENTP", label: "ENTP — 辯論家" },
  { value: "INFJ", label: "INFJ — 提倡者" },
  { value: "INFP", label: "INFP — 調停者" },
  { value: "ENFJ", label: "ENFJ — 主角" },
  { value: "ENFP", label: "ENFP — 競選者" },
  { value: "ISTJ", label: "ISTJ — 物流師" },
  { value: "ISFJ", label: "ISFJ — 守護者" },
  { value: "ESTJ", label: "ESTJ — 總經理" },
  { value: "ESFJ", label: "ESFJ — 執政官" },
  { value: "ISTP", label: "ISTP — 鑑賞家" },
  { value: "ISFP", label: "ISFP — 探險家" },
  { value: "ESTP", label: "ESTP — 企業家" },
  { value: "ESFP", label: "ESFP — 表演者" },
];
