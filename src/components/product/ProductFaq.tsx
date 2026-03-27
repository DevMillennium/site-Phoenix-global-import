"use client";

interface FaqItem {
  question: string;
  answer: string;
}

interface ProductFaqProps {
  items: FaqItem[];
  title?: string;
}

export function ProductFaq({ items, title = "Perguntas frequentes" }: ProductFaqProps) {
  if (items.length === 0) return null;

  return (
    <section className="mt-12 border-t border-phoenix-border pt-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-display text-xl font-bold text-phoenix-text sm:text-2xl">
        {title}
      </h2>
      <ul className="mt-6 space-y-2" role="list">
        {items.map((item, i) => (
          <li key={i} className="rounded-xl border border-phoenix-border bg-phoenix-card overflow-hidden">
            <details className="group">
              <summary className="cursor-pointer list-none px-4 py-3 sm:px-5 sm:py-4 font-medium text-phoenix-text flex items-center justify-between gap-2 min-h-touch">
                {item.question}
                <span className="text-phoenix-text-muted group-open:rotate-180 transition-transform" aria-hidden>
                  ▾
                </span>
              </summary>
              <p className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm text-phoenix-text-muted border-t border-phoenix-border pt-3">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
}
