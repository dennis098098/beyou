import Anthropic from "@anthropic-ai/sdk";
import { getMbtiBlock } from "@/lib/utils/mbtiUtils";
import { GenerateSentenceRequest } from "@/types";

const client = new Anthropic();

const SYSTEM_PROMPT = `你是一本每日撕頁日曆的文案寫手。
你的工作是為日曆寫一句話。
這句話要讓人覺得是寫給他/她個人的，值得在早上第一眼看到。

規則：
- 只能輸出一句話，不要其他內容。
- 語言：繁體中文。
- 15-35 個中文字。
- 不要 hashtag、emoji、引號。
- 不要解釋，只輸出那句話本身。`;

function buildUserPrompt(req: GenerateSentenceRequest & { mbtiBlock: string }): string {
  const { calendarType, dateKey, dayOfWeek, userName, mbtiBlock } = req;

  if (calendarType === "funny") {
    return `今天是 ${dayOfWeek}，${dateKey}。
這個人叫做 ${userName}。
${mbtiBlock}
請寫一句帶點自嘲、荒謬、會讓人會心一笑的日曆句子。
要有共鳴感，不要雙關語冷笑話。`;
  }

  return `今天是 ${dayOfWeek}，${dateKey}。
這個人叫做 ${userName}。
${mbtiBlock}
請寫一句溫暖、踏實、低調鼓勵的日曆句子。
要像智慧的朋友留的便條。不要浮誇，不要陳腔濫調。`;
}

export async function POST(req: Request) {
  try {
    const body: GenerateSentenceRequest = await req.json();
    const { mbti, calendarType, dateKey, dayOfWeek, userName } = body;

    if (!calendarType || !dateKey || !dayOfWeek || !userName) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const mbtiBlock = getMbtiBlock(mbti);
    const userPrompt = buildUserPrompt({ ...body, mbtiBlock });

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const sentence = (message.content[0] as { text: string }).text.trim();
    return Response.json({ sentence });
  } catch (err) {
    console.error("generate-sentence error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
