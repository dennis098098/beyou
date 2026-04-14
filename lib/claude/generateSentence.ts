import { GenerateSentenceRequest, GenerateSentenceResponse } from "@/types";

export async function generateSentence(req: GenerateSentenceRequest): Promise<string> {
  const res = await fetch("/api/generate-sentence", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`Failed to generate sentence: ${res.status}`);
  }

  const data: GenerateSentenceResponse = await res.json();
  return data.sentence;
}
