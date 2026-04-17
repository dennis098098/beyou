// Simplified → Traditional Chinese character lookup
// Only includes unambiguous single-character conversions common in everyday text
const SC_TO_TC: Record<string, string> = {
  // Pronouns / particles
  这: "這", 那: "那", 们: "們",
  // Common verbs
  说: "說", 来: "來", 过: "過", 开: "開", 让: "讓", 给: "給",
  认: "認", 见: "見", 进: "進", 动: "動", 转: "轉", 带: "帶",
  继: "繼", 续: "續", 学: "學", 读: "讀", 听: "聽", 换: "換",
  记: "記", 发: "發",
  // Common nouns / adjectives
  东: "東", 时: "時", 问: "問", 话: "話", 头: "頭", 个: "個",
  关: "關", 当: "當", 实: "實", 总: "總", 应: "應", 气: "氣",
  点: "點", 书: "書", 场: "場", 断: "斷", 亲: "親", 产: "產",
  热: "熱", 电: "電", 难: "難", 类: "類", 种: "種", 题: "題",
  该: "該", 体: "體", 质: "質", 导: "導", 无: "無", 与: "與",
  语: "語", 义: "義", 观: "觀", 终: "終", 证: "證", 许: "許",
  须: "須", 习: "習", 兴: "興", 医: "醫", 约: "約", 阳: "陽",
  飞: "飛", 节: "節", 积: "積", 际: "際", 门: "門", 间: "間",
  随: "隨", 数: "數", 线: "線", 边: "邊", 处: "處", 两: "兩",
  国: "國", 现: "現", 从: "從", 会: "會", 经: "經", 为: "為",
  乐: "樂", 虽: "雖", 则: "則", 样: "樣", 没: "沒",
  还: "還", 爱: "愛", 对: "對",
  // 里→裡 (inside); 后→後 (behind/after) — both safe in natural text
  里: "裡", 后: "後",
  // 么→麼
  么: "麼",
};

export function toTraditional(text: string): string {
  return text.split("").map((c) => SC_TO_TC[c] ?? c).join("");
}
