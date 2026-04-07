import { NextResponse } from "next/server";
import { buildCatalogoContextoParaAtendente } from "@/lib/atendente-catalogo";
import { ATENDENTE_SYSTEM_PROMPT_BASE } from "@/lib/atendente-prompt";

const DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions";
const MAX_MESSAGES = 24;
const MAX_USER_CHARS = 4000;

type ChatRole = "user" | "assistant";

type IncomingMessage = { role: ChatRole; content: string };

function isValidMessage(m: unknown): m is IncomingMessage {
  if (!m || typeof m !== "object") return false;
  const o = m as Record<string, unknown>;
  return (
    (o.role === "user" || o.role === "assistant") &&
    typeof o.content === "string" &&
    o.content.length > 0 &&
    o.content.length <= MAX_USER_CHARS
  );
}

function montarPromptSistema(): string {
  const catalogo = buildCatalogoContextoParaAtendente();
  return `${ATENDENTE_SYSTEM_PROMPT_BASE}

---
CATÁLOGO E DADOS OFICIAIS (atualizados do site — use para responder):
${catalogo}`;
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Atendente indisponível no momento. Configure a chave da API no servidor." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const rawMessages = (body as { messages?: unknown }).messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json({ error: "Envie ao menos uma mensagem." }, { status: 400 });
  }

  const trimmed = rawMessages.slice(-MAX_MESSAGES).filter(isValidMessage);
  if (trimmed.length === 0) {
    return NextResponse.json({ error: "Mensagens inválidas." }, { status: 400 });
  }

  const model = process.env.DEEPSEEK_MODEL?.trim() || "deepseek-chat";

  const systemContent = montarPromptSistema();

  const messages = [
    { role: "system" as const, content: systemContent },
    ...trimmed.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
  ];

  try {
    const res = await fetch(DEEPSEEK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.55,
        max_tokens: 1200,
      }),
    });

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string };
    };

    if (!res.ok) {
      const msg = data.error?.message ?? res.statusText;
      console.error("[atendente] DeepSeek:", res.status, msg);
      return NextResponse.json(
        { error: "Não foi possível obter resposta agora. Tente de novo em instantes." },
        { status: 502 },
      );
    }

    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return NextResponse.json({ error: "Resposta vazia do modelo." }, { status: 502 });
    }

    return NextResponse.json({ message: text });
  } catch (e) {
    console.error("[atendente]", e);
    return NextResponse.json(
      { error: "Erro de conexão com o serviço de IA. Tente novamente." },
      { status: 502 },
    );
  }
}
