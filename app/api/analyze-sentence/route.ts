import { NextRequest, NextResponse } from "next/server";
import { toTraditional } from "@/lib/utils/tcConvert";

export async function POST(req: NextRequest) {
  try {
    const { sentence, mbti, calendarType, reversed, luckBonus } = await req.json();
    if (!sentence) {
      return NextResponse.json({ error: "missing sentence" }, { status: 400 });
    }

    const isFunny = calendarType === "funny";
    const tcRule = "【語言規定】必須使用台灣繁體中文，嚴禁任何簡體字。禁用：里、这、时间、问题、发现、没有、还是、说、来、过、样、么、别、开、后、爱、对 等簡體字，一律改用對應繁體字。";
    const mbtiLine = mbti ? `這個人的 MBTI 是 ${mbti}。` : "這個人的 MBTI 未知。";
    const useMbti = mbti && Math.random() > 0.25; // 75% 機率帶入 MBTI（有 MBTI 才算）

    const mbtiInstruction = useMbti
      ? `這個人是 ${mbti}，請自然地把這個類型的核心傾向（例如思考模式、情感處理、行動風格）融入解析，像是你真的認識他一樣，不要像在解釋 MBTI 定義。`
      : "這次不需要提及 MBTI，純粹從句子本身出發。";

    let systemPrompt: string;
    let angles: string[];
    let structureGuide: string;

    if (luckBonus) {
      const bonusAngles = [
        "今天有一件小事，如果你去做，會比平時更順",
        "今天有一個人，值得你多說一句話",
        "今天你的直覺比往常準，遇到猶豫的事可以相信第一感",
        "今天有一個機會會用很不起眼的方式出現，不要忽略它",
        "今天適合開一個之前一直拖著的頭，時機到了",
        "今天有什麼讓你心動但沒說出口的，說出來會有好事",
      ];
      const bonusAngle = bonusAngles[Math.floor(Math.random() * bonusAngles.length)];
      const isFunnyBonus = calendarType === "funny";
      const bonusSystemPrompt = isFunnyBonus
        ? `你是一個有點神棍但說話很準的算命朋友，改運成功後給對方一句今日彩蛋提示，幽默但有點像真的。只輸出一句話，不加標題或前綴。${tcRule}`
        : `你是一位溫柔的算命師，改運成功後給對方一句今日專屬的彩蛋提示，像是只說給他一個人聽的秘密。只輸出一句話，不加標題或前綴。${tcRule}`;
      const bonusPrompt = `今天的日曆句子是：「${sentence}」\n\n今日彩蛋方向：${bonusAngle}\n\n只輸出一句話，不超過25個字，有餘韻，讓人覺得「哇這說的是我」。`;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GROQ_API_KEY}` },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 80,
          messages: [
            { role: "system", content: bonusSystemPrompt },
            { role: "user", content: bonusPrompt },
          ],
        }),
      });
      const data = await res.json();
      const bonus = data.choices?.[0]?.message?.content?.trim();
      if (!bonus) throw new Error("empty response");
      return NextResponse.json({ analysis: toTraditional(bonus) });
    }

    if (reversed) {
      // After failed 改運 — dark/ominous reversed interpretation
      if (isFunny) {
        systemPrompt = `你是一個看透一切的悲觀毒舌朋友，改運失敗之後，用更荒謬、更無奈的方式點破現實。只輸出內容，不加標題或前綴。${tcRule}`;
        angles = [
          "把這句話反過來解讀，說說它其實在預告今天哪裡會出包",
          "從「努力沒有用」的荒謬角度延伸，今天可能發生的鬧劇",
          "用命運弄人的邏輯，說說這句話反過來看有多諷刺",
          "從「改運失敗了那就擺爛吧」的破罐子破摔角度出發",
          "假裝很淡定地說，其實這句話根本是在詛咒你今天",
          "從「宇宙今天跟你作對」的角度，說說可能踩到的雷",
        ];
        structureGuide = `第一句：反轉句子原意，帶出今天可能的壞兆頭，語氣荒謬但不過分悲傷。\n第二句：延伸說一個今天最好「什麼都別做」的理由，幽默地建議躺平。\n第三句：一句苦中帶笑的結尾，讓人無奈搖頭但還是會笑。`;
      } else {
        systemPrompt = `你是一位語氣沉穩的占卜師，改運儀式失敗了，以委婉但直接的方式提醒今日的凶兆與需要小心之處。只輸出內容，不加標題或前綴。${tcRule}`;
        angles = [
          "從能量阻滯的角度，說說今天這句話反映的是什麼需要警惕的訊號",
          "從人際關係角度提醒，今天可能有什麼摩擦或誤解需要留心",
          "從身心狀態切入，今天的阻力可能來自哪裡，需要收斂什麼",
          "從決策角度切入，今天哪些事最好延後，不要輕舉妄動",
          "從自我觀察角度，這句話反轉後照見了什麼需要先處理的內在課題",
          "從時機角度提醒，今天可能不是前進的好時機，靜觀其變更合適",
        ];
        structureGuide = `第一句：從指定角度輕輕點出今天需要留意的方向，語氣平靜不嚇人。\n第二句：給一個今天應該「暫停」或「收斂」的具體建議。\n第三句：一句有點宿命感但不絕望的收尾，留下思考空間。`;
      }
    } else if (isFunny) {
      systemPrompt = `你是一個幽默又有點毒舌的朋友，說話直接但不傷人，喜歡用輕鬆荒謬的方式點出人生真相。只輸出內容，不加標題或前綴。${tcRule}`;
      angles = [
        "用一點自嘲的角度，說說這句話是不是其實在說某種人類共同的懶惰或逃避",
        "用荒謬的邏輯延伸，這句話如果套用在某個奇怪的生活場景會怎樣",
        "從反諷角度切入，這句話表面說一件事，但背後其實在說另一件更好笑的事",
        "假裝很認真地分析，但說到一半突然轉個彎變得很接地氣",
        "用「社會觀察」的角度，這句話照見了哪些人類共通的荒謬行為",
        "從「其實你也這樣」的角度出發，讓讀者笑著點頭",
      ];
      structureGuide = `第一句：用指定角度輕鬆切入，有點好笑但不誇張。\n第二句：稍微延伸，說一個今天可以「試試看」的小事，語氣要像在開玩笑但其實是認真的。\n第三句：一句有點意思的收尾，讓人哭笑不得或會心一笑。`;
    } else {
      systemPrompt = `你是一位溫暖的心理解析師，說話像懂你的朋友，不說教不浮誇。只輸出解析內容，不加標題或前綴。${tcRule}`;
      angles = [
        "從今天的情緒狀態切入，說說這句話可能在回應你內心什麼樣的感受",
        "從人際關係角度切入，這句話對你和身邊的人有什麼啟示",
        "從身體和休息角度切入，今天你的狀態需要什麼",
        "從工作和行動角度切入，今天可以留意什麼",
        "從自我觀察角度切入，這句話照見了你最近的什麼模式",
        "從時間感角度切入，今天這個時間點對你有什麼特別的意義",
      ];
      structureGuide = `第一句：從指定角度出發，輕輕點到這句話可能觸動的某個感受或畫面，不下結論。\n第二句：給一個今天可以留意或嘗試的方向，不要太指令化。\n第三句：一句有餘韻的收尾，讓人想一下。`;
    }

    const angle = angles[Math.floor(Math.random() * angles.length)];

    const prompt = `${mbtiLine}\n今天的日曆句子是：「${sentence}」\n\n解析角度：${angle}\nMBTI 使用方式：${mbtiInstruction}\n\n規則：\n- 全程只能用「你」稱呼對方，絕不用「你們」、「他」、「她」。\n- 只能用繁體中文，不能夾雜英文或簡體字。\n- 輸出三句話。\n- 不要直接解釋日曆句子，用它作為引子讓讀者自己感受。\n\n${structureGuide}\n\n只輸出三句話本身，不加標題、編號、前綴。`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 256,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = await res.json();
    const analysis = data.choices?.[0]?.message?.content?.trim();
    if (!analysis) throw new Error("empty response");

    return NextResponse.json({ analysis: toTraditional(analysis) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("analyze-sentence error:", msg);
    return NextResponse.json({ error: "分析失敗，請再試一次" }, { status: 500 });
  }
}
