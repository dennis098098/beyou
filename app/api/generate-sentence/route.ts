import { getMbtiBlock } from "@/lib/utils/mbtiUtils";
import { GenerateSentenceRequest, CalendarType, MBTIType } from "@/types";

const POSITIVE_STYLE_POOL = [
  "用一個具體的生活場景切入，讓人感覺是今天早上剛發生的事",
  "用反問句，讓人重新思考某件理所當然的事",
  "聚焦在身體感官：呼吸、溫度、觸感，帶出心理狀態",
  "從關係出發，關於相處、陪伴或獨處",
  "像一個哲學小觀察，但用日常語言說出來",
  "直接對今天這個時間點說話，具體到這個早晨",
  "說一件別人不會說、但很多人有過的感受",
  "像一句電影台詞，有畫面感但不煽情",
  "用否定句開頭，說出一個解放感的觀點",
  "從食物或飲食出發，連結到某種心境",
  "用天氣或自然景象帶出今天的情緒基調",
  "說一個關於時間流逝的細微觀察",
  "描述一個拖延或猶豫的瞬間，但用溫柔的方式說",
  "從某個小物件或習慣動作出發，帶出一種生活哲學",
  "說一個關於疲憊但還是繼續的感受",
  "從城市或空間感出發，帶出某種孤獨或自在",
];

const FUNNY_STYLE_POOL = [
  "用荒謬的邏輯說一件很多人都有過但不敢承認的事",
  "假裝給出很認真的人生建議，但其實建議很廢",
  "用「今天的科學發現」的語氣說一個毫無根據但好笑的結論",
  "從一件超級小的日常瑣事出發，誇張地上升到宇宙哲學",
  "用反話說出一個大家心裡都這樣想但嘴上不說的事",
  "模仿一個很正經的心靈語錄，但最後一句話完全出戲",
  "用「其實你也知道」的語氣說一個超現實的人生觀察",
  "描述一個拖延或逃避的行為，用完全理解的語氣幫它找理由",
  "假裝替某個無生命的物體發聲，說出它的心聲",
  "用對比手法：理想中的樣子 vs 現實中的自己",
  "說一個只有在某個特定時刻才會有的荒謬念頭",
  "用「研究顯示」開頭，說出一個完全不科學的人生真理",
  "從食物或睡眠出發，說出某種人類行為的深層動機",
  "模仿勵志語錄的格式，但內容完全是擺爛哲學",
  "說一件本來應該很嚴肅，但換個角度看其實很好笑的事",
  "用「恭喜你」的語氣，稱讚某個沒有意義的小成就",
];

function pickStyle(dateKey: string, attempt: number, isFunny: boolean): string {
  const pool = isFunny ? FUNNY_STYLE_POOL : POSITIVE_STYLE_POOL;
  const seed = dateKey.replace(/-/g, "").split("").reduce((a, b) => a + parseInt(b), 0);
  return pool[(seed + attempt * 3) % pool.length];
}

const SYSTEM_PROMPT = `你是一本每日撕頁日曆的文案寫手，風格介於村上春樹的散文與好友傳來的早安訊息之間。

【最重要】語言規定：必須使用台灣繁體中文。以下是常見錯誤，絕對禁止使用簡體字：
- 禁用：里、这、东西、时间、问题、发现、没有、还是、对、爱、说、来、过、样、么、别、开、后、处、边 等簡體字
- 正確：裡、這、東西、時間、問題、發現、沒有、還是、對、愛、說、來、過、樣、麼、別、開、後、處、邊

規則：
- 只能輸出一句話，不要其他內容。
- 所有文字必須是繁體中文，一個簡體字都不能出現。
- 15-35 個中文字。
- 不要 hashtag、emoji、引號。
- 句尾只能用句號，不要用驚嘆號、省略號。
- 不要解釋，只輸出那句話本身。
- 絕對不用這些詞：努力、加油、相信自己、每一天、堅持、夢想、正能量、勇氣、突破、成長、規律、目標、計畫。`;

