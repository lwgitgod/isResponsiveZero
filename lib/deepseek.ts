// DeepSeek chat-completions call (OpenAI-compatible), same pattern as
// _DocClassify_MVP/src/docclassify/deepseek_client.py: Bearer key, JSON mode, temperature 0.
// Server-side only.

const BASE_URL = "https://api.deepseek.com";
const MODEL = "deepseek-chat";

export class DeepSeekError extends Error {}

interface ChatResponse {
  model?: string;
  choices?: { message?: { content?: string }; finish_reason?: string }[];
}

export async function deepseekJson(system: string, user: string, maxTokens: number): Promise<{ json: unknown; model: string }> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new DeepSeekError("DEEPSEEK_API_KEY is not set in .env.local");
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0,
      max_tokens: maxTokens,
    }),
    signal: AbortSignal.timeout(300_000),
  });
  if (!res.ok) throw new DeepSeekError(`DeepSeek HTTP ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as ChatResponse;
  const choice = data.choices?.[0];
  if (choice?.finish_reason === "length") throw new DeepSeekError("DeepSeek output was cut off (max_tokens reached).");
  const content = choice?.message?.content;
  if (!content) throw new DeepSeekError("DeepSeek returned no content.");
  try {
    return { json: JSON.parse(content), model: data.model ?? MODEL };
  } catch {
    throw new DeepSeekError("DeepSeek response was not valid JSON.");
  }
}
