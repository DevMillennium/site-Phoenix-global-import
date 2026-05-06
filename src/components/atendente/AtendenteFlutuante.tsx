"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getWhatsAppLink } from "@/lib/env";
import { tryParseResponseJson } from "@/lib/parse-api-json";

type ChatTurn = { role: "user" | "assistant"; content: string };

const WHATSAPP_MENSAGEM =
  "Olá! Falei com a Shyr no site e gostaria de falar com um atendente da Phoenix Global Import.";

export function AtendenteFlutuante() {
  const prefersReducedMotion = useReducedMotion();
  const panelId = useId();
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<ChatTurn[]>([]);
  const [entrada, setEntrada] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  const rolarParaFim = useCallback(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (aberto) rolarParaFim();
  }, [aberto, mensagens, carregando, rolarParaFim]);

  const enviar = async () => {
    const texto = entrada.trim();
    if (!texto || carregando) return;

    setErro(null);
    const novaUser: ChatTurn = { role: "user", content: texto };
    const historico = [...mensagens, novaUser];
    setMensagens(historico);
    setEntrada("");
    setCarregando(true);

    try {
      const res = await fetch("/api/atendente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: historico.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const parsed = await tryParseResponseJson<{ message?: string; error?: string }>(res);
      if (!parsed.parsed) {
        setErro(
          res.status >= 500
            ? "Servidor indisponível. Tente de novo em instantes."
            : "Resposta inválida. Tente de novo.",
        );
        return;
      }
      const data = parsed.data;

      if (!res.ok) {
        setErro(data.error ?? "Não foi possível enviar. Tente de novo.");
        return;
      }

      if (data.message) {
        setMensagens((prev) => [...prev, { role: "assistant", content: data.message! }]);
      }
    } catch {
      setErro("Erro de rede. Verifique sua conexão e tente novamente.");
    } finally {
      setCarregando(false);
    }
  };

  const linkWhatsapp = getWhatsAppLink(WHATSAPP_MENSAGEM);

  const pulse = !prefersReducedMotion && !aberto;

  return (
    <div className="fixed bottom-4 right-4 z-[10000] flex max-w-[min(100vw-1.5rem,22rem)] flex-col items-end gap-1.5 sm:bottom-6 sm:right-6 pointer-events-none [&>*]:pointer-events-auto">
      <AnimatePresence>
        {aberto && (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Shyr — assistente virtual"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "flex w-[min(100vw-2rem,22rem)] max-h-[min(32rem,70dvh)] flex-col overflow-hidden rounded-xl border border-phoenix-border bg-phoenix-card shadow-[0_12px_48px_rgba(0,0,0,0.45)]",
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-phoenix-border bg-gradient-to-r from-phoenix-surface to-phoenix-card px-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-base font-bold tracking-tight text-phoenix-text">Shyr</p>
                <p className="truncate text-[11px] leading-snug text-phoenix-muted sm:text-xs">
                  Diretora de assistência e orientação · <span className="text-phoenix-gold">24h</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAberto(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-phoenix-muted hover:bg-phoenix-border/40 hover:text-phoenix-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary"
                aria-label="Fechar chat da Shyr"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3 space-y-3">
              {mensagens.length === 0 && (
                <p className="text-sm text-phoenix-text-muted leading-relaxed">
                  Olá! Sou a <strong className="text-phoenix-text">Shyr</strong>, diretora de assistência e orientação ao
                  cliente da Phoenix Global Import. Posso esclarecer dúvidas sobre os produtos do nosso catálogo
                  (comercial e técnico), <strong className="text-phoenix-text">varejo e atacado</strong>, e{" "}
                  <strong className="text-phoenix-text">importação sob encomenda</strong>. Para falar com a equipe
                  humana, use o WhatsApp abaixo.
                </p>
              )}
              {mensagens.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                      m.role === "user"
                        ? "bg-phoenix-primary/25 text-phoenix-text"
                        : "bg-phoenix-surface text-phoenix-text border border-phoenix-border/80",
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              {carregando && (
                <p className="text-xs text-phoenix-muted" aria-live="polite">
                  Shyr está respondendo…
                </p>
              )}
              {erro && (
                <p className="text-sm text-phoenix-accent" role="alert">
                  {erro}
                </p>
              )}
              <div ref={fimRef} />
            </div>

            <div className="border-t border-phoenix-border p-2 space-y-2">
              <a
                href={linkWhatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg border border-phoenix-border bg-phoenix-surface px-3 py-2 text-xs font-medium text-phoenix-text hover:border-phoenix-primary/60 hover:bg-phoenix-dark/50 transition-colors"
              >
                <svg className="h-4 w-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Falar com humano no WhatsApp
              </a>
              <div className="flex gap-2">
                <label htmlFor="atendente-input" className="sr-only">
                  Sua mensagem para a Shyr
                </label>
                <input
                  id="atendente-input"
                  type="text"
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void enviar();
                    }
                  }}
                  placeholder="Pergunte sobre produtos, atacado ou importação…"
                  disabled={carregando}
                  className="min-h-touch min-w-0 flex-1 rounded-lg border border-phoenix-border bg-phoenix-dark px-3 py-2 text-sm text-phoenix-text placeholder:text-phoenix-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-phoenix-primary disabled:opacity-60"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={() => void enviar()}
                  disabled={carregando || !entrada.trim()}
                  className="shrink-0 rounded-lg bg-phoenix-primary px-3 py-2 text-sm font-medium text-phoenix-dark hover:bg-phoenix-primary-hover transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phoenix-primary"
                >
                  Enviar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-[min(100vw-1.5rem,22rem)]">
        {!aberto && (
          <span
            className="absolute -top-2 left-1/2 z-[1] -translate-x-1/2 whitespace-nowrap rounded-full border border-phoenix-gold/80 bg-gradient-to-r from-phoenix-accent to-phoenix-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-[0_4px_14px_rgba(220,47,2,0.55)]"
            aria-hidden
          >
            Assistente 24 horas
          </span>
        )}
        <motion.button
          type="button"
          onClick={() => setAberto((v) => !v)}
          animate={
            pulse
              ? {
                boxShadow: [
                  "0 10px 40px rgba(232, 93, 4, 0.35)",
                  "0 14px 52px rgba(232, 93, 4, 0.6)",
                  "0 10px 40px rgba(232, 93, 4, 0.35)",
                ],
              }
              : {}
          }
          transition={pulse ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" } : {}}
          className={cn(
            "relative flex w-full items-center gap-3 rounded-2xl border-2 border-phoenix-gold/70 bg-gradient-to-br from-phoenix-primary via-[#d9480f] to-phoenix-accent px-4 py-3 text-left text-white shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
            "hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-phoenix-gold",
            aberto && "ring-2 ring-phoenix-gold/80 ring-offset-2 ring-offset-[#0d0d0d]",
          )}
          aria-expanded={aberto}
          aria-controls={aberto ? panelId : undefined}
          aria-label={aberto ? "Fechar chat da Shyr" : "Abrir Shyr — diretora de assistência, 24 horas"}
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
            {aberto ? (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            ) : (
              <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-base font-bold tracking-tight">Shyr</span>
            <span className="block truncate text-xs font-medium text-white/90">
              Diretora · assistência e orientação · <span className="font-bold text-phoenix-gold">24h</span>
            </span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
