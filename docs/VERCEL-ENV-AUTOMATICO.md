# Enviar variáveis do .env.local para a Vercel (automático)

Um único comando envia as variáveis do `.env.local` para a Vercel e **dispara o redeploy** em seguida.

Para lista completa de variáveis e como obter as chaves Stripe, veja [DADOS-STRIPE-E-VERCEL.md](./DADOS-STRIPE-E-VERCEL.md).

## Passo 1: Token da Vercel

1. Acesse https://vercel.com/account/tokens  
2. Clique em **Create**  
3. Nome (ex.: "env-script"), expiração à vontade  
4. Copie o token (só aparece uma vez)

## Passo 2: Nome do projeto na Vercel

No painel do projeto na Vercel: **Settings** → **General** → **Project Name** (ex.: `phoenix-global` ou `site-phoenix-global-import`).

## Passo 3: Rodar o script

Coloque no `.env.local` (além das variáveis do site e Stripe):

- `VERCEL_TOKEN` — token da Vercel
- `VERCEL_PROJECT` — nome do projeto (ex.: `site-phoenix-global-import`)
- Se o projeto estiver em uma **equipe**: `VERCEL_TEAM_ID` — ID da equipe (Settings → General na Vercel)

Depois, na pasta do projeto:

```bash
npm run vercel:env
```

O script lê tudo do `.env.local`, envia as variáveis para a Vercel e **dispara o redeploy** automaticamente.

**Se aparecer 403 (Not authorized):** o projeto pode estar em uma equipe. Defina `VERCEL_TEAM_ID` no `.env.local` ou use um token com permissão de escrita em https://vercel.com/account/tokens.

## O que o script envia

- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

(Todas as que existirem no `.env.local`.)

O script também **dispara o redeploy** após enviar as variáveis, para que elas passem a valer no build.
