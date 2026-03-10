import Link from "next/link";

export const metadata = {
  title: "Teste das alterações",
  description: "Checklist para validar as melhorias no site.",
  robots: "noindex, nofollow",
};

const links = [
  { href: "/", label: "Home", check: "Hero, Destaques e CTAs carregam sem texto 'Carregando...' visível" },
  { href: "/produtos", label: "Produtos", check: "Lista de produtos aparece direto (sem flash de skeleton)" },
  { href: "/produtos?categoria=audio", label: "Produtos — Áudio", check: "Filtro por categoria funciona; conteúdo server-rendered" },
  { href: "/produtos/airpods-4", label: "PDP AirPods 4", check: "Botão WhatsApp com link correto; texto 'Parcelamento e pagamento seguro via Stripe' abaixo do cartão" },
  { href: "/contato", label: "Contato", check: "Links 'Abrir WhatsApp para cotação' e 'WhatsApp' abrem com número e mensagem" },
  { href: "/carrinho", label: "Carrinho", check: "Link 'Falar no WhatsApp' com href preenchido" },
  { href: "/sitemap.xml", label: "Sitemap (XML)", check: "Retorna 200 e XML com URLs do site (não 500)" },
  { href: "/emulador-mobile", label: "Emulador mobile", check: "Viewport mobile; trocar dispositivo e páginas" },
];

export default function TesteAlteracoesPage() {
  return (
    <div className="min-h-screen bg-phoenix-dark text-phoenix-text">
      <div className="container py-12 max-w-2xl">
        <h1 className="font-display text-2xl font-bold mb-2">
          Teste das alterações
        </h1>
        <p className="text-phoenix-text-muted text-sm mb-8">
          Abra cada link abaixo no navegador e confira o item da lista. Esta página não aparece no menu.
        </p>
        <ul className="space-y-4">
          {links.map((item) => (
            <li key={item.href} className="rounded-xl border border-phoenix-border bg-phoenix-card p-4">
              <Link
                href={item.href}
                target={item.href.endsWith(".xml") ? "_blank" : undefined}
                className="font-medium text-phoenix-primary hover:text-phoenix-primary-hover block mb-1"
              >
                {item.label} →
              </Link>
              <span className="text-sm text-phoenix-text-muted">{item.check}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-xs text-phoenix-muted">
          Para emular mobile: use DevTools (F12) → toggle device toolbar ou acesse /emulador-mobile.
        </p>
      </div>
    </div>
  );
}