const FALLBACK: Record<CalendarType, string[]> = {
  positive: [
    "今天的你，已經比昨天的自己更勇敢了一點點。",
    "不必完美，只需真實地活著就已經足夠。",
    "慢一點也沒關係，重要的是你還在前進。",
    "有些事情今天做不完，明天的太陽還是會升起。",
    "你比自己以為的更有能力面對這一切。",
    "深呼吸，今天只需要做好今天的事就好。",
    "疲倦的時候休息，不是放棄，是為了走更遠。",
    "每一個平凡的日子，都是生命給你的禮物。",
    "不用跟別人比，跟昨天的自己比就夠了。",
    "你的存在本身，就已經是一件很了不起的事。",
    "今天遇到的困難，都是讓你變強的材料。",
    "即使小步前進，也是在移動，不是原地踏步。",
    "放下昨天，專注當下，期待明天。",
    "你值得被好好對待，包括被自己好好對待。",
    "有時候最大的勇氣，是對自己溫柔。",
  ],
  funny: [
    "今天的目標：活著就好，其他都是bonus。",
    "你的拖延症不是缺點，是在等待最佳時機。",
    "深呼吸，這個世界的荒謬不是你的錯。",
    "今天也是個適合假裝很忙的好日子。",
    "你沒有輸，只是還沒贏，這兩件事不一樣。",
    "計畫永遠跟不上變化，所以不如少計畫多睡覺。",
    "今天遇到的麻煩，明天回頭看都是故事。",
    "你的存在就是對這個無聊世界的一種反抗。",
    "別人看起來很厲害，只是因為你沒看到他們的崩潰時刻。",
    "今天也請繼續假裝一切盡在掌握。",
    "人生就是一連串搞不清楚狀況但還是撐過去了。",
    "不要問今天能做什麼，要問今天能少做什麼。",
    "你的疲憊是真實的，你的努力也是真實的。",
    "世界很複雜，但你的被子很暖，先記住這個。",
    "今天也是個沒有標準答案的日子，放輕鬆。",
  ],
};

function getFallbackSentence(calendarType: CalendarType, dateKey: string): string {
  const pool = FALLBACK[calendarType];
  // Use date as seed for consistent daily sentence
  const seed = dateKey.replace(/-/g, "").split("").reduce((a, b) => a + parseInt(b), 0);
  return pool[seed % pool.length];
}

function buildUserPrompt(req: GenerateSentenceRequest & { mbtiBlock: string }, attempt = 0): string {
  const { calendarType, dateKey, dayOfWeek, userName, mbtiBlock } = req;
  const isFunny = calendarType === "funny";
  const style = pickStyle(dateKey, attempt, isFunny);

  if (isFunny) {
    return `今天是 ${dayOfWeek}，${dateKey}。
讀者是 ${userName}，${mbtiBlock}
寫作方向：${style}
請寫一句幽默、有點荒謬、讓人會心一笑的日曆句子。
風格要像一個懂你的朋友說出來的，不是搞笑段子，是那種讓你笑著點頭的句子。
不要雙關語冷笑話，不要太誇張，要有真實共鳴感。
重要：句子裡不能出現讀者的名字。`;
  }

  return `今天是 ${dayOfWeek}，${dateKey}。
讀者是 ${userName}，${mbtiBlock}
寫作方向：${style}
請寫一句讓人看了有點觸動、低調但有力量的日曆句子。像朋友留的便條，不是勵志演講。
重要：句子裡不能出現讀者的名字。`;
}

export async function POST(req: Request) {
  const body: GenerateSentenceRequest = await req.json().catch(() => ({}));
  const { mbti, calendarType, dateKey, dayOfWeek, userName } = body;

  if (!calendarType || !dateKey || !dayOfWeek || !userName) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Try AI first, fall back to curated sentences
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      const mbtiBlock = getMbtiBlock(mbti);
      const stylePool = calendarType === "funny" ? FUNNY_STYLE_POOL : POSITIVE_STYLE_POOL;
      const attempt = Math.floor(Math.random() * stylePool.length);
      const userPrompt = buildUserPrompt({ ...body, mbtiBlock }, attempt);
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 80,
          temperature: 0.9,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      });
      const data = await res.json();
      const sentence = data.choices?.[0]?.message?.content?.trim();
      if (sentence) return Response.json({ sentence });
    }
  } catch (err) {
    console.warn("AI generation failed, using fallback:", err instanceof Error ? err.message : err);
  }

  // Fallback to pre-written sentences
  const sentence = getFallbackSentence(calendarType, dateKey);
  return Response.json({ sentence });
}
